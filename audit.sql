-- CreateTable
CREATE TABLE "product_structure_versions" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_structure_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_structure_versions_product_id_idx" ON "product_structure_versions"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_structure_versions_product_id_version_key" ON "product_structure_versions"("product_id", "version");

-- AddForeignKey
ALTER TABLE "product_structure_versions" ADD CONSTRAINT "product_structure_versions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

