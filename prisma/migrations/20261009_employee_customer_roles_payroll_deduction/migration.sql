ALTER TYPE tenant."PaymentMethod" ADD VALUE IF NOT EXISTS 'PAYROLL_DEDUCTION';
ALTER TYPE tenant."HrAccountEntryType" ADD VALUE IF NOT EXISTS 'PAYROLL_DEDUCTION';

CREATE TABLE IF NOT EXISTS tenant.business_party_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL,
  role tenant."PartyType" NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT business_party_roles_party_id_fkey
    FOREIGN KEY (party_id) REFERENCES tenant.business_parties(id)
    ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS business_party_roles_party_id_role_key
  ON tenant.business_party_roles(party_id, role);
CREATE INDEX IF NOT EXISTS business_party_roles_role_active_idx
  ON tenant.business_party_roles(role, active);

INSERT INTO tenant.business_party_roles (party_id, role, active, created_at)
SELECT id, type, true, CURRENT_TIMESTAMP
FROM tenant.business_parties
WHERE deleted_at IS NULL
ON CONFLICT (party_id, role) DO UPDATE SET active = true, updated_at = CURRENT_TIMESTAMP;
