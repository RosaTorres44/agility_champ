import { RankingService } from './ranking.service';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getNationalRanking(year: number, gradeId?: number, categoryId?: number): Promise<{
        puesto: number;
        dupla: string;
        categoria: string;
        puntos: number;
        raza: any;
    }[]>;
}
