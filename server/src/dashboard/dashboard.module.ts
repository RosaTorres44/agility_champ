import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Competencia } from '../entities/competencia.entity';
import { Dupla } from '../entities/dupla.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Competencia, Dupla, ResultadoPista])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
