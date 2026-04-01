/*
  Warnings:

  - You are about to drop the column `business_party_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `destination_party_location_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `origin_party_location_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the `trip_rates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trip_rates" DROP CONSTRAINT "trip_rates_rate_id_fkey";

-- DropForeignKey
ALTER TABLE "trip_rates" DROP CONSTRAINT "trip_rates_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_business_party_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_destination_party_location_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_origin_party_location_id_fkey";

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "business_party_id",
DROP COLUMN "destination_party_location_id",
DROP COLUMN "origin_party_location_id";

-- DropTable
DROP TABLE "trip_rates";

-- CreateTable
CREATE TABLE "dispatch_rates" (
    "id" UUID NOT NULL,
    "dispatch_id" UUID NOT NULL,
    "rate_id" UUID NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispatch_rates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dispatch_rates" ADD CONSTRAINT "dispatch_rates_dispatch_id_fkey" FOREIGN KEY ("dispatch_id") REFERENCES "dispatch_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_rates" ADD CONSTRAINT "dispatch_rates_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "transfer_rates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
