import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Persona } from '../entities/persona.entity';
import { TipoPersona } from '../entities/tipo-persona.entity';
export declare class AuthService {
    private jwtService;
    private personaRepo;
    private tipoPersonaRepo;
    constructor(jwtService: JwtService, personaRepo: Repository<Persona>, tipoPersonaRepo: Repository<TipoPersona>);
    private getDefaultRole;
    validateOAuthLogin(profile: any): Promise<string>;
    validateEmailLogin(email: string): Promise<any>;
    register(data: {
        nombres: string;
        apellidos: string;
        email: string;
        telefono?: string;
    }): Promise<any>;
}
