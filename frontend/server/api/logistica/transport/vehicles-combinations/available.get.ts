import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string

  return apiProxy(event, `/vehicle-combinations/available`, {
    method: 'GET',
    query: {
      date
    }
  })
})
