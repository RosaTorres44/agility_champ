import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competencia } from '../entities/competencia.entity';
import { Pista } from '../entities/pista.entity';

@Injectable()
export class CompetitionsService {
    constructor(
        @InjectRepository(Competencia)
        private competenciaRepo: Repository<Competencia>,
        @InjectRepository(Pista)
        private pistaRepo: Repository<Pista>,
    ) { }

    async findAll() {
        return this.competenciaRepo.find({
            relations: ['organizacion'],
            order: { fecha_inicio: 'DESC' },
        });
    }

    async findOne(id: number) {
        return this.competenciaRepo.findOne({
            where: { id },
            relations: ['organizacion', 'juez'],
        });
    }

    async getTracksForCompetition(competitionId: number) {
        return this.pistaRepo.find({
            where: { id_competencia: competitionId },
            relations: ['tipoPista', 'gradoBase', 'juez'],
            order: { id: 'ASC' }
        });
    }
}
