export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')
  const { entityType, entityId } = event.context.params!

  return await $fetch(
    `${config.apiBase2}/media/files/${entityType}/${entityId}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  )
})
