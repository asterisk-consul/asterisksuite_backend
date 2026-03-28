import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCompaniesService } from '~/modulos/logistica/core/companies/company.service'
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput
} from '~/modulos/logistica/core/companies/company.types'

export const useCompaniesStore = defineStore('companies', () => {
  const service = useCompaniesService()

  const items = ref<Company[]>([])
  const current = ref<Company | null>(null)
  const loading = ref(false)

  const fetchAll = async () => {
    try {
      loading.value = true
      items.value = await service.findAll()
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (id: string) => {
    try {
      loading.value = true
      const data = await service.findOne(id)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateCompanyInput) => {
    const created = await service.create(payload)
    items.value.unshift(created)
    return created
  }

  const update = async (id: string, payload: UpdateCompanyInput) => {
    const updated = await service.update(id, payload)

    const index = items.value.findIndex((i) => i.id === id)
    if (index !== -1) {
      items.value[index] = updated
    }

    if (current.value?.id === id) {
      current.value = updated
    }

    return updated
  }

  const deactivate = async (id: string) => {
    await service.deactivate(id)

    items.value = items.value.filter((i) => i.id !== id)

    if (current.value?.id === id) {
      current.value = null
    }
  }

  return {
    items,
    current,
    loading,
    fetchAll,
    fetchOne,
    create,
    update,
    deactivate
  }
})
