-- DropForeignKey
ALTER TABLE "document_sequences" DROP CONSTRAINT "document_sequences_company_id_fkey";

-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "affects_tax_book" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "document_sequences" ADD CONSTRAINT "document_sequences_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
