import { ResultsService } from './results.service';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    getInscriptions(trackId: string): Promise<import("../entities/inscripcion.entity").Inscripcion[]>;
    addInscription(body: {
        trackId: number;
        duplaId: number;
    }): Promise<import("../entities/inscripcion.entity").Inscripcion>;
    deactivateInscription(id: string): Promise<import("../entities/inscripcion.entity").Inscripcion | null>;
    enterResult(body: any): Promise<{
        ranking_points: number;
        id?: number | undefined;
        id_inscripcion?: number | undefined;
        inscripcion?: import("../entities/inscripcion.entity").Inscripcion | undefined;
        id_pista?: number | undefined;
        pista?: import("../entities/pista.entity").Pista | undefined;
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
        es_ausente?: boolean | undefined;
        es_elegible_podio?: boolean | undefined;
        es_elegible_ranking?: boolean | undefined;
        puesto?: number | undefined;
        puntos_ranking?: number | undefined;
        flg_activo?: boolean | undefined;
        fec_creacion?: Date | undefined;
        fec_actualizacion?: Date | undefined;
    }>;
    getResults(trackId: string): Promise<{
        inscription: import("../entities/inscripcion.entity").Inscripcion;
        result: any;
    }[]>;
}
