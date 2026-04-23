-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "business_parties" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "corridor_stops" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "corridors" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "delivery_notes" ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dispatch_orders" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "dispatch_rates" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "document_item_taxes" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_items" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "document_sequences" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "document_taxes" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "documents_driver" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "documents_vehicle" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "entity_photos" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "pallets" ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "party_contacts" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "party_locations" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "picking_orders" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "product_taxes" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "active" BOOLEAN DEFAULT true,
ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "taxes" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "transfer_rates" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "transport_document_types" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "trip_stop_orders" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "trip_stops" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "vehicle_combinations" ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID,
DROP COLUMN "deleted_by",
ADD COLUMN     "deleted_by" UUID;

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "warehouse_stock" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_by" UUID,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "warehouse_stock_movements" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "updated_by" UUID;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" VARCHAR(100) NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "changed_by" UUID,
    "changed_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(50),
    "request_id" VARCHAR(100),
    "action" "AuditAction" NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_table_name_record_id_idx" ON "audit_logs"("table_name", "record_id");

-- CreateIndex
CREATE INDEX "audit_logs_changed_by_idx" ON "audit_logs"("changed_by");

-- CreateIndex
CREATE INDEX "audit_logs_changed_at_idx" ON "audit_logs"("changed_at");

-- CreateIndex
CREATE INDEX "audit_logs_table_name_changed_at_idx" ON "audit_logs"("table_name", "changed_at" DESC);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

