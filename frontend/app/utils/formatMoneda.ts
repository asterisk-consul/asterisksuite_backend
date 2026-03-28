export function formatMoneda(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return '$0.00'

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(valor)
}
