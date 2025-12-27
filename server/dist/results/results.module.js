"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const results_controller_1 = require("./results.controller");
const results_service_1 = require("./results.service");
const resultado_pista_entity_1 = require("../entities/resultado-pista.entity");
const pista_entity_1 = require("../entities/pista.entity");
const ranking_module_1 = require("../ranking/ranking.module");
const inscripcion_entity_1 = require("../entities/inscripcion.entity");
const dupla_entity_1 = require("../entities/dupla.entity");
const perro_entity_1 = require("../entities/perro.entity");
const persona_entity_1 = require("../entities/persona.entity");
const grado_entity_1 = require("../entities/grado.entity");
const categoria_talla_entity_1 = require("../entities/categoria-talla.entity");
const tipo_persona_entity_1 = require("../entities/tipo-persona.entity");
const ranking_puntaje_entity_1 = require("../entities/ranking-puntaje.entity");
let ResultsModule = class ResultsModule {
};
exports.ResultsModule = ResultsModule;
exports.ResultsModule = ResultsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                resultado_pista_entity_1.ResultadoPista,
                inscripcion_entity_1.Inscripcion,
                pista_entity_1.Pista,
                dupla_entity_1.Dupla,
                perro_entity_1.Perro,
                persona_entity_1.Persona,
                grado_entity_1.Grado,
                categoria_talla_entity_1.CategoriaTalla,
                categoria_talla_entity_1.CategoriaTalla,
                tipo_persona_entity_1.TipoPersona,
                ranking_puntaje_entity_1.RankingPuntaje
            ]),
            ranking_module_1.RankingModule
        ],
        controllers: [results_controller_1.ResultsController],
        providers: [results_service_1.ResultsService],
    })
], ResultsModule);
//# sourceMappingURL=results.module.js.map