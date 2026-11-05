/**
 * Reconstruye los saldos corridos de una cuenta sin necesitar una columna de
 * saldo inicial. El saldo base se obtiene del saldo actual menos el efecto de
 * todos los movimientos activos, por lo que también funciona con cuentas ya
 * existentes.
 *
 * Debe llamarse después de crear, modificar o anular un movimiento y, cuando
 * corresponda, dentro de la misma transacción que originó ese cambio.
 */
export async function recalculateBankAccountLedger(prisma: any, bankAccountId: string) {
  const rows = await prisma.$queryRaw<Array<{ balance: number }>>`
    WITH movement_deltas AS (
      SELECT id, date, created_at, (balance_after - balance_before) AS delta
      FROM tenant.bank_account_movements
      WHERE bank_account_id = ${bankAccountId}::uuid
        AND deleted_at IS NULL
    ),
    totals AS (
      SELECT COALESCE(SUM(delta), 0)::numeric AS total_delta
      FROM movement_deltas
    ),
    ordered AS (
      SELECT
        movement_deltas.id,
        movement_deltas.delta,
        totals.total_delta,
        COALESCE(
          SUM(movement_deltas.delta) OVER (
            ORDER BY movement_deltas.date, movement_deltas.created_at, movement_deltas.id
            ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
          ),
          0
        )::numeric AS prior_delta
      FROM movement_deltas
      CROSS JOIN totals
    ),
    updated_movements AS (
      UPDATE tenant.bank_account_movements AS movement
      SET
        balance_before = ROUND((account.balance - ordered.total_delta + ordered.prior_delta)::numeric, 2),
        balance_after = ROUND((account.balance - ordered.total_delta + ordered.prior_delta + ordered.delta)::numeric, 2)
      FROM ordered
      JOIN tenant.bank_accounts AS account ON account.id = ${bankAccountId}::uuid
      WHERE movement.id = ordered.id
      RETURNING movement.id
    ),
    updated_account AS (
      UPDATE tenant.bank_accounts AS account
      SET
        balance = ROUND((account.balance - totals.total_delta + totals.total_delta)::numeric, 2),
        updated_at = CURRENT_TIMESTAMP
      FROM totals
      WHERE account.id = ${bankAccountId}::uuid
      RETURNING account.balance
    )
    SELECT balance FROM updated_account
  `;

  return rows[0] ? Number(rows[0].balance) : undefined;
}
