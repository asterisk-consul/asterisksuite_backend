/*
  Warnings:

  - You are about to drop the column `company_id` on the `dispatch_orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_number]` on the table `dispatch_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "dispatch_orders" DROP CONSTRAINT "dispatch_orders_company_id_fkey";

-- DropIndex
DROP INDEX "dispatch_orders_company_id_order_number_key";

-- DropIndex
DROP INDEX "idx_dispatch_orders_company_id";

-- AlterTable
ALTER TABLE "dispatch_orders" DROP COLUMN "company_id",
ADD COLUMN     "companiesId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "dispatch_orders_order_number_key" ON "dispatch_orders"("order_number");

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
