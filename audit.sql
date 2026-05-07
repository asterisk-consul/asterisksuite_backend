-- DropIndex
DROP INDEX "document_sequences_point_of_sale_key";

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "business_parties" ADD COLUMN     
"exemption_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "cargo_transfer_items" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "cargo_transfers" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "corridor_stops" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "corridors" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "delivery_notes" ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "dispatch_orders" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "dispatch_rates" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_item_taxes" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_items" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_sequences" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_taxes" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "document_types" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "documents_driver" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "documents_vehicle" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "drivers" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "entity_photos" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "pallet_items" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "pallets" ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "party_contacts" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "party_locations" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "picking_items" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "picking_orders" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "picking_results" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "picking_sources" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "product_taxes" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "taxes" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "transfer_rates" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "transport_document_types" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "trip_cargo" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "trip_stop_orders" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "trip_stops" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "trip_temperature_logs" DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "vehicle_combinations" DROP COLUMN "deleted_by",
ADD COLUMN     "deleted_by" UUID,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_stock" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_stock_movements" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "warehouses" ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateTable
CREATE TABLE "document_type_taxes" (
    "id" UUID NOT NULL,
    "document_type_id" UUID NOT NULL,
    "tax_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "document_type_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_type_taxes_document_type_id_tax_id_key" ON "document_type_taxes"("document_type_id", "tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_point_of_sale_prefix_key" ON "document_sequences"("point_of_sale", "prefix");

-- AddForeignKey
ALTER TABLE "document_type_taxes" ADD CONSTRAINT "document_type_taxes_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_type_taxes" ADD CONSTRAINT "document_type_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;