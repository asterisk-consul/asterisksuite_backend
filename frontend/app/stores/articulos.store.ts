import { defineStore } from 'pinia'
import { ArticulosService } from '~/services/articulos.service'

export const useArticulosDepositosStore = defineStore(
  'articulos.depositos',
  () => {
    const articulo = ref<Articulo | null>(null)
    const loading = ref(false)
    const loaded = ref(false)

    async function fetchArticulo(id: number) {
      if (loaded.value) return
      loading.value = true
      articulo.value = await ArticulosService.findArticulo(id)
      console.log('articuloStore', articulo.value)
      loaded.value = true
      loading.value = false
    }

    return { articulo, loading, fetchArticulo }
  }
)
