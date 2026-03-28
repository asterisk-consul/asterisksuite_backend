import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const company_id = query.company_id as string
  const date = query.date as string

  if (!company_id || !date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'company_id y date son requeridos'
    })
  }

  return apiProxy(event, `/vehicle-combinations/available`, {
    method: 'GET',
    query: {
      company_id,
      date
    }
  })
})
