import { AuthService } from './auth.service';
import type { RequestWithUser } from './types/request-with-user.interface';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        user: import("./types/auth-user.interface").AuthUser;
        accessToken: string;
        refreshToken: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        user: import("./types/auth-user.interface").AuthUser;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        user: import("./types/auth-user.interface").AuthUser;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAll(req: RequestWithUser): Promise<{
        message: string;
    }>;
    changePassword(req: RequestWithUser, body: ChangePasswordDto): Promise<{
        message: string;
    }>;
    me(req: RequestWithUser): import("./types/auth-user.interface").AuthUser;
}
