import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


// Entities
import { Persona } from '../entities/persona.entity';
import { Perro } from '../entities/perro.entity';
import { CategoriaTalla } from '../entities/categoria-talla.entity';
import { Grado } from '../entities/grado.entity';
import { Organizacion } from '../entities/organizacion.entity';
import { TipoPersona } from '../entities/tipo-persona.entity';
import { TipoPista } from '../entities/tipo-pista.entity';
import { Competencia } from '../entities/competencia.entity';
import { CompetenciaOrganizacion } from '../entities/competencia-organizacion.entity';
import { Pista } from '../entities/pista.entity';
import { Dupla } from '../entities/dupla.entity';
import { Raza } from '../entities/raza.entity';
import { SystemSetting } from '../entities/system-setting.entity';

import { AuditLog } from '../audit/audit-log.entity';

@Injectable()
export class MaintenanceService {
    private repositories: { [key: string]: Repository<any> } = {};

    constructor(
        @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
        @InjectRepository(Persona) private personaRepo: Repository<Persona>,
        @InjectRepository(Perro) private perroRepo: Repository<Perro>,
        @InjectRepository(CategoriaTalla) private categoriaTallaRepo: Repository<CategoriaTalla>,
        @InjectRepository(Grado) private gradoRepo: Repository<Grado>,
        @InjectRepository(Organizacion) private organizacionRepo: Repository<Organizacion>,
        @InjectRepository(TipoPersona) private tipoPersonaRepo: Repository<TipoPersona>,
        @InjectRepository(TipoPista) private tipoPistaRepo: Repository<TipoPista>,
        @InjectRepository(Competencia) private competenciaRepo: Repository<Competencia>,
        @InjectRepository(CompetenciaOrganizacion) private competenciaOrganizacionRepo: Repository<CompetenciaOrganizacion>,
        @InjectRepository(Pista) private pistaRepo: Repository<Pista>,
        @InjectRepository(Dupla) private duplaRepo: Repository<Dupla>,
        @InjectRepository(Raza) private razaRepo: Repository<Raza>,
        @InjectRepository(SystemSetting) private systemSettingRepo: Repository<SystemSetting>,
    ) {
        // Map entity names (slugs) to repositories
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

    private getRepo(entity: string): Repository<any> {
        const repo = this.repositories[entity];
        if (!repo) {
            throw new BadRequestException(`Entity '${entity}' not supported.`);
        }
        return repo;
    }

    async findAll(entity: string) {
        // Default to showing only active, or all? "Mantenimiento" often implies seeing everything.
        // Let's show all for now, or filter flg_activo=true if requested.
        // Usually admin wants to see deactivated too to reactivate.
        // For perro and dupla, return enriched data with names instead of IDs
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
                relations: ['pista', 'pista.competencia', 'dupla', 'dupla.perro', 'dupla.guia', 'dupla.perro.razas'], // Fetch full tree
                order: { id: 'DESC' }
            });

            // Map to include flat fields for Admin display while keeping objects for Results page
            return items.map((i: any) => ({
                ...i,
                competencia_nombre: i.pista?.competencia?.nombre,
                pista_nombre: i.pista?.grado_nombre, // Or construct full name
                guia_nombre: i.dupla?.guia?.nombre,
                competencia: i.pista?.competencia, // Ensure nested exists
                dupla: i.dupla // Ensure nested exists
            }));
        }

        // Default behavior for other entities
        return this.getRepo(entity).find({ order: { id: 'DESC' } });
    }

    async create(entity: string, data: any, userId: number, userName: string) {
        try {
            const repo = this.getRepo(entity);

            // Clean empty strings to null for nullable fields
            Object.keys(data).forEach(key => {
                if (data[key] === '') {
                    data[key] = null;
                }
            });

            // Fix Date format for fecha_nacimiento (MySQL DATE type)
            if (data.fecha_nacimiento && typeof data.fecha_nacimiento === 'string') {
                data.fecha_nacimiento = data.fecha_nacimiento.split('T')[0];
            }

            // Calculate TMR and TSR for pista
            if (entity === 'pista' && data.longitud_m) {
                // Get tipo_pista to determine TMR formula
                if (data.id_tipo_pista) {
                    const tipoPista = await this.tipoPistaRepo.findOne({ where: { id: data.id_tipo_pista } });
                    if (tipoPista) {
                        const cod = tipoPista.cod.toUpperCase();
                        // TMR calculation: Agility and Requisito = L/2.5, Jumping = L/3
                        if (cod === 'JUMPING') {
                            data.tmr_seg = data.longitud_m / 3;
                        } else { // AGILITY or REQUISITO
                            data.tmr_seg = data.longitud_m / 2.5;
                        }
                    }
                }

                // TSR calculation: L / velocidad_elegida
                if (data.velocidad_elegida_ms && data.velocidad_elegida_ms > 0) {
                    data.tsr_seg = data.longitud_m / data.velocidad_elegida_ms;
                }
            }

            console.log(`Creating ${entity} with data:`, data);
            const newItem = repo.create(data);
            const saved = await repo.save(newItem);

            await this.logAudit(userId, userName, 'CREATE', entity, saved.id, JSON.stringify(data));
            return saved;
        } catch (error) {
            console.error(`Error creating ${entity}:`, error);
            console.error('Data that caused error:', data);

            // Write to file for debugging since console logs are lost


            throw error;
        }
    }

    async update(entity: string, id: number, data: any, userId: number, userName: string) {
        const repo = this.getRepo(entity);

        // Calculate TMR and TSR for pista
        if (entity === 'pista' && data.longitud_m) {
            // Get tipo_pista to determine TMR formula
            if (data.id_tipo_pista) {
                const tipoPista = await this.tipoPistaRepo.findOne({ where: { id: data.id_tipo_pista } });
                if (tipoPista) {
                    const cod = tipoPista.cod.toUpperCase();
                    // TMR calculation: Agility and Requisito = L/2.5, Jumping = L/3
                    if (cod === 'JUMPING') {
                        data.tmr_seg = data.longitud_m / 3;
                    } else { // AGILITY or REQUISITO
                        data.tmr_seg = data.longitud_m / 2.5;
                    }
                }
            }

            // TSR calculation: L / velocidad_elegida
            if (data.velocidad_elegida_ms && data.velocidad_elegida_ms > 0) {
                data.tsr_seg = data.longitud_m / data.velocidad_elegida_ms;
            }
        }

        const existing = await repo.findOne({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`${entity} with id ${id} not found.`);
        }

        // Clean data of read-only fields from joins
        const readOnlyFields = [
            'raza_nombre', 'grado_nombre', 'categoria_nombre', 'tipo_pista_nombre', 'competencia_nombre',
            'perro_info', 'persona_info', 'perro_grado_id', 'perro_categoria_id'
        ];
        readOnlyFields.forEach(field => delete data[field]);

        // Fix Date format for fecha_nacimiento (MySQL DATE type)
        if (data.fecha_nacimiento && typeof data.fecha_nacimiento === 'string') {
            data.fecha_nacimiento = data.fecha_nacimiento.split('T')[0];
        }

        try {
            await repo.update(id, data);
            const updated = await repo.findOne({ where: { id } });

            await this.logAudit(userId, userName, 'UPDATE', entity, id, JSON.stringify(data));
            return updated;
        } catch (error) {
            console.error(`Error updating ${entity}:`, error);

            throw error;
        }
    }

    async deactivate(entity: string, id: number, userId: number, userName: string) {
        const repo = this.getRepo(entity);
        // Check if column exists by checking metadata or trying to update
        // Simpler: Fetch first.
        const item = await repo.findOne({ where: { id } });
        if (!item) throw new NotFoundException('Record not found');

        // Robust check for property existence: check if it's in the object or prototype
        const hasFlag = item.hasOwnProperty('flg_activo') || (item as any).flg_activo !== undefined;

        if (hasFlag) {
            await repo.update(id, { flg_activo: false });
            await this.logAudit(userId, userName, 'DEACTIVATE', entity, id, 'flg_activo=false');
        } else {
            await repo.delete(id);
            await this.logAudit(userId, userName, 'DELETE', entity, id, 'Physical Delete');
        }
        return { success: true };
    }

    async reactivate(entity: string, id: number, userId: number, userName: string) {
        const repo = this.getRepo(entity);

        // Direct update approach is safer for simple toggles
        const updateResult = await repo.update(id, { flg_activo: true });

        if (updateResult.affected && updateResult.affected > 0) {
            await this.logAudit(userId, userName, 'REACTIVATE', entity, id, 'flg_activo=true');
        } else {
            console.warn(`Reactivate failed: record ${id} not found or not updated`);
        }

        return { success: true };
    }

    private async logAudit(userId: number, userName: string, action: string, entity: string, entityId: number, details: string) {
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
        } catch (e) {
            console.error("Audit Log Failed", e);
        }
    }
}
