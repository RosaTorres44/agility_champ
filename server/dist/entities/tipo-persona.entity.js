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
exports.TipoPersona = void 0;
const typeorm_1 = require("typeorm");
let TipoPersona = class TipoPersona {
    id;
    cod;
    nombre;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.TipoPersona = TipoPersona;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], TipoPersona.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], TipoPersona.prototype, "cod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TipoPersona.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TipoPersona.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TipoPersona.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TipoPersona.prototype, "fec_actualizacion", void 0);
exports.TipoPersona = TipoPersona = __decorate([
    (0, typeorm_1.Entity)('tipo_persona')
], TipoPersona);
//# sourceMappingURL=tipo-persona.entity.js.map