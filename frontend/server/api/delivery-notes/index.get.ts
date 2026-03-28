import { apiProxy } from '~~/server/utils/api-proxy'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return apiProxy(event, '/delivery-notes')
})
