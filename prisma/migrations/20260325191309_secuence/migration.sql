/*
  Warnings:

  - Added the required column `name` to the `document_sequences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_sequences" ADD COLUMN     "automatic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" VARCHAR(50) NOT NULL,
ADD COLUMN     "range" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "range_end" INTEGER,
ADD COLUMN     "range_start" INTEGER;
