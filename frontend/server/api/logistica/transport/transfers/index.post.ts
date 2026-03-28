export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')
  const body = await readBody(event)

  return await $fetch(`${config.apiBase2}/transport/drivers`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    method: 'POST',
    body
  })
})
