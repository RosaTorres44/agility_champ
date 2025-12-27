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
exports.Perro = void 0;
const typeorm_1 = require("typeorm");
const categoria_talla_entity_1 = require("./categoria-talla.entity");
const grado_entity_1 = require("./grado.entity");
const raza_entity_1 = require("./raza.entity");
let Perro = class Perro {
    id;
    nombre;
    fecha_nacimiento;
    chip;
    id_categoria_talla;
    categoriaTalla;
    id_grado_actual;
    gradoActual;
    id_raza;
    raza;
    observaciones;
    flg_activo;
    fec_creacion;
    fec_actualizacion;
};
exports.Perro = Perro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Perro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Perro.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Perro.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Perro.prototype, "chip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Perro.prototype, "id_categoria_talla", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_talla_entity_1.CategoriaTalla),
    (0, typeorm_1.JoinColumn)({ name: 'id_categoria_talla' }),
    __metadata("design:type", categoria_talla_entity_1.CategoriaTalla)
], Perro.prototype, "categoriaTalla", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Perro.prototype, "id_grado_actual", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => grado_entity_1.Grado),
    (0, typeorm_1.JoinColumn)({ name: 'id_grado_actual' }),
    __metadata("design:type", grado_entity_1.Grado)
], Perro.prototype, "gradoActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Perro.prototype, "id_raza", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => raza_entity_1.Raza),
    (0, typeorm_1.JoinColumn)({ name: 'id_raza' }),
    __metadata("design:type", raza_entity_1.Raza)
], Perro.prototype, "raza", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Perro.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Perro.prototype, "flg_activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Perro.prototype, "fec_creacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Perro.prototype, "fec_actualizacion", void 0);
exports.Perro = Perro = __decorate([
    (0, typeorm_1.Entity)('perro')
], Perro);
//# sourceMappingURL=perro.entity.js.map