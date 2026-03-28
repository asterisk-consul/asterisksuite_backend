export interface JwtPayload {
  sub: string; // UUID
  name: string;
  email: string;
  role: string;
  companyId?: string;
  iat?: number;
  exp?: number;
}
