/*
  Warnings:

  - You are about to drop the column `document_type` on the `document_sequences` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company_id,point_of_sale]` on the table `document_sequences` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "document_sequences_company_id_document_type_point_of_sale_key";

-- AlterTable
ALTER TABLE "document_sequences" DROP COLUMN "document_type";

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_company_id_point_of_sale_key" ON "document_sequences"("company_id", "point_of_sale");
