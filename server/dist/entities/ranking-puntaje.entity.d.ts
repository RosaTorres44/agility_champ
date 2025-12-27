import { ResultadoPista } from './resultado-pista.entity';
import { Dupla } from './dupla.entity';
export declare class RankingPuntaje {
    id: number;
    anio: number;
    id_resultado_pista: number;
    resultadoPista: ResultadoPista;
    id_dupla: number;
    dupla: Dupla;
    puntos: number;
    motivo: string;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
