// stores/useProfileStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchData } from '~/composables/apiService'

interface Perfil {
  id: number
  nombre: string
  apellido: string
  foto?: string
  [key: string]: any
}

export const useProfileStore = defineStore('profile', () => {
  const perfilActual = ref<Perfil | null>(null)
  const perfiles = ref<Perfil[]>([])

  async function fetchProfile(id: number) {
    perfilActual.value = await fetchData<Perfil>(`/perfil/show/${id}`)
  }

  async function fetchAllProfiles() {
    perfiles.value = await fetchData<Perfil[]>('/perfiles')
  }

  return { perfilActual, perfiles, fetchProfile, fetchAllProfiles }
})
