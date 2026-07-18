import { Sink } from '../core/interfaces';
import { ParsedProduct } from './product.parser';
import { PrismaService } from '../../prisma/prisma.service';

export class ProductSink implements Sink<ParsedProduct> {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async send(products: ParsedProduct[]): Promise<void> {
    for (const product of products) {
      try {
        console.log(`[ProductSink] Processing: ${product.name}`)

        // Check if product exists by SKU
        let existing: { id: string } | null = null;
        if (product.sku) {
          existing = await this.prisma.products.findFirst({
            where: { sku: product.sku, deleted_at: null },
            select: { id: true }
          })
          console.log(`[ProductSink] Found existing by SKU: ${existing ? existing.id : 'none'}`)
        }

        if (existing) {
          // Update existing product
          console.log(`[ProductSink] Updating product ${existing.id}`)
          await this.prisma.products.update({
            where: { id: existing.id },
            data: {
              name: product.name,
              product_type: product.product_type as any,
              active: product.active,
              manages_stock: product.manages_stock,
              requires_refrigeration: product.requires_refrigeration,
              price_enabled: product.price_enabled,
              is_rate_type: product.is_rate_type,
              is_composed: product.is_composed,
              auto_calculate_cost: product.auto_calculate_cost,
              has_engineering: product.has_engineering,
              calculation_type: product.calculation_type as any || null,
              cost_source: product.cost_source as any || 'MANUAL',
            },
          });
          console.log(`[ProductSink] Updated OK`)
        } else {
          // Create new product
          console.log(`[ProductSink] Creating new product: ${product.name}`)
          await this.prisma.products.create({
            data: {
              sku: product.sku,
              name: product.name,
              product_type: product.product_type as any,
              active: product.active,
              manages_stock: product.manages_stock,
              requires_refrigeration: product.requires_refrigeration,
              price_enabled: product.price_enabled,
              is_rate_type: product.is_rate_type,
              is_composed: product.is_composed,
              auto_calculate_cost: product.auto_calculate_cost,
              has_engineering: product.has_engineering,
              calculation_type: product.calculation_type as any || null,
              cost_source: product.cost_source as any || 'MANUAL',
            },
          });
          console.log(`[ProductSink] Created OK`)
        }
      } catch (error) {
        console.error(`[ProductSink] Error importing product ${product.name}:`, error);
      }
    }
  }
}
