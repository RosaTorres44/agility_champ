import { Competencia } from './competencia.entity';
import { TipoPista } from './tipo-pista.entity';
import { Grado } from './grado.entity';
import { Persona } from './persona.entity';
export declare class Pista {
    id: number;
    id_competencia: number;
    competencia: Competencia;
    id_tipo_pista: number;
    tipoPista: TipoPista;
    id_grado_base: number;
    gradoBase: Grado;
    id_juez_persona: number;
    juez: Persona;
    longitud_m: number;
    velocidad_elegida_ms: number;
    tsr_seg: number;
    tmr_seg: number;
    estado: string;
    flg_perro_mas_rapido: boolean;
    modo_tsr: string;
    velocidad_nt_ms: number;
    mejor_tiempo_ref_seg: number;
    velocidad_calculada_ms: number;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
