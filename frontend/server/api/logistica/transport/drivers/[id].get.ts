import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!

  return apiProxy(event, `/transport/drivers/${id}`)
})
