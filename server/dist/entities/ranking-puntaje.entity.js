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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingPuntaje = void 0;
const typeorm_1 = require("typeorm");
const resultado_pista_entity_1 = require("./resultado-pista.entity");
const dupla_entity_1 = require("./dupla.entity");
let RankingPuntaje = class RankingPuntaje {
    id;
    anio;
    id_resultado_pista;
    resultadoPista;
    id_dupla;
    dupla;
    puntos;
    motivo;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.RankingPuntaje = RankingPuntaje;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], RankingPuntaje.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 2024 }),
    __metadata("design:type", Number)
], RankingPuntaje.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], RankingPuntaje.prototype, "id_resultado_pista", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resultado_pista_entity_1.ResultadoPista),
    (0, typeorm_1.JoinColumn)({ name: 'id_resultado_pista' }),
    __metadata("design:type", resultado_pista_entity_1.ResultadoPista)
], RankingPuntaje.prototype, "resultadoPista", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], RankingPuntaje.prototype, "id_dupla", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dupla_entity_1.Dupla),
    (0, typeorm_1.JoinColumn)({ name: 'id_dupla' }),
    __metadata("design:type", dupla_entity_1.Dupla)
], RankingPuntaje.prototype, "dupla", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RankingPuntaje.prototype, "puntos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RankingPuntaje.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RankingPuntaje.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RankingPuntaje.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RankingPuntaje.prototype, "fec_actualizacion", void 0);
exports.RankingPuntaje = RankingPuntaje = __decorate([
    (0, typeorm_1.Entity)('ranking_puntaje')
], RankingPuntaje);
//# sourceMappingURL=ranking-puntaje.entity.js.map