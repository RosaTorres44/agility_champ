import { CategoriaTalla } from './categoria-talla.entity';
import { Grado } from './grado.entity';
import { Raza } from './raza.entity';
export declare class Perro {
    id: number;
    nombre: string;
    fecha_nacimiento: Date;
    chip: string;
    id_categoria_talla: number;
    categoriaTalla: CategoriaTalla;
    id_grado_actual: number;
    gradoActual: Grado;
    id_raza: number;
    raza: Raza;
    observaciones: string;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
