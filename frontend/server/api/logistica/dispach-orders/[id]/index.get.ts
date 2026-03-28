import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  return apiProxy(event, `/dispatch-orders/${id}`)
})
