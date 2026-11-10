-- Tableros de tareas de la empresa (aislados en el schema tenant).
CREATE TYPE "tenant"."TaskPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

CREATE TABLE "tenant"."task_boards" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "party_id" UUID,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_by" UUID,
    "updated_by" UUID,
    CONSTRAINT "task_boards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant"."task_board_columns" (
    "id" UUID NOT NULL,
    "board_id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "color" VARCHAR(20),
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_by" UUID,
    "updated_by" UUID,
    CONSTRAINT "task_board_columns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant"."tasks" (
    "id" UUID NOT NULL,
    "board_id" UUID NOT NULL,
    "column_id" UUID NOT NULL,
    "party_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "priority" "tenant"."TaskPriority" NOT NULL DEFAULT 'NORMAL',
    "assigned_to" UUID,
    "due_at" TIMESTAMP(6),
    "position" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_by" UUID,
    "updated_by" UUID,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant"."task_labels" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) NOT NULL DEFAULT 'primary',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_by" UUID,
    CONSTRAINT "task_labels_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant"."task_label_assignments" (
    "task_id" UUID NOT NULL,
    "label_id" UUID NOT NULL,
    CONSTRAINT "task_label_assignments_pkey" PRIMARY KEY ("task_id", "label_id")
);

CREATE TABLE "tenant"."task_comments" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "content" VARCHAR(5000) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant"."task_board_column_preferences" (
    "column_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_watching" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(6) NOT NULL,
    CONSTRAINT "task_board_column_preferences_pkey" PRIMARY KEY ("column_id", "user_id")
);

CREATE INDEX "task_boards_active_deleted_at_idx" ON "tenant"."task_boards"("active", "deleted_at");
CREATE INDEX "task_boards_party_id_active_deleted_at_idx" ON "tenant"."task_boards"("party_id", "active", "deleted_at");
CREATE INDEX "task_board_columns_board_id_position_idx" ON "tenant"."task_board_columns"("board_id", "position");
CREATE INDEX "tasks_board_id_column_id_position_idx" ON "tenant"."tasks"("board_id", "column_id", "position");
CREATE INDEX "tasks_party_id_due_at_idx" ON "tenant"."tasks"("party_id", "due_at");
CREATE INDEX "tasks_assigned_to_due_at_idx" ON "tenant"."tasks"("assigned_to", "due_at");
CREATE INDEX "tasks_deleted_at_updated_at_idx" ON "tenant"."tasks"("deleted_at", "updated_at");
CREATE UNIQUE INDEX "task_labels_name_key" ON "tenant"."task_labels"("name");
CREATE INDEX "task_labels_active_name_idx" ON "tenant"."task_labels"("active", "name");
CREATE INDEX "task_label_assignments_label_id_task_id_idx" ON "tenant"."task_label_assignments"("label_id", "task_id");
CREATE INDEX "task_comments_task_id_created_at_idx" ON "tenant"."task_comments"("task_id", "created_at");
CREATE INDEX "task_board_column_preferences_user_id_is_pinned_idx" ON "tenant"."task_board_column_preferences"("user_id", "is_pinned");

ALTER TABLE "tenant"."task_board_columns"
  ADD CONSTRAINT "task_board_columns_board_id_fkey"
  FOREIGN KEY ("board_id") REFERENCES "tenant"."task_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant"."task_boards"
  ADD CONSTRAINT "task_boards_party_id_fkey"
  FOREIGN KEY ("party_id") REFERENCES "tenant"."business_parties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tenant"."tasks"
  ADD CONSTRAINT "tasks_board_id_fkey"
  FOREIGN KEY ("board_id") REFERENCES "tenant"."task_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant"."tasks"
  ADD CONSTRAINT "tasks_column_id_fkey"
  FOREIGN KEY ("column_id") REFERENCES "tenant"."task_board_columns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenant"."tasks"
  ADD CONSTRAINT "tasks_party_id_fkey"
  FOREIGN KEY ("party_id") REFERENCES "tenant"."business_parties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tenant"."task_label_assignments"
  ADD CONSTRAINT "task_label_assignments_task_id_fkey"
  FOREIGN KEY ("task_id") REFERENCES "tenant"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant"."task_label_assignments"
  ADD CONSTRAINT "task_label_assignments_label_id_fkey"
  FOREIGN KEY ("label_id") REFERENCES "tenant"."task_labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant"."task_comments"
  ADD CONSTRAINT "task_comments_task_id_fkey"
  FOREIGN KEY ("task_id") REFERENCES "tenant"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant"."task_board_column_preferences"
  ADD CONSTRAINT "task_board_column_preferences_column_id_fkey"
  FOREIGN KEY ("column_id") REFERENCES "tenant"."task_board_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
