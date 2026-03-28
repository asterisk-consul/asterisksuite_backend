import { ref, h, type Component } from 'vue'
import { UInput } from '#components'

export type EditableValue = string | null | undefined

export interface InlineEditActions<T, F extends string> {
  onInlineSave?: (row: T, field: F, value: EditableValue) => void
}

export function useInlineEdit<T extends { id: string }, F extends string>() {
  const editing = ref<{ id: string; field: F } | null>(null)

  const startEdit = (id: string, field: F) => {
    editing.value = { id, field }
  }

  const stopEdit = () => {
    editing.value = null
  }

  const isEditing = (id: string, field: F) =>
    editing.value?.id === id && editing.value?.field === field

  function editableCell(field: F, row: T, actions: InlineEditActions<T, F>) {
    const id = row.id
    const originalValue = (row as any)[field]
    const value = originalValue ?? ''

    const save = () => {
      actions.onInlineSave?.(row, field, (row as any)[field])
      stopEdit()
    }

    const cancel = () => {
      ;(row as any)[field] = originalValue
      stopEdit()
    }

    if (isEditing(id, field)) {
      return h(UInput as unknown as Component, {
        modelValue: value,
        size: 'lg',
        autofocus: true,

        'onUpdate:modelValue': (v: string) => ((row as any)[field] = v),

        onBlur: save,

        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            save()
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
        }
      })
    }

    return h(
      'div',
      {
        class:
          'cursor-pointer hover:bg-primary/5 hover:text-primary px-2 py-1 rounded',
        onClick: () => startEdit(id, field)
      },
      value || '—'
    )
  }

  return {
    editableCell,
    startEdit,
    stopEdit,
    isEditing
  }
}
