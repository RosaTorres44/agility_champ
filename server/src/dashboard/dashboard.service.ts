import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { Competencia } from '../entities/competencia.entity';
import { Dupla } from '../entities/dupla.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Competencia)
        private competenciaRepo: Repository<Competencia>,
        @InjectRepository(Dupla)
        private duplaRepo: Repository<Dupla>,
        @InjectRepository(ResultadoPista)
        private resultadoRepo: Repository<ResultadoPista>,
    ) { }

    async getStats(userId: number, roleId: number) {
        const today = new Date();
        const isAdminOrJudge = roleId === 1 || roleId === 3;

        // --- 1. Top Cards Stats ---
        const activeCompetitions = await this.competenciaRepo.count({
            where: {
                flg_activo: true,
                fecha_inicio: MoreThan(today) // Changed logic to just future active comps
            }
        });

        const nextEvent = await this.competenciaRepo.findOne({
            where: { fecha_inicio: MoreThan(today), flg_activo: true },
            order: { fecha_inicio: 'ASC' }
        });

        const topStats = [
            { name: 'Competencias Activas', value: activeCompetitions.toString(), icon: 'Trophy', color: 'bg-indigo-500' },
            { name: 'Próximo Evento', value: nextEvent ? nextEvent.nombre : 'No prog.', icon: 'Calendar', color: 'bg-amber-500' },
        ];

        // Unified View (Guide Style for Everyone)
        const participated = await this.resultadoRepo.createQueryBuilder('resultado')
            .innerJoin('resultado.dupla', 'dupla')
            .where('dupla.id_guia_persona = :userId', { userId })
            .select('COUNT(DISTINCT resultado.id_pista)', 'count')
            .getRawOne();

        const podiums = await this.resultadoRepo.createQueryBuilder('resultado')
            .innerJoin('resultado.dupla', 'dupla')
            .where('dupla.id_guia_persona = :userId', { userId })
            .andWhere('resultado.puesto IN (:...puestos)', { puestos: [1, 2, 3] })
            .getCount();

        topStats.push(
            { name: 'Participaciones', value: participated?.count || '0', icon: 'Award', color: 'bg-blue-500' },
            { name: 'Podios', value: podiums.toString(), icon: 'Trophy', color: 'bg-amber-500' }
        );

        // --- 2. Recent Competitions (Left Panel) ---
        let compsQuery = this.competenciaRepo.createQueryBuilder('comp')
            .where('comp.flg_activo = :active', { active: true })
            .orderBy('comp.fecha_inicio', 'DESC')
            .take(3);

        const recentCompsRaw = await compsQuery.getMany();

        const recentCompetitions = recentCompsRaw.map(comp => {
            const start = new Date(comp.fecha_inicio).getTime();
            // Assuming single day event or end of day
            const end = new Date(comp.fecha_inicio).setHours(23, 59, 59, 999);
            const now = today.getTime();

            let status = 'Próxima';
            let progress = 0;
            let statusColor = 'bg-slate-100 text-slate-600';

            if (now > end) {
                status = 'Cerrada';
                progress = 100;
                statusColor = 'bg-gray-100 text-gray-600';
            } else if (now >= start) {
                status = 'En Curso';
                statusColor = 'bg-emerald-100 text-emerald-600';
                // Simple progress for single day
                progress = 50;
            }

            return {
                id: comp.id,
                nombre: comp.nombre,
                status,
                statusColor,
                progress
            };
        });


        // --- 3. Recent Activity (Right Panel) ---
        // Always show individual results
        const myResults = await this.resultadoRepo.find({
            where: { dupla: { id_guia_persona: userId } },
            relations: ['pista', 'pista.competencia'],
            order: { fec_creacion: 'DESC' },
            take: 5
        });

        const recentActivity = myResults.map(res => ({
            type: 'guide',
            title: `Pista ${res.pista.id}`, // Pista name removed, using ID
            subtitle: res.puesto ? `Puesto: ${res.puesto}º` : 'Sin puesto',
            meta: res.es_eli ? 'ELIMINADO' : (res.faltas === 0 && res.rehuses === 0 && res.penalidad_total_seg === 0 ? 'CERADO' : `${res.faltas}F / ${res.rehuses}R`),
            metaColor: res.es_eli ? 'text-rose-600' : (res.faltas === 0 && res.rehuses === 0 && res.penalidad_total_seg === 0 ? 'text-emerald-600' : 'text-amber-600')
        }));

        return {
            topStats,
            recentCompetitions,
            recentActivity
        };
    }
}
