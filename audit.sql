-- DropIndex
DROP INDEX "document_sequences_point_of_sale_key";

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "business_parties" ADD COLUMN     
"exemption_rate" DECIMAL(5,2) NOT NULL DEFAULT 0;


-- CreateTable
CREATE TABLE "document_type_taxes" (
    "id" UUID NOT NULL,
    "document_type_id" UUID NOT NULL,
    "tax_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "document_type_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_type_taxes_document_type_id_tax_id_key" ON "document_type_taxes"("document_type_id", "tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_point_of_sale_prefix_key" ON "document_sequences"("point_of_sale", "prefix");

-- AddForeignKey
ALTER TABLE "document_type_taxes" ADD CONSTRAINT "document_type_taxes_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_type_taxes" ADD CONSTRAINT "document_type_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;