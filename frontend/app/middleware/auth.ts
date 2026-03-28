import { useAuthStore } from '~/modulos/auth/auth.store'
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.init()
  }

  if (!auth.isLogged) {
    return navigateTo('/login')
  }
})
