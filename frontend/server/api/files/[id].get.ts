export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')
  const { id } = event.context.params!

  return await $fetch(`${config.apiBase2}/media/files${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })
})
