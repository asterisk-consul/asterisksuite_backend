/*
  Warnings:

  - Added the required column `updated_at` to the `document_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;
