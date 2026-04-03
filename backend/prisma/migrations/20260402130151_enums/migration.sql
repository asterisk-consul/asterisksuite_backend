-- Crear los enums
CREATE TYPE "DispatchStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TripStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DispatchOrders: agregar columna temporal
ALTER TABLE "dispatch_orders" ADD COLUMN "status_new" "DispatchStatus";

-- Copiar datos (ajustá si los valores actuales en BD son distintos)
UPDATE "dispatch_orders" SET "status_new" = status::text::"DispatchStatus";

-- Reemplazar columna
ALTER TABLE "dispatch_orders" DROP COLUMN "status";
ALTER TABLE "dispatch_orders" RENAME COLUMN "status_new" TO "status";

-- Hacer la columna NOT NULL
ALTER TABLE "dispatch_orders" ALTER COLUMN "status" SET NOT NULL;


-- Trips: agregar columna temporal
ALTER TABLE "trips" ADD COLUMN "status_new" "TripStatus";

-- Copiar datos
UPDATE "trips" SET "status_new" = status::text::"TripStatus";

-- Reemplazar columna
ALTER TABLE "trips" DROP COLUMN "status";
ALTER TABLE "trips" RENAME COLUMN "status_new" TO "status";

-- Hacer la columna NOT NULL
ALTER TABLE "trips" ALTER COLUMN "status" SET NOT NULL;