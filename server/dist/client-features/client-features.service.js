"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFeaturesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const perro_entity_1 = require("../entities/perro.entity");
const dupla_entity_1 = require("../entities/dupla.entity");
const competencia_entity_1 = require("../entities/competencia.entity");
const inscripcion_entity_1 = require("../entities/inscripcion.entity");
const pista_entity_1 = require("../entities/pista.entity");
const resultado_pista_entity_1 = require("../entities/resultado-pista.entity");
const maintenance_service_1 = require("../maintenance/maintenance.service");
let ClientFeaturesService = class ClientFeaturesService {
    perroRepo;
    duplaRepo;
    competenciaRepo;
    inscripcionRepo;
    pistaRepo;
    resultadoRepo;
    maintenanceService;
    constructor(perroRepo, duplaRepo, competenciaRepo, inscripcionRepo, pistaRepo, resultadoRepo, maintenanceService) {
        this.perroRepo = perroRepo;
        this.duplaRepo = duplaRepo;
        this.competenciaRepo = competenciaRepo;
        this.inscripcionRepo = inscripcionRepo;
        this.pistaRepo = pistaRepo;
        this.resultadoRepo = resultadoRepo;
        this.maintenanceService = maintenanceService;
    }
    async getMyDogs(userId) {
        const duplas = await this.duplaRepo.find({
            where: { id_guia_persona: userId, flg_activo: true },
            relations: ['perro', 'perro.raza', 'perro.gradoActual', 'perro.categoriaTalla']
        });
        return duplas.map(d => ({
            ...d.perro,
            duplaId: d.id,
            raza_nombre: d.perro.raza?.descripcion,
            grado_nombre: d.perro.gradoActual?.nombre,
            categoria_nombre: d.perro.categoriaTalla?.nombre
        }));
    }
    async addMyDog(data, userId, userName) {
        const newPerro = await this.maintenanceService.create('perro', data, userId, userName);
        const duplaData = {
            id_perro: newPerro.id,
            id_guia_persona: userId,
            flg_activo: true
        };
        const newDupla = await this.maintenanceService.create('dupla', duplaData, userId, userName);
        return { ...newPerro, duplaId: newDupla.id };
    }
    async verifyDogOwnership(dogId, userId) {
        const dupla = await this.duplaRepo.findOne({
            where: { id_perro: dogId, id_guia_persona: userId, flg_activo: true }
        });
        if (!dupla) {
            throw new common_1.BadRequestException('No tienes permiso para editar este perro o no existe.');
        }
        return dupla;
    }
    async updateMyDog(id, data, userId, userName) {
        await this.verifyDogOwnership(id, userId);
        const { duplaId, raza_nombre, grado_nombre, categoria_nombre, ...updateData } = data;
        if (updateData.id_raza)
            updateData.id_raza = Number(updateData.id_raza);
        if (updateData.id_grado_actual)
            updateData.id_grado_actual = Number(updateData.id_grado_actual);
        if (updateData.id_categoria_talla)
            updateData.id_categoria_talla = Number(updateData.id_categoria_talla);
        return this.maintenanceService.update('perro', id, updateData, userId, userName);
    }
    async getAllMyResults(userId, page = 1, limit = 10, search = '', filters = {}, isAdmin = false) {
        let dogIds = [];
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
        const query = this.resultadoRepo.createQueryBuilder('result')
            .leftJoinAndSelect('result.pista', 'pista')
            .leftJoinAndSelect('pista.competencia', 'competencia')
            .leftJoinAndSelect('pista.tipoPista', 'tipoPista')
            .leftJoinAndSelect('pista.gradoBase', 'grado')
            .leftJoinAndSelect('result.perro', 'perro')
            .where("result.flg_activo = :active", { active: true });
        if (!isAdmin) {
            query.andWhere("result.id_perro IN (:...dogIds)", { dogIds });
        }
        if (search) {
            query.andWhere("(competencia.nombre LIKE :search OR tipoPista.nombre LIKE :search OR perro.nombre LIKE :search)", { search: `%${search}%` });
        }
        if (filters.competitionId) {
            query.andWhere("pista.id_competencia = :compId", { compId: filters.competitionId });
        }
        if (filters.dogId) {
            if (!isAdmin && !dogIds.includes(Number(filters.dogId))) {
                return { data: [], total: 0, page, limit };
            }
            query.andWhere("result.id_perro = :dogId", { dogId: filters.dogId });
        }
        if (filters.trackType) {
            query.andWhere("tipoPista.nombre LIKE :trackType", { trackType: `%${filters.trackType}%` });
        }
        if (filters.gradeId) {
            query.andWhere("pista.id_grado_base = :gradeId", { gradeId: filters.gradeId });
        }
        query.orderBy('result.fec_creacion', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [results, total] = await query.getManyAndCount();
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
                points: 0
            };
        });
        return { data: formatted, total, page, limit };
    }
    async deactivateMyDog(id, userId, userName) {
        await this.verifyDogOwnership(id, userId);
        await this.maintenanceService.deactivate('perro', id, userId, userName);
        const dupla = await this.verifyDogOwnership(id, userId);
        await this.maintenanceService.deactivate('dupla', dupla.id, userId, userName);
        return { success: true };
    }
    async getActiveCompetitions() {
        return this.competenciaRepo.find({
            where: { flg_activo: true },
            order: { fecha_inicio: 'ASC' }
        });
    }
    async registerForCompetition(competitionId, dogId, userId) {
        const dupla = await this.duplaRepo.findOne({
            where: { id_perro: dogId, id_guia_persona: userId, flg_activo: true },
            relations: ['perro']
        });
        if (!dupla) {
            throw new common_1.BadRequestException('No existe una dupla activa para este perro y usuario.');
        }
        const perro = dupla.perro;
        const pistas = await this.pistaRepo.find({
            where: { id_competencia: competitionId, flg_activo: true }
        });
        if (!pistas || pistas.length === 0) {
            throw new common_1.BadRequestException('Esta competencia no tiene pistas activas.');
        }
        const eligiblePistas = pistas.filter(p => {
            return p.id_grado_base === perro.id_grado_actual;
        });
        if (eligiblePistas.length === 0) {
            throw new common_1.BadRequestException('No hay pistas elegibles para el grado del perro en esta competencia.');
        }
        const registeredPistas = [];
        for (const pista of eligiblePistas) {
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
    async getDogStats(dogId, userId) {
        await this.verifyDogOwnership(dogId, userId);
        const duplas = await this.duplaRepo.find({ where: { id_perro: dogId } });
        const duplaIds = duplas.map(d => d.id);
        let inscriptions = [];
        if (duplaIds.length > 0) {
            inscriptions = await this.inscripcionRepo.createQueryBuilder('i')
                .leftJoinAndSelect('i.pista', 'pista')
                .leftJoinAndSelect('pista.competencia', 'comp')
                .where('i.id_dupla IN (:...ids)', { ids: duplaIds })
                .getMany();
        }
        const compMap = new Map();
        inscriptions.forEach(i => {
            if (i.pista && i.pista.competencia) {
                compMap.set(i.pista.competencia.id, i.pista.competencia);
            }
        });
        const comps = Array.from(compMap.values());
        const totalCompetitions = comps.length;
        const activeCompetitionsCount = comps.filter(c => c.flg_activo).length;
        const pendingCompetitionsCount = comps.filter(c => new Date(c.fecha_inicio) > new Date()).length;
        const totalTracks = inscriptions.length;
        const activeTracks = inscriptions.filter(i => i.pista.competencia.flg_activo).length;
        const pendingTracks = inscriptions.filter(i => new Date(i.pista.competencia.fecha_inicio) > new Date()).length;
        const results = await this.resultadoRepo.find({
            where: { id_perro: dogId, flg_activo: true },
            order: { fec_creacion: 'DESC' },
            relations: ['pista', 'pista.competencia', 'pista.tipoPista']
        });
        const excellentTracks = results.filter(r => r.faltas === 0 && r.rehuses === 0 && !r.es_eli).length;
        const cleanRunPercentage = results.length > 0 ? Math.round((excellentTracks / results.length) * 100) : 0;
        const validTimeResults = results.filter(r => r.tiempo_cronometrado_seg > 0 && !r.es_eli);
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
    async getDogRegistrations(dogId, userId) {
        await this.verifyDogOwnership(dogId, userId);
        const duplas = await this.duplaRepo.find({ where: { id_perro: dogId, flg_activo: true } });
        const duplaIds = duplas.map(d => d.id);
        if (duplaIds.length === 0)
            return [];
        const inscriptions = await this.inscripcionRepo.createQueryBuilder("inscripcion")
            .leftJoinAndSelect("inscripcion.pista", "pista")
            .where("inscripcion.id_dupla IN (:...ids)", { ids: duplaIds })
            .andWhere("inscripcion.flg_activo = :active", { active: true })
            .getMany();
        const compIds = new Set(inscriptions.map(i => i.pista.id_competencia));
        return Array.from(compIds);
    }
    async getMyCompetitionsSummary(userId) {
        const duplas = await this.duplaRepo.find({
            where: { id_guia_persona: userId, flg_activo: true },
            select: ['id_perro']
        });
        const dogIds = duplas.map(d => d.id_perro);
        if (dogIds.length === 0)
            return {};
        const results = await this.resultadoRepo.find({
            where: { flg_activo: true },
            relations: ['pista'],
        });
        const data = await this.resultadoRepo.createQueryBuilder('result')
            .leftJoinAndSelect('result.pista', 'pista')
            .where("result.id_perro IN (:...dogIds)", { dogIds })
            .andWhere("result.flg_activo = :active", { active: true })
            .getMany();
        const summary = {};
        data.forEach(r => {
            const compId = r.pista.id_competencia;
            let currentBest = summary[compId]?.bestResult;
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
        const inscriptions = await this.inscripcionRepo.createQueryBuilder("inscripcion")
            .leftJoinAndSelect("inscripcion.dupla", "dupla")
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
    async getDogInsights(dogId, userId) {
        await this.verifyDogOwnership(dogId, userId);
        const results = await this.resultadoRepo.createQueryBuilder('result')
            .leftJoinAndSelect('result.pista', 'pista')
            .leftJoinAndSelect('pista.competencia', 'competencia')
            .leftJoinAndSelect('pista.tipoPista', 'tipoPista')
            .where('result.id_perro = :dogId', { dogId })
            .andWhere('result.flg_activo = true')
            .orderBy('competencia.fecha_inicio', 'ASC')
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
        const validSpeedResults = results.map(r => {
            const time = Number(r.tiempo_cronometrado_seg);
            const length = Number(r.pista.longitud_m);
            if (time > 0 && length > 0 && !r.es_eli) {
                return { ...r, calculatedSpeed: length / time };
            }
            return null;
        }).filter(r => r !== null);
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
            if (speedImprovement > 5)
                speedTrend = "improving";
            else if (speedImprovement < -5)
                speedTrend = "declining";
        }
        const cleanRuns = results.filter(r => !r.es_eli &&
            Number(r.faltas) === 0 &&
            Number(r.rehuses) === 0);
        const cleanRunRate = (cleanRuns.length / results.length) * 100;
        const podiums = results.filter(r => r.puesto && r.puesto <= 3).length;
        const eliCount = results.filter(r => r.es_eli).length;
        const eliminationRate = (eliCount / results.length) * 100;
        const agilityResults = results.filter(r => r.pista.tipoPista && r.pista.tipoPista.nombre.toUpperCase().includes('AGILITY'));
        const jumpingResults = results.filter(r => r.pista.tipoPista && r.pista.tipoPista.nombre.toUpperCase().includes('JUMPING'));
        const agiEliRate = agilityResults.length ? (agilityResults.filter(r => r.es_eli).length / agilityResults.length) : 0;
        const jumpEliRate = jumpingResults.length ? (jumpingResults.filter(r => r.es_eli).length / jumpingResults.length) : 0;
        const insights = [];
        if (speedTrend === "improving") {
            insights.push({
                title: "Potencial de Velocidad",
                type: "positive",
                text: `¡Gran trabajo! Hemos detectado una mejora del ${speedImprovement.toFixed(1)}% en la velocidad promedio comparando tus primeras carreras con las más recientes. El entrenamiento de potencia está dando frutos.`
            });
        }
        else if (speedTrend === "declining") {
            insights.push({
                title: "Alerta de Ritmo",
                type: "warning",
                text: `Se ha notado una ligera disminución del ${Math.abs(speedImprovement).toFixed(1)}% en la velocidad reciente. Podría ser fatiga o pistas más técnicas recientemente.`
            });
        }
        else {
            insights.push({
                title: "Ritmo Constante",
                type: "neutral",
                text: "La velocidad se mantiene muy consistente a lo largo del tiempo. Esto es excelente para predecir tiempos, pero considera ejercicios de intervalos si buscas rascar segundos al cronómetro."
            });
        }
        if (cleanRunRate > 30) {
            insights.push({
                title: "Máquina de Ceros",
                type: "positive",
                text: `¡Impresionante! Tienes un ${cleanRunRate.toFixed(0)}% de efectividad en pistas limpias (Clean Runs). La precisión es tu mayor fortaleza.`
            });
        }
        else if (eliminationRate > 40) {
            insights.push({
                title: "Enfoque en Consistencia",
                type: "improvement",
                text: `La tasa de eliminados es del ${eliminationRate.toFixed(0)}%. Sugerimos volver a lo básico en zonas de contacto y entradas a slalom para asegurar finalizar pista antes de buscar velocidad máxima.`
            });
        }
        else {
            insights.push({
                title: "Equilibrio Riesgo/Control",
                type: "neutral",
                text: `Tu tasa de pistas limpias es del ${cleanRunRate.toFixed(0)}%. Estás en un punto medio saludable, pero trabajar la conexión en los cambios de lado podría reducir esos rehúses ocasionales.`
            });
        }
        if (agiEliRate > jumpEliRate + 0.2) {
            insights.push({
                title: "Reto Técnico: Agility",
                type: "info",
                text: "Tus resultados en Jumping son notablemente más consistentes que en Agility. Dedica más tiempo a zonas de contacto (Pasarela, Empalizada, Balancín), ya que parece ser el diferenciador clave."
            });
        }
        else if (jumpEliRate > agiEliRate + 0.2) {
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
        const totalCompetitions = await this.pistaRepo.createQueryBuilder('pista')
            .leftJoinAndSelect('pista.competencia', 'competencia')
            .select('COUNT(DISTINCT competencia.id)', 'count')
            .getRawOne();
        const totalTracks = await this.pistaRepo.count();
        const activeDuplas = await this.duplaRepo.count({ where: { flg_activo: true } });
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
        return this.perroRepo.find({
            where: { flg_activo: true },
            select: ['id', 'nombre'],
            order: { nombre: 'ASC' }
        });
    }
};
exports.ClientFeaturesService = ClientFeaturesService;
exports.ClientFeaturesService = ClientFeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(perro_entity_1.Perro)),
    __param(1, (0, typeorm_1.InjectRepository)(dupla_entity_1.Dupla)),
    __param(2, (0, typeorm_1.InjectRepository)(competencia_entity_1.Competencia)),
    __param(3, (0, typeorm_1.InjectRepository)(inscripcion_entity_1.Inscripcion)),
    __param(4, (0, typeorm_1.InjectRepository)(pista_entity_1.Pista)),
    __param(5, (0, typeorm_1.InjectRepository)(resultado_pista_entity_1.ResultadoPista)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        maintenance_service_1.MaintenanceService])
], ClientFeaturesService);
//# sourceMappingURL=client-features.service.js.map