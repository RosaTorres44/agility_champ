import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { ResultadoPista } from '../entities/resultado-pista.entity';
import { Pista } from '../entities/pista.entity';
import { RankingModule } from '../ranking/ranking.module';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Dupla } from '../entities/dupla.entity';
import { Perro } from '../entities/perro.entity';
import { Persona } from '../entities/persona.entity';
import { Grado } from '../entities/grado.entity';
import { CategoriaTalla } from '../entities/categoria-talla.entity';
import { TipoPersona } from '../entities/tipo-persona.entity';
import { RankingPuntaje } from '../entities/ranking-puntaje.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultadoPista,
      Inscripcion,
      Pista,
      Dupla,
      Perro,
      Persona,
      Grado,
      CategoriaTalla,
      CategoriaTalla,
      TipoPersona,
      RankingPuntaje
    ]),
    RankingModule
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule { }
