import type {
  ApiLoginResponse,
  AuthUser,
  ApiRegisterDto,
  ApiChangePasswordDto,
  ApiMessageResponse
} from './auth.types'

export const authService = {
  login: (email: string, password: string) =>
    $fetch<ApiLoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include'
    }),

  register: (data: ApiRegisterDto) =>
    $fetch<ApiLoginResponse>('/api/auth/register', {
      method: 'POST',
      body: data,
      credentials: 'include'
    }),

  refresh: (refreshToken: string) =>
    $fetch<ApiLoginResponse>('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      credentials: 'include'
    }),

  logout: () =>
    $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }),

  logoutAll: () =>
    $fetch<ApiMessageResponse>('/api/auth/logout-all', {
      method: 'POST',
      credentials: 'include'
    }),

  changePassword: (data: ApiChangePasswordDto) =>
    $fetch<ApiMessageResponse>('/api/auth/change-password', {
      method: 'POST',
      body: data,
      credentials: 'include'
    }),

  me: () =>
    $fetch<AuthUser>('/api/auth/me', {
      credentials: 'include'
    })
}
