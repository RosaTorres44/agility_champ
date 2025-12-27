import { Module } from '@nestjs/common';
import { ClientFeaturesController } from './client-features.controller';
import { ClientFeaturesService } from './client-features.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perro } from '../entities/perro.entity';
import { Dupla } from '../entities/dupla.entity';
import { Competencia } from '../entities/competencia.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Pista } from '../entities/pista.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Perro, Dupla, Competencia, Inscripcion, Pista, ResultadoPista]),
        MaintenanceModule
    ],
    controllers: [ClientFeaturesController],
    providers: [ClientFeaturesService],
})
export class ClientFeaturesModule { }
