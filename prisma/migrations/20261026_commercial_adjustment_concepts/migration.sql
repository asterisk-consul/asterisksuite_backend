CREATE TABLE IF NOT EXISTS tenant.commercial_adjustment_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  description TEXT,
  applies_to VARCHAR(20) NOT NULL DEFAULT 'BOTH',
  value_type VARCHAR(20) NOT NULL,
  basis VARCHAR(10) NOT NULL,
  default_value DECIMAL(15, 4),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  deleted_at TIMESTAMP(6),
  created_by UUID,
  updated_by UUID,
  deleted_by UUID,
  CONSTRAINT commercial_adjustment_concepts_scope_check CHECK (applies_to IN ('SALES', 'PURCHASES', 'BOTH')),
  CONSTRAINT commercial_adjustment_concepts_type_check CHECK (value_type IN ('PERCENTAGE', 'AMOUNT')),
  CONSTRAINT commercial_adjustment_concepts_basis_check CHECK (basis IN ('NET', 'GROSS')),
  CONSTRAINT commercial_adjustment_concepts_default_value_check CHECK (
    default_value IS NULL OR (default_value > 0 AND (value_type <> 'PERCENTAGE' OR default_value <= 100))
  )
);

CREATE INDEX IF NOT EXISTS idx_commercial_adjustment_concepts_active_scope_order
  ON tenant.commercial_adjustment_concepts (is_active, applies_to, sort_order);

INSERT INTO tenant.permissions (id, code, description, active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'commercial_adjustment_concepts.read', 'Ver conceptos comerciales reutilizables', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'commercial_adjustment_concepts.create', 'Crear conceptos comerciales reutilizables', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'commercial_adjustment_concepts.update', 'Editar conceptos comerciales reutilizables', TRUE, NOW(), NOW())
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description, active = TRUE, updated_at = NOW();

-- Administrators/managers can maintain the catalog. Basic document users only
-- need read access to select a template while creating an invoice.
INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT business_role.id, permission.id
FROM tenant.business_roles AS business_role
CROSS JOIN tenant.permissions permission
WHERE business_role.code IN ('admin', 'manager')
  AND permission.code IN (
    'commercial_adjustment_concepts.read',
    'commercial_adjustment_concepts.create',
    'commercial_adjustment_concepts.update'
  )
ON CONFLICT DO NOTHING;

INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT business_role.id, permission.id
FROM tenant.business_roles AS business_role
JOIN tenant.permissions permission ON permission.code = 'commercial_adjustment_concepts.read'
WHERE business_role.code IN ('user', 'viewer')
ON CONFLICT DO NOTHING;
