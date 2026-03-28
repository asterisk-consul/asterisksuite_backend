import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ParteInteresadasService } from '~/services/parteinteresadas.service'

export const usePerfilesStore = defineStore('perfiles', () => {
  const entities = ref<ApiPerfil[]>([])
  const loading = ref(false)

  // Cargar todos los perfiles de un tipo (solo datos generales)
  async function fetchAll(tipo?: number, detalleCompleto = false) {
    if (loading.value) return
    loading.value = true
    try {
      if (detalleCompleto) {
        // Llamada separada sin usar loading dentro de fetchAllDetailed
        const detallados = await fetchAllDetailedSafe(tipo)
        entities.value = detallados
      } else {
        entities.value = await ParteInteresadasService.findAll(tipo)
      }
      // console.log('Perfiles cargados:', entities.value)
    } finally {
      loading.value = false
    }
  }

  // Buscar perfil individual
  async function fetchById(id: number) {
    const perfil = await ParteInteresadasService.findById(id)
    return perfil
  }

  // Función “segura” para traer todos los perfiles con detalle
  async function fetchAllDetailedSafe(tipo?: number): Promise<ApiPerfil[]> {
    const generales = await ParteInteresadasService.findAll(tipo)
    // console.log('Perfiles generales:', generales.length)

    const detallados: ApiPerfil[] = []
    for (const perfil of generales) {
      // console.log('Procesando perfil', perfil.perfiles?.id)
      if (perfil.perfiles?.id) {
        const detalle = await fetchById(perfil.perfiles.id)
        if (detalle) detallados.push(detalle)
      }
    }
    // console.log('Perfiles detallados:', detallados.length)
    return detallados
  }

  return {
    entities,
    loading,
    fetchAll,
    fetchById,
    fetchAllDetailedSafe
  }
})
