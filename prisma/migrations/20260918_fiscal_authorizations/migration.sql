CREATE TABLE "tenant"."fiscal_authorizations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "authorization_type" VARCHAR(10) NOT NULL DEFAULT 'CAI',
  "code" VARCHAR(50) NOT NULL,
  "document_type_id" UUID NOT NULL,
  "document_sequence_id" UUID NOT NULL,
  "valid_from" DATE NOT NULL,
  "valid_to" DATE NOT NULL,
  "range_from" INTEGER NOT NULL,
  "range_to" INTEGER NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  "replacement_date" DATE,
  "observations" TEXT,
  "attachment_file_id" UUID,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6),
  "deleted_at" TIMESTAMP(3),
  "created_by" UUID,
  "updated_by" UUID,
  "deleted_by" UUID,
  CONSTRAINT "fiscal_authorizations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fiscal_authorizations_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "tenant"."document_types"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT "fiscal_authorizations_document_sequence_id_fkey" FOREIGN KEY ("document_sequence_id") REFERENCES "tenant"."document_sequences"("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "fiscal_authorizations_type_code_type_sequence_key"
  ON "tenant"."fiscal_authorizations"("authorization_type", "code", "document_type_id", "document_sequence_id");
CREATE INDEX "fiscal_authorizations_lookup_idx"
  ON "tenant"."fiscal_authorizations"("document_type_id", "document_sequence_id", "valid_from", "valid_to");

CREATE TABLE "tenant"."fiscal_authorization_settings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "settings_key" VARCHAR(30) NOT NULL DEFAULT 'default',
  "alerts_enabled" BOOLEAN NOT NULL DEFAULT true,
  "day_thresholds" JSONB NOT NULL DEFAULT '[30,15,7,3,1]'::jsonb,
  "number_thresholds" JSONB NOT NULL DEFAULT '[100,50,20,10]'::jsonb,
  "expired_policy" VARCHAR(20) NOT NULL DEFAULT 'BLOCK',
  "missing_policy" VARCHAR(20) NOT NULL DEFAULT 'BLOCK',
  "daily_after_expiration" BOOLEAN NOT NULL DEFAULT false,
  "notify_roles" JSONB,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6),
  "updated_by" UUID,
  CONSTRAINT "fiscal_authorization_settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "fiscal_authorization_settings_settings_key_key"
  ON "tenant"."fiscal_authorization_settings"("settings_key");

CREATE TABLE "tenant"."fiscal_authorization_alerts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "fiscal_authorization_id" UUID NOT NULL,
  "alert_key" VARCHAR(80) NOT NULL,
  "severity" VARCHAR(20) NOT NULL DEFAULT 'WARNING',
  "title" VARCHAR(180) NOT NULL,
  "message" TEXT NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read_at" TIMESTAMP(6),
  CONSTRAINT "fiscal_authorization_alerts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fiscal_authorization_alerts_authorization_fkey" FOREIGN KEY ("fiscal_authorization_id") REFERENCES "tenant"."fiscal_authorizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "fiscal_authorization_alerts_authorization_key_key"
  ON "tenant"."fiscal_authorization_alerts"("fiscal_authorization_id", "alert_key");
CREATE INDEX "fiscal_authorization_alerts_unread_created_idx"
  ON "tenant"."fiscal_authorization_alerts"("is_read", "created_at");

ALTER TABLE "tenant"."documents"
  ADD COLUMN "fiscal_authorization_id" UUID,
  ADD COLUMN "fiscal_authorization_type" VARCHAR(10),
  ADD COLUMN "fiscal_authorization_code" VARCHAR(50),
  ADD COLUMN "fiscal_authorization_expires_at" DATE,
  ADD COLUMN "fiscal_authorization_range_from" INTEGER,
  ADD COLUMN "fiscal_authorization_range_to" INTEGER;

ALTER TABLE "tenant"."documents"
  ADD CONSTRAINT "documents_fiscal_authorization_id_fkey"
  FOREIGN KEY ("fiscal_authorization_id") REFERENCES "tenant"."fiscal_authorizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

INSERT INTO "tenant"."fiscal_authorization_settings" ("settings_key")
VALUES ('default') ON CONFLICT ("settings_key") DO NOTHING;
