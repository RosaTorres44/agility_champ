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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const competencia_entity_1 = require("../entities/competencia.entity");
const dupla_entity_1 = require("../entities/dupla.entity");
const resultado_pista_entity_1 = require("../entities/resultado-pista.entity");
let DashboardService = class DashboardService {
    competenciaRepo;
    duplaRepo;
    resultadoRepo;
    constructor(competenciaRepo, duplaRepo, resultadoRepo) {
        this.competenciaRepo = competenciaRepo;
        this.duplaRepo = duplaRepo;
        this.resultadoRepo = resultadoRepo;
    }
    async getStats(userId, roleId) {
        const today = new Date();
        const isAdminOrJudge = roleId === 1 || roleId === 3;
        const activeCompetitions = await this.competenciaRepo.count({
            where: {
                flg_activo: true,
                fecha_inicio: (0, typeorm_2.MoreThan)(today)
            }
        });
        const nextEvent = await this.competenciaRepo.findOne({
            where: { fecha_inicio: (0, typeorm_2.MoreThan)(today), flg_activo: true },
            order: { fecha_inicio: 'ASC' }
        });
        const topStats = [
            { name: 'Competencias Activas', value: activeCompetitions.toString(), icon: 'Trophy', color: 'bg-indigo-500' },
            { name: 'Próximo Evento', value: nextEvent ? nextEvent.nombre : 'No prog.', icon: 'Calendar', color: 'bg-amber-500' },
        ];
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
        topStats.push({ name: 'Participaciones', value: participated?.count || '0', icon: 'Award', color: 'bg-blue-500' }, { name: 'Podios', value: podiums.toString(), icon: 'Trophy', color: 'bg-amber-500' });
        let compsQuery = this.competenciaRepo.createQueryBuilder('comp')
            .where('comp.flg_activo = :active', { active: true })
            .orderBy('comp.fecha_inicio', 'DESC')
            .take(3);
        const recentCompsRaw = await compsQuery.getMany();
        const recentCompetitions = recentCompsRaw.map(comp => {
            const start = new Date(comp.fecha_inicio).getTime();
            const end = new Date(comp.fecha_inicio).setHours(23, 59, 59, 999);
            const now = today.getTime();
            let status = 'Próxima';
            let progress = 0;
            let statusColor = 'bg-slate-100 text-slate-600';
            if (now > end) {
                status = 'Cerrada';
                progress = 100;
                statusColor = 'bg-gray-100 text-gray-600';
            }
            else if (now >= start) {
                status = 'En Curso';
                statusColor = 'bg-emerald-100 text-emerald-600';
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
        const myResults = await this.resultadoRepo.find({
            where: { dupla: { id_guia_persona: userId } },
            relations: ['pista', 'pista.competencia'],
            order: { fec_creacion: 'DESC' },
            take: 5
        });
        const recentActivity = myResults.map(res => ({
            type: 'guide',
            title: `Pista ${res.pista.id}`,
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(competencia_entity_1.Competencia)),
    __param(1, (0, typeorm_1.InjectRepository)(dupla_entity_1.Dupla)),
    __param(2, (0, typeorm_1.InjectRepository)(resultado_pista_entity_1.ResultadoPista)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map