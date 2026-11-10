-- Participantes múltiples por tarea. Ejecutar en cada base tenant que tenga el módulo Tareas.
BEGIN;

CREATE TABLE IF NOT EXISTS tenant.task_members (
  task_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'COLLABORATOR',
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  CONSTRAINT task_members_pkey PRIMARY KEY (task_id, user_id),
  CONSTRAINT task_members_role_check CHECK (role IN ('COLLABORATOR', 'REVIEWER', 'OBSERVER'))
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'task_members_task_id_fkey'
      AND conrelid = 'tenant.task_members'::regclass
  ) THEN
    ALTER TABLE tenant.task_members
      ADD CONSTRAINT task_members_task_id_fkey
      FOREIGN KEY (task_id) REFERENCES tenant.tasks(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS task_members_user_id_task_id_idx
  ON tenant.task_members(user_id, task_id);

COMMIT;
