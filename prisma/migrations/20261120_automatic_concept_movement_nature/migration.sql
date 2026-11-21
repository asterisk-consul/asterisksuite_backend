ALTER TABLE "tenant"."bank_concepts"
ADD COLUMN "automatic_movement_nature" VARCHAR(6) NOT NULL DEFAULT 'BOTH';
ALTER TABLE "tenant"."bank_concepts"
ADD CONSTRAINT "bank_concepts_automatic_movement_nature_check"
CHECK ("automatic_movement_nature" IN ('BOTH', 'DEBIT', 'CREDIT'));
