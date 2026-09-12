INSERT INTO tenant.permissions (id, code, description, active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'intake.read', 'Ver menú y bandeja de capturas', true, now(), now()),
  (gen_random_uuid(), 'intake.create', 'Crear capturas en borrador', true, now(), now()),
  (gen_random_uuid(), 'intake.upload', 'Adjuntar imágenes o PDF a capturas', true, now(), now()),
  (gen_random_uuid(), 'intake.send', 'Enviar capturas a otro usuario', true, now(), now()),
  (gen_random_uuid(), 'intake.delete', 'Eliminar capturas propias en borrador', true, now(), now()),
  (gen_random_uuid(), 'intake.process', 'Procesar capturas asignadas', true, now(), now())
ON CONFLICT (code) DO UPDATE
SET description = EXCLUDED.description, active = true, updated_at = now();

INSERT INTO tenant.business_roles (id, code, name, description, is_system, active, created_at, updated_at)
VALUES (
  gen_random_uuid(), 'capturist', 'Capturista',
  'Carga y envía imágenes o PDF sin acceso al resto de Tesorería', true, true, now(), now()
)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, active = true, updated_at = now();

-- Administrador, gerente y usuario conservan el flujo completo de capturas.
INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT role.id, permission.id
FROM tenant.business_roles role
CROSS JOIN tenant.permissions permission
WHERE role.code IN ('admin', 'manager', 'user')
  AND permission.code LIKE 'intake.%'
ON CONFLICT DO NOTHING;

-- El observador únicamente puede consultar la bandeja.
INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT role.id, permission.id
FROM tenant.business_roles role
JOIN tenant.permissions permission ON permission.code = 'intake.read'
WHERE role.code = 'viewer'
ON CONFLICT DO NOTHING;

-- El capturista ve solo esta opción de Tesorería, carga archivos y puede enviarlos.
INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT role.id, permission.id
FROM tenant.business_roles role
JOIN tenant.permissions permission
  ON permission.code IN ('intake.read', 'intake.create', 'intake.upload', 'intake.send', 'intake.delete')
WHERE role.code = 'capturist'
ON CONFLICT DO NOTHING;
