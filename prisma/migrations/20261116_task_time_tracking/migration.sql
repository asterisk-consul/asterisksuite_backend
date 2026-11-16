-- Registro manual de tiempo por tarea. Ejecutar en cada base tenant.
BEGIN;

ALTER TABLE tenant.task_boards
  ADD COLUMN IF NOT EXISTS require_work_log_on_transition BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS tenant.task_work_logs (
  id UUID NOT NULL,
  task_id UUID NOT NULL,
  user_id UUID NOT NULL,
  minutes INTEGER NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT task_work_logs_pkey PRIMARY KEY (id),
  CONSTRAINT task_work_logs_minutes_check CHECK (minutes > 0)
);

CREATE INDEX IF NOT EXISTS task_work_logs_task_created_idx
  ON tenant.task_work_logs(task_id, created_at DESC);
CREATE INDEX IF NOT EXISTS task_work_logs_user_created_idx
  ON tenant.task_work_logs(user_id, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'task_work_logs_task_id_fkey'
      AND conrelid = 'tenant.task_work_logs'::regclass
  ) THEN
    ALTER TABLE tenant.task_work_logs
      ADD CONSTRAINT task_work_logs_task_id_fkey
      FOREIGN KEY (task_id) REFERENCES tenant.tasks(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
