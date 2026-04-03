/*
  Warnings:

  - You are about to drop the column `corridor_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `destination_location_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `destination_warehouse_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `dispatch_ordersId` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `origin_location_id` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `origin_warehouse_id` on the `trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_corridor_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_destination_location_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_destination_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_dispatch_ordersId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_origin_location_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_origin_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "corridor_id",
DROP COLUMN "destination_location_id",
DROP COLUMN "destination_warehouse_id",
DROP COLUMN "dispatch_ordersId",
DROP COLUMN "origin_location_id",
DROP COLUMN "origin_warehouse_id";
