ALTER TABLE tenant.cash_box_transfers
  ADD COLUMN IF NOT EXISTS source_company_id UUID,
  ADD COLUMN IF NOT EXISTS source_company_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS source_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS dest_company_id UUID,
  ADD COLUMN IF NOT EXISTS dest_company_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS dest_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS execution_error VARCHAR(500),
  ADD COLUMN IF NOT EXISTS record_side VARCHAR(20) NOT NULL DEFAULT 'source';

CREATE INDEX IF NOT EXISTS cash_box_transfers_dest_company_id_idx
  ON tenant.cash_box_transfers(dest_company_id);

CREATE INDEX IF NOT EXISTS cash_box_transfers_source_company_id_idx
  ON tenant.cash_box_transfers(source_company_id);

CREATE UNIQUE INDEX IF NOT EXISTS bank_movements_intercompany_side_uidx
  ON tenant.bank_account_movements(reference_type, reference_id)
  WHERE deleted_at IS NULL
    AND reference_type IN ('intercompany_transfer_source', 'intercompany_transfer_destination');

CREATE UNIQUE INDEX IF NOT EXISTS cash_movements_intercompany_side_uidx
  ON tenant.cash_box_movements(reference_type, reference_id)
  WHERE deleted_at IS NULL
    AND reference_type IN ('intercompany_transfer_source', 'intercompany_transfer_destination');
