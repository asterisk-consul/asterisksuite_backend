-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "corridorsId" UUID,
ADD COLUMN     "destination_location_id" UUID,
ADD COLUMN     "destination_warehouse_id" UUID,
ADD COLUMN     "origin_location_id" UUID,
ADD COLUMN     "origin_warehouse_id" UUID;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destination_location_id_fkey" FOREIGN KEY ("destination_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destination_warehouse_id_fkey" FOREIGN KEY ("destination_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_origin_location_id_fkey" FOREIGN KEY ("origin_location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_origin_warehouse_id_fkey" FOREIGN KEY ("origin_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_corridorsId_fkey" FOREIGN KEY ("corridorsId") REFERENCES "corridors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
