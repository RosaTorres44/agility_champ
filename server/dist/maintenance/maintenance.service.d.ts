import { Repository } from 'typeorm';
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
export declare class MaintenanceService {
    private auditRepo;
    private personaRepo;
    private perroRepo;
    private categoriaTallaRepo;
    private gradoRepo;
    private organizacionRepo;
    private tipoPersonaRepo;
    private tipoPistaRepo;
    private competenciaRepo;
    private competenciaOrganizacionRepo;
    private pistaRepo;
    private duplaRepo;
    private razaRepo;
    private systemSettingRepo;
    private repositories;
    constructor(auditRepo: Repository<AuditLog>, personaRepo: Repository<Persona>, perroRepo: Repository<Perro>, categoriaTallaRepo: Repository<CategoriaTalla>, gradoRepo: Repository<Grado>, organizacionRepo: Repository<Organizacion>, tipoPersonaRepo: Repository<TipoPersona>, tipoPistaRepo: Repository<TipoPista>, competenciaRepo: Repository<Competencia>, competenciaOrganizacionRepo: Repository<CompetenciaOrganizacion>, pistaRepo: Repository<Pista>, duplaRepo: Repository<Dupla>, razaRepo: Repository<Raza>, systemSettingRepo: Repository<SystemSetting>);
    private getRepo;
    findAll(entity: string): Promise<any>;
    create(entity: string, data: any, userId: number, userName: string): Promise<any>;
    update(entity: string, id: number, data: any, userId: number, userName: string): Promise<any>;
    deactivate(entity: string, id: number, userId: number, userName: string): Promise<{
        success: boolean;
    }>;
    reactivate(entity: string, id: number, userId: number, userName: string): Promise<{
        success: boolean;
    }>;
    private logAudit;
}
