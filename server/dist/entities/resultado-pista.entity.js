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
exports.ResultadoPista = void 0;
const typeorm_1 = require("typeorm");
const pista_entity_1 = require("./pista.entity");
const dupla_entity_1 = require("./dupla.entity");
const perro_entity_1 = require("./perro.entity");
const inscripcion_entity_1 = require("./inscripcion.entity");
let ResultadoPista = class ResultadoPista {
    id;
    id_inscripcion;
    inscripcion;
    id_pista;
    pista;
    id_dupla;
    dupla;
    id_perro;
    perro;
    categoria_competitiva;
    tiempo_cronometrado_seg;
    faltas;
    rehuses;
    penalidad_total_seg;
    tiempo_total_seg;
    es_eli;
    es_ausente;
    es_elegible_podio;
    es_elegible_ranking;
    puesto;
    puntos_ranking;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.ResultadoPista = ResultadoPista;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "id_inscripcion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inscripcion_entity_1.Inscripcion),
    (0, typeorm_1.JoinColumn)({ name: 'id_inscripcion' }),
    __metadata("design:type", inscripcion_entity_1.Inscripcion)
], ResultadoPista.prototype, "inscripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "id_pista", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pista_entity_1.Pista),
    (0, typeorm_1.JoinColumn)({ name: 'id_pista' }),
    __metadata("design:type", pista_entity_1.Pista)
], ResultadoPista.prototype, "pista", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "id_dupla", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dupla_entity_1.Dupla),
    (0, typeorm_1.JoinColumn)({ name: 'id_dupla' }),
    __metadata("design:type", dupla_entity_1.Dupla)
], ResultadoPista.prototype, "dupla", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "id_perro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => perro_entity_1.Perro),
    (0, typeorm_1.JoinColumn)({ name: 'id_perro' }),
    __metadata("design:type", perro_entity_1.Perro)
], ResultadoPista.prototype, "perro", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResultadoPista.prototype, "categoria_competitiva", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "tiempo_cronometrado_seg", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "faltas", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "rehuses", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "penalidad_total_seg", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "tiempo_total_seg", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ResultadoPista.prototype, "es_eli", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ResultadoPista.prototype, "es_ausente", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ResultadoPista.prototype, "es_elegible_podio", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ResultadoPista.prototype, "es_elegible_ranking", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "puesto", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ResultadoPista.prototype, "puntos_ranking", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ResultadoPista.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResultadoPista.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ResultadoPista.prototype, "fec_actualizacion", void 0);
exports.ResultadoPista = ResultadoPista = __decorate([
    (0, typeorm_1.Entity)('resultado_pista')
], ResultadoPista);
//# sourceMappingURL=resultado-pista.entity.js.map