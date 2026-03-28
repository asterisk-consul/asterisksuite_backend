import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { company_id } = getQuery(event)

  const query = company_id ? `?company_id=${company_id}` : ''

  return apiProxy(event, `/master-data/business-parties${query}`)
})
