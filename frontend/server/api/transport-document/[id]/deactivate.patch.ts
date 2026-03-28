import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  return apiProxy(event, `/logistica/document-types/${id}/deactivate`, {
    method: 'PATCH'
  })
})
