import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!

  return apiProxy(event, `/logistica/document-types/${id}/activate`, {
    method: 'PATCH'
  })
})
