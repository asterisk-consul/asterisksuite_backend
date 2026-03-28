export const defaultRegistroParams = {
  pattern: '',
  offset: 0,
  max: null,
  sort: 'fecha',
  descending: true
} as const

export interface RegistroParams {
  statusid: number
  flowid: number
  pattern: string
  offset: number
  max: number | null
  sort: string
  descending: boolean
}

/**
 * Construye los params finales aplicando defaults
 */
export const buildRegistroParams = (
  params: Pick<RegistroParams, 'statusid' | 'flowid'> &
    Partial<Omit<RegistroParams, 'statusid' | 'flowid'>>
): RegistroParams => {
  return {
    ...defaultRegistroParams,
    ...params
  }
}
