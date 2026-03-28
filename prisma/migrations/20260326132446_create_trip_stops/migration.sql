/*
  Warnings:

  - You are about to drop the column `email` on the `business_parties` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `business_parties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business_parties" DROP COLUMN "email",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "dispatch_orders" ADD COLUMN     "corridor_id" UUID;

-- CreateTable
CREATE TABLE "trip_stops" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "stop_order" INTEGER NOT NULL,
    "stop_type" VARCHAR(20),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_stop_orders" (
    "id" UUID NOT NULL,
    "trip_stop_id" UUID NOT NULL,
    "dispatch_order_id" UUID NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_stop_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trip_stops_trip_id_idx" ON "trip_stops"("trip_id");

-- CreateIndex
CREATE INDEX "trip_stop_orders_trip_stop_id_idx" ON "trip_stop_orders"("trip_stop_id");

-- CreateIndex
CREATE INDEX "trip_stop_orders_dispatch_order_id_idx" ON "trip_stop_orders"("dispatch_order_id");

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_corridor_id_fkey" FOREIGN KEY ("corridor_id") REFERENCES "corridors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stop_orders" ADD CONSTRAINT "trip_stop_orders_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stop_orders" ADD CONSTRAINT "trip_stop_orders_dispatch_order_id_fkey" FOREIGN KEY ("dispatch_order_id") REFERENCES "dispatch_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
