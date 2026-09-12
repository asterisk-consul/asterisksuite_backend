/**
 * Conversión con tipo de cambio de mercado (convención argentina).
 *
 * El exchange_rate se ingresa como cotización de mercado: X ARS por 1 USD
 * (ej: 1510 = 1 USD = 1510 ARS). Regla de conversión:
 *  - Misma moneda → monto sin cambios.
 *  - Desde ARS hacia moneda extranjera → DIVIDE por el TC.
 *  - Desde moneda extranjera hacia ARS → MULTIPLICA por el TC.
 *  - Par sin ARS (ej. USD→EUR) → no convertible con un solo TC → null.
 *
 * Espejo exacto de app/utils/currency.ts en el frontend — mantener en sincronía.
 */
export function convertWithMarketRate(
  amount: number,
  from: string,
  to: string,
  rate: number | null | undefined
): number | null {
  if (from === to) return amount;
  if (rate == null || rate <= 0) return null;
  if (from === 'ARS') return amount / rate;
  if (to === 'ARS') return amount * rate;
  return null;
}
