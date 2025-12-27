import { Repository } from 'typeorm';
import { ResultadoPista } from '../entities/resultado-pista.entity';
import { Pista } from '../entities/pista.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { RankingService } from '../ranking/ranking.service';
import { RankingPuntaje } from '../entities/ranking-puntaje.entity';
export declare class ResultsService {
    private resultsRepo;
    private pistaRepo;
    private inscripcionRepo;
    private rankingRepo;
    private rankingService;
    constructor(resultsRepo: Repository<ResultadoPista>, pistaRepo: Repository<Pista>, inscripcionRepo: Repository<Inscripcion>, rankingRepo: Repository<RankingPuntaje>, rankingService: RankingService);
    getInscriptions(trackId: number): Promise<Inscripcion[]>;
    addInscription(trackId: number, duplaId: number): Promise<Inscripcion>;
    deactivateInscription(id: number): Promise<Inscripcion | null>;
    enterResult(data: any): Promise<{
        ranking_points: number;
        id?: number | undefined;
        id_inscripcion?: number | undefined;
        inscripcion?: Inscripcion | undefined;
        id_pista?: number | undefined;
        pista?: Pista | undefined;
        id_dupla?: number | undefined;
        dupla?: import("../entities/dupla.entity").Dupla | undefined;
        id_perro?: number | undefined;
        perro?: import("../entities/perro.entity").Perro | undefined;
        categoria_competitiva?: string | undefined;
        tiempo_cronometrado_seg?: number | undefined;
        faltas?: number | undefined;
        rehuses?: number | undefined;
        penalidad_total_seg?: number | undefined;
        tiempo_total_seg?: number | undefined;
        es_eli?: boolean | undefined;
        es_elegible_podio?: boolean | undefined;
        es_elegible_ranking?: boolean | undefined;
        puesto?: number | undefined;
        puntos_ranking?: number | undefined;
        flg_activo?: boolean | undefined;
        fec_creacion?: Date | undefined;
        fec_actualizacion?: Date | undefined;
    }>;
    private updatePlacements;
    getResultsForTrack(trackId: number): Promise<{
        inscription: Inscripcion;
        result: any;
    }[]>;
}
