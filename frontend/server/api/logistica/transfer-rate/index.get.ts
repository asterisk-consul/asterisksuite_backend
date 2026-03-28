import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler((event) => {
  const company_id = getQuery(event).company_id as string
  return apiProxy(event, `/transfer-rates?company_id=${company_id}`)
})
