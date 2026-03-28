let token: string | null = null

export function setToken(newToken: string | null) {
  token = newToken
}

export async function fetchData<T>(endpoint: string) {
  const config = useRuntimeConfig()

  const headers: HeadersInit = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  return await $fetch<T>(`${config.public.apiBase}${endpoint}`, { headers })
}

export async function postData<T, B extends Record<string, any>>(
  endpoint: string,
  body: B
) {
  const config = useRuntimeConfig()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  let status = 0

  const data = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
    method: 'POST',
    headers,
    body,
    onResponse({ response }) {
      status = response.status
    }
  })

  return { data, status }
}

export async function loginService(username: string, password: string) {
  const config = useRuntimeConfig()

  return $fetch(`${config.public.apiBase}/api/login`, {
    method: 'POST',
    body: { username, password }
  })
}
