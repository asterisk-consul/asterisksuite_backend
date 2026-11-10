-- CRM/Tareas: catalogo global y preferencias de notificacion por empresa.
-- Ejecutar en la base central que mantiene el schema public.

BEGIN;

ALTER TABLE public.company_whatsapp_notification_settings
  ADD COLUMN IF NOT EXISTS tasks_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.company_whatsapp_notification_settings
  ADD COLUMN IF NOT EXISTS in_app_tasks_enabled BOOLEAN NOT NULL DEFAULT true;

INSERT INTO public.platform_modules
  (code, name, description, icon, sort_order, is_core, dependencies, active)
VALUES
  ('CRM', 'CRM y tareas', 'Seguimiento de clientes y organización del trabajo en tableros', 'i-lucide-kanban-square', 150, false, '["CORE","MASTER_DATA"]'::jsonb, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_core = EXCLUDED.is_core,
  dependencies = EXCLUDED.dependencies,
  active = EXCLUDED.active;

-- Las empresas históricas con LEGACY_FULL conservan acceso a Tareas.
INSERT INTO public.subscription_plan_modules (plan_id, module_code, enabled, limits)
SELECT plan.id, 'CRM', true, '{}'::jsonb
FROM public.subscription_plans AS plan
WHERE plan.code = 'LEGACY_FULL'
ON CONFLICT (plan_id, module_code) DO UPDATE SET enabled = true;

COMMIT;
