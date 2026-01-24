export interface JwtPayload {
  sub: number;
  username: string;
  roles: string[];
  permissions?: string[];
  perfilid?: number;
  iat?: number;
  exp?: number;
}
