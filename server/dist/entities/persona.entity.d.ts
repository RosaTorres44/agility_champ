import { TipoPersona } from './tipo-persona.entity';
export declare class Persona {
    id: number;
    id_tipo_persona: number;
    tipoPersona: TipoPersona;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    flg_activo: boolean;
    fec_creacion: Date;
    fec_actualizacion: Date;
}
