// server/api/trips/[id]/assign-orders.post.ts

import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return apiProxy(event, `/trips/${id}/assign-orders`, {
    method: 'POST',
    body
  })
})
