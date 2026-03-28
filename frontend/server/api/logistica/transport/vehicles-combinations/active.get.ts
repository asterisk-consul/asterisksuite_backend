import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const company_id = getQuery(event).company_id as string
  return apiProxy(
    event,
    `/vehicle-combinations/active?company_id=${company_id}`
  )
})
