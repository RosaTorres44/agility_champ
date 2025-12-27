import { Repository } from 'typeorm';
import { Competencia } from '../entities/competencia.entity';
import { Pista } from '../entities/pista.entity';
export declare class CompetitionsService {
    private competenciaRepo;
    private pistaRepo;
    constructor(competenciaRepo: Repository<Competencia>, pistaRepo: Repository<Pista>);
    findAll(): Promise<Competencia[]>;
    findOne(id: number): Promise<Competencia | null>;
    getTracksForCompetition(competitionId: number): Promise<Pista[]>;
}
