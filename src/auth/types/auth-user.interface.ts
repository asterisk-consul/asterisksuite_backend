export interface AuthUser {
  id: number;
  username: string;
  roles: string[];
  permissions?: string[];
  perfilid?: number;
}
