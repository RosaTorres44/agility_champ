import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Persona } from '../entities/persona.entity';
export declare class AuthService {
    private jwtService;
    private personaRepo;
    constructor(jwtService: JwtService, personaRepo: Repository<Persona>);
    validateOAuthLogin(profile: any): Promise<string>;
    validateEmailLogin(email: string): Promise<any>;
    register(data: {
        nombres: string;
        apellidos: string;
        email: string;
        telefono?: string;
    }): Promise<any>;
}
