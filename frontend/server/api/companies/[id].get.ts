import { apiProxy } from '../../utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!

  return apiProxy(event, `/companies/${id}`)
})
