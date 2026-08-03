// ══════════════════════════════════════════════════════════
// Document Statuses por categoría
// ══════════════════════════════════════════════════════════

export const QUOTE_STATUSES: Record<number, string> = {
  0: 'Borrador',
  1: 'Enviado',
  2: 'Aprobado',
  3: 'Rechazado',
  4: 'Vencido',
  5: 'Convertido',
  6: 'Cancelado',
}

export const ORDER_STATUSES: Record<number, string> = {
  0: 'Borrador',
  1: 'Aprobada',
  2: 'En Preparación',
  3: 'Lista Despacho',
  4: 'Parcial Entregada',
  5: 'Entregada',
  6: 'Facturada',
  7: 'Cerrada',
  8: 'Cancelada',
}

export const REMITO_STATUSES: Record<number, string> = {
  0: 'Borrador',
  1: 'En Tránsito',
  2: 'Entregado',
  3: 'Cancelado',
}

export const INVOICE_STATUSES: Record<number, string> = {
  0: 'Borrador',
  1: 'Pendiente',
  2: 'Confirmada',
  3: 'Anulada',
}

export type BadgeColor = 'primary' | 'neutral' | 'secondary' | 'success' | 'info' | 'warning' | 'error'

export const QUOTE_STATUS_COLORS: Record<number, BadgeColor> = {
  0: 'neutral',
  1: 'info',
  2: 'success',
  3: 'error',
  4: 'warning',
  5: 'secondary',
  6: 'error',
}

export const ORDER_STATUS_COLORS: Record<number, BadgeColor> = {
  0: 'neutral',
  1: 'info',
  2: 'warning',
  3: 'primary',
  4: 'warning',
  5: 'success',
  6: 'success',
  7: 'secondary',
  8: 'error',
}

export const REMITO_STATUS_COLORS: Record<number, BadgeColor> = {
  0: 'neutral',
  1: 'info',
  2: 'success',
  3: 'error',
}

export const INVOICE_STATUS_COLORS: Record<number, BadgeColor> = {
  0: 'neutral',
  1: 'warning',
  2: 'success',
  3: 'error',
}

// ══════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════

const STATUS_MAPS: Record<string, Record<number, string>> = {
  QUOTE: QUOTE_STATUSES,
  ORDER: ORDER_STATUSES,
  REMITO: REMITO_STATUSES,
  INVOICE: INVOICE_STATUSES,
  CREDIT_NOTE: INVOICE_STATUSES,
  DEBIT_NOTE: INVOICE_STATUSES,
  RECEIPT: INVOICE_STATUSES,
}

const COLOR_MAPS: Record<string, Record<number, BadgeColor>> = {
  QUOTE: QUOTE_STATUS_COLORS,
  ORDER: ORDER_STATUS_COLORS,
  REMITO: REMITO_STATUS_COLORS,
  INVOICE: INVOICE_STATUS_COLORS,
  CREDIT_NOTE: INVOICE_STATUS_COLORS,
  DEBIT_NOTE: INVOICE_STATUS_COLORS,
  RECEIPT: INVOICE_STATUS_COLORS,
}

export function getStatusLabel(category: string | null | undefined, status: number): string {
  return STATUS_MAPS[category ?? '']?.[status] ?? `Status ${status}`
}

export function getStatusColor(category: string | null | undefined, status: number): BadgeColor {
  return COLOR_MAPS[category ?? '']?.[status] ?? 'neutral'
}

// ══════════════════════════════════════════════════════════
// Transiciones válidas por categoría
// ══════════════════════════════════════════════════════════

export function getValidTransitions(category: string | null | undefined, currentStatus: number): number[] {
  const transitions: Record<string, Record<number, number[]>> = {
    QUOTE: {
      0: [1, 6],        // Borrador → Enviado, Cancelado
      1: [2, 3, 6],     // Enviado → Aprobado, Rechazado, Cancelado
      2: [5],           // Aprobado → Convertido
    },
    ORDER: {
      0: [1, 8],        // Borrador → Aprobada, Cancelada
      1: [2, 8],        // Aprobada → En Preparación, Cancelada
      2: [3, 8],        // En Preparación → Lista Despacho, Cancelada
      3: [4, 5],        // Lista Despacho → Parcial Entregada, Entregada
      4: [5, 6],        // Parcial Entregada → Entregada, Facturada
      5: [6, 7],        // Entregada → Facturada, Cerrada
      6: [7],           // Facturada → Cerrada
    },
    REMITO: {
      0: [1, 3],        // Borrador → En Tránsito, Cancelado
      1: [2, 3],        // En Tránsito → Entregado, Cancelado
    },
    INVOICE: {
      0: [1, 3],        // Borrador → Pendiente, Anulada
      1: [2, 3],        // Pendiente → Confirmada, Anulada
    },
  }

  return transitions[category ?? '']?.[currentStatus] ?? []
}
