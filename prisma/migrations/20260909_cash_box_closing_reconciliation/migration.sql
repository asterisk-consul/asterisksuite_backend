ALTER TABLE tenant.cash_box_sessions
ADD COLUMN IF NOT EXISTS difference_reason VARCHAR(500);
