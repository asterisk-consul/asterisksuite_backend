export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'api_refresh')

  if (refreshToken) {
    const config = useRuntimeConfig()
    await $fetch(`${config.apiBase}/auth/logout`, {
      method: 'POST',
      body: { refreshToken } // ✅ revocar en BD
    }).catch(() => {})
  }

  // Limpiar cookies siempre
  deleteCookie(event, 'api_access')
  deleteCookie(event, 'api_refresh')

  return { ok: true }
})
