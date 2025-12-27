import { Perro } from './perro.entity';
import { Persona } from './persona.entity';
export declare class Dupla {
    id: number;
    id_perro: number;
    perro: Perro;
    id_guia_persona: number;
    guia: Persona;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
