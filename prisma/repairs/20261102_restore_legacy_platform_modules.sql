-- Ejecutar en la base central `asterisksuite`, nunca en una base tenant como `dev_db`.
-- Recupera catálogo y plan histórico cuando las tablas existen pero quedaron sin seed.
-- Es idempotente y no reemplaza suscripciones que ya tenga asignadas una empresa.

BEGIN;

INSERT INTO public.platform_modules
  (code, name, description, icon, sort_order, is_core, dependencies, active)
VALUES
  ('CORE', 'Núcleo', 'Usuarios, empresas, seguridad y configuración básica', 'i-lucide-settings', 0, true, '[]'::jsonb, true),
  ('MASTER_DATA', 'Datos maestros', 'Productos, terceros, depósitos y catálogos comunes', 'i-lucide-database', 10, true, '["CORE"]'::jsonb, true),
  ('SALES', 'Ventas', 'Presupuestos, órdenes, facturación y remitos de venta', 'i-lucide-shopping-cart', 20, false, '["CORE","MASTER_DATA"]'::jsonb, true),
  ('PURCHASES', 'Compras', 'Órdenes, facturas y remitos de compra', 'i-lucide-shopping-bag', 30, false, '["CORE","MASTER_DATA"]'::jsonb, true),
  ('INVENTORY', 'Inventario', 'Stock, movimientos, reservas y reposición', 'i-lucide-boxes', 40, false, '["MASTER_DATA"]'::jsonb, true),
  ('LOGISTICS', 'Logística', 'Despacho, picking, viajes y transporte', 'i-lucide-truck', 50, false, '["INVENTORY"]'::jsonb, true),
  ('TREASURY', 'Tesorería', 'Pagos, cobros, bancos, cajas y cheques', 'i-lucide-wallet-cards', 60, false, '["CORE","MASTER_DATA"]'::jsonb, true),
  ('ACCOUNTING', 'Contabilidad', 'Asientos, diario y balances', 'i-lucide-book-open', 70, false, '["SALES","PURCHASES","TREASURY"]'::jsonb, true),
  ('HR', 'Recursos humanos', 'Empleados, vales y comisiones', 'i-lucide-users', 80, false, '["CORE"]'::jsonb, true),
  ('MAINTENANCE', 'Mantenimiento', 'Activos, cubiertas y órdenes de mantenimiento', 'i-lucide-wrench', 90, false, '["CORE"]'::jsonb, true),
  ('INTERNATIONAL_OPERATIONS', 'Operaciones internacionales', 'Importaciones, exportaciones y contenedores', 'i-lucide-ship', 100, false, '["PURCHASES"]'::jsonb, true),
  ('MANUFACTURING', 'Fabricación', 'Ingeniería, listas de materiales y producción', 'i-lucide-factory', 110, false, '["INVENTORY"]'::jsonb, true),
  ('REPORTS', 'Reportes', 'Reportes avanzados, programados y consolidados', 'i-lucide-chart-no-axes-combined', 120, false, '["CORE"]'::jsonb, true),
  ('WHATSAPP', 'WhatsApp', 'Notificaciones operativas y reportes enviados por WhatsApp', 'i-lucide-message-circle', 130, false, '["CORE"]'::jsonb, true),
  ('MCP', 'Conexiones MCP', 'Integración de asistentes de IA con herramientas autorizadas de Asterisk Suite', 'i-lucide-plug-zap', 140, false, '["CORE"]'::jsonb, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_core = EXCLUDED.is_core,
  dependencies = EXCLUDED.dependencies,
  active = EXCLUDED.active;

INSERT INTO public.subscription_plans
  (id, code, name, description, is_legacy, active)
VALUES
  (gen_random_uuid(), 'LEGACY_FULL', 'Plan histórico completo', 'Conserva todos los módulos para empresas anteriores al sistema de planes', true, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_legacy = EXCLUDED.is_legacy,
  active = EXCLUDED.active;

-- LEGACY_FULL conserva todos los módulos, incluidos WhatsApp y MCP.
INSERT INTO public.subscription_plan_modules (plan_id, module_code, enabled, limits)
SELECT plan.id, module.code, true, '{}'::jsonb
FROM public.subscription_plans AS plan
CROSS JOIN public.platform_modules AS module
WHERE plan.code = 'LEGACY_FULL'
  AND module.active = true
ON CONFLICT (plan_id, module_code) DO UPDATE SET
  enabled = true;

-- Solo agrega el plan a empresas que todavía no tienen suscripción.
-- Si una empresa ya tiene otro plan, esa asignación no se modifica.
INSERT INTO public.company_subscriptions (id, company_id, plan_id, status, starts_at)
SELECT gen_random_uuid(), company.id, plan.id, 'ACTIVE'::public."SubscriptionStatus", CURRENT_TIMESTAMP
FROM public.companies AS company
CROSS JOIN public.subscription_plans AS plan
WHERE plan.code = 'LEGACY_FULL'
  AND company.deleted_at IS NULL
ON CONFLICT (company_id) DO NOTHING;

COMMIT;

-- Verificación posterior: lista las empresas activas y su plan efectivo.
SELECT
  company.name AS empresa,
  company.subdomain,
  plan.code AS plan,
  subscription.status,
  COUNT(plan_module.module_code) FILTER (WHERE plan_module.enabled AND module.active) AS modulos_habilitados
FROM public.companies AS company
LEFT JOIN public.company_subscriptions AS subscription ON subscription.company_id = company.id
LEFT JOIN public.subscription_plans AS plan ON plan.id = subscription.plan_id
LEFT JOIN public.subscription_plan_modules AS plan_module ON plan_module.plan_id = plan.id
LEFT JOIN public.platform_modules AS module ON module.code = plan_module.module_code
WHERE company.deleted_at IS NULL
GROUP BY company.name, company.subdomain, plan.code, subscription.status;
