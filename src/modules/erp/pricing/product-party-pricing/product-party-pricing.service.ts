import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpsertProductPartyPriceDto } from './dto/upsert-product-party-price.dto';

type OperationType = 'SALE' | 'PURCHASE';

@Injectable()
export class ProductPartyPricingService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findByParty(partyId: string, operationType?: OperationType) {
    return this.prisma.product_party_prices.findMany({
      where: {
        party_id: partyId,
        deleted_at: null,
        ...(operationType ? { operation_type: operationType } : {}),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            is_rate_type: true,
            product_price: {
              where: { active: true, deleted_at: null },
              select: {
                price: true,
                sale_price: true,
                currency_id: true,
                currencies: { select: { code: true, symbol: true } },
              },
            },
          },
        },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
      orderBy: [{ operation_type: 'asc' }, { created_at: 'desc' }],
    });
  }

  async findByProduct(productId: string, operationType?: OperationType) {
    return this.prisma.product_party_prices.findMany({
      where: {
        product_id: productId,
        deleted_at: null,
        ...(operationType ? { operation_type: operationType } : {}),
      },
      include: {
        business_parties: { select: { id: true, name: true, type: true, tax_id: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
      orderBy: [{ operation_type: 'asc' }, { created_at: 'desc' }],
    });
  }

  async history(partyId: string, productId?: string, operationType?: OperationType) {
    return this.prisma.product_party_price_history.findMany({
      where: {
        party_id: partyId,
        ...(productId ? { product_id: productId } : {}),
        ...(operationType ? { operation_type: operationType } : {}),
      },
      include: {
        products: { select: { id: true, name: true, sku: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
      orderBy: { effective_at: 'desc' },
      take: 200,
    });
  }

  async productHistory(productId: string, operationType?: OperationType) {
    return this.prisma.product_party_price_history.findMany({
      where: {
        product_id: productId,
        ...(operationType ? { operation_type: operationType } : {}),
      },
      include: {
        business_parties: { select: { id: true, name: true, type: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
      orderBy: { effective_at: 'desc' },
      take: 200,
    });
  }

  async resolve(
    productId: string,
    partyId: string,
    currencyCode: string,
    operationType: OperationType,
  ) {
    const currency = await this.prisma.currencies.findFirst({
      where: { code: currencyCode, deleted_at: null },
    });
    if (!currency) throw new NotFoundException(`Moneda ${currencyCode} no encontrada`);

    const agreed = await this.prisma.product_party_prices.findUnique({
      where: {
        product_id_party_id_operation_type_currency_id: {
          product_id: productId,
          party_id: partyId,
          operation_type: operationType,
          currency_id: currency.id,
        },
      },
    });
    if (agreed?.active && !agreed.deleted_at) {
      return { price: Number(agreed.price), currency_code: currencyCode, source: 'PARTY_PRICE' };
    }

    if (operationType === 'PURCHASE') {
      const supplier = await this.prisma.product_suppliers.findFirst({
        where: {
          product_id: productId,
          supplier_id: partyId,
          currency_id: currency.id,
          active: true,
          deleted_at: null,
        },
      });
      if (supplier) {
        return { price: Number(supplier.purchase_price), currency_code: currencyCode, source: 'PRODUCT_SUPPLIER' };
      }
    }

    const general = await this.prisma.product_price.findFirst({
      where: { product_id: productId, currency_id: currency.id, active: true, deleted_at: null },
    });
    if (general) {
      const value = operationType === 'SALE' ? (general.sale_price ?? general.price) : general.price;
      return { price: Number(value), currency_code: currencyCode, source: 'GENERAL_PRICE' };
    }

    return { price: null, currency_code: currencyCode, source: 'NONE' };
  }

  async upsert(dto: UpsertProductPartyPriceDto, userId?: string) {
    const [product, party, currency] = await Promise.all([
      this.prisma.products.findUnique({ where: { id: dto.product_id } }),
      this.prisma.business_parties.findUnique({ where: { id: dto.party_id } }),
      this.prisma.currencies.findUnique({ where: { id: dto.currency_id } }),
    ]);
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (!party) throw new NotFoundException('Cliente/proveedor no encontrado');
    if (!currency) throw new NotFoundException('Moneda no encontrada');

    return this.prisma.$transaction((tx) =>
      this.upsertWithHistory(tx, dto, 'MANUAL', null, null, userId),
    );
  }

  async remove(id: string, userId?: string) {
    const existing = await this.prisma.product_party_prices.findUnique({ where: { id } });
    if (!existing || existing.deleted_at) throw new NotFoundException('Precio acordado no encontrado');
    return this.prisma.product_party_prices.update({
      where: { id },
      data: { active: false, deleted_at: new Date(), deleted_by: userId ?? null },
    });
  }

  async captureDocumentPrices(
    tx: any,
    doc: any,
    operationType: OperationType,
    userId?: string,
  ) {
    if (!doc.party_id) return;
    const currencyCode = doc.currency_code ?? 'ARS';
    const currency = await tx.currencies.findFirst({
      where: { code: currencyCode, deleted_at: null },
      select: { id: true },
    });
    if (!currency) throw new BadRequestException(`Moneda ${currencyCode} no encontrada`);

    for (const item of doc.document_items ?? []) {
      if (!item.product_id) continue;
      await this.upsertWithHistory(
        tx,
        {
          product_id: item.product_id,
          party_id: doc.party_id,
          currency_id: currency.id,
          operation_type: operationType,
          price: Number(item.unit_price),
        },
        operationType === 'SALE' ? 'SALE_DOCUMENT' : 'PURCHASE_DOCUMENT',
        doc.id,
        item.id,
        userId,
      );
    }
  }

  private async upsertWithHistory(
    tx: any,
    dto: UpsertProductPartyPriceDto,
    sourceType: string,
    sourceId: string | null,
    documentItemId: string | null,
    userId?: string,
  ) {
    const key = {
      product_id: dto.product_id,
      party_id: dto.party_id,
      operation_type: dto.operation_type,
      currency_id: dto.currency_id,
    };
    const existing = await tx.product_party_prices.findUnique({
      where: { product_id_party_id_operation_type_currency_id: key },
    });
    const previous = existing ? Number(existing.price) : null;
    const next = Number(dto.price);

    const current = existing
      ? await tx.product_party_prices.update({
          where: { id: existing.id },
          data: {
            price: next,
            active: true,
            deleted_at: null,
            effective_from: dto.effective_from ? new Date(dto.effective_from) : new Date(),
            updated_by: userId ?? null,
          },
        })
      : await tx.product_party_prices.create({
          data: {
            ...key,
            price: next,
            effective_from: dto.effective_from ? new Date(dto.effective_from) : new Date(),
            created_by: userId ?? null,
          },
        });

    if (previous === null || Math.abs(previous - next) > 0.000001) {
      await tx.product_party_price_history.create({
        data: {
          product_party_price_id: current.id,
          ...key,
          previous_price: previous,
          new_price: next,
          source_type: sourceType,
          source_id: sourceId,
          document_item_id: documentItemId,
          created_by: userId ?? null,
        },
      });
    }

    return current;
  }
}
