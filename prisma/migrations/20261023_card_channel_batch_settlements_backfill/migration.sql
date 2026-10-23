-- Conserva las acreditaciones históricas ya asentadas antes de introducir
-- los lotes. Se reutiliza el id del cobro como id del lote unitario para que
-- sigan coincidiendo las referencias de movimientos existentes.
INSERT INTO tenant.credit_card_settlements (
  id,
  credit_card_id,
  bank_account_id,
  date,
  currency_code,
  transaction_count,
  gross_amount,
  commission_amount,
  tax_amount,
  withholding_amount,
  other_deductions,
  net_amount,
  reference,
  notes,
  created_at,
  created_by
)
SELECT
  t.id,
  t.credit_card_id,
  t.settlement_bank_id,
  COALESCE(t.actual_clearing_date, t.date),
  t.currency_code,
  1,
  t.amount,
  COALESCE(t.commission_amount, 0),
  COALESCE(t.tax_amount, 0),
  COALESCE(t.withholding_amount, 0),
  COALESCE(t.other_deductions, 0),
  COALESCE(
    t.net_amount,
    t.amount
      - COALESCE(t.commission_amount, 0)
      - COALESCE(t.tax_amount, 0)
      - COALESCE(t.withholding_amount, 0)
      - COALESCE(t.other_deductions, 0)
  ),
  t.settlement_reference,
  t.settlement_notes,
  t.created_at,
  t.created_by
FROM tenant.credit_card_transactions AS t
WHERE t.type = 'COLLECTION'
  AND t.clearing_status = 'CLEARED'
  AND t.settlement_bank_id IS NOT NULL
  AND t.settlement_id IS NULL
ON CONFLICT (id) DO NOTHING;

UPDATE tenant.credit_card_transactions
SET settlement_id = id
WHERE type = 'COLLECTION'
  AND clearing_status = 'CLEARED'
  AND settlement_bank_id IS NOT NULL
  AND settlement_id IS NULL
  AND EXISTS (
    SELECT 1
    FROM tenant.credit_card_settlements AS settlement
    WHERE settlement.id = credit_card_transactions.id
  );
