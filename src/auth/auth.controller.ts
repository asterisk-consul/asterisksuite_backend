import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.username, body.password);
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }
}
