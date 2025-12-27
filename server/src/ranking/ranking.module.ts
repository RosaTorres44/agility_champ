import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { RankingPuntaje } from '../entities/ranking-puntaje.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RankingPuntaje, ResultadoPista]),
  ],
  controllers: [RankingController],
  providers: [RankingService],
  exports: [RankingService]
})
export class RankingModule { }
