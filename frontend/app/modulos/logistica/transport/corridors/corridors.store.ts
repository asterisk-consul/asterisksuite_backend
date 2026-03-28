import { defineStore } from 'pinia'
import type {
  Corridor,
  CorridorRoute,
  CreateCorridorDto
} from './types/corridors.types'
import { useCorridorsService } from './corridors.service'

export const useCorridorsStore = defineStore('corridors', () => {
  const service = useCorridorsService()

  const corridors = ref<Corridor[]>([])
  const templates = ref<Corridor[]>([])
  const currentCorridor = ref<Corridor | null>(null)
  const currentRoute = ref<CorridorRoute | null>(null)

  const loading = ref(false)

  const fetchCorridors = async () => {
    loading.value = true
    corridors.value = await service.findAll()
    loading.value = false
  }

  const fetchTemplates = async () => {
    templates.value = await service.findTemplates()
  }

  const fetchCorridor = async (id: string) => {
    currentCorridor.value = await service.findOne(id)
  }

  const fetchRoute = async (id: string) => {
    currentRoute.value = await service.getRoute(id)
  }

  const createCorridor = async (data: CreateCorridorDto) => {
    const corridor = await service.create(data)
    corridors.value.push(corridor)
    return corridor
  }

  const updateCorridor = async (
    id: string,
    data: Partial<CreateCorridorDto>
  ) => {
    const updated = await service.update(id, data)

    const index = corridors.value.findIndex((c) => c.id === id)
    if (index !== -1) corridors.value[index] = updated

    return updated
  }

  const deleteCorridor = async (id: string) => {
    await service.remove(id)
    corridors.value = corridors.value.filter((c) => c.id !== id)
  }

  return {
    corridors,
    templates,
    currentCorridor,
    currentRoute,
    loading,
    fetchCorridors,
    fetchTemplates,
    fetchCorridor,
    fetchRoute,
    createCorridor,
    updateCorridor,
    deleteCorridor
  }
})
