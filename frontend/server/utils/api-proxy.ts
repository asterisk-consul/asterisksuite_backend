import type { H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

interface TokenCache {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const tokenCache = new Map<string, TokenCache>()

// Key: primeros 8 chars del refresh token original (estable durante el ciclo de vida del token)
const refreshMutex = new Map<string, Promise<TokenCache | null>>()

const ACCESS_TOKEN_TTL_MS = 30_000

// Mapa para rastrear rotación: oldRefreshPrefix → newRefreshToken
const tokenRotationMap = new Map<string, string>()

function getTokenPrefix(token: string): string {
  return token?.slice(0, 8) ?? ''
}

function getCachedTokens(refreshToken: string): TokenCache | null {
  console.log('[CACHE] lookup for refreshToken:', refreshToken?.slice(0, 8))

  // 1. Buscar directamente con el token actual
  let cached = tokenCache.get(refreshToken)

  // 2. Si no encontró, puede que ya fue rotado → buscar el nuevo token
  if (!cached) {
    const prefix = getTokenPrefix(refreshToken)
    const rotatedToken = tokenRotationMap.get(prefix)
    if (rotatedToken) {
      cached = tokenCache.get(rotatedToken)
      if (cached) {
        console.log('[CACHE] hit via rotation map')
      }
    }
  }

  if (!cached) {
    console.log('[CACHE] miss')
    return null
  }

  if (Date.now() > cached.expiresAt) {
    console.log('[CACHE] expired → deleting')
    tokenCache.delete(refreshToken)
    tokenCache.delete(cached.refreshToken)
    return null
  }

  console.log('[CACHE] hit → accessToken cached')
  return cached
}

export async function apiProxy(
  event: H3Event,
  path: string,
  options: {
    method?: HTTPMethod
    body?: any
    query?: FetchOptions['query']
  } = {}
) {
  const config = useRuntimeConfig()
  const method = options.method ?? 'GET'

  console.log('\n================ API PROXY START ================')
  console.log('[REQUEST]', method, path)

  const refreshToken = getCookie(event, 'api_refresh')
  const accessCookie = getCookie(event, 'api_access')

  console.log('[COOKIE] refresh:', refreshToken?.slice(0, 10))
  console.log('[COOKIE] access:', accessCookie?.slice(0, 10))

  if (!refreshToken) {
    console.log('[AUTH] No refresh cookie')
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  let tokens = getCachedTokens(refreshToken)
  let accessToken = tokens?.accessToken ?? accessCookie

  console.log('[TOKEN] using accessToken:', accessToken?.slice(0, 10))

  const doFetch = async (token?: string) => {
    console.log('[FETCH] →', `${config.apiBase}${path}`)
    console.log('[FETCH] token:', token?.slice(0, 10))

    return await $fetch(`${config.apiBase}${path}`, {
      method,
      body: options.body,
      query: options.query,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
  }

  if (accessToken) {
    try {
      const res = await doFetch(accessToken)
      console.log('[FETCH] success')
      console.log('================ API PROXY END ================\n')
      return res
    } catch (err: any) {
      console.log('[FETCH] error status:', err?.response?.status)

      if (err?.response?.status !== 401) {
        throw err
      }

      console.log('[AUTH] access token invalid → refresh required')
      tokenCache.delete(refreshToken)
    }
  }

  return await doRefreshAndRetry(event, refreshToken, doFetch)
}

async function doRefreshAndRetry(
  event: H3Event,
  refreshToken: string,
  doFetch: (token: string) => Promise<any>
) {
  console.log('\n=========== REFRESH FLOW START ===========')

  // Usar prefijo como key del mutex para sobrevivir la rotación
  const mutexKey = getTokenPrefix(refreshToken)

  if (refreshMutex.has(mutexKey)) {
    console.log('[REFRESH] waiting existing refresh mutex')

    const tokens = await refreshMutex.get(mutexKey)!

    if (!tokens) {
      console.log('[REFRESH] mutex result = null → session expired')
      throw createError({ statusCode: 401, message: 'Sesión expirada' })
    }

    console.log('[REFRESH] mutex resolved → retry request')
    return await doFetch(tokens.accessToken)
  }

  console.log('[REFRESH] creating new refresh promise')

  let resolveRefresh!: (t: TokenCache | null) => void

  const refreshPromise = new Promise<TokenCache | null>((res) => {
    resolveRefresh = res
  })

  refreshMutex.set(mutexKey, refreshPromise)

  try {
    // ✅ Re-verificar el cache DENTRO del mutex (otra request pudo haber refrescado primero)
    const alreadyCached = getCachedTokens(refreshToken)
    if (alreadyCached) {
      console.log('[REFRESH] cache hit inside mutex → skip refresh')
      resolveRefresh(alreadyCached)
      return await doFetch(alreadyCached.accessToken)
    }

    const cookieHeader = getRequestHeader(event, 'cookie') ?? ''
    console.log(
      `[${new Date().toLocaleTimeString()}] [REFRESH] cookie header: ${cookieHeader}`
    )

    console.log('================ REFRESH START ================')
    console.log(
      `[${new Date().toLocaleTimeString()}] Refresh cookie: ${refreshToken}`
    )
    console.log('API BASE:', useRuntimeConfig().apiBase)
    console.log('➡️ Calling backend /auth/refresh')

    const refreshRes: any = await $fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { cookie: cookieHeader }
    })

    console.log('✅ Backend refresh success')

    const newAccessToken: string = refreshRes.accessToken
    const newRefreshToken: string = refreshRes.refreshToken ?? refreshToken

    console.log('[REFRESH] backend response received')
    console.log('[REFRESH] newAccessToken:', newAccessToken?.slice(0, 10))
    console.log('[REFRESH] newRefreshToken:', newRefreshToken?.slice(0, 10))

    if (!newAccessToken) throw new Error('Refresh sin accessToken')

    const cached: TokenCache = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: Date.now() + ACCESS_TOKEN_TTL_MS
    }

    console.log('[CACHE] storing tokens')

    // Guardar con el nuevo refresh token
    tokenCache.delete(refreshToken)
    tokenCache.set(newRefreshToken, cached)

    // Registrar la rotación para que otras requests con el token viejo lo encuentren
    tokenRotationMap.set(mutexKey, newRefreshToken)

    // Limpiar el mapa de rotación después del TTL para no acumular entradas
    setTimeout(
      () => tokenRotationMap.delete(mutexKey),
      ACCESS_TOKEN_TTL_MS + 5_000
    )

    resolveRefresh(cached)

    console.log('[REFRESH] retrying original request')
    const res = await doFetch(newAccessToken)

    console.log('[REFRESH] retry success')
    console.log('=========== REFRESH FLOW END ===========\n')

    return res
  } catch (error: any) {
    console.log('[REFRESH] FAILED')
    console.log('[REFRESH] status:', error?.response?.status)
    console.log('[REFRESH] message:', error?.message)

    resolveRefresh(null)

    throw createError({ statusCode: 401, message: 'Sesión expirada' })
  } finally {
    console.log('[REFRESH] mutex released')
    refreshMutex.delete(mutexKey)
  }
}
