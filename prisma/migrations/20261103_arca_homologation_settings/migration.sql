CREATE TABLE IF NOT EXISTS public.company_arca_settings (
  company_id UUID PRIMARY KEY,
  issuer_cuit VARCHAR(11) NOT NULL,
  environment VARCHAR(20) NOT NULL DEFAULT 'HOMOLOGATION',
  point_of_sale INTEGER,
  credentials_ciphertext TEXT NOT NULL,
  credentials_iv VARCHAR(32) NOT NULL,
  credentials_auth_tag VARCHAR(32) NOT NULL,
  access_ticket_ciphertext TEXT,
  access_ticket_iv VARCHAR(32),
  access_ticket_auth_tag VARCHAR(32),
  access_ticket_expires_at TIMESTAMP(6),
  certificate_subject TEXT,
  certificate_serial VARCHAR(100),
  certificate_valid_to TIMESTAMP(6),
  available_point_sales JSONB,
  last_test_status VARCHAR(20) NOT NULL DEFAULT 'NOT_TESTED',
  last_test_message TEXT,
  last_tested_at TIMESTAMP(6),
  configured_by UUID,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT company_arca_settings_company_fk
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT company_arca_settings_cuit_check
    CHECK (issuer_cuit ~ '^[0-9]{11}$'),
  CONSTRAINT company_arca_settings_environment_check
    CHECK (environment = 'HOMOLOGATION'),
  CONSTRAINT company_arca_settings_point_of_sale_check
    CHECK (point_of_sale IS NULL OR point_of_sale BETWEEN 1 AND 99999),
  CONSTRAINT company_arca_settings_test_status_check
    CHECK (last_test_status IN ('NOT_TESTED', 'READY', 'ERROR')),
  CONSTRAINT company_arca_settings_ticket_fields_check
    CHECK (
      (access_ticket_ciphertext IS NULL AND access_ticket_iv IS NULL AND access_ticket_auth_tag IS NULL)
      OR
      (access_ticket_ciphertext IS NOT NULL AND access_ticket_iv IS NOT NULL AND access_ticket_auth_tag IS NOT NULL)
    )
);

-- ARCA queda fuera de los planes existentes y apagado para las empresas hasta
-- que un administrador de plataforma lo habilite en un plan o excepción.
INSERT INTO public.platform_modules (code, name, description, icon, sort_order, is_core, dependencies, active)
VALUES (
  'ARCA',
  'ARCA',
  'Configuración fiscal y conexión de homologación con ARCA',
  'i-lucide-badge-check',
  150,
  false,
  '["CORE"]'::jsonb,
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_core = EXCLUDED.is_core,
  dependencies = EXCLUDED.dependencies,
  active = EXCLUDED.active;
