"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFeaturesModule = void 0;
const common_1 = require("@nestjs/common");
const client_features_controller_1 = require("./client-features.controller");
const client_features_service_1 = require("./client-features.service");
const typeorm_1 = require("@nestjs/typeorm");
const perro_entity_1 = require("../entities/perro.entity");
const dupla_entity_1 = require("../entities/dupla.entity");
const competencia_entity_1 = require("../entities/competencia.entity");
const inscripcion_entity_1 = require("../entities/inscripcion.entity");
const pista_entity_1 = require("../entities/pista.entity");
const resultado_pista_entity_1 = require("../entities/resultado-pista.entity");
const maintenance_module_1 = require("../maintenance/maintenance.module");
let ClientFeaturesModule = class ClientFeaturesModule {
};
exports.ClientFeaturesModule = ClientFeaturesModule;
exports.ClientFeaturesModule = ClientFeaturesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([perro_entity_1.Perro, dupla_entity_1.Dupla, competencia_entity_1.Competencia, inscripcion_entity_1.Inscripcion, pista_entity_1.Pista, resultado_pista_entity_1.ResultadoPista]),
            maintenance_module_1.MaintenanceModule
        ],
        controllers: [client_features_controller_1.ClientFeaturesController],
        providers: [client_features_service_1.ClientFeaturesService],
    })
], ClientFeaturesModule);
//# sourceMappingURL=client-features.module.js.map