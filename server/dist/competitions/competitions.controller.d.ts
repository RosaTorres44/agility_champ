import { CompetitionsService } from './competitions.service';
export declare class CompetitionsController {
    private readonly competitionsService;
    constructor(competitionsService: CompetitionsService);
    findAll(): Promise<import("../entities/competencia.entity").Competencia[]>;
    findOne(id: string): Promise<import("../entities/competencia.entity").Competencia | null>;
    getTracks(id: string): Promise<import("../entities/pista.entity").Pista[]>;
}
