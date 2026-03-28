export interface AuthUser {
  id?: number
  name?: string
  email?: string
  role?: string
  companyId?: string
}

export interface ApiLoginResponse {
  accessToken: string // ✅ camelCase
  refreshToken: string // ✅ camelCase
  user: AuthUser
}
