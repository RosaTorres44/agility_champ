import { Controller, Get, Post, Body, Req, UseGuards, Res, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const jwt = await this.authService.validateOAuthLogin(req.user);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        res.redirect(`${clientUrl}/login?token=${jwt}`);
    }

    @Post('login-email')
    async loginEmail(@Body() body: { email: string }) {
        const result = await this.authService.validateEmailLogin(body.email);
        if (!result) {
            throw new NotFoundException('User not found');
        }
        return result;
    }

    @Post('register')
    async register(@Body() body: { nombres: string; apellidos: string; email: string; telefono?: string }) {
        return this.authService.register(body);
    }
}
