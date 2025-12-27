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
exports.Dupla = void 0;
const typeorm_1 = require("typeorm");
const perro_entity_1 = require("./perro.entity");
const persona_entity_1 = require("./persona.entity");
let Dupla = class Dupla {
    id;
    id_perro;
    perro;
    id_guia_persona;
    guia;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.Dupla = Dupla;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Dupla.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Dupla.prototype, "id_perro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => perro_entity_1.Perro),
    (0, typeorm_1.JoinColumn)({ name: 'id_perro' }),
    __metadata("design:type", perro_entity_1.Perro)
], Dupla.prototype, "perro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Dupla.prototype, "id_guia_persona", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => persona_entity_1.Persona),
    (0, typeorm_1.JoinColumn)({ name: 'id_guia_persona' }),
    __metadata("design:type", persona_entity_1.Persona)
], Dupla.prototype, "guia", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Dupla.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Dupla.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Dupla.prototype, "fec_actualizacion", void 0);
exports.Dupla = Dupla = __decorate([
    (0, typeorm_1.Entity)('dupla')
], Dupla);
//# sourceMappingURL=dupla.entity.js.map