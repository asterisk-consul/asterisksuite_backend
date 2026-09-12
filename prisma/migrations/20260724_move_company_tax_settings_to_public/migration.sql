-- =====================================================
-- Migración: company_tax_settings → base de datos general
-- =====================================================
-- company_tax_settings debe estar en la base compartida (public),
-- no en cada base de tenant.

-- 1. Crear la tabla en la base general (si no existe)
CREATE TABLE IF NOT EXISTS public.company_tax_settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID UNIQUE NOT NULL,
  fiscal_mode         VARCHAR(20) NOT NULL DEFAULT 'SIMPLE',
  prices_include_tax  BOOLEAN NOT NULL DEFAULT true,
  show_tax_breakdown  BOOLEAN NOT NULL DEFAULT false,
  country             VARCHAR(3) NOT NULL DEFAULT 'AR',
  created_at          TIMESTAMP(6) NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP(6)
);

-- 2. Migrar datos desde las bases de tenant (ejecutar por cada tenant)
-- REEMPLAZAR 'dev_db' con el nombre de cada base de tenant

-- Opción A: Migrar desde dev_db
-- INSERT INTO public.company_tax_settings (id, company_id, fiscal_mode, prices_include_tax, show_tax_breakdown, country, created_at, updated_at)
-- SELECT id, company_id, fiscal_mode::text, prices_include_tax, show_tax_breakdown, country, created_at, updated_at
-- FROM dev_db.public.company_tax_settings
-- ON CONFLICT (company_id) DO UPDATE SET
--   fiscal_mode = EXCLUDED.fiscal_mode,
--   prices_include_tax = EXCLUDED.prices_include_tax,
--   show_tax_breakdown = EXCLUDED.show_tax_breakdown,
--   country = EXCLUDED.country,
--   updated_at = EXCLUDED.updated_at;

-- Opción B: Listar todas las bases de tenant para migrar
-- SELECT datname FROM pg_database WHERE datname LIKE '%_db' AND datname != 'public_db';

-- 3. Eliminar la tabla de las bases de tenant (después de migrar)
-- DROP TABLE IF EXISTS dev_db.public.company_tax_settings;
