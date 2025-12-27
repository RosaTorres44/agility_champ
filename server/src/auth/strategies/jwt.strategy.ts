import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
        });
    }

    async validate(payload: any) {
        // console.log('JWT Payload:', payload);
        return { userId: payload.sub, username: payload.username, nombres: payload.nombres, id_tipo_persona: payload.id_tipo_persona };
    }
}
