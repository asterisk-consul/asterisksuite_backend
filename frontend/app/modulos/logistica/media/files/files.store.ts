import { useFilesService } from '~/modulos/logistica/media/files/files.service'

import type {
  File,
  CreateFileDto,
  UpdateFileDto,
  QueryFileInput
} from '~/modulos/logistica/media/files/files.types'

export const useFilesStore = defineStore('files', () => {
  const service = useFilesService()

  const files = ref<File[]>([])
  const current = ref<File | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const findAll = (query?: QueryFileInput) =>
    service.findAll(query).then((response) => {
      files.value = response
    })

  const findOne = (id: string) =>
    service.findOne(id).then((response) => {
      current.value = response
    })

  const create = (payload: CreateFileDto) =>
    service.create(payload).then((response) => {
      files.value.push(response)
    })

  const update = (id: string, payload: UpdateFileDto) =>
    service.update(id, payload).then((response) => {
      const index = files.value.findIndex((item) => item.id === id)
      files.value[index] = response
    })

  const remove = (id: string) =>
    service.remove(id).then(() => {
      const index = files.value.findIndex((item) => item.id === id)
      files.value.splice(index, 1)
    })

  return {
    files,
    current,
    loading,
    error,
    service,
    findAll,
    findOne,
    create,
    update,
    remove
  }
})
