export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')
  const body = await readBody(event)

  return await apiProxy(event, `/logistica/picking`, {
    method: 'POST',
    body
  })
})
