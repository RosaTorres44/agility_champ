import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Persona } from '../entities/persona.entity';
import { TipoPersona } from '../entities/tipo-persona.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Persona)
        private personaRepo: Repository<Persona>,
        @InjectRepository(TipoPersona)
        private tipoPersonaRepo: Repository<TipoPersona>,
    ) {
        console.log(" [AuthService] INITIALIZED with Default Role Logic (GUIA check) v2");
    }

    private async getDefaultRole(): Promise<number> {
        // Try to find 'GUIA' (or similar)
        // If "cod" logic is used:
        let role = await this.tipoPersonaRepo.findOne({ where: { cod: 'GUIA' } });

        if (!role) {
            // Fallback to searching by name if code isn't standard
            role = await this.tipoPersonaRepo.findOne({ where: { nombre: Like('%Guia%') } });
        }

        if (role) {
            console.log(`[AuthService] Found role: ${role.nombre} (ID: ${role.id})`);
            return role.id;
        }

        console.log(`[AuthService] Role 'GUIA' not found. Defaulting to ID 2.`);

        // Final fallback if DB is empty or weird
        // Assuming 2 is safe based on implementation plan discussions, 
        // but let's default to whatever ID is NOT 1 (Admin) ideally? 
        // If we can't find Guia, better to error or default to something safe.
        // Let's default to 2 as per request.
        return 2;
    }

    async validateOAuthLogin(profile: any): Promise<string> {
        let user = await this.personaRepo.findOne({ where: { email: profile.email } });

        if (!user) {
            console.log('User not found in DB', profile.email);
            const defaultRoleId = await this.getDefaultRole();

            user = this.personaRepo.create({
                nombres: profile.firstName,
                apellidos: profile.lastName,
                email: profile.email,
                id_tipo_persona: defaultRoleId,
                flg_activo: true
            });
            await this.personaRepo.save(user);
        }

        const payload = {
            sub: user.id,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            id_tipo_persona: user.id_tipo_persona
        };
        return this.jwtService.sign(payload);
    }

    async validateEmailLogin(email: string): Promise<any> {
        const user = await this.personaRepo.findOne({ where: { email } });
        if (!user) {
            return null; // Not found
        }
        const payload = {
            sub: user.id,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            id_tipo_persona: user.id_tipo_persona
        };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }

    async register(data: { nombres: string; apellidos: string; email: string; telefono?: string }): Promise<any> {
        let user = await this.personaRepo.findOne({ where: { email: data.email } });
        if (user) {
            throw new Error('User already exists');
        }

        const defaultRoleId = await this.getDefaultRole();
        console.log(`[AuthService.register] Creating user ${data.email} with Role ID: ${defaultRoleId}`);

        user = this.personaRepo.create({
            ...data,
            id_tipo_persona: defaultRoleId,
            flg_activo: true
        });
        await this.personaRepo.save(user);

        const payload = {
            sub: user.id,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            id_tipo_persona: user.id_tipo_persona
        };
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }
}
