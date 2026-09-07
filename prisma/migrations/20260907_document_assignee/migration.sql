ALTER TABLE "tenant"."documents" ADD COLUMN IF NOT EXISTS "assigned_to" UUID;
CREATE INDEX IF NOT EXISTS "documents_assigned_to_idx" ON "tenant"."documents"("assigned_to");
