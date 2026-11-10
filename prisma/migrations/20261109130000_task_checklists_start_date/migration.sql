ALTER TABLE "tenant"."tasks"
ADD COLUMN "start_at" TIMESTAMP(6);

CREATE TABLE "tenant"."task_checklists" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_by" UUID,
    CONSTRAINT "task_checklists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tenant"."task_checklist_items" (
    "id" UUID NOT NULL,
    "checklist_id" UUID NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "assigned_to" UUID,
    "due_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    CONSTRAINT "task_checklist_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "task_checklists_task_id_position_idx" ON "tenant"."task_checklists"("task_id", "position");
CREATE INDEX "task_checklist_items_checklist_id_position_idx" ON "tenant"."task_checklist_items"("checklist_id", "position");
CREATE INDEX "task_checklist_items_assigned_to_due_at_idx" ON "tenant"."task_checklist_items"("assigned_to", "due_at");

ALTER TABLE "tenant"."task_checklists"
ADD CONSTRAINT "task_checklists_task_id_fkey"
FOREIGN KEY ("task_id") REFERENCES "tenant"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tenant"."task_checklist_items"
ADD CONSTRAINT "task_checklist_items_checklist_id_fkey"
FOREIGN KEY ("checklist_id") REFERENCES "tenant"."task_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
