// stores/depositos.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DepositosService } from '~/services/deposit.service'

export const useDepositosStore = defineStore('depositos', () => {
  const entities = ref<Partial<ApiDeposito>[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchAll() {
    if (loaded.value) return
    loading.value = true
    entities.value = await DepositosService.findAll()
    loaded.value = true
    loading.value = false
  }

  return { entities, loading, fetchAll }
})
