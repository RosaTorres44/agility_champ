import { Competencia } from './competencia.entity';
import { Organizacion } from './organizacion.entity';
export declare class CompetenciaOrganizacion {
    id: number;
    id_competencia: number;
    competencia: Competencia;
    id_organizacion: number;
    organizacion: Organizacion;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
