-- Temporizador opcional por tablero y sesión activa por usuario. Ejecutar en cada base tenant.
BEGIN;

ALTER TABLE tenant.task_boards
  ADD COLUMN IF NOT EXISTS allow_task_timer BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS tenant.task_active_timers (
  user_id UUID NOT NULL,
  task_id UUID NOT NULL,
  started_at TIMESTAMP(6),
  elapsed_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT task_active_timers_pkey PRIMARY KEY (user_id),
  CONSTRAINT task_active_timers_elapsed_seconds_check CHECK (elapsed_seconds >= 0),
  CONSTRAINT task_active_timers_task_id_fkey FOREIGN KEY (task_id)
    REFERENCES tenant.tasks(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS task_active_timers_task_idx
  ON tenant.task_active_timers(task_id);

COMMIT;
