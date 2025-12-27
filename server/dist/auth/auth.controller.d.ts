import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    loginEmail(body: {
        email: string;
    }): Promise<any>;
    register(body: {
        nombres: string;
        apellidos: string;
        email: string;
        telefono?: string;
    }): Promise<any>;
}
