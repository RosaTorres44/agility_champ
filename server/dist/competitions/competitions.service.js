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
exports.CompetitionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const competencia_entity_1 = require("../entities/competencia.entity");
const pista_entity_1 = require("../entities/pista.entity");
let CompetitionsService = class CompetitionsService {
    competenciaRepo;
    pistaRepo;
    constructor(competenciaRepo, pistaRepo) {
        this.competenciaRepo = competenciaRepo;
        this.pistaRepo = pistaRepo;
    }
    async findAll() {
        return this.competenciaRepo.find({
            relations: ['organizacion'],
            order: { fecha_inicio: 'DESC' },
        });
    }
    async findOne(id) {
        return this.competenciaRepo.findOne({
            where: { id },
            relations: ['organizacion', 'juez'],
        });
    }
    async getTracksForCompetition(competitionId) {
        return this.pistaRepo.find({
            where: { id_competencia: competitionId },
            relations: ['tipoPista', 'gradoBase', 'juez'],
            order: { id: 'ASC' }
        });
    }
};
exports.CompetitionsService = CompetitionsService;
exports.CompetitionsService = CompetitionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(competencia_entity_1.Competencia)),
    __param(1, (0, typeorm_1.InjectRepository)(pista_entity_1.Pista)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CompetitionsService);
//# sourceMappingURL=competitions.service.js.map