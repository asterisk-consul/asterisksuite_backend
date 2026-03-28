// server/api/logistica/transport/trips/[id]/status/[status].patch.ts
import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { id, status } = getRouterParams(event)

  return apiProxy(event, `/trips/${id}/status/${status}`, {
    method: 'PATCH'
  })
})
