/*
  Warnings:

  - You are about to drop the column `companiesId` on the `business_parties` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `delivery_notes` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `dispatch_orders` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `document_sequences` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `pallets` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `taxes` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `transfer_rates` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `vehicle_combinations` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `companiesId` on the `warehouses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "business_parties" DROP CONSTRAINT "business_parties_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "delivery_notes" DROP CONSTRAINT "delivery_notes_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_orders" DROP CONSTRAINT "dispatch_orders_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "document_sequences" DROP CONSTRAINT "document_sequences_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "pallets" DROP CONSTRAINT "pallets_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "picking_orders" DROP CONSTRAINT "picking_orders_client_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "taxes" DROP CONSTRAINT "taxes_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "transfer_rates" DROP CONSTRAINT "transfer_rates_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_combinations" DROP CONSTRAINT "vehicle_combinations_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_companiesId_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_companiesId_fkey";

-- AlterTable
ALTER TABLE "business_parties" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "delivery_notes" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "dispatch_orders" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "document_sequences" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "pallets" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "taxes" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "transfer_rates" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "vehicle_combinations" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "companiesId";

-- AlterTable
ALTER TABLE "warehouses" DROP COLUMN "companiesId";
