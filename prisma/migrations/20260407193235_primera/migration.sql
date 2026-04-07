-- CreateEnum
CREATE TYPE "DispatchStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "business_parties" (
    "id" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tax_id" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_transfer_items" (
    "id" UUID NOT NULL,
    "transfer_id" UUID NOT NULL,
    "pallet_id" UUID,
    "delivery_note_id" UUID,
    "quantity" DECIMAL(12,3),

    CONSTRAINT "cargo_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_transfers" (
    "id" UUID NOT NULL,
    "from_trip_id" UUID,
    "to_trip_id" UUID,
    "location_id" UUID,
    "transfer_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performed_by" UUID,
    "notes" TEXT,

    CONSTRAINT "cargo_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tax_id" VARCHAR(50),
    "phone" VARCHAR(30),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_notes" (
    "id" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "party_id" UUID,
    "trip_id" UUID,
    "created_by" UUID,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatch_order_id" UUID,

    CONSTRAINT "delivery_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "document" VARCHAR(50),
    "phone" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_photos" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(30) NOT NULL,
    "entity_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "photo_type" VARCHAR(30),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "storage_provider" VARCHAR(50),
    "file_path" TEXT NOT NULL,
    "public_url" TEXT,
    "file_name" VARCHAR(255),
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "uploaded_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,6),
    "longitude" DECIMAL(10,6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pallet_items" (
    "id" UUID NOT NULL,
    "pallet_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,

    CONSTRAINT "pallet_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pallets" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "warehouse_id" UUID,
    "status" VARCHAR(20) NOT NULL,
    "created_by" UUID,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party_locations" (
    "id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "label" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "party_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party_contacts" (
    "id" UUID NOT NULL,
    "party_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100),
    "phone" VARCHAR(50),
    "email" VARCHAR(150),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "party_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picking_items" (
    "id" UUID NOT NULL,
    "picking_order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity_required" DECIMAL(12,3) NOT NULL,
    "quantity_picked" DECIMAL(12,3) DEFAULT 0,

    CONSTRAINT "picking_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picking_orders" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "client_id" UUID,
    "status" VARCHAR(20) NOT NULL,
    "delivery_note_id" UUID,
    "trip_id" UUID,
    "created_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatch_order_id" UUID,

    CONSTRAINT "picking_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picking_results" (
    "id" UUID NOT NULL,
    "picking_order_id" UUID NOT NULL,
    "pallet_id" UUID NOT NULL,

    CONSTRAINT "picking_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picking_sources" (
    "id" UUID NOT NULL,
    "picking_item_id" UUID NOT NULL,
    "pallet_id" UUID NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,

    CONSTRAINT "picking_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100),
    "requires_refrigeration" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_cargo" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "pallet_id" UUID,
    "delivery_note_id" UUID,
    "loaded_at" TIMESTAMP(6),
    "unloaded_at" TIMESTAMP(6),

    CONSTRAINT "trip_cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_temperature_logs" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "temperature" DECIMAL(5,2) NOT NULL,
    "recorded_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorded_by" UUID,

    CONSTRAINT "trip_temperature_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatch_orders" (
    "id" UUID NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "status" "DispatchStatus" NOT NULL,
    "requires_stock" BOOLEAN NOT NULL DEFAULT false,
    "planned_date" TIMESTAMP(6),
    "confirmed_at" TIMESTAMP(6),
    "customer_id" UUID,
    "origin_location_id" UUID,
    "destination_location_id" UUID,
    "corridor_id" UUID,
    "created_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispatch_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "reference_number" VARCHAR(100),
    "week" VARCHAR(10),
    "vehicle_combination_id" UUID,
    "origin_warehouse_id" UUID,
    "destination_warehouse_id" UUID,
    "origin_location_id" UUID,
    "destination_location_id" UUID,
    "departure_time" TIMESTAMP(6),
    "arrival_time" TIMESTAMP(6),
    "status" "TripStatus" NOT NULL,
    "notes" TEXT,
    "created_by" UUID,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kilometers" DECIMAL(10,2),

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "corridors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150),
    "description" VARCHAR(255),
    "origin_location_id" UUID NOT NULL,
    "destination_location_id" UUID NOT NULL,
    "is_template" BOOLEAN NOT NULL DEFAULT true,
    "total_distance_km" DECIMAL(10,2),
    "estimated_minutes" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corridors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corridor_stops" (
    "id" UUID NOT NULL,
    "corridor_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "stop_order" INTEGER NOT NULL,
    "stop_type" VARCHAR(30),
    "distance_km" DECIMAL(10,2),
    "estimated_minutes" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corridor_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT,
    "role" VARCHAR(30),
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "plate" VARCHAR(20) NOT NULL,
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "year" INTEGER,
    "max_weight" DECIMAL(12,3),
    "max_volume" DECIMAL(12,3),
    "refrigeration" BOOLEAN DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_combinations" (
    "id" UUID NOT NULL,
    "tractor_id" UUID NOT NULL,
    "trailer_id" UUID,
    "valid_from" TIMESTAMP(6) NOT NULL,
    "valid_until" TIMESTAMP(6),
    "created_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unit_number" VARCHAR(50),
    "driver_id" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "vehicle_combinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stock" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "reserved_quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouse_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stock_movements" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "movement_type" VARCHAR(20) NOT NULL,
    "direction" VARCHAR(3) NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "reference_type" VARCHAR(30),
    "reference_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "warehouse_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "location_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_sequences" (
    "id" UUID NOT NULL,
    "document_type" VARCHAR(50) NOT NULL,
    "point_of_sale" VARCHAR(10) NOT NULL,
    "current_number" INTEGER NOT NULL DEFAULT 0,
    "prefix" VARCHAR(20),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_document_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(20) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transport_document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_vehicle" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "document_type_id" UUID NOT NULL,
    "expiration_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_driver" (
    "id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "document_type_id" UUID NOT NULL,
    "expiration_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_rates" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "rate_type" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfer_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatch_rates" (
    "id" UUID NOT NULL,
    "dispatch_id" UUID NOT NULL,
    "rate_id" UUID NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispatch_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_item_taxes" (
    "id" UUID NOT NULL,
    "document_item_id" UUID NOT NULL,
    "tax_id" UUID NOT NULL,
    "tax_rate" DECIMAL(6,3) NOT NULL,
    "tax_amount" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_item_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document_id" UUID NOT NULL,
    "product_id" UUID,
    "quantity" DECIMAL(15,3) NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unit_price" DECIMAL(15,2) NOT NULL DEFAULT 0,

    CONSTRAINT "document_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_taxes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document_id" UUID NOT NULL,
    "tax_id" UUID NOT NULL,
    "tax_rate" DECIMAL(6,3) NOT NULL,
    "taxable_base" DECIMAL(15,2) NOT NULL,
    "tax_amount" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" UUID NOT NULL,
    "document_sequence_id" UUID,
    "code" VARCHAR(20) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "direction" SMALLINT NOT NULL,
    "affects_stock" BOOLEAN NOT NULL DEFAULT false,
    "affects_accounting" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document_type_id" UUID NOT NULL,
    "party_id" UUID,
    "number" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_taxes" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "descrip" VARCHAR(50),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_taxes" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "tax_id" UUID NOT NULL,
    "is_included_in_price" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tax_type" VARCHAR(30) NOT NULL,
    "rate" DECIMAL(6,3) NOT NULL,
    "is_percentage" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "calculation_level" VARCHAR(20) NOT NULL,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_business_parties_tax_id" ON "business_parties"("tax_id");

-- CreateIndex
CREATE INDEX "idx_entity_photos" ON "entity_photos"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "pallet_items_pallet_id_product_id_key" ON "pallet_items"("pallet_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "pallets_code_key" ON "pallets"("code");

-- CreateIndex
CREATE INDEX "idx_party_contacts_party" ON "party_contacts"("party_id");

-- CreateIndex
CREATE INDEX "idx_trip_cargo_pallet" ON "trip_cargo"("pallet_id");

-- CreateIndex
CREATE INDEX "idx_trip_cargo_trip" ON "trip_cargo"("trip_id");

-- CreateIndex
CREATE INDEX "idx_dispatch_orders_status" ON "dispatch_orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "dispatch_orders_order_number_key" ON "dispatch_orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_trips_status" ON "trips"("status");

-- CreateIndex
CREATE INDEX "idx_trips_vehicle_combination_id" ON "trips"("vehicle_combination_id");

-- CreateIndex
CREATE INDEX "trip_stops_trip_id_idx" ON "trip_stops"("trip_id");

-- CreateIndex
CREATE INDEX "trip_stop_orders_trip_stop_id_idx" ON "trip_stop_orders"("trip_stop_id");

-- CreateIndex
CREATE INDEX "trip_stop_orders_dispatch_order_id_idx" ON "trip_stop_orders"("dispatch_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "corridor_stops_corridor_id_stop_order_key" ON "corridor_stops"("corridor_id", "stop_order");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "vehicles"("plate");

-- CreateIndex
CREATE INDEX "idx_vehicle_combinations_tractor" ON "vehicle_combinations"("tractor_id");

-- CreateIndex
CREATE INDEX "idx_vehicle_combinations_trailer" ON "vehicle_combinations"("trailer_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_stock_warehouse_id_product_id_key" ON "warehouse_stock"("warehouse_id", "product_id");

-- CreateIndex
CREATE INDEX "idx_stock_movements_product" ON "warehouse_stock_movements"("product_id");

-- CreateIndex
CREATE INDEX "idx_stock_movements_ref" ON "warehouse_stock_movements"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "idx_stock_movements_warehouse" ON "warehouse_stock_movements"("warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_document_type_point_of_sale_key" ON "document_sequences"("document_type", "point_of_sale");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_token_hash" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_revoked_at" ON "refresh_tokens"("revoked_at");

-- CreateIndex
CREATE INDEX "idx_transport_document_types_entity" ON "transport_document_types"("entity");

-- CreateIndex
CREATE INDEX "idx_documents_vehicle_vehicle" ON "documents_vehicle"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_vehicle_doc" ON "documents_vehicle"("vehicle_id", "document_type_id");

-- CreateIndex
CREATE INDEX "idx_documents_driver_driver" ON "documents_driver"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_driver_doc" ON "documents_driver"("driver_id", "document_type_id");

-- CreateIndex
CREATE INDEX "idx_document_item_taxes_document_item" ON "document_item_taxes"("document_item_id");

-- CreateIndex
CREATE INDEX "idx_document_item_taxes_tax" ON "document_item_taxes"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_code_key" ON "document_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_document_number" ON "documents"("document_type_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "uq_product_tax" ON "product_taxes"("product_id", "tax_id");

-- CreateIndex
CREATE INDEX "idx_taxes_type_active" ON "taxes"("tax_type", "active");

-- AddForeignKey
ALTER TABLE "cargo_transfer_items" ADD CONSTRAINT "cargo_transfer_items_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo_transfer_items" ADD CONSTRAINT "cargo_transfer_items_pallet_id_fkey" FOREIGN KEY ("pallet_id") REFERENCES "pallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo_transfer_items" ADD CONSTRAINT "cargo_transfer_items_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "cargo_transfers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo_transfers" ADD CONSTRAINT "cargo_transfers_from_trip_id_fkey" FOREIGN KEY ("from_trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo_transfers" ADD CONSTRAINT "cargo_transfers_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo_transfers" ADD CONSTRAINT "cargo_transfers_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cargo_transfers" ADD CONSTRAINT "cargo_transfers_to_trip_id_fkey" FOREIGN KEY ("to_trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_dispatch_order_id_fkey" FOREIGN KEY ("dispatch_order_id") REFERENCES "dispatch_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "business_parties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_notes" ADD CONSTRAINT "fk_delivery_notes_trip" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entity_photos" ADD CONSTRAINT "entity_photos_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pallet_items" ADD CONSTRAINT "pallet_items_pallet_id_fkey" FOREIGN KEY ("pallet_id") REFERENCES "pallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pallet_items" ADD CONSTRAINT "pallet_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pallets" ADD CONSTRAINT "pallets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pallets" ADD CONSTRAINT "pallets_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "party_locations" ADD CONSTRAINT "party_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "party_locations" ADD CONSTRAINT "party_locations_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "business_parties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "party_contacts" ADD CONSTRAINT "party_contacts_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "business_parties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picking_items" ADD CONSTRAINT "picking_items_picking_order_id_fkey" FOREIGN KEY ("picking_order_id") REFERENCES "picking_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_items" ADD CONSTRAINT "picking_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_orders" ADD CONSTRAINT "picking_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_orders" ADD CONSTRAINT "picking_orders_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_orders" ADD CONSTRAINT "picking_orders_dispatch_order_id_fkey" FOREIGN KEY ("dispatch_order_id") REFERENCES "dispatch_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_orders" ADD CONSTRAINT "picking_orders_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_orders" ADD CONSTRAINT "picking_orders_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_results" ADD CONSTRAINT "picking_results_pallet_id_fkey" FOREIGN KEY ("pallet_id") REFERENCES "pallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_results" ADD CONSTRAINT "picking_results_picking_order_id_fkey" FOREIGN KEY ("picking_order_id") REFERENCES "picking_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_sources" ADD CONSTRAINT "picking_sources_pallet_id_fkey" FOREIGN KEY ("pallet_id") REFERENCES "pallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picking_sources" ADD CONSTRAINT "picking_sources_picking_item_id_fkey" FOREIGN KEY ("picking_item_id") REFERENCES "picking_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_cargo" ADD CONSTRAINT "trip_cargo_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_cargo" ADD CONSTRAINT "trip_cargo_pallet_id_fkey" FOREIGN KEY ("pallet_id") REFERENCES "pallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_cargo" ADD CONSTRAINT "trip_cargo_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_temperature_logs" ADD CONSTRAINT "trip_temperature_logs_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_temperature_logs" ADD CONSTRAINT "trip_temperature_logs_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "business_parties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_destination_location_id_fkey" FOREIGN KEY ("destination_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_origin_location_id_fkey" FOREIGN KEY ("origin_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dispatch_orders" ADD CONSTRAINT "dispatch_orders_corridor_id_fkey" FOREIGN KEY ("corridor_id") REFERENCES "corridors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destination_location_id_fkey" FOREIGN KEY ("destination_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destination_warehouse_id_fkey" FOREIGN KEY ("destination_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_origin_location_id_fkey" FOREIGN KEY ("origin_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_origin_warehouse_id_fkey" FOREIGN KEY ("origin_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_combination_id_fkey" FOREIGN KEY ("vehicle_combination_id") REFERENCES "vehicle_combinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stop_orders" ADD CONSTRAINT "trip_stop_orders_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stop_orders" ADD CONSTRAINT "trip_stop_orders_dispatch_order_id_fkey" FOREIGN KEY ("dispatch_order_id") REFERENCES "dispatch_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corridors" ADD CONSTRAINT "corridors_origin_location_id_fkey" FOREIGN KEY ("origin_location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corridors" ADD CONSTRAINT "corridors_destination_location_id_fkey" FOREIGN KEY ("destination_location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corridor_stops" ADD CONSTRAINT "corridor_stops_corridor_id_fkey" FOREIGN KEY ("corridor_id") REFERENCES "corridors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corridor_stops" ADD CONSTRAINT "corridor_stops_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_combinations" ADD CONSTRAINT "fk_vehicle_comb_driver" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_combinations" ADD CONSTRAINT "vehicle_combinations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_combinations" ADD CONSTRAINT "vehicle_combinations_tractor_id_fkey" FOREIGN KEY ("tractor_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_combinations" ADD CONSTRAINT "vehicle_combinations_trailer_id_fkey" FOREIGN KEY ("trailer_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_stock" ADD CONSTRAINT "warehouse_stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_stock" ADD CONSTRAINT "warehouse_stock_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_stock_movements" ADD CONSTRAINT "warehouse_stock_movements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_stock_movements" ADD CONSTRAINT "warehouse_stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_stock_movements" ADD CONSTRAINT "warehouse_stock_movements_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents_vehicle" ADD CONSTRAINT "fk_vehicle" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents_vehicle" ADD CONSTRAINT "fk_vehicle_doc_type" FOREIGN KEY ("document_type_id") REFERENCES "transport_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents_driver" ADD CONSTRAINT "fk_driver" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents_driver" ADD CONSTRAINT "fk_driver_doc_type" FOREIGN KEY ("document_type_id") REFERENCES "transport_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dispatch_rates" ADD CONSTRAINT "dispatch_rates_dispatch_id_fkey" FOREIGN KEY ("dispatch_id") REFERENCES "dispatch_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_rates" ADD CONSTRAINT "dispatch_rates_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "transfer_rates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_item_taxes" ADD CONSTRAINT "dit_document_item_fkey" FOREIGN KEY ("document_item_id") REFERENCES "document_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_item_taxes" ADD CONSTRAINT "dit_tax_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_items" ADD CONSTRAINT "document_items_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_taxes" ADD CONSTRAINT "document_taxes_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_taxes" ADD CONSTRAINT "document_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_document_sequence_id_fkey" FOREIGN KEY ("document_sequence_id") REFERENCES "document_sequences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "business_parties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_taxes" ADD CONSTRAINT "product_taxes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_taxes" ADD CONSTRAINT "product_taxes_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
