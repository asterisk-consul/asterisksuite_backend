-- AlterTable: Add affects_payment flag to document_types
ALTER TABLE "tenant"."document_types" ADD COLUMN "affects_payment" BOOLEAN NOT NULL DEFAULT false;

-- Set affects_payment = true for INVOICE types (they should appear in pending payments)
UPDATE "tenant"."document_types" SET "affects_payment" = true WHERE "category" = 'INVOICE';

-- OPENING_BALANCE, ORDER, QUOTE, REMITO remain false (default)
