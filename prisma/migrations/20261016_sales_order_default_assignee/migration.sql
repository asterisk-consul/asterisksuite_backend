ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "prompt_order_assignee_on_confirmation" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "require_order_assignee_on_confirmation" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "default_order_assignee_id" UUID;
