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
exports.Pista = void 0;
const typeorm_1 = require("typeorm");
const competencia_entity_1 = require("./competencia.entity");
const tipo_pista_entity_1 = require("./tipo-pista.entity");
const grado_entity_1 = require("./grado.entity");
const persona_entity_1 = require("./persona.entity");
let Pista = class Pista {
    id;
    id_competencia;
    competencia;
    id_tipo_pista;
    tipoPista;
    id_grado_base;
    gradoBase;
    id_juez_persona;
    juez;
    longitud_m;
    obstaculos;
    velocidad_elegida_ms;
    tsr_seg;
    tmr_seg;
    estado;
    flg_perro_mas_rapido;
    modo_tsr;
    velocidad_nt_ms;
    mejor_tiempo_ref_seg;
    velocidad_calculada_ms;
    descripcion;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.Pista = Pista;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Pista.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Pista.prototype, "id_competencia", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => competencia_entity_1.Competencia),
    (0, typeorm_1.JoinColumn)({ name: 'id_competencia' }),
    __metadata("design:type", competencia_entity_1.Competencia)
], Pista.prototype, "competencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Pista.prototype, "id_tipo_pista", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_pista_entity_1.TipoPista),
    (0, typeorm_1.JoinColumn)({ name: 'id_tipo_pista' }),
    __metadata("design:type", tipo_pista_entity_1.TipoPista)
], Pista.prototype, "tipoPista", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Pista.prototype, "id_grado_base", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grado_entity_1.Grado),
    (0, typeorm_1.JoinColumn)({ name: 'id_grado_base' }),
    __metadata("design:type", grado_entity_1.Grado)
], Pista.prototype, "gradoBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "id_juez_persona", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => persona_entity_1.Persona),
    (0, typeorm_1.JoinColumn)({ name: 'id_juez_persona' }),
    __metadata("design:type", persona_entity_1.Persona)
], Pista.prototype, "juez", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "longitud_m", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 15 }),
    __metadata("design:type", Number)
], Pista.prototype, "obstaculos", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "velocidad_elegida_ms", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "tsr_seg", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "tmr_seg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['creada', 'armada', 'en_curso', 'finalizada'], default: 'creada' }),
    __metadata("design:type", String)
], Pista.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pista.prototype, "flg_perro_mas_rapido", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pista.prototype, "modo_tsr", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "velocidad_nt_ms", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "mejor_tiempo_ref_seg", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pista.prototype, "velocidad_calculada_ms", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pista.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pista.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pista.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pista.prototype, "fec_actualizacion", void 0);
exports.Pista = Pista = __decorate([
    (0, typeorm_1.Entity)('pista')
], Pista);
//# sourceMappingURL=pista.entity.js.map