export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  companyId?: string | null;
  active?: boolean | null;
}
