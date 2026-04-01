export interface JwtPayload {
    sub: string;
    name: string;
    email: string;
    role: string;
    companyId?: string;
    iat?: number;
    exp?: number;
}
