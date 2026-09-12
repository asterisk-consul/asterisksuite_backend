-- Agrega campo last_entry_date a current_accounts para indicador de actividad
ALTER TABLE tenant.current_accounts ADD COLUMN last_entry_date DATE;

-- Poblar con la fecha del último movimiento existente por cuenta
UPDATE tenant.current_accounts ca
SET last_entry_date = sub.max_date
FROM (
  SELECT current_account_id, MAX(date)::date AS max_date
  FROM tenant.current_account_entries
  WHERE deleted_at IS NULL
  GROUP BY current_account_id
) sub
WHERE ca.id = sub.current_account_id;
