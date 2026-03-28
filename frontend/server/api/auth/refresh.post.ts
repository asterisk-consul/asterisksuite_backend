export default defineEventHandler(async (event) => {
  console.log('================ REFRESH START ================')

  const refreshToken = getCookie(event, 'api_refresh')

  console.log('Refresh cookie:', refreshToken)

  if (!refreshToken) {
    console.log('❌ No refresh token found')
    throw createError({ statusCode: 401, message: 'No refresh token' })
  }

  const config = useRuntimeConfig()

  console.log('API BASE:', config.apiBase)

  try {
    console.log('➡️ Calling backend /auth/refresh')

    const api = await $fetch<{
      user: any
      accessToken: string
      refreshToken: string
    }>(`${config.apiBase}/auth/refresh`, {
      method: 'POST',
      body: { refreshToken }
    })

    console.log('✅ Backend refresh success')
    console.log('User:', api.user)
    console.log('Access token length:', api.accessToken?.length)
    console.log('Refresh token length:', api.refreshToken?.length)

    // =========================
    // SET COOKIES
    // =========================

    console.log('🍪 Setting cookies')

    setCookie(event, 'api_access', api.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15
    })

    setCookie(event, 'api_refresh', api.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    console.log('✅ Cookies set')

    console.log('================ REFRESH END ================')

    return {
      ok: true,
      user: api.user,
      accessToken: api.accessToken,
      refreshToken: api.refreshToken
    }
  } catch (e: any) {
    console.error('REFRESH ERROR:', e?.data || e)

    deleteCookie(event, 'api_access', { path: '/' })
    deleteCookie(event, 'api_refresh', { path: '/' })

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Sesión expirada'
      }
    })
  }
})
