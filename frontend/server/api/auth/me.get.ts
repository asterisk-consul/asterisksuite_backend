import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  return await apiProxy(event, '/auth/me', {
    method: 'GET'
  })
})
