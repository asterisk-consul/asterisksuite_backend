CREATE TABLE IF NOT EXISTS tenant.intake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150),
  notes TEXT,
  suggested_type VARCHAR(30),
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  assigned_to UUID,
  sent_at TIMESTAMP,
  completed_at TIMESTAMP,
  completed_by UUID,
  target_type VARCHAR(30),
  target_id UUID,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  deleted_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  deleted_by UUID
);

CREATE INDEX IF NOT EXISTS idx_intake_records_assigned_status
  ON tenant.intake_records (assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_intake_records_creator_status
  ON tenant.intake_records (created_by, status);
