import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { Competencia } from '../entities/competencia.entity';
import { Pista } from '../entities/pista.entity';
import { Perro } from '../entities/perro.entity';
import { CategoriaTalla } from '../entities/categoria-talla.entity';
import { Grado } from '../entities/grado.entity';
import { Dupla } from '../entities/dupla.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Competencia, Inscripcion, Perro, CategoriaTalla, Grado, Dupla, Pista])],
  controllers: [CompetitionsController],
  providers: [CompetitionsService]
})
export class CompetitionsModule { }
