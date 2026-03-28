export type ExpirationStatus = 'expired' | 'warning' | 'valid' | 'none'

export function daysUntil(dateString?: string | null): number | null {
  if (!dateString) return null

  const today = new Date()
  const expiration = new Date(dateString)

  today.setHours(0, 0, 0, 0)
  expiration.setHours(0, 0, 0, 0)

  const diffMs = expiration.getTime() - today.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

type ExpirationInput = Date | string | null | undefined

export function getExpirationStatus(date: ExpirationInput) {
  if (!date) return 'valid'

  const expirationDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(expirationDate.getTime())) return 'valid'

  const today = new Date()

  const diffDays =
    (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'warning'

  return 'valid'
}
