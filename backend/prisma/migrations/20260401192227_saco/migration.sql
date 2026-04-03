/*
  Warnings:

  - You are about to drop the column `corridorsId` on the `trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_corridorsId_fkey";

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "corridorsId";
