import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perro } from '../entities/perro.entity';
import { Dupla } from '../entities/dupla.entity';
import { Competencia } from '../entities/competencia.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Pista } from '../entities/pista.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';
import { MaintenanceService } from '../maintenance/maintenance.service';

@Injectable()
export class ClientFeaturesService {
    constructor(
        @InjectRepository(Perro) private perroRepo: Repository<Perro>,
        @InjectRepository(Dupla) private duplaRepo: Repository<Dupla>,
        @InjectRepository(Competencia) private competenciaRepo: Repository<Competencia>,
        @InjectRepository(Inscripcion) private inscripcionRepo: Repository<Inscripcion>,
        @InjectRepository(Pista) private pistaRepo: Repository<Pista>,
        @InjectRepository(ResultadoPista) private resultadoRepo: Repository<ResultadoPista>,
        private maintenanceService: MaintenanceService
    ) { }

    async getMyDogs(userId: number) {
        // Find Duplas where user is guia
        const duplas = await this.duplaRepo.find({
            where: { id_guia_persona: userId, flg_activo: true },
            relations: ['perro', 'perro.raza', 'perro.gradoActual', 'perro.categoriaTalla']
        });

        // Map to return dog info enriched
        return duplas.map(d => ({
            ...d.perro,
            duplaId: d.id, // Keep reference to dupla if needed
            raza_nombre: d.perro.raza?.descripcion,
            grado_nombre: d.perro.gradoActual?.nombre,
            categoria_nombre: d.perro.categoriaTalla?.nombre
        }));
    }

    async addMyDog(data: any, userId: number, userName: string) {
        // Ensure IDs are numbers
        if (data.id_raza) data.id_raza = Number(data.id_raza);
        if (data.id_grado_actual) data.id_grado_actual = Number(data.id_grado_actual);
        if (data.id_categoria_talla) data.id_categoria_talla = Number(data.id_categoria_talla);

        // 1. Create Perro using MaintenanceService to reuse logic
        const newPerro = await this.maintenanceService.create('perro', data, userId, userName);

        // 2. Create Dupla linking User + New Perro
        const duplaData = {
            id_perro: newPerro.id,
            id_guia_persona: userId,
            flg_activo: true
        };

        // Use MaintenanceService for Dupla too if possible, but straightforward create here is fine
        // Using maintenance service for 'dupla' ensures audit logs consistency
        const newDupla = await this.maintenanceService.create('dupla', duplaData, userId, userName);

        return { ...newPerro, duplaId: newDupla.id };
    }

    private async verifyDogOwnership(dogId: number, userId: number) {
        // Verify via Dupla
        const dupla = await this.duplaRepo.findOne({
            where: { id_perro: dogId, id_guia_persona: userId, flg_activo: true }
        });
        if (!dupla) {
            throw new BadRequestException('No tienes permiso para editar este perro o no existe.');
        }
        return dupla;
    }

    async updateMyDog(id: number, data: any, userId: number, userName: string) {
        await this.verifyDogOwnership(id, userId);
        // Remove read-only/computed fields that might be sent back
        const { duplaId, raza_nombre, grado_nombre, categoria_nombre, ...updateData } = data;

        // Ensure IDs are numbers
        if (updateData.id_raza) updateData.id_raza = Number(updateData.id_raza);
        if (updateData.id_grado_actual) updateData.id_grado_actual = Number(updateData.id_grado_actual);
        if (updateData.id_categoria_talla) updateData.id_categoria_talla = Number(updateData.id_categoria_talla);

        return this.maintenanceService.update('perro', id, updateData, userId, userName);
    }

    // ... (rest of methods)

    async getAllMyResults(userId: number, page: number = 1, limit: number = 10, search: string = '', filters: any = {}, isAdmin: boolean = false) {

        let dogIds: number[] = [];

        // 1. Get Dog IDs for regular users (if not Admin)
        if (!isAdmin) {
            const duplas = await this.duplaRepo.find({
                where: { id_guia_persona: userId, flg_activo: true },
                select: ['id', 'id_perro']
            });
            dogIds = duplas.map(d => d.id_perro);

            if (dogIds.length === 0) {
                return { data: [], total: 0, page, limit };
            }
        }

        // 2. Query Results
        const query = this.resultadoRepo.createQueryBuilder('result')
            .leftJoinAndSelect('result.pista', 'pista')
            .leftJoinAndSelect('pista.competencia', 'competencia')
            .leftJoinAndSelect('pista.tipoPista', 'tipoPista')
            .leftJoinAndSelect('pista.gradoBase', 'grado')
            .leftJoinAndSelect('result.perro', 'perro')
            .where("result.flg_activo = :active", { active: true });

        // Apply Scope Restriction for non-admins
        if (!isAdmin) {
            query.andWhere("result.id_perro IN (:...dogIds)", { dogIds });
        }

        // Search
        if (search) {
            query.andWhere(
                "(competencia.nombre LIKE :search OR tipoPista.nombre LIKE :search OR perro.nombre LIKE :search)",
                { search: `%${search}%` }
            );
        }

        // Filters
        if (filters.competitionId) {
            query.andWhere("pista.id_competencia = :compId", { compId: filters.competitionId });
        }
        if (filters.dogId) {
            // Verify ownership if regular user tries to filter by specific dog
            if (!isAdmin && !dogIds.includes(Number(filters.dogId))) {
                return { data: [], total: 0, page, limit };
            }
            query.andWhere("result.id_perro = :dogId", { dogId: filters.dogId });
        }
        if (filters.trackType) { // 'AGILITY' or 'JUMPING'
            query.andWhere("tipoPista.nombre LIKE :trackType", { trackType: `%${filters.trackType}%` });
        }
        if (filters.gradeId) {
            query.andWhere("pista.id_grado_base = :gradeId", { gradeId: filters.gradeId });
        }

        query.orderBy('result.fec_creacion', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [results, total] = await query.getManyAndCount();

        // 3. Format
        const formatted = results.map(r => {
            let speed = 0;
            if (r.pista && r.pista.longitud_m && r.tiempo_cronometrado_seg > 0) {
                speed = Number(r.pista.longitud_m) / Number(r.tiempo_cronometrado_seg);
            }
            return {
                id: r.id,
                eventName: r.pista?.competencia?.nombre || 'Evento Desconocido',
                date: r.fec_creacion,
                trackType: r.pista?.tipoPista?.nombre || 'Pista',
                gradeName: r.pista?.gradoBase?.nombre || '',
                dogName: r.perro?.nombre || 'Perro',
                speed: speed > 0 ? `${speed.toFixed(2)} m/s` : '-',
                faults: r.faltas,
                refusals: r.rehuses,
                time: r.tiempo_cronometrado_seg,
                isEli: r.es_eli,
                place: r.puesto,
                points: 0 // Placeholder for now, ranking logic needed later
            };
        });

        return { data: formatted, total, page, limit };
    }
    async deactivateMyDog(id: number, userId: number, userName: string) {
        await this.verifyDogOwnership(id, userId);
        // Deactivate dog
        await this.maintenanceService.deactivate('perro', id, userId, userName);
        // Also deactivate dupla? Maybe.
        const dupla = await this.verifyDogOwnership(id, userId);
        await this.maintenanceService.deactivate('dupla', dupla.id, userId, userName);
        return { success: true };
    }

    async getActiveCompetitions() {
        // Only active competitions
        return this.competenciaRepo.find({
            where: { flg_activo: true },
            order: { fecha_inicio: 'ASC' }
        });
    }

    async registerForCompetition(competitionId: number, dogId: number, userId: number) {
        // 1. Validate Dupla exists
        const dupla = await this.duplaRepo.findOne({
            where: { id_perro: dogId, id_guia_persona: userId, flg_activo: true },
            relations: ['perro']
        });

        if (!dupla) {
            throw new BadRequestException('No existe una dupla activa para este perro y usuario.');
        }

        const perro = dupla.perro;

        // 2. Find valid tracks in this competition
        // Valid = Active Pista in this Competition AND (Grado matches OR Open) AND (Categoria compatible if applicable)
        // Usually Grado is the main constraint.

        // Basic Logic: Find all pistas for this competition
        const pistas = await this.pistaRepo.find({
            where: { id_competencia: competitionId, flg_activo: true }
        });

        if (!pistas || pistas.length === 0) {
            throw new BadRequestException('Esta competencia no tiene pistas activas.');
        }

        // Filter Pistas by Grado (if Pista has restricted grado)
        // If pista.id_grado_base is set, dog must match? Or is it >=?
        // Let's assume strict match for now based on "Category/Grade" request.
        // Actually, Agility usually allows running higher grades or specific logic.
        // Simplified: Dog Grade must match Pista Grade Base.

        const eligiblePistas = pistas.filter(p => {
            // If pista has no specific grade, it might be open (Jumping Open, etc.) -> Needs logic.
            // Assuming strict match for MVP:
            return p.id_grado_base === perro.id_grado_actual;
        });

        if (eligiblePistas.length === 0) {
            throw new BadRequestException('No hay pistas elegibles para el grado del perro en esta competencia.');
        }

        const registeredPistas = [];

        for (const pista of eligiblePistas) {
            // Check if already registered
            const existing = await this.inscripcionRepo.findOne({
                where: { id_pista: pista.id, id_dupla: dupla.id, flg_activo: true }
            });

            if (!existing) {
                const inscripcion = this.inscripcionRepo.create({
                    id_pista: pista.id,
                    id_dupla: dupla.id,
                    flg_activo: true
                });
                await this.inscripcionRepo.save(inscripcion);
                registeredPistas.push(pista.id);
            }
        }

        if (registeredPistas.length === 0) {
            return { message: 'El perro ya estaba inscrito en todas las pistas elegibles.' };
        }

        return { success: true, registeredPistas, message: `Inscrito exitosamente en ${registeredPistas.length} pistas.` };
    }

    async getDogStats(dogId: number, userId: number) {
        await this.verifyDogOwnership(dogId, userId);

        // 1. Get Dupla IDs for this dog/user combination (or just dog)
        // Usually stats are per dog, but maybe context of user? 
        // Logic: Get all results for this dog.

        // Fetch All Inscriptions (for Total/Pending counts)
        // Verify Duplas first to be safe or just query by Dog ID if Inscription had it, but Inscription has Dupla.
        // We need to find Duplas for this Dog.
        const duplas = await this.duplaRepo.find({ where: { id_perro: dogId } });
        const duplaIds = duplas.map(d => d.id);

        let inscriptions: Inscripcion[] = [];
        if (duplaIds.length > 0) {
            inscriptions = await this.inscripcionRepo.createQueryBuilder('i')
                .leftJoinAndSelect('i.pista', 'pista')
                .leftJoinAndSelect('pista.competencia', 'comp')
                .where('i.id_dupla IN (:...ids)', { ids: duplaIds })
                .getMany();
        }

        // Competitions Stats
        const compMap = new Map();
        inscriptions.forEach(i => {
            if (i.pista && i.pista.competencia) {
                compMap.set(i.pista.competencia.id, i.pista.competencia);
            }
        });
        const comps = Array.from(compMap.values());
        const totalCompetitions = comps.length;
        const activeCompetitionsCount = comps.filter(c => c.flg_activo).length;
        // Pending: Future start date
        const pendingCompetitionsCount = comps.filter(c => new Date(c.fecha_inicio) > new Date()).length;

        // Tracks Stats
        const totalTracks = inscriptions.length;
        // Pistas Activas: Pistas belonging to active competitions
        const activeTracks = inscriptions.filter(i => i.pista.competencia.flg_activo).length;
        // Pistas Pendientes: Not run yet? Let's use Future Competitions for "Pending" tracks for now to align with Comp logic
        const pendingTracks = inscriptions.filter(i => new Date(i.pista.competencia.fecha_inicio) > new Date()).length;


        // Results for Performance Stats
        const results = await this.resultadoRepo.find({
            where: { id_perro: dogId, flg_activo: true },
            order: { fec_creacion: 'DESC' },
            relations: ['pista', 'pista.competencia', 'pista.tipoPista']
        });

        // Excellent Tracks (Clean Runs)
        const excellentTracks = results.filter(r => r.faltas === 0 && r.rehuses === 0 && !r.es_eli).length;
        const cleanRunPercentage = results.length > 0 ? Math.round((excellentTracks / results.length) * 100) : 0;

        // Trend Data (Speed)
        const validTimeResults = results.filter(r => r.tiempo_cronometrado_seg > 0 && !r.es_eli);

        // Find Global Min/Max for context if needed, but per track tendency is requested.
        // We will send the data points, and frontend can identify min/max.
        const trendData = validTimeResults.slice(0, 10).map(r => {
            let speed = 0;
            if (r.pista && r.pista.longitud_m && r.tiempo_cronometrado_seg > 0) {
                speed = Number(r.pista.longitud_m) / Number(r.tiempo_cronometrado_seg);
            }
            return {
                date: r.fec_creacion,
                speed: parseFloat(speed.toFixed(2)),
                track: r.pista?.tipoPista?.nombre || 'Pista'
            };
        }).reverse();

        // Recent Activity
        const recentActivity = results.slice(0, 5).map(r => {
            let speed = 0;
            if (r.pista && r.pista.longitud_m && r.tiempo_cronometrado_seg > 0) {
                speed = Number(r.pista.longitud_m) / Number(r.tiempo_cronometrado_seg);
            }
            return {
                id: r.id,
                eventName: r.pista?.competencia?.nombre || 'Evento Desconocido',
                trackName: r.pista?.tipoPista?.nombre || 'Pista',
                date: r.fec_creacion,
                result: r.es_eli ? 'Eliminado' : `${r.faltas}F / ${r.rehuses}R`,
                speed: speed > 0 ? `${speed.toFixed(2)} m/s` : '-',
                place: r.puesto ? `${r.puesto}° Lugar` : '-',
                isClean: r.faltas === 0 && r.rehuses === 0 && !r.es_eli
            };
        });

        return {
            stats: {
                competitions: {
                    total: totalCompetitions,
                    active: activeCompetitionsCount,
                    pending: pendingCompetitionsCount
                },
                tracks: {
                    total: totalTracks,
                    active: activeTracks,
                    pending: pendingTracks
                },
                excellentTracks: excellentTracks,
                cleanRunPercentage
            },
            trendData,
            recentActivity
        };
    }

    async getDogRegistrations(dogId: number, userId: number) {
        await this.verifyDogOwnership(dogId, userId);
        const duplas = await this.duplaRepo.find({ where: { id_perro: dogId, flg_activo: true } });
        const duplaIds = duplas.map(d => d.id);

        if (duplaIds.length === 0) return [];

        const inscriptions = await this.inscripcionRepo.createQueryBuilder("inscripcion")
            .leftJoinAndSelect("inscripcion.pista", "pista")
            .where("inscripcion.id_dupla IN (:...ids)", { ids: duplaIds })
            .andWhere("inscripcion.flg_activo = :active", { active: true })
            .getMany();

        const compIds = new Set(inscriptions.map(i => i.pista.id_competencia));
        return Array.from(compIds);
    }



    async getMyCompetitionsSummary(userId: number) {
        // 1. Get Dog IDs
        const duplas = await this.duplaRepo.find({
            where: { id_guia_persona: userId, flg_activo: true },
            select: ['id_perro']
        });
        const dogIds = duplas.map(d => d.id_perro);

        if (dogIds.length === 0) return {};

        // 2. Get Results grouped by Competition
        // We need all results to check for 'participation' and 'best placement'
        const results = await this.resultadoRepo.find({
            where: { flg_activo: true }, // Ideally filter by dogIds where in list
            relations: ['pista'],
            // In typeorm find with IN
        });
        // Doing in memory or filtered query is better.
        // Let's use QueryBuilder
        const data = await this.resultadoRepo.createQueryBuilder('result')
            .leftJoinAndSelect('result.pista', 'pista')
            .where("result.id_perro IN (:...dogIds)", { dogIds })
            .andWhere("result.flg_activo = :active", { active: true })
            .getMany();

        const summary: Record<number, { status: string, bestResult?: string }> = {};

        data.forEach(r => {
            const compId = r.pista.id_competencia;
            // If exists, update best result if needed?
            // "Participado" is default if result exists.

            let currentBest = summary[compId]?.bestResult;

            // Logic for best result: 1st place > 2nd ... ?
            // Assuming 'puesto' is number 1, 2, 3...
            if (r.puesto && r.puesto > 0) {
                if (!currentBest || r.puesto < parseInt(currentBest)) {
                    currentBest = r.puesto.toString();
                }
            }

            summary[compId] = {
                status: 'Participado',
                bestResult: currentBest
            };
        });

        // 3. Check Registrations (for future/active competitions without results yet)
        const inscriptions = await this.inscripcionRepo.createQueryBuilder("inscripcion")
            .leftJoinAndSelect("inscripcion.dupla", "dupla") // Join dupla to get perro? 
            // Dupla links to user. We have duplas list earlier, can use dupla Ids.
            .leftJoinAndSelect("inscripcion.pista", "pista")
            .where("dupla.id_guia_persona = :userId", { userId })
            .andWhere("inscripcion.flg_activo = :active", { active: true })
            .getMany();

        inscriptions.forEach(i => {
            const compId = i.pista.id_competencia;
            if (!summary[compId]) {
                summary[compId] = { status: 'Inscrito' };
            }
        });

        return summary;
    }
    async getDogInsights(dogId: number, userId: number) {
        // Verify ownership first
        await this.verifyDogOwnership(dogId, userId);

        // Fetch ALL historical results
        const results = await this.resultadoRepo.createQueryBuilder('result')
            .leftJoinAndSelect('result.pista', 'pista')
            .leftJoinAndSelect('pista.competencia', 'competencia')
            .leftJoinAndSelect('pista.tipoPista', 'tipoPista')
            .where('result.id_perro = :dogId', { dogId })
            .andWhere('result.flg_activo = true')
            .orderBy('competencia.fecha_inicio', 'ASC') // Oldest first for trend analysis
            .getMany();

        if (results.length < 3) {
            return {
                analysis: {
                    totalRaces: results.length,
                    speedImprovement: 0,
                    cleanRunRate: 0,
                    eliminationRate: 0
                },
                insights: [
                    {
                        title: "Pocos Datos",
                        type: "neutral",
                        text: "Aún no tenemos suficientes datos históricos para generar un análisis profundo. ¡Sigue compitiendo para desbloquear insights avanzados!"
                    }
                ]
            };
        }

        // --- ANALYSIS ---

        // 1. Speed Improvement (Compare first 3 vs last 3 average speeds, excluding ELI/0 speed)
        const validSpeedResults = results.map(r => {
            const time = Number(r.tiempo_cronometrado_seg);
            const length = Number(r.pista.longitud_m);
            if (time > 0 && length > 0 && !r.es_eli) {
                return { ...r, calculatedSpeed: length / time };
            }
            return null;
        }).filter(r => r !== null) as (typeof results[0] & { calculatedSpeed: number })[];
        let speedImprovement = 0;
        let speedTrend = "stable";

        if (validSpeedResults.length >= 6) {
            const first3 = validSpeedResults.slice(0, 3);
            const last3 = validSpeedResults.slice(-3);

            const avgSpeedFirst = first3.reduce((sum, r) => sum + r.calculatedSpeed, 0) / 3;
            const avgSpeedLast = last3.reduce((sum, r) => sum + r.calculatedSpeed, 0) / 3;

            if (avgSpeedFirst > 0) {
                speedImprovement = ((avgSpeedLast - avgSpeedFirst) / avgSpeedFirst) * 100;
            }

            if (speedImprovement > 5) speedTrend = "improving";
            else if (speedImprovement < -5) speedTrend = "declining";
        }

        // 2. Excellent Tracks (Clean Runs: 0 Faults, 0 Refusals, No ELI)
        // Also check if they podiumed
        const cleanRuns = results.filter(r =>
            !r.es_eli &&
            Number(r.faltas) === 0 &&
            Number(r.rehuses) === 0
        );
        const cleanRunRate = (cleanRuns.length / results.length) * 100;
        const podiums = results.filter(r => r.puesto && r.puesto <= 3).length;


        // 3. Elimination Rate
        const eliCount = results.filter(r => r.es_eli).length;
        const eliminationRate = (eliCount / results.length) * 100;

        // 4. Track Preference (Jumping vs Agility)
        const agilityResults = results.filter(r => r.pista.tipoPista && r.pista.tipoPista.nombre.toUpperCase().includes('AGILITY'));
        const jumpingResults = results.filter(r => r.pista.tipoPista && r.pista.tipoPista.nombre.toUpperCase().includes('JUMPING'));

        const agiEliRate = agilityResults.length ? (agilityResults.filter(r => r.es_eli).length / agilityResults.length) : 0;
        const jumpEliRate = jumpingResults.length ? (jumpingResults.filter(r => r.es_eli).length / jumpingResults.length) : 0;


        // --- GENERATE TEXT (Simulated AI) ---
        const insights = [];

        // Insight 1: Performance/Speed
        if (speedTrend === "improving") {
            insights.push({
                title: "Potencial de Velocidad",
                type: "positive",
                text: `¡Gran trabajo! Hemos detectado una mejora del ${speedImprovement.toFixed(1)}% en la velocidad promedio comparando tus primeras carreras con las más recientes. El entrenamiento de potencia está dando frutos.`
            });
        } else if (speedTrend === "declining") {
            insights.push({
                title: "Alerta de Ritmo",
                type: "warning",
                text: `Se ha notado una ligera disminución del ${Math.abs(speedImprovement).toFixed(1)}% en la velocidad reciente. Podría ser fatiga o pistas más técnicas recientemente.`
            });
        } else {
            insights.push({
                title: "Ritmo Constante",
                type: "neutral",
                text: "La velocidad se mantiene muy consistente a lo largo del tiempo. Esto es excelente para predecir tiempos, pero considera ejercicios de intervalos si buscas rascar segundos al cronómetro."
            });
        }

        // Insight 2: Reliability/Clean Runs
        if (cleanRunRate > 30) {
            insights.push({
                title: "Máquina de Ceros",
                type: "positive",
                text: `¡Impresionante! Tienes un ${cleanRunRate.toFixed(0)}% de efectividad en pistas limpias (Clean Runs). La precisión es tu mayor fortaleza.`
            });
        } else if (eliminationRate > 40) {
            insights.push({
                title: "Enfoque en Consistencia",
                type: "improvement",
                text: `La tasa de eliminados es del ${eliminationRate.toFixed(0)}%. Sugerimos volver a lo básico en zonas de contacto y entradas a slalom para asegurar finalizar pista antes de buscar velocidad máxima.`
            });
        } else {
            insights.push({
                title: "Equilibrio Riesgo/Control",
                type: "neutral",
                text: `Tu tasa de pistas limpias es del ${cleanRunRate.toFixed(0)}%. Estás en un punto medio saludable, pero trabajar la conexión en los cambios de lado podría reducir esos rehúses ocasionales.`
            });
        }

        // Insight 3: Specific Check (Agility vs Jumping)
        if (agiEliRate > jumpEliRate + 0.2) {
            insights.push({
                title: "Reto Técnico: Agility",
                type: "info",
                text: "Tus resultados en Jumping son notablemente más consistentes que en Agility. Dedica más tiempo a zonas de contacto (Pasarela, Empalizada, Balancín), ya que parece ser el diferenciador clave."
            });
        } else if (jumpEliRate > agiEliRate + 0.2) {
            insights.push({
                title: "Fluidez en Jumping",
                type: "info",
                text: "Curiosamente, tienes más eliminaciones en Jumping. A veces la falta de zonas de contacto invita a correr de más, provocando errores de conducción por adelantamiento. ¡Ojo con el 'handling' a distancia!"
            });
        }

        return {
            analysis: {
                totalRaces: results.length,
                speedImprovement,
                cleanRunRate,
                eliminationRate,
                podiums
            },
            insights
        };
    }

    async getGlobalStats() {
        // 1. Total Competitions
        const totalCompetitions = await this.pistaRepo.createQueryBuilder('pista')
            .leftJoinAndSelect('pista.competencia', 'competencia')
            .select('COUNT(DISTINCT competencia.id)', 'count')
            .getRawOne();

        // 2. Total Tracks
        const totalTracks = await this.pistaRepo.count();

        // 3. Active Duplas
        const activeDuplas = await this.duplaRepo.count({ where: { flg_activo: true } });

        // 4. Global Recent Activity
        const results = await this.resultadoRepo.find({
            where: { flg_activo: true },
            order: { fec_creacion: 'DESC' },
            take: 20,
            relations: ['pista', 'pista.competencia', 'pista.tipoPista', 'perro']
        });

        const recentActivity = results.map(r => {
            let speed = 0;
            if (r.pista && r.pista.longitud_m && r.tiempo_cronometrado_seg > 0) {
                speed = Number(r.pista.longitud_m) / Number(r.tiempo_cronometrado_seg);
            }
            return {
                id: r.id,
                eventName: r.pista?.competencia?.nombre || 'Evento Desconocido',
                trackName: r.pista?.tipoPista?.nombre || 'Pista',
                dogName: r.perro?.nombre || 'Perro',
                date: r.fec_creacion,
                result: r.es_eli ? 'Eliminado' : `${r.faltas}F / ${r.rehuses}R`,
                speed: speed > 0 ? `${speed.toFixed(2)} m/s` : '-',
                place: r.puesto ? `${r.puesto}° Lugar` : '-',
                isClean: r.faltas === 0 && r.rehuses === 0 && !r.es_eli
            };
        });

        return {
            stats: {
                competitions: { total: Number(totalCompetitions.count) },
                tracks: { total: totalTracks },
                activeDuplas
            },
            recentActivity
        };
    }

    async getAllDogs() {
        // Return minimal list for selector
        return this.perroRepo.find({
            where: { flg_activo: true },
            select: ['id', 'nombre'],
            order: { nombre: 'ASC' }
        });
    }

}
