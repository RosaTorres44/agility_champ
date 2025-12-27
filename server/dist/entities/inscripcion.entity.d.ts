import { Pista } from './pista.entity';
import { Dupla } from './dupla.entity';
export declare class Inscripcion {
    id: number;
    id_pista: number;
    pista: Pista;
    id_dupla: number;
    dupla: Dupla;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
