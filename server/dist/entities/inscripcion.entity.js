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
exports.Inscripcion = void 0;
const typeorm_1 = require("typeorm");
const pista_entity_1 = require("./pista.entity");
const dupla_entity_1 = require("./dupla.entity");
let Inscripcion = class Inscripcion {
    id;
    id_pista;
    pista;
    id_dupla;
    dupla;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.Inscripcion = Inscripcion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Inscripcion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Inscripcion.prototype, "id_pista", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pista_entity_1.Pista),
    (0, typeorm_1.JoinColumn)({ name: 'id_pista' }),
    __metadata("design:type", pista_entity_1.Pista)
], Inscripcion.prototype, "pista", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Inscripcion.prototype, "id_dupla", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dupla_entity_1.Dupla),
    (0, typeorm_1.JoinColumn)({ name: 'id_dupla' }),
    __metadata("design:type", dupla_entity_1.Dupla)
], Inscripcion.prototype, "dupla", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Inscripcion.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Inscripcion.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Inscripcion.prototype, "fec_actualizacion", void 0);
exports.Inscripcion = Inscripcion = __decorate([
    (0, typeorm_1.Entity)('inscripcion')
], Inscripcion);
//# sourceMappingURL=inscripcion.entity.js.map