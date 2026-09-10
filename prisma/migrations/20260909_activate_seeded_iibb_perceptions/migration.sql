UPDATE tenant.tax_rules
SET is_active = true,
    updated_at = CURRENT_TIMESTAMP
WHERE tax_type = 'IIBB'
  AND application_type = 'PERCEPTION'
  AND name LIKE 'Percepción IIBB %'
  AND valid_to IS NULL
  AND deleted_at IS NULL;
