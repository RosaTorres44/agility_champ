"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const competitions_controller_1 = require("./competitions.controller");
const competitions_service_1 = require("./competitions.service");
const competencia_entity_1 = require("../entities/competencia.entity");
const pista_entity_1 = require("../entities/pista.entity");
const perro_entity_1 = require("../entities/perro.entity");
const categoria_talla_entity_1 = require("../entities/categoria-talla.entity");
const grado_entity_1 = require("../entities/grado.entity");
const dupla_entity_1 = require("../entities/dupla.entity");
const inscripcion_entity_1 = require("../entities/inscripcion.entity");
let CompetitionsModule = class CompetitionsModule {
};
exports.CompetitionsModule = CompetitionsModule;
exports.CompetitionsModule = CompetitionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([competencia_entity_1.Competencia, inscripcion_entity_1.Inscripcion, perro_entity_1.Perro, categoria_talla_entity_1.CategoriaTalla, grado_entity_1.Grado, dupla_entity_1.Dupla, pista_entity_1.Pista])],
        controllers: [competitions_controller_1.CompetitionsController],
        providers: [competitions_service_1.CompetitionsService]
    })
], CompetitionsModule);
//# sourceMappingURL=competitions.module.js.map