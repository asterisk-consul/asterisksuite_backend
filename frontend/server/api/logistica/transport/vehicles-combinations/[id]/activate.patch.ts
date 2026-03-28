import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  return apiProxy(event, `/vehicle-combinations/${id}/activate`, {
    method: 'PATCH'
  })
})
