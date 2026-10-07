ALTER TABLE tenant.credit_card_transactions
  ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS withholding_amount DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS other_deductions DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS settlement_reference VARCHAR(100),
  ADD COLUMN IF NOT EXISTS settlement_notes VARCHAR(500),
  ADD COLUMN IF NOT EXISTS settlement_bank_id UUID;

CREATE INDEX IF NOT EXISTS credit_card_transactions_settlement_bank_id_idx
  ON tenant.credit_card_transactions(settlement_bank_id);
