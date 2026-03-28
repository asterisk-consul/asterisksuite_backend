/*
  Warnings:

  - You are about to drop the column `company_id` on the `business_parties` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `corridors` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `delivery_notes` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `document_sequences` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `pallets` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `taxes` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `transfer_rates` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `vehicle_combinations` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `warehouses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document_type,point_of_sale]` on the table `document_sequences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `warehouses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "business_parties" DROP CONSTRAINT "business_parties_company_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_notes" DROP CONSTRAINT "delivery_notes_company_id_fkey";

-- DropForeignKey
ALTER TABLE "document_sequences" DROP CONSTRAINT "document_sequences_company_id_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_company_id_fkey";

-- DropForeignKey
ALTER TABLE "pallets" DROP CONSTRAINT "pallets_company_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_company_id_fkey";

-- DropForeignKey
ALTER TABLE "taxes" DROP CONSTRAINT "taxes_company_id_fkey";

-- DropForeignKey
ALTER TABLE "transfer_rates" DROP CONSTRAINT "transfer_rates_company_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_company_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_company_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_combinations" DROP CONSTRAINT "vehicle_combinations_company_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_company_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_company_id_fkey";

-- DropIndex
DROP INDEX "idx_parties_company";

-- DropIndex
DROP INDEX "corridors_company_id_name_key";

-- DropIndex
DROP INDEX "document_sequences_company_id_document_type_point_of_sale_key";

-- DropIndex
DROP INDEX "idx_trips_company";

-- DropIndex
DROP INDEX "idx_vehicle_combinations_company_id";

-- DropIndex
DROP INDEX "idx_vehicles_company";

-- DropIndex
DROP INDEX "warehouses_company_id_code_key";

-- AlterTable
ALTER TABLE "business_parties" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "corridors" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "delivery_notes" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "document_sequences" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "pallets" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "taxes" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "transfer_rates" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "vehicle_combinations" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- AlterTable
ALTER TABLE "warehouses" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_document_type_point_of_sale_key" ON "document_sequences"("document_type", "point_of_sale");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- AddForeignKey
ALTER TABLE "business_parties" ADD CONSTRAINT "business_parties_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pallets" ADD CONSTRAINT "pallets_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_combinations" ADD CONSTRAINT "vehicle_combinations_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_sequences" ADD CONSTRAINT "document_sequences_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_rates" ADD CONSTRAINT "transfer_rates_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes" ADD CONSTRAINT "taxes_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
