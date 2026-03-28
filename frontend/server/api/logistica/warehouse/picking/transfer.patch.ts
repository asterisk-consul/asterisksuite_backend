import { apiProxy } from '~~/server/utils/api-proxy'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return await apiProxy(event, `/logistica/picking/transfer`, {
    method: 'PATCH',
    body
  })
})
