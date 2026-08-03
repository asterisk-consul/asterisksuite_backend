-- CreateTable
CREATE TABLE "tenant"."dashboard_configs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "dashboard_key" VARCHAR(100) NOT NULL,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "dashboard_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_configs_user_id_dashboard_key_key" ON "tenant"."dashboard_configs"("user_id", "dashboard_key");

-- CreateIndex
CREATE INDEX "dashboard_configs_user_id_idx" ON "tenant"."dashboard_configs"("user_id");
