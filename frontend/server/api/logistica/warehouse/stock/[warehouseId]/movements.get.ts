import { apiProxy } from '~~/server/utils/api-proxy'
export default defineEventHandler(async (event) => {
  const { warehouseId } = event.context.params!

  return await apiProxy(event, `/warehouse/stock/${warehouseId}/movements`)
})
