-- Clasificación configurable para tareas. Ejecutar en cada base tenant con el módulo CRM y Tareas.
BEGIN;

CREATE TABLE IF NOT EXISTS tenant.task_categories (
  id UUID NOT NULL,
  name VARCHAR(60) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT 'neutral',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL,
  created_by UUID,
  CONSTRAINT task_categories_pkey PRIMARY KEY (id)
);

ALTER TABLE tenant.tasks
  ADD COLUMN IF NOT EXISTS category_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS task_categories_name_key
  ON tenant.task_categories(name);
CREATE INDEX IF NOT EXISTS task_categories_active_name_idx
  ON tenant.task_categories(active, name);
CREATE INDEX IF NOT EXISTS tasks_category_id_updated_at_idx
  ON tenant.tasks(category_id, updated_at);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tasks_category_id_fkey'
      AND conrelid = 'tenant.tasks'::regclass
  ) THEN
    ALTER TABLE tenant.tasks
      ADD CONSTRAINT tasks_category_id_fkey
      FOREIGN KEY (category_id) REFERENCES tenant.task_categories(id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
