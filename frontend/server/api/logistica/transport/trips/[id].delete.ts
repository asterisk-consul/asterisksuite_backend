import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler((event) => {
  const { id } = event.context.params!
  return apiProxy(event, `/trips/${id}`, { method: 'DELETE' })
})
