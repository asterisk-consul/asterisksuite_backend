import { apiProxy } from '~~/server/utils/api-proxy'
export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)

  return await apiProxy(event, `/warehouse/pallets/${id}`, {
    method: 'PATCH',
    body
  })
})
