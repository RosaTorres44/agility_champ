import { Repository } from 'typeorm';
import { Competencia } from '../entities/competencia.entity';
import { Dupla } from '../entities/dupla.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';
export declare class DashboardService {
    private competenciaRepo;
    private duplaRepo;
    private resultadoRepo;
    constructor(competenciaRepo: Repository<Competencia>, duplaRepo: Repository<Dupla>, resultadoRepo: Repository<ResultadoPista>);
    getStats(userId: number, roleId: number): Promise<{
        topStats: {
            name: string;
            value: string;
            icon: string;
            color: string;
        }[];
        recentCompetitions: {
            id: number;
            nombre: string;
            status: string;
            statusColor: string;
            progress: number;
        }[];
        recentActivity: {
            type: string;
            title: string;
            subtitle: string;
            meta: string;
            metaColor: string;
        }[];
    }>;
}
