ALTER TYPE tenant."BankOperationType" ADD VALUE IF NOT EXISTS 'ACCOUNT_TRANSFER';

ALTER TABLE tenant.credit_cards
  ADD COLUMN IF NOT EXISTS channel_type VARCHAR(30);

UPDATE tenant.credit_cards
SET channel_type = 'OTHER'
WHERE type = 'CUSTOMER' AND channel_type IS NULL;

ALTER TABLE tenant.credit_card_transactions
  ADD COLUMN IF NOT EXISTS settlement_id UUID;

CREATE TABLE IF NOT EXISTS tenant.credit_card_settlements (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  credit_card_id UUID NOT NULL,
  bank_account_id UUID NOT NULL,
  date DATE NOT NULL,
  currency_code VARCHAR(10) NOT NULL,
  transaction_count INTEGER NOT NULL,
  gross_amount DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  withholding_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  other_deductions DECIMAL(15,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(15,2) NOT NULL,
  reference VARCHAR(100),
  notes VARCHAR(500),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  deleted_at TIMESTAMP(6),
  created_by UUID,
  updated_by UUID,
  deleted_by UUID,
  CONSTRAINT credit_card_settlements_pkey PRIMARY KEY (id),
  CONSTRAINT credit_card_settlements_transaction_count_check CHECK (transaction_count > 0),
  CONSTRAINT credit_card_settlements_amounts_check CHECK (
    gross_amount >= 0 AND commission_amount >= 0 AND tax_amount >= 0
    AND withholding_amount >= 0 AND other_deductions >= 0 AND net_amount >= 0
  ),
  CONSTRAINT credit_card_settlements_credit_card_id_fkey
    FOREIGN KEY (credit_card_id) REFERENCES tenant.credit_cards(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT credit_card_settlements_bank_account_id_fkey
    FOREIGN KEY (bank_account_id) REFERENCES tenant.bank_accounts(id) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS credit_card_transactions_settlement_id_idx
  ON tenant.credit_card_transactions(settlement_id);
CREATE INDEX IF NOT EXISTS credit_card_settlements_credit_card_id_date_idx
  ON tenant.credit_card_settlements(credit_card_id, date);
CREATE INDEX IF NOT EXISTS credit_card_settlements_bank_account_id_date_idx
  ON tenant.credit_card_settlements(bank_account_id, date);
CREATE INDEX IF NOT EXISTS credit_card_settlements_created_at_idx
  ON tenant.credit_card_settlements(created_at);

ALTER TABLE tenant.credit_card_transactions
  ADD CONSTRAINT credit_card_transactions_settlement_id_fkey
  FOREIGN KEY (settlement_id) REFERENCES tenant.credit_card_settlements(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS tenant.bank_account_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  source_bank_account_id UUID NOT NULL,
  destination_bank_account_id UUID NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency_code VARCHAR(10) NOT NULL,
  reference VARCHAR(100),
  notes VARCHAR(500),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  deleted_at TIMESTAMP(6),
  created_by UUID,
  updated_by UUID,
  deleted_by UUID,
  CONSTRAINT bank_account_transfers_pkey PRIMARY KEY (id),
  CONSTRAINT bank_account_transfers_amount_check CHECK (amount > 0),
  CONSTRAINT bank_account_transfers_distinct_accounts_check CHECK (source_bank_account_id <> destination_bank_account_id),
  CONSTRAINT bank_account_transfers_source_fkey
    FOREIGN KEY (source_bank_account_id) REFERENCES tenant.bank_accounts(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT bank_account_transfers_destination_fkey
    FOREIGN KEY (destination_bank_account_id) REFERENCES tenant.bank_accounts(id) ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS bank_account_transfers_source_date_idx
  ON tenant.bank_account_transfers(source_bank_account_id, date);
CREATE INDEX IF NOT EXISTS bank_account_transfers_destination_date_idx
  ON tenant.bank_account_transfers(destination_bank_account_id, date);
CREATE INDEX IF NOT EXISTS bank_account_transfers_created_at_idx
  ON tenant.bank_account_transfers(created_at);
