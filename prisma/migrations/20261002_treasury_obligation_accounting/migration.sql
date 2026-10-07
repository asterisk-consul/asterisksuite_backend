ALTER TABLE tenant.treasury_obligation_templates
  ADD COLUMN IF NOT EXISTS treatment varchar(30) NOT NULL DEFAULT 'DIRECT_EXPENSE',
  ADD COLUMN IF NOT EXISTS service_product_id uuid,
  ADD COLUMN IF NOT EXISTS expense_account_id uuid,
  ADD COLUMN IF NOT EXISTS net_amount numeric(15,2);

ALTER TABLE tenant.treasury_obligations
  ADD COLUMN IF NOT EXISTS treatment varchar(30) NOT NULL DEFAULT 'DIRECT_EXPENSE',
  ADD COLUMN IF NOT EXISTS service_product_id uuid,
  ADD COLUMN IF NOT EXISTS expense_account_id uuid,
  ADD COLUMN IF NOT EXISTS net_amount numeric(15,2);
