import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';

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
import { AuditModule } from '../audit/audit.module';
import { Inscripcion } from '../entities/inscripcion.entity'; // Added import

@Module({
    imports: [
        AuditModule, // Log changes
        TypeOrmModule.forFeature([
            Persona,
            Perro,
            CategoriaTalla,
            Grado,
            Organizacion,
            TipoPersona,
            TipoPista,
            Competencia,
            CompetenciaOrganizacion,
            Pista,
            Dupla,
            Raza,
            SystemSetting,
            Inscripcion // Added
        ])
    ],
    controllers: [MaintenanceController],
    providers: [MaintenanceService],
    exports: [MaintenanceService]
})
export class MaintenanceModule { }
