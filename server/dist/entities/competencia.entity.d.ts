import { Organizacion } from './organizacion.entity';
import { Persona } from './persona.entity';
export declare class Competencia {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: Date;
    flg_homologada: number;
    numero: number;
    anio: number;
    id_organizacion: number;
    organizacion: Organizacion;
    id_juez: number;
    juez: Persona;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
