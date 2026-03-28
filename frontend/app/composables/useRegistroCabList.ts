import type { RegistroParams } from './useRegistroParams'

export const useRegistroCabList = (params: Ref<RegistroParams>) => {
  const data = ref<ApiRegistroCabList | null>(null)
  const loading = ref(false)
  const error = ref<unknown>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const { data: res } = await postData<ApiRegistroCabList, RegistroParams>(
        '/workspace/getRegistroCabList',
        params.value
      )

      data.value = res
      console.log(res)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  watch(params, fetchData, {
    deep: true,
    immediate: true
  })

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}
