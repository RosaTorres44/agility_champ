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
exports.Competencia = void 0;
const typeorm_1 = require("typeorm");
const organizacion_entity_1 = require("./organizacion.entity");
let Competencia = class Competencia {
    id;
    nombre;
    descripcion;
    fecha_inicio;
    flg_homologada;
    numero;
    anio;
    id_organizacion;
    organizacion;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.Competencia = Competencia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Competencia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Competencia.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Competencia.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Competencia.prototype, "fecha_inicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Competencia.prototype, "flg_homologada", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Competencia.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Competencia.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Competencia.prototype, "id_organizacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizacion_entity_1.Organizacion),
    (0, typeorm_1.JoinColumn)({ name: 'id_organizacion' }),
    __metadata("design:type", organizacion_entity_1.Organizacion)
], Competencia.prototype, "organizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Competencia.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Competencia.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Competencia.prototype, "fec_actualizacion", void 0);
exports.Competencia = Competencia = __decorate([
    (0, typeorm_1.Entity)('competencia')
], Competencia);
//# sourceMappingURL=competencia.entity.js.map