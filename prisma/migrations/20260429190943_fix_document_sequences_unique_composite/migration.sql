/*
  Warnings:

  - A unique constraint covering the columns `[point_of_sale,prefix]` on the table `document_sequences` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "document_sequences_point_of_sale_key";

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_point_of_sale_prefix_key" ON "document_sequences"("point_of_sale", "prefix");
