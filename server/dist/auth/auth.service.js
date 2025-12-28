"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const persona_entity_1 = require("../entities/persona.entity");
const tipo_persona_entity_1 = require("../entities/tipo-persona.entity");
let AuthService = class AuthService {
    jwtService;
    personaRepo;
    tipoPersonaRepo;
    constructor(jwtService, personaRepo, tipoPersonaRepo) {
        this.jwtService = jwtService;
        this.personaRepo = personaRepo;
        this.tipoPersonaRepo = tipoPersonaRepo;
        console.log(" [AuthService] INITIALIZED with Default Role Logic (GUIA check) v2");
    }
    async getDefaultRole() {
        let role = await this.tipoPersonaRepo.findOne({ where: { cod: 'GUIA' } });
        if (!role) {
            role = await this.tipoPersonaRepo.findOne({ where: { nombre: (0, typeorm_2.Like)('%Guia%') } });
        }
        if (role) {
            console.log(`[AuthService] Found role: ${role.nombre} (ID: ${role.id})`);
            return role.id;
        }
        console.log(`[AuthService] Role 'GUIA' not found. Defaulting to ID 2.`);
        return 2;
    }
    async validateOAuthLogin(profile) {
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
    async validateEmailLogin(email) {
        const user = await this.personaRepo.findOne({ where: { email } });
        if (!user) {
            return null;
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
    async register(data) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(persona_entity_1.Persona)),
    __param(2, (0, typeorm_1.InjectRepository)(tipo_persona_entity_1.TipoPersona)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map