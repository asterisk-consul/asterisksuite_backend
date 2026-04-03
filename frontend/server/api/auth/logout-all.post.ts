import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  return await apiProxy(event, '/auth/logout-all', {
    method: 'POST'
  })
})
