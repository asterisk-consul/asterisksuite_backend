ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "warn_when_order_delivery_data_empty" BOOLEAN NOT NULL DEFAULT true;
