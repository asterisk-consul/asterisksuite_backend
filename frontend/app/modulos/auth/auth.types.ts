export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  active?: boolean
}

export interface ApiLoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface ApiRegisterDto {
  name: string
  email: string
  password: string
  role?: string
}

export interface ApiChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export interface ApiMessageResponse {
  message: string
}
