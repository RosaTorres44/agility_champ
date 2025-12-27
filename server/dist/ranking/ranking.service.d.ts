import { Repository } from 'typeorm';
import { RankingPuntaje } from '../entities/ranking-puntaje.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';
export declare class RankingService {
    private rankingRepo;
    private resultsRepo;
    constructor(rankingRepo: Repository<RankingPuntaje>, resultsRepo: Repository<ResultadoPista>);
    calculateRankingForTrack(trackId: number, year: number): Promise<{
        message: string;
        details?: undefined;
    } | {
        message: string;
        details: RankingPuntaje[];
    }>;
    getNationalRanking(year: number, gradeId?: number, categoryId?: number): Promise<{
        puesto: number;
        dupla: string;
        categoria: string;
        puntos: number;
        raza: any;
    }[]>;
}
