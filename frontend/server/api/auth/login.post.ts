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
    console.error('LOGIN ERROR:', e?.data || e)

    throw createError({
      statusCode: e?.status || 500,
      statusMessage: 'Login failed',
      data: {
        message: e?.data?.message || 'Credenciales inválidas'
      }
    })
  }
})
