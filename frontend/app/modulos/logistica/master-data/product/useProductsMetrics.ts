import { computed, type Ref } from 'vue'
import type { Product } from '~/modulos/logistica/master-data/product/product.types'

export const useProductsMetrics = (items: Ref<Product[]>) => {
  const total = computed(() => items.value.length)

  return {
    total
  }
}
