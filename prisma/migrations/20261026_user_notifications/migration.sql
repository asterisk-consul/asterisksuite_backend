CREATE SCHEMA IF NOT EXISTS "tenant";

CREATE TABLE IF NOT EXISTS "tenant"."user_notifications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "recipient_user_id" UUID NOT NULL,
  "actor_user_id" UUID,
  "type" VARCHAR(50) NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "message" VARCHAR(500) NOT NULL,
  "target_path" VARCHAR(500),
  "target_type" VARCHAR(60),
  "target_id" UUID,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read_at" TIMESTAMP(6),
  CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "user_notifications_recipient_created_idx"
  ON "tenant"."user_notifications" ("recipient_user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "user_notifications_recipient_read_idx"
  ON "tenant"."user_notifications" ("recipient_user_id", "read_at");

CREATE INDEX IF NOT EXISTS "treasury_obligations_status_due_date_idx"
  ON "tenant"."treasury_obligations" ("status", "due_date");
