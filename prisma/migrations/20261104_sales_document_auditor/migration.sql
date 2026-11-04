ALTER TABLE "tenant"."documents"
  ADD COLUMN IF NOT EXISTS "auditor_user_id" UUID;

CREATE INDEX IF NOT EXISTS "documents_auditor_user_id_idx"
  ON "tenant"."documents"("auditor_user_id");

ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "default_order_auditor_id" UUID;

CREATE TABLE IF NOT EXISTS "tenant"."document_activity_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "document_id" UUID NOT NULL,
  "actor_user_id" UUID,
  "event_type" VARCHAR(40) NOT NULL,
  "message" VARCHAR(500) NOT NULL,
  "from_status" SMALLINT,
  "to_status" SMALLINT,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "document_activity_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "document_activity_events_document_id_fkey"
    FOREIGN KEY ("document_id") REFERENCES "tenant"."documents"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "document_activity_document_created_idx"
  ON "tenant"."document_activity_events"("document_id", "created_at" DESC);
