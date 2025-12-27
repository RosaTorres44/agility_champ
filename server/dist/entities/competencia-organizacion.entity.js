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
exports.CompetenciaOrganizacion = void 0;
const typeorm_1 = require("typeorm");
const competencia_entity_1 = require("./competencia.entity");
const organizacion_entity_1 = require("./organizacion.entity");
let CompetenciaOrganizacion = class CompetenciaOrganizacion {
    id;
    id_competencia;
    competencia;
    id_organizacion;
    organizacion;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.CompetenciaOrganizacion = CompetenciaOrganizacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], CompetenciaOrganizacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], CompetenciaOrganizacion.prototype, "id_competencia", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => competencia_entity_1.Competencia),
    (0, typeorm_1.JoinColumn)({ name: 'id_competencia' }),
    __metadata("design:type", competencia_entity_1.Competencia)
], CompetenciaOrganizacion.prototype, "competencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], CompetenciaOrganizacion.prototype, "id_organizacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizacion_entity_1.Organizacion),
    (0, typeorm_1.JoinColumn)({ name: 'id_organizacion' }),
    __metadata("design:type", organizacion_entity_1.Organizacion)
], CompetenciaOrganizacion.prototype, "organizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CompetenciaOrganizacion.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CompetenciaOrganizacion.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CompetenciaOrganizacion.prototype, "fec_actualizacion", void 0);
exports.CompetenciaOrganizacion = CompetenciaOrganizacion = __decorate([
    (0, typeorm_1.Entity)('competencia_organizacion')
], CompetenciaOrganizacion);
//# sourceMappingURL=competencia-organizacion.entity.js.map