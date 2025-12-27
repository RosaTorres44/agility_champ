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
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resultado_pista_entity_1 = require("../entities/resultado-pista.entity");
const pista_entity_1 = require("../entities/pista.entity");
const inscripcion_entity_1 = require("../entities/inscripcion.entity");
const ranking_service_1 = require("../ranking/ranking.service");
const ranking_puntaje_entity_1 = require("../entities/ranking-puntaje.entity");
let ResultsService = class ResultsService {
    resultsRepo;
    pistaRepo;
    inscripcionRepo;
    rankingRepo;
    rankingService;
    constructor(resultsRepo, pistaRepo, inscripcionRepo, rankingRepo, rankingService) {
        this.resultsRepo = resultsRepo;
        this.pistaRepo = pistaRepo;
        this.inscripcionRepo = inscripcionRepo;
        this.rankingRepo = rankingRepo;
        this.rankingService = rankingService;
    }
    async getInscriptions(trackId) {
        return this.inscripcionRepo.find({
            where: { id_pista: trackId, flg_activo: true },
            relations: ['dupla', 'dupla.perro', 'dupla.guia']
        });
    }
    async addInscription(trackId, duplaId) {
        const exists = await this.inscripcionRepo.findOne({ where: { id_pista: trackId, id_dupla: duplaId } });
        if (exists) {
            if (!exists.flg_activo) {
                exists.flg_activo = true;
                return this.inscripcionRepo.save(exists);
            }
            return exists;
        }
        const newIns = this.inscripcionRepo.create({
            id_pista: trackId,
            id_dupla: duplaId
        });
        return this.inscripcionRepo.save(newIns);
    }
    async deactivateInscription(id) {
        const ins = await this.inscripcionRepo.findOne({ where: { id } });
        if (ins) {
            ins.flg_activo = false;
            return this.inscripcionRepo.save(ins);
        }
        return null;
    }
    async enterResult(data) {
        let inscripcionId = data.id_inscripcion;
        if (!inscripcionId && data.id_dupla) {
            const ins = await this.inscripcionRepo.findOne({ where: { id_pista: data.id_pista, id_dupla: data.id_dupla } });
            if (ins)
                inscripcionId = ins.id;
            else {
                const newIns = await this.addInscription(data.id_pista, data.id_dupla);
                inscripcionId = newIns.id;
            }
        }
        let result = await this.resultsRepo.findOne({ where: { id_inscripcion: inscripcionId } });
        if (!result) {
            result = this.resultsRepo.create({
                id_inscripcion: inscripcionId,
                id_pista: data.id_pista,
                id_dupla: data.id_dupla,
                id_perro: data.id_perro
            });
            if (!result.id_perro && result.id_dupla) {
                const inscrip = await this.inscripcionRepo.findOne({ where: { id: inscripcionId }, relations: ['dupla'] });
                if (inscrip)
                    result.id_perro = inscrip.dupla.id_perro;
            }
        }
        const pista = await this.pistaRepo.findOne({ where: { id: data.id_pista }, relations: ['tipoPista', 'competencia'] });
        if (!pista)
            throw new Error('Pista not found');
        const time = Number(data.tiempo_cronometrado_seg) || 0;
        const faults = Number(data.faltas) || 0;
        const refusals = Number(data.rehuses) || 0;
        const isManualEli = data.es_eli || false;
        let timePenalty = 0;
        let totalPenalty = 0;
        let isEli = isManualEli;
        const TSR = Number(pista.tsr_seg) || 0;
        const TMR = Number(pista.tmr_seg) || 0;
        if (TSR > 0 && time > TSR) {
            timePenalty = time - TSR;
        }
        totalPenalty = (faults * 5) + (refusals * 5) + timePenalty;
        if (refusals >= 3) {
            isEli = true;
        }
        if (TMR > 0 && time > TMR) {
            isEli = true;
        }
        const isEligible = !isEli && totalPenalty <= 15.99;
        result.tiempo_cronometrado_seg = time;
        result.faltas = faults;
        result.rehuses = refusals;
        result.es_eli = isEli;
        result.penalidad_total_seg = isEli ? 0 : Number(totalPenalty.toFixed(2));
        result.tiempo_total_seg = isEli ? 0 : Number((time + totalPenalty).toFixed(2));
        result.es_elegible_podio = isEligible;
        result.es_elegible_ranking = isEligible;
        result.id_inscripcion = inscripcionId;
        const saved = await this.resultsRepo.save(result);
        if (pista.estado === 'creada' || pista.estado === 'armada') {
            pista.estado = 'en_curso';
            await this.pistaRepo.save(pista);
        }
        await this.updatePlacements(data.id_pista);
        const year = pista.competencia && pista.competencia.anio ? pista.competencia.anio : new Date().getFullYear();
        await this.rankingService.calculateRankingForTrack(data.id_pista, year);
        const savedWithRelations = await this.resultsRepo.findOne({
            where: { id: saved.id },
            relations: ['pista', 'dupla', 'perro', 'inscripcion']
        });
        const ranking = await this.rankingRepo.findOne({ where: { id_resultado_pista: saved.id } });
        return {
            ...savedWithRelations,
            ranking_points: ranking ? ranking.puntos : 0
        };
    }
    async updatePlacements(trackId) {
        const results = await this.resultsRepo.find({
            where: { id_pista: trackId, es_eli: false, es_elegible_podio: true },
        });
        const allNonEli = await this.resultsRepo.find({
            where: { id_pista: trackId, es_eli: false },
        });
        allNonEli.sort((a, b) => {
            if (a.penalidad_total_seg !== b.penalidad_total_seg) {
                return a.penalidad_total_seg - b.penalidad_total_seg;
            }
            return a.tiempo_cronometrado_seg - b.tiempo_cronometrado_seg;
        });
        for (let i = 0; i < allNonEli.length; i++) {
            const r = allNonEli[i];
            r.puesto = i + 1;
            await this.resultsRepo.save(r);
        }
    }
    async getResultsForTrack(trackId) {
        const tId = Number(trackId);
        console.log(`[ResultsService] getResultsForTrack (Restored) for ID: ${tId}`);
        try {
            const inscriptions = await this.getInscriptions(trackId);
            console.log(`[ResultsService] Inscriptions fetched: ${inscriptions.length}`);
            const results = await this.resultsRepo.createQueryBuilder('r')
                .where('r.id_pista = :trackId', { trackId: tId })
                .getMany();
            console.log(`[ResultsService] Results fetched: ${results.length}`);
            const resultsMap = new Map();
            results.forEach(r => resultsMap.set(Number(r.id_inscripcion), r));
            let rankingPoints = [];
            if (results.length > 0) {
                rankingPoints = await this.rankingRepo.find({
                    where: { id_resultado_pista: (0, typeorm_2.In)(results.map(r => r.id)) }
                });
            }
            const pointsMap = new Map();
            rankingPoints.forEach(rp => pointsMap.set(Number(rp.id_resultado_pista), rp.puntos));
            const finalData = inscriptions.map(ins => {
                const res = resultsMap.get(Number(ins.id));
                const points = res ? pointsMap.get(Number(res.id)) : null;
                return {
                    inscription: ins,
                    result: res ? { ...res, ranking_points: points } : null
                };
            });
            return finalData;
        }
        catch (error) {
            console.error('[ResultsService] ERROR in getResultsForTrack:', error);
            throw error;
        }
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resultado_pista_entity_1.ResultadoPista)),
    __param(1, (0, typeorm_1.InjectRepository)(pista_entity_1.Pista)),
    __param(2, (0, typeorm_1.InjectRepository)(inscripcion_entity_1.Inscripcion)),
    __param(3, (0, typeorm_1.InjectRepository)(ranking_puntaje_entity_1.RankingPuntaje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ranking_service_1.RankingService])
], ResultsService);
//# sourceMappingURL=results.service.js.map