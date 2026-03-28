import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return apiProxy(event, '/vehicle-combinations', { method: 'POST', body })
})
