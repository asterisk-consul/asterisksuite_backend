import { defineStore } from 'pinia'
import type { AuthUser } from '~/modulos/auth/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const fetchApi = import.meta.client ? $fetch : useRequestFetch()

  const user = ref<AuthUser | null>(null)
  const initialized = ref(false)
  const loading = ref(false)

  const isLogged = computed(() => !!user.value)

  const error = ref<string | null>(null)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const res = await fetchApi<{ user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })

      user.value = res.user
    } catch (e: any) {
      error.value =
        e?.data?.message || e?.statusMessage || 'Error al iniciar sesión'
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    try {
      const res = await fetchApi<AuthUser>('/api/auth/me', {
        credentials: 'include'
      })
      user.value = res
    } catch {
      user.value = null
    }
  }

  // 🚀 INIT — solo obtiene el usuario, el refresh lo maneja apiProxy
  async function init() {
    if (initialized.value) return
    initialized.value = true
    await fetchMe() // ✅ apiProxy se encarga del refresh si es necesario
  }

  async function logout() {
    await fetchApi('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    user.value = null
  }

  return {
    user,
    loading,
    initialized,
    isLogged,
    login,
    fetchMe,
    init,
    logout
  }
})
