"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const maintenance_service_1 = require("./maintenance.service");
const maintenance_controller_1 = require("./maintenance.controller");
const persona_entity_1 = require("../entities/persona.entity");
const perro_entity_1 = require("../entities/perro.entity");
const categoria_talla_entity_1 = require("../entities/categoria-talla.entity");
const grado_entity_1 = require("../entities/grado.entity");
const organizacion_entity_1 = require("../entities/organizacion.entity");
const tipo_persona_entity_1 = require("../entities/tipo-persona.entity");
const tipo_pista_entity_1 = require("../entities/tipo-pista.entity");
const competencia_entity_1 = require("../entities/competencia.entity");
const competencia_organizacion_entity_1 = require("../entities/competencia-organizacion.entity");
const pista_entity_1 = require("../entities/pista.entity");
const dupla_entity_1 = require("../entities/dupla.entity");
const raza_entity_1 = require("../entities/raza.entity");
const system_setting_entity_1 = require("../entities/system-setting.entity");
const audit_module_1 = require("../audit/audit.module");
let MaintenanceModule = class MaintenanceModule {
};
exports.MaintenanceModule = MaintenanceModule;
exports.MaintenanceModule = MaintenanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_module_1.AuditModule,
            typeorm_1.TypeOrmModule.forFeature([
                persona_entity_1.Persona,
                perro_entity_1.Perro,
                categoria_talla_entity_1.CategoriaTalla,
                grado_entity_1.Grado,
                organizacion_entity_1.Organizacion,
                tipo_persona_entity_1.TipoPersona,
                tipo_pista_entity_1.TipoPista,
                competencia_entity_1.Competencia,
                competencia_organizacion_entity_1.CompetenciaOrganizacion,
                pista_entity_1.Pista,
                dupla_entity_1.Dupla,
                raza_entity_1.Raza,
                system_setting_entity_1.SystemSetting
            ])
        ],
        controllers: [maintenance_controller_1.MaintenanceController],
        providers: [maintenance_service_1.MaintenanceService],
        exports: [maintenance_service_1.MaintenanceService]
    })
], MaintenanceModule);
//# sourceMappingURL=maintenance.module.js.map