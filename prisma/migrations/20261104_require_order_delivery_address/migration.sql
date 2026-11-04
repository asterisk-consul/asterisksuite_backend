ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "require_order_delivery_address" BOOLEAN NOT NULL DEFAULT false;
