"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await this.prisma.refresh_tokens.create({
            data: {
                user_id: user.id,
                token_hash: this.hashToken(refreshToken),
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        return {
            user: safeUser,
            accessToken,
            refreshToken,
        };
    }
    async register(dto) {
        const existing = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email ya registrado');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.users.create({
            data: {
                name: dto.name,
                email: dto.email,
                password_hash: passwordHash,
                role: dto.role ?? 'user',
            },
        });
        return this.generateTokens({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    async login(email, password) {
        const user = await this.prisma.users.findUnique({
            where: { email },
        });
        if (!user || !user.password_hash) {
            throw new common_1.UnauthorizedException();
        }
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid)
            throw new common_1.UnauthorizedException();
        return this.generateTokens({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    async refresh(refreshToken) {
        const hashed = this.hashToken(refreshToken);
        const now = new Date();
        const GRACE_WINDOW_MS = 60000;
        const stored = await this.prisma.refresh_tokens.findFirst({
            where: {
                token_hash: hashed,
                expires_at: { gt: now },
                OR: [
                    { revoked: false },
                    {
                        revoked: true,
                        revoked_at: {
                            gte: new Date(now.getTime() - GRACE_WINDOW_MS),
                        },
                    },
                ],
            },
            include: { users: true },
        });
        if (!stored) {
            throw new common_1.UnauthorizedException('Refresh token invalido');
        }
        if (!stored.revoked) {
            await this.prisma.refresh_tokens.update({
                where: { id: stored.id },
                data: {
                    revoked: true,
                    revoked_at: now,
                },
            });
        }
        const user = {
            id: stored.users.id,
            name: stored.users.name,
            email: stored.users.email,
            role: stored.users.role,
            active: stored.users.active,
        };
        return this.generateTokens(user);
    }
    async logout(refreshToken) {
        const hashed = this.hashToken(refreshToken);
        await this.prisma.refresh_tokens.updateMany({
            where: { token_hash: hashed },
            data: { revoked: true },
        });
        return { message: 'Logout exitoso' };
    }
    async logoutAll(userId) {
        await this.prisma.refresh_tokens.updateMany({
            where: { user_id: userId },
            data: { revoked: true },
        });
        return { message: 'Todas las sesiones cerradas' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user || !user.password_hash) {
            throw new common_1.UnauthorizedException();
        }
        const valid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Password Incorrecto');
        }
        const newHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.users.update({
            where: { id: userId },
            data: { password_hash: newHash },
        });
        await this.prisma.refresh_tokens.updateMany({
            where: { user_id: userId },
            data: { revoked: true },
        });
        return { message: 'Password actualizado. Todas las sesiones cerradas' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map