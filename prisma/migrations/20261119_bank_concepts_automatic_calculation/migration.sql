ALTER TABLE "tenant"."bank_concepts"
  ADD COLUMN "automatic_calculation" BOOLEAN NOT NULL DEFAULT false;

-- Preserve the existing automatic behavior for the seeded bank tax. Runtime
-- behavior no longer depends on this editable code value.
UPDATE "tenant"."bank_concepts"
SET "automatic_calculation" = true
WHERE "code" = 'IMP_DEBITOS'
  AND "default_percentage" IS NOT NULL;
