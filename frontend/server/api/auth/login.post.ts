import type { ApiLoginResponse } from '~/modulos/auth/auth.types'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const api = await $fetch<ApiLoginResponse>(`${config.apiBase}/auth/login`, {
      method: 'POST',
      body
    })

    setCookie(event, 'api_access', api.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15
    })

    setCookie(event, 'api_refresh', api.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return { user: api.user }
  } catch (e: any) {
    throw createError({
      statusCode: e?.status || 500,
      statusMessage: 'Usuario o contraseña incorrectos',
      data: {
        message: e?.data?.message || 'Credenciales inválidas'
      }
    })
  }
})
