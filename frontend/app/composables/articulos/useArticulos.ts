import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticulosDepositosStore } from '~/stores/articulos.store'

export function useArticulos(id: number) {
  const store = useArticulosDepositosStore()
  const { articulo, loading } = storeToRefs(store)

  const fetchArticulo = async () => {
    if (loading.value) return
    if (articulo.value?.id === id) return

    await store.fetchArticulo(id)
  }

  // 👇 clave: inmediato y reactivo
  watch(
    () => id,
    () => fetchArticulo(),
    { immediate: true }
  )

  const articulosDepositos = computed(
    () => articulo.value?.articulosDepositos ?? []
  )

  const totalCantidad = computed(() =>
    articulosDepositos.value.reduce(
      (acc, d) => acc + Number(d.cantidad || 0),
      0
    )
  )

  return {
    articulo,
    loading,
    fetchArticulo,
    articulosDepositos,
    totalCantidad
  }
}
