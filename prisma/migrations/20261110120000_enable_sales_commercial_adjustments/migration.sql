-- Enable global commercial discounts on existing sales quotes and orders.
-- Users can still turn this off per document type from ERP settings.
UPDATE tenant.document_types
SET accepts_commercial_adjustments = true
WHERE deleted_at IS NULL
  AND active = true
  AND direction = 1
  AND category IN ('QUOTE', 'ORDER');
