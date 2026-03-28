export default defineEventHandler(async () => {
  const res = await $fetch('https://dolarapi.com/v1/dolares')
  return res
})
