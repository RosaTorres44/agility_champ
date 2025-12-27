import { Organizacion } from './organizacion.entity';
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
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
