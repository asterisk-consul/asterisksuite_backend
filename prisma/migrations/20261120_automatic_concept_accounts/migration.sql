ALTER TABLE "tenant"."bank_concepts"
ADD COLUMN "automatic_all_accounts" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "tenant"."_AutomaticConceptAccounts" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  CONSTRAINT "_AutomaticConceptAccounts_AB_pkey" PRIMARY KEY ("A", "B")
);
CREATE INDEX "_AutomaticConceptAccounts_B_index" ON "tenant"."_AutomaticConceptAccounts"("B");
ALTER TABLE "tenant"."_AutomaticConceptAccounts" ADD CONSTRAINT "_AutomaticConceptAccounts_A_fkey"
FOREIGN KEY ("A") REFERENCES "tenant"."bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant"."_AutomaticConceptAccounts" ADD CONSTRAINT "_AutomaticConceptAccounts_B_fkey"
FOREIGN KEY ("B") REFERENCES "tenant"."bank_concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
