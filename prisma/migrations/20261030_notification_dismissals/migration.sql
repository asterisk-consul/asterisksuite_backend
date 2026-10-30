CREATE SCHEMA IF NOT EXISTS "tenant";

ALTER TABLE "tenant"."user_notifications"
  ADD COLUMN "dismissed_until" TIMESTAMP(6);

CREATE INDEX "user_notifications_recipient_dismissed_idx"
  ON "tenant"."user_notifications" ("recipient_user_id", "dismissed_until");

CREATE TABLE "tenant"."user_notification_alert_dismissals" (
  "recipient_user_id" UUID NOT NULL,
  "alert_key" VARCHAR(200) NOT NULL,
  "dismissed_until" TIMESTAMP(6) NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_notification_alert_dismissals_pkey" PRIMARY KEY ("recipient_user_id", "alert_key")
);

CREATE INDEX "user_notification_alert_dismissals_expiry_idx"
  ON "tenant"."user_notification_alert_dismissals" ("recipient_user_id", "dismissed_until");
