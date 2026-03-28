import { apiProxy } from '../../utils/api-proxy'
export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)

  return apiProxy(event, `/companies/${id}`, {
    method: 'PATCH',
    body
  })
})
