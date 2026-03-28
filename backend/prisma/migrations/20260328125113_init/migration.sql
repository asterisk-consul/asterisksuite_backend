/*
  Warnings:

  - You are about to drop the column `dispatch_order_id` on the `trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_dispatch_order_id_fkey";

-- DropIndex
DROP INDEX "idx_trips_dispatch_order_id";

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "dispatch_order_id",
ADD COLUMN     "dispatch_ordersId" UUID;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_dispatch_ordersId_fkey" FOREIGN KEY ("dispatch_ordersId") REFERENCES "dispatch_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
