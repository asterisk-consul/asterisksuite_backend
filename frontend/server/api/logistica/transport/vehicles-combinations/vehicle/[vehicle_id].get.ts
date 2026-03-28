import { apiProxy } from '~~/server/utils/api-proxy'

export default defineEventHandler(async (event) => {
  const { vehicle_id } = event.context.params!
  return apiProxy(event, `/vehicle-combinations/vehicle/${vehicle_id}`)
})
