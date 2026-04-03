import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return await apiProxy(event, '/auth/change-password', {
    method: 'POST',
    body
  })
})
