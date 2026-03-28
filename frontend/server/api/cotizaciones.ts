export default defineEventHandler(async () => {
  return await $fetch('https://dolarapi.com/v1/cotizaciones')
})
