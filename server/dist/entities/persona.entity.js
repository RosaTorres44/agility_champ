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
exports.Persona = void 0;
const typeorm_1 = require("typeorm");
const tipo_persona_entity_1 = require("./tipo-persona.entity");
let Persona = class Persona {
    id;
    id_tipo_persona;
    tipoPersona;
    nombres;
    apellidos;
    email;
    telefono;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.Persona = Persona;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Persona.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Persona.prototype, "id_tipo_persona", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_persona_entity_1.TipoPersona),
    (0, typeorm_1.JoinColumn)({ name: 'id_tipo_persona' }),
    __metadata("design:type", tipo_persona_entity_1.TipoPersona)
], Persona.prototype, "tipoPersona", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Persona.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Persona.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], Persona.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Persona.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Persona.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Persona.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Persona.prototype, "fec_actualizacion", void 0);
exports.Persona = Persona = __decorate([
    (0, typeorm_1.Entity)('persona')
], Persona);
//# sourceMappingURL=persona.entity.js.map