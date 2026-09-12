
-- ─── PERCEPCIONES IIBB EN COMPROBANTES ───────────────────────
-- Se crea una regla editable y activa por jurisdicción. La aplicación efectiva
-- sigue dependiendo de la jurisdicción habilitada por la empresa.
INSERT INTO tenant.tax_rules (
  id, name, tax_type, application_type, jurisdiction_id,
  operation_type, base_type, calculation_method,
  rate, minimum_amount, priority, is_active, valid_from
)
SELECT
  gen_random_uuid(), 'Percepción IIBB ' || j.name,
  'IIBB', 'PERCEPTION', j.id,
  'SALE', 'NET_AMOUNT', 'RATE_TIMES_BASE',
  CASE j.code
    WHEN 'AR-C' THEN 3.0000
    WHEN 'AR-B' THEN 4.0000
    WHEN 'AR-X' THEN 3.5000
    WHEN 'AR-S' THEN 3.5000
    WHEN 'AR-N' THEN 4.5000
    WHEN 'AR-V' THEN 5.0000
    ELSE 3.0000
  END,
  NULL, 10, true, CURRENT_DATE
FROM tenant.tax_jurisdictions j
WHERE j.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM tenant.tax_rules r
    WHERE r.tax_type = 'IIBB'
      AND r.application_type = 'PERCEPTION'
      AND r.jurisdiction_id = j.id
      AND r.deleted_at IS NULL
  );
