import { apiProxy } from '../../utils/api-proxy'
export default defineEventHandler(async (event) => {
  return apiProxy(event, '/companies')
})
