import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../entities/persona.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Persona)
        private personaRepo: Repository<Persona>,
    ) { }

    async validateOAuthLogin(profile: any): Promise<string> {
        let user = await this.personaRepo.findOne({ where: { email: profile.email } });

        if (!user) {
            console.log('User not found in DB', profile.email);
            user = this.personaRepo.create({
                nombres: profile.firstName,
                apellidos: profile.lastName,
                email: profile.email,
                id_tipo_persona: 1, // 1 = ADMIN for dev
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
        user = this.personaRepo.create({
            ...data,
            id_tipo_persona: 1, // Default to ADMIN for dev visibility
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
