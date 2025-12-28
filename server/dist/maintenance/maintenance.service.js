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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
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
const audit_log_entity_1 = require("../audit/audit-log.entity");
let MaintenanceService = class MaintenanceService {
    auditRepo;
    personaRepo;
    perroRepo;
    categoriaTallaRepo;
    gradoRepo;
    organizacionRepo;
    tipoPersonaRepo;
    tipoPistaRepo;
    competenciaRepo;
    competenciaOrganizacionRepo;
    pistaRepo;
    duplaRepo;
    razaRepo;
    systemSettingRepo;
    repositories = {};
    constructor(auditRepo, personaRepo, perroRepo, categoriaTallaRepo, gradoRepo, organizacionRepo, tipoPersonaRepo, tipoPistaRepo, competenciaRepo, competenciaOrganizacionRepo, pistaRepo, duplaRepo, razaRepo, systemSettingRepo) {
        this.auditRepo = auditRepo;
        this.personaRepo = personaRepo;
        this.perroRepo = perroRepo;
        this.categoriaTallaRepo = categoriaTallaRepo;
        this.gradoRepo = gradoRepo;
        this.organizacionRepo = organizacionRepo;
        this.tipoPersonaRepo = tipoPersonaRepo;
        this.tipoPistaRepo = tipoPistaRepo;
        this.competenciaRepo = competenciaRepo;
        this.competenciaOrganizacionRepo = competenciaOrganizacionRepo;
        this.pistaRepo = pistaRepo;
        this.duplaRepo = duplaRepo;
        this.razaRepo = razaRepo;
        this.systemSettingRepo = systemSettingRepo;
        this.repositories = {
            'persona': this.personaRepo,
            'perro': this.perroRepo,
            'categoria-talla': this.categoriaTallaRepo,
            'grado': this.gradoRepo,
            'organizacion': this.organizacionRepo,
            'tipo-persona': this.tipoPersonaRepo,
            'tipo-pista': this.tipoPistaRepo,
            'competencia': this.competenciaRepo,
            'competencia-organizacion': this.competenciaOrganizacionRepo,
            'pista': this.pistaRepo,
            'dupla': this.duplaRepo,
            'raza': this.razaRepo,
            'system-setting': this.systemSettingRepo,
        };
    }
    getRepo(entity) {
        const repo = this.repositories[entity];
        if (!repo) {
            throw new common_1.BadRequestException(`Entity '${entity}' not supported.`);
        }
        return repo;
    }
    async findAll(entity) {
        if (entity === 'perro') {
            const query = `
                SELECT 
                    p.*,
                    r.descripcion as raza_nombre,
                    g.nombre as grado_nombre,
                    ct.nombre as categoria_nombre
                FROM perro p
                LEFT JOIN raza r ON p.id_raza = r.id
                LEFT JOIN grado g ON p.id_grado_actual = g.id
                LEFT JOIN categoria_talla ct ON p.id_categoria_talla = ct.id
                ORDER BY p.id DESC
            `;
            return this.getRepo(entity).query(query);
        }
        if (entity === 'dupla') {
            const query = `
                SELECT 
                    d.*,
                    CONCAT(perro.nombre, ' - ', COALESCE(raza.descripcion, 'Sin raza'), ' - ', 
                           TIMESTAMPDIFF(YEAR, perro.fecha_nacimiento, CURDATE()), ' años') as perro_info,
                    CONCAT(persona.nombres, ' ', persona.apellidos, ' - ', persona.email) as persona_info,
                    perro.id_grado_actual as perro_grado_id,
                    perro.id_categoria_talla as perro_categoria_id
                FROM dupla d
                LEFT JOIN perro ON d.id_perro = perro.id
                LEFT JOIN raza ON perro.id_raza = raza.id
                LEFT JOIN persona ON d.id_guia_persona = persona.id
                ORDER BY d.id DESC
            `;
            return this.getRepo(entity).query(query);
        }
        if (entity === 'pista') {
            const query = `
                SELECT 
                    p.*,
                    tp.nombre as tipo_pista_nombre,
                    g.nombre as grado_nombre,
                    c.nombre as competencia_nombre
                FROM pista p
                LEFT JOIN tipo_pista tp ON p.id_tipo_pista = tp.id
                LEFT JOIN grado g ON p.id_grado_base = g.id
                LEFT JOIN competencia c ON p.id_competencia = c.id
                ORDER BY p.id DESC
            `;
            return this.getRepo(entity).query(query);
        }
        if (entity === 'inscripcion') {
            const items = await this.getRepo(entity).find({
                relations: ['pista', 'pista.competencia', 'dupla', 'dupla.perro', 'dupla.guia', 'dupla.perro.razas'],
                order: { id: 'DESC' }
            });
            return items.map((i) => ({
                ...i,
                competencia_nombre: i.pista?.competencia?.nombre,
                pista_nombre: i.pista?.grado_nombre,
                guia_nombre: i.dupla?.guia?.nombre,
                competencia: i.pista?.competencia,
                dupla: i.dupla
            }));
        }
        return this.getRepo(entity).find({ order: { id: 'DESC' } });
    }
    async create(entity, data, userId, userName) {
        try {
            const repo = this.getRepo(entity);
            Object.keys(data).forEach(key => {
                if (data[key] === '') {
                    data[key] = null;
                }
            });
            if (data.fecha_nacimiento && typeof data.fecha_nacimiento === 'string') {
                data.fecha_nacimiento = data.fecha_nacimiento.split('T')[0];
            }
            if (entity === 'pista' && data.longitud_m) {
                if (data.id_tipo_pista) {
                    const tipoPista = await this.tipoPistaRepo.findOne({ where: { id: data.id_tipo_pista } });
                    if (tipoPista) {
                        const cod = tipoPista.cod.toUpperCase();
                        if (cod === 'JUMPING') {
                            data.tmr_seg = data.longitud_m / 3;
                        }
                        else {
                            data.tmr_seg = data.longitud_m / 2.5;
                        }
                    }
                }
                if (data.velocidad_elegida_ms && data.velocidad_elegida_ms > 0) {
                    data.tsr_seg = data.longitud_m / data.velocidad_elegida_ms;
                }
            }
            console.log(`Creating ${entity} with data:`, data);
            const newItem = repo.create(data);
            const saved = await repo.save(newItem);
            await this.logAudit(userId, userName, 'CREATE', entity, saved.id, JSON.stringify(data));
            return saved;
        }
        catch (error) {
            console.error(`Error creating ${entity}:`, error);
            console.error('Data that caused error:', data);
            throw error;
        }
    }
    async update(entity, id, data, userId, userName) {
        const repo = this.getRepo(entity);
        if (entity === 'pista' && data.longitud_m) {
            if (data.id_tipo_pista) {
                const tipoPista = await this.tipoPistaRepo.findOne({ where: { id: data.id_tipo_pista } });
                if (tipoPista) {
                    const cod = tipoPista.cod.toUpperCase();
                    if (cod === 'JUMPING') {
                        data.tmr_seg = data.longitud_m / 3;
                    }
                    else {
                        data.tmr_seg = data.longitud_m / 2.5;
                    }
                }
            }
            if (data.velocidad_elegida_ms && data.velocidad_elegida_ms > 0) {
                data.tsr_seg = data.longitud_m / data.velocidad_elegida_ms;
            }
        }
        const existing = await repo.findOne({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`${entity} with id ${id} not found.`);
        }
        const readOnlyFields = [
            'raza_nombre', 'grado_nombre', 'categoria_nombre', 'tipo_pista_nombre', 'competencia_nombre',
            'perro_info', 'persona_info', 'perro_grado_id', 'perro_categoria_id'
        ];
        readOnlyFields.forEach(field => delete data[field]);
        if (data.fecha_nacimiento && typeof data.fecha_nacimiento === 'string') {
            data.fecha_nacimiento = data.fecha_nacimiento.split('T')[0];
        }
        try {
            await repo.update(id, data);
            const updated = await repo.findOne({ where: { id } });
            await this.logAudit(userId, userName, 'UPDATE', entity, id, JSON.stringify(data));
            return updated;
        }
        catch (error) {
            console.error(`Error updating ${entity}:`, error);
            throw error;
        }
    }
    async deactivate(entity, id, userId, userName) {
        const repo = this.getRepo(entity);
        const item = await repo.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Record not found');
        const hasFlag = item.hasOwnProperty('flg_activo') || item.flg_activo !== undefined;
        if (hasFlag) {
            await repo.update(id, { flg_activo: false });
            await this.logAudit(userId, userName, 'DEACTIVATE', entity, id, 'flg_activo=false');
        }
        else {
            await repo.delete(id);
            await this.logAudit(userId, userName, 'DELETE', entity, id, 'Physical Delete');
        }
        return { success: true };
    }
    async reactivate(entity, id, userId, userName) {
        const repo = this.getRepo(entity);
        const updateResult = await repo.update(id, { flg_activo: true });
        if (updateResult.affected && updateResult.affected > 0) {
            await this.logAudit(userId, userName, 'REACTIVATE', entity, id, 'flg_activo=true');
        }
        else {
            console.warn(`Reactivate failed: record ${id} not found or not updated`);
        }
        return { success: true };
    }
    async logAudit(userId, userName, action, entity, entityId, details) {
        try {
            const audit = this.auditRepo.create({
                user_id: userId,
                user_name: userName,
                action,
                entity,
                entity_id: entityId,
                details
            });
            await this.auditRepo.save(audit);
        }
        catch (e) {
            console.error("Audit Log Failed", e);
        }
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(1, (0, typeorm_1.InjectRepository)(persona_entity_1.Persona)),
    __param(2, (0, typeorm_1.InjectRepository)(perro_entity_1.Perro)),
    __param(3, (0, typeorm_1.InjectRepository)(categoria_talla_entity_1.CategoriaTalla)),
    __param(4, (0, typeorm_1.InjectRepository)(grado_entity_1.Grado)),
    __param(5, (0, typeorm_1.InjectRepository)(organizacion_entity_1.Organizacion)),
    __param(6, (0, typeorm_1.InjectRepository)(tipo_persona_entity_1.TipoPersona)),
    __param(7, (0, typeorm_1.InjectRepository)(tipo_pista_entity_1.TipoPista)),
    __param(8, (0, typeorm_1.InjectRepository)(competencia_entity_1.Competencia)),
    __param(9, (0, typeorm_1.InjectRepository)(competencia_organizacion_entity_1.CompetenciaOrganizacion)),
    __param(10, (0, typeorm_1.InjectRepository)(pista_entity_1.Pista)),
    __param(11, (0, typeorm_1.InjectRepository)(dupla_entity_1.Dupla)),
    __param(12, (0, typeorm_1.InjectRepository)(raza_entity_1.Raza)),
    __param(13, (0, typeorm_1.InjectRepository)(system_setting_entity_1.SystemSetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map