INSERT INTO public.platform_modules (code, name, description, icon, sort_order, is_core, dependencies, active)
VALUES
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

-- Las empresas históricas siguen con acceso completo al agregar módulos nuevos.
INSERT INTO public.subscription_plan_modules (plan_id, module_code, enabled, limits)
SELECT plan.id, module.code, true, '{}'::jsonb
FROM public.subscription_plans plan
CROSS JOIN public.platform_modules module
WHERE plan.code = 'LEGACY_FULL'
  AND module.code IN ('WHATSAPP', 'MCP')
ON CONFLICT (plan_id, module_code) DO UPDATE SET enabled = true;

-- Cubre empresas creadas entre la migración inicial y esta ampliación.
INSERT INTO public.company_subscriptions (company_id, plan_id, status, starts_at)
SELECT company.id, plan.id, 'ACTIVE'::public."SubscriptionStatus", CURRENT_TIMESTAMP
FROM public.companies company
CROSS JOIN public.subscription_plans plan
WHERE plan.code = 'LEGACY_FULL'
  AND company.deleted_at IS NULL
ON CONFLICT (company_id) DO NOTHING;
