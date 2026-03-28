export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')
  const body = await readBody(event)

  return await $fetch(`${config.public.apiBase2}/transport/trips/cargo`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    method: 'POST',
    body
  })
})
