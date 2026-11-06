DO $$ BEGIN
  CREATE TYPE public."SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public."ModuleOverrideState" AS ENUM ('ENABLED', 'READ_ONLY', 'DISABLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.platform_modules (
  code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500),
  icon VARCHAR(100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_core BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500),
  is_legacy BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS public.subscription_plan_modules (
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  module_code VARCHAR(50) NOT NULL REFERENCES public.platform_modules(code) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (plan_id, module_code)
);

CREATE TABLE IF NOT EXISTS public.company_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status public."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  starts_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trial_ends_at TIMESTAMP(6),
  renews_at TIMESTAMP(6),
  cancelled_at TIMESTAMP(6),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6)
);

CREATE INDEX IF NOT EXISTS company_subscriptions_plan_status_idx
  ON public.company_subscriptions(plan_id, status);

CREATE TABLE IF NOT EXISTS public.company_module_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  module_code VARCHAR(50) NOT NULL REFERENCES public.platform_modules(code) ON DELETE CASCADE,
  state public."ModuleOverrideState" NOT NULL,
  reason VARCHAR(500),
  expires_at TIMESTAMP(6),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  UNIQUE (company_id, module_code)
);

CREATE INDEX IF NOT EXISTS company_module_overrides_expires_at_idx
  ON public.company_module_overrides(expires_at);

INSERT INTO public.platform_modules (code, name, description, icon, sort_order, is_core, dependencies)
VALUES
  ('CORE', 'Núcleo', 'Usuarios, empresas, seguridad y configuración básica', 'i-lucide-settings', 0, true, '[]'),
  ('MASTER_DATA', 'Datos maestros', 'Productos, terceros, depósitos y catálogos comunes', 'i-lucide-database', 10, true, '["CORE"]'),
  ('SALES', 'Ventas', 'Presupuestos, órdenes, facturación y remitos de venta', 'i-lucide-shopping-cart', 20, false, '["CORE","MASTER_DATA"]'),
  ('PURCHASES', 'Compras', 'Órdenes, facturas y remitos de compra', 'i-lucide-shopping-bag', 30, false, '["CORE","MASTER_DATA"]'),
  ('INVENTORY', 'Inventario', 'Stock, movimientos, reservas y reposición', 'i-lucide-boxes', 40, false, '["MASTER_DATA"]'),
  ('LOGISTICS', 'Logística', 'Despacho, picking, viajes y transporte', 'i-lucide-truck', 50, false, '["INVENTORY"]'),
  ('TREASURY', 'Tesorería', 'Pagos, cobros, bancos, cajas y cheques', 'i-lucide-wallet-cards', 60, false, '["CORE","MASTER_DATA"]'),
  ('ACCOUNTING', 'Contabilidad', 'Asientos, diario y balances', 'i-lucide-book-open', 70, false, '["SALES","PURCHASES","TREASURY"]'),
  ('HR', 'Recursos humanos', 'Empleados, vales y comisiones', 'i-lucide-users', 80, false, '["CORE"]'),
  ('MAINTENANCE', 'Mantenimiento', 'Activos, cubiertas y órdenes de mantenimiento', 'i-lucide-wrench', 90, false, '["CORE"]'),
  ('INTERNATIONAL_OPERATIONS', 'Operaciones internacionales', 'Importaciones, exportaciones y contenedores', 'i-lucide-ship', 100, false, '["PURCHASES"]'),
  ('MANUFACTURING', 'Fabricación', 'Ingeniería, listas de materiales y producción', 'i-lucide-factory', 110, false, '["INVENTORY"]'),
  ('REPORTS', 'Reportes', 'Reportes avanzados, programados y consolidados', 'i-lucide-chart-no-axes-combined', 120, false, '["CORE"]')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_core = EXCLUDED.is_core,
  dependencies = EXCLUDED.dependencies;

INSERT INTO public.subscription_plans (code, name, description, is_legacy, active)
VALUES ('LEGACY_FULL', 'Plan histórico completo', 'Conserva todos los módulos para empresas anteriores al sistema de planes', true, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.subscription_plan_modules (plan_id, module_code, enabled, limits)
SELECT plan.id, module.code, true, '{}'::jsonb
FROM public.subscription_plans plan
CROSS JOIN public.platform_modules module
WHERE plan.code = 'LEGACY_FULL'
ON CONFLICT (plan_id, module_code) DO UPDATE SET enabled = true;

INSERT INTO public.company_subscriptions (company_id, plan_id, status, starts_at)
SELECT company.id, plan.id, 'ACTIVE'::public."SubscriptionStatus", CURRENT_TIMESTAMP
FROM public.companies company
CROSS JOIN public.subscription_plans plan
WHERE plan.code = 'LEGACY_FULL'
  AND company.deleted_at IS NULL
ON CONFLICT (company_id) DO NOTHING;
