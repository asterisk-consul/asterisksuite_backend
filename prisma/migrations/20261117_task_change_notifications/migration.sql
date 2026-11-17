-- Preferencia de empresa para notificar cambios de tareas a creador, responsable y miembros.
-- Ejecutar una vez en la base central con el esquema public.
ALTER TABLE public.company_whatsapp_notification_settings
  ADD COLUMN IF NOT EXISTS task_changes_enabled BOOLEAN NOT NULL DEFAULT true;
