import { ref } from 'vue'
import { useCombustibleSubmit } from './useCombustibleSubmit'
import { mapRegistroToCombustibleForm } from './combustibleExcelMapper'
import type { RegistroCombustible } from './useCombustibleImporter'

export function useCombustibleBatchSubmit() {
  const { submit } = useCombustibleSubmit()

  const running = ref(false)
  const progress = ref(0)
  const currentRow = ref<number | null>(null)

  async function submitBatch(registros: RegistroCombustible[]) {
    running.value = true
    progress.value = 0

    const total = registros.length

    for (let i = 0; i < total; i++) {
      const r = registros[i]

      if (!r) continue

      currentRow.value = r._rowIndex

      const form = mapRegistroToCombustibleForm(r)
      await submit(form)

      progress.value = Math.round(((i + 1) / total) * 100)
    }

    running.value = false
    currentRow.value = null
  }

  return {
    submitBatch,
    running,
    progress,
    currentRow
  }
}
