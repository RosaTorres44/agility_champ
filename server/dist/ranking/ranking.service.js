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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ranking_puntaje_entity_1 = require("../entities/ranking-puntaje.entity");
const resultado_pista_entity_1 = require("../entities/resultado-pista.entity");
let RankingService = class RankingService {
    rankingRepo;
    resultsRepo;
    constructor(rankingRepo, resultsRepo) {
        this.rankingRepo = rankingRepo;
        this.resultsRepo = resultsRepo;
    }
    async calculateRankingForTrack(trackId, year) {
        const fs = require('fs');
        const logFile = 'ranking_debug.log';
        const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
        try {
            const existingResults = await this.resultsRepo.find({ where: { id_pista: trackId }, select: ['id'] });
            const existingIds = existingResults.map(r => r.id);
            if (existingIds.length > 0) {
                await this.rankingRepo.delete({ id_resultado_pista: (0, typeorm_2.In)(existingIds) });
            }
            const results = await this.resultsRepo.find({
                where: { id_pista: trackId, es_eli: false, es_elegible_ranking: true },
                relations: ['pista', 'pista.tipoPista', 'pista.gradoBase', 'dupla', 'dupla.perro'],
                order: { penalidad_total_seg: 'ASC', tiempo_cronometrado_seg: 'ASC' }
            });
            if (results.length === 0) {
                log(`[RankingService] No results found for track ${trackId}`);
                return { message: 'No eligible results found' };
            }
            const trackType = results[0].pista.tipoPista.cod;
            const trackGrade = results[0].pista.gradoBase.cod;
            log(`[RankingService] Track ${trackId} Type: ${trackType}, Grade: ${trackGrade}`);
            const isHomologada = results[0].pista.competencia?.flg_homologada;
            log(`[RankingService] Competition Homologated: ${isHomologada}`);
            if (!isHomologada) {
                log(`[RankingService] Skipped: Competition is NOT homologated. Points removed.`);
                return { message: 'Competition not homologated, points removed if any.' };
            }
            if (['G0', 'G1'].includes(trackGrade)) {
                log(`[RankingService] Skipped: Grade ${trackGrade} not eligible`);
                return { message: 'Grade not eligible for National Ranking' };
            }
            const pointsMap = {
                AGILITY: {
                    clean: [10, 8, 6],
                    penalty: [8, 6, 4]
                },
                JUMPING: {
                    clean: [7, 5, 3],
                    penalty: [5, 3, 1]
                }
            };
            const config = pointsMap[trackType] || pointsMap['AGILITY'];
            let assignedCount = 0;
            const savedPoints = [];
            log(`[RankingService] Processing ${results.length} results for ranking...`);
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.categoria_competitiva === 'SENIOR') {
                    log(`[RankingService] Result ${result.id}: Skipped (SENIOR)`);
                    continue;
                }
                if (Number(result.penalidad_total_seg) > 15.99) {
                    log(`[RankingService] Result ${result.id}: Skipped (Penalty > 15.99)`);
                    continue;
                }
                const place = assignedCount + 1;
                if (place > 3)
                    break;
                const isClean = Number(result.penalidad_total_seg) === 0;
                const pointsTable = isClean ? config.clean : config.penalty;
                const points = pointsTable[place - 1];
                log(`[RankingService] Result ${result.id}: Assigning ${points} points (Place ${place})`);
                const rankingEntry = this.rankingRepo.create({
                    anio: year,
                    id_resultado_pista: result.id,
                    id_dupla: result.id_dupla,
                    puntos: points,
                    motivo: `${place}º Place (${isClean ? 'Clean' : 'Penalty'}) - ${trackType}`
                });
                await this.rankingRepo.save(rankingEntry);
                savedPoints.push(rankingEntry);
                assignedCount++;
            }
            return { message: 'Ranking calculated', details: savedPoints };
        }
        catch (e) {
            const fs = require('fs');
            fs.appendFileSync('ranking_debug.log', `ERROR: ${e.message}\n${e.stack}\n`);
            throw e;
        }
    }
    async getNationalRanking(year, gradeId, categoryId) {
        try {
            console.log(`[RankingService] Calculating ranking (IGNORING YEAR)`);
            const query = this.rankingRepo.createQueryBuilder('rp')
                .leftJoinAndSelect('rp.dupla', 'd')
                .leftJoinAndSelect('d.perro', 'p')
                .leftJoinAndSelect('d.guia', 'g')
                .leftJoinAndSelect('p.raza', 'r')
                .leftJoinAndSelect('p.gradoActual', 'gr')
                .leftJoinAndSelect('p.categoriaTalla', 'ct')
                .select([
                'rp.id_dupla AS id',
                'p.nombre AS perro',
                'g.nombres AS guia_nombres',
                'g.apellidos AS guia_apellidos',
                'ct.nombre AS categoria',
                'gr.nombre AS grado',
                'r.descripcion AS raza',
                'SUM(rp.puntos) AS puntos',
                'RANK() OVER (PARTITION BY p.id_grado_actual, p.id_categoria_talla ORDER BY SUM(rp.puntos) DESC) as puesto_calculado'
            ])
                .where('rp.anio = :year', { year })
                .groupBy('rp.id_dupla')
                .addGroupBy('p.id')
                .addGroupBy('p.nombre')
                .addGroupBy('g.nombres')
                .addGroupBy('g.apellidos')
                .addGroupBy('ct.nombre')
                .addGroupBy('gr.nombre')
                .addGroupBy('r.descripcion')
                .addGroupBy('p.id_grado_actual')
                .addGroupBy('p.id_categoria_talla')
                .orderBy('grado', 'DESC')
                .addOrderBy('categoria', 'ASC')
                .addOrderBy('puesto_calculado', 'ASC');
            if (gradeId) {
                query.andWhere('p.id_grado_actual = :gradeId', { gradeId });
            }
            if (categoryId) {
                query.andWhere('p.id_categoria_talla = :categoryId', { categoryId });
            }
            const rawResults = await query.getRawMany();
            return rawResults.map((r) => ({
                puesto: Number(r.puesto_calculado),
                dupla: `${r.perro} & ${r.guia_nombres} ${r.guia_apellidos}`,
                categoria: `${r.categoria} - ${r.grado}`,
                puntos: Number(r.puntos),
                raza: r.raza || 'Desconocida'
            }));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ranking_puntaje_entity_1.RankingPuntaje)),
    __param(1, (0, typeorm_1.InjectRepository)(resultado_pista_entity_1.ResultadoPista)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RankingService);
//# sourceMappingURL=ranking.service.js.map