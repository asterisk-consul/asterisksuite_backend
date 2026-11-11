-- Backfill idempotente de anticipos confirmados anteriores al registro en CC.
-- Ejecutar dentro de cada base tenant donde se quieran reflejar anticipos existentes.
-- No modifica pagos, aplicaciones, caja ni bancos; agrega solo el saldo disponible.

BEGIN;

CREATE TEMP TABLE _advance_cc_backfill ON COMMIT DROP AS
WITH applied AS (
  SELECT payment_id, SUM(amount_applied) AS amount_applied
  FROM tenant.payment_documents
  WHERE deleted_at IS NULL
  GROUP BY payment_id
), base_currency AS (
  SELECT code
  FROM tenant.currencies
  WHERE is_base = TRUE AND deleted_at IS NULL
  ORDER BY code
  LIMIT 1
)
SELECT
  gen_random_uuid() AS entry_id,
  p.id AS payment_id,
  p.party_id,
  COALESCE(p.party_type, CASE WHEN p.type = 'COLLECTION' THEN 'CUSTOMER' ELSE 'SUPPLIER' END) AS party_type,
  p.number,
  p.date,
  ROUND(p.amount - COALESCE(applied.amount_applied, 0), 2) AS amount,
  p.currency_code,
  p.exchange_rate,
  p.rate_type,
  CASE
    WHEN UPPER(p.currency_code) = UPPER(base_currency.code)
      THEN ROUND(p.amount - COALESCE(applied.amount_applied, 0), 2)
    WHEN p.converted_amount IS NOT NULL AND p.amount > 0
      THEN ROUND(p.converted_amount * (p.amount - COALESCE(applied.amount_applied, 0)) / p.amount, 2)
    WHEN p.exchange_rate IS NOT NULL
      THEN ROUND((p.amount - COALESCE(applied.amount_applied, 0)) * p.exchange_rate, 2)
    ELSE NULL::numeric
  END AS converted_amount,
  p.created_by,
  NULL::uuid AS current_account_id
FROM tenant.payments p
CROSS JOIN base_currency
LEFT JOIN applied ON applied.payment_id = p.id
WHERE p.payment_mode = 'ADVANCE'
  AND p.status IN ('CONFIRMED', 'PAID')
  AND p.deleted_at IS NULL
  AND p.party_id IS NOT NULL
  AND p.amount - COALESCE(applied.amount_applied, 0) > 0.01
  AND NOT EXISTS (
    SELECT 1
    FROM tenant.current_account_entries entry
    WHERE entry.payment_id = p.id
      AND entry.reference_type = 'payment_advance'
      AND entry.deleted_at IS NULL
  );

INSERT INTO tenant.current_accounts (id, party_id, party_type, balance, active, created_at, updated_at, created_by)
SELECT DISTINCT ON (party_id)
  gen_random_uuid(), party_id, party_type, 0, TRUE, NOW(), NOW(), created_by
FROM _advance_cc_backfill
ORDER BY party_id, date DESC, payment_id
ON CONFLICT (party_id) DO UPDATE
SET party_type = EXCLUDED.party_type,
    updated_at = NOW();

UPDATE _advance_cc_backfill backfill
SET current_account_id = account.id
FROM tenant.current_accounts account
WHERE account.party_id = backfill.party_id;

-- El anticipo es un crédito a favor del cliente o proveedor; su saldo reduce
-- el balance de la cuenta corriente en ambos casos.
INSERT INTO tenant.current_account_entries (
  id,
  current_account_id,
  type,
  amount,
  currency_code,
  exchange_rate,
  rate_type,
  converted_amount,
  balance_before,
  balance_after,
  description,
  reference_type,
  reference_id,
  payment_id,
  date,
  created_at,
  created_by
)
SELECT
  entry_id,
  current_account_id,
  'ADVANCE'::tenant."AccountEntryType",
  amount,
  currency_code,
  exchange_rate,
  rate_type,
  converted_amount,
  0,
  -COALESCE(converted_amount, amount),
  'Anticipo #' || number || ' · saldo disponible',
  'payment_advance',
  payment_id,
  payment_id,
  date::timestamp,
  NOW(),
  created_by
FROM _advance_cc_backfill;

UPDATE tenant.current_accounts account
SET balance = account.balance - totals.amount_to_subtract,
    updated_at = NOW()
FROM (
  SELECT current_account_id, SUM(COALESCE(converted_amount, amount)) AS amount_to_subtract
  FROM _advance_cc_backfill
  GROUP BY current_account_id
) totals
WHERE account.id = totals.current_account_id;

-- Recalcular los saldos corridos de las cuentas tocadas respetando fecha y orden.
WITH affected_accounts AS (
  SELECT DISTINCT current_account_id FROM _advance_cc_backfill
), deltas AS (
  SELECT
    entry.id,
    entry.current_account_id,
    entry.date,
    entry.created_at,
    entry.balance_after - entry.balance_before AS delta,
    SUM(entry.balance_after - entry.balance_before) OVER (
      PARTITION BY entry.current_account_id
    ) AS total_delta,
    SUM(entry.balance_after - entry.balance_before) OVER (
      PARTITION BY entry.current_account_id
      ORDER BY entry.date, entry.created_at, entry.id
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_delta
  FROM tenant.current_account_entries entry
  JOIN affected_accounts affected ON affected.current_account_id = entry.current_account_id
  WHERE entry.deleted_at IS NULL
), recalculated AS (
  SELECT
    deltas.id,
    account.balance - deltas.total_delta + deltas.cumulative_delta - deltas.delta AS balance_before,
    account.balance - deltas.total_delta + deltas.cumulative_delta AS balance_after
  FROM deltas
  JOIN tenant.current_accounts account ON account.id = deltas.current_account_id
)
UPDATE tenant.current_account_entries entry
SET balance_before = recalculated.balance_before,
    balance_after = recalculated.balance_after
FROM recalculated
WHERE entry.id = recalculated.id;

UPDATE tenant.current_accounts account
SET last_entry_date = latest.date::date,
    updated_at = NOW()
FROM (
  SELECT entry.current_account_id, MAX(entry.date) AS date
  FROM tenant.current_account_entries entry
  JOIN (SELECT DISTINCT current_account_id FROM _advance_cc_backfill) affected
    ON affected.current_account_id = entry.current_account_id
  WHERE entry.deleted_at IS NULL
  GROUP BY entry.current_account_id
) latest
WHERE account.id = latest.current_account_id;

SELECT COUNT(*) AS anticipos_con_saldo_incorporados
FROM _advance_cc_backfill;

SELECT number AS pago_numero, party_id, amount AS saldo_disponible, currency_code AS moneda
FROM _advance_cc_backfill
ORDER BY party_id, number;

COMMIT;
