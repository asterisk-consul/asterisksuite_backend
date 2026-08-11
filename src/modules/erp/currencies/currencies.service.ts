import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyRateType } from '@/generated/prisma/enums';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateCurrencyDto) {
    const existing = await this.prisma.currencies.findUnique({
      where: {
        code: dto.code.toUpperCase(),
      },
    });

    if (existing) {
      throw new BadRequestException('Ya existe una moneda con ese código');
    }

    // solo una moneda base
    if (dto.is_base) {
      await this.clearBaseCurrency();
    }

    return this.prisma.currencies.create({
      data: {
        code: dto.code.toUpperCase(),
        name: dto.name,
        symbol: dto.symbol,
        is_base: dto.is_base ?? false,
        active: dto.active ?? true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ALL
  // ─────────────────────────────────────────────
  async findAll() {
    return this.prisma.currencies.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
  async findOne(id: string) {
    const currency = await this.prisma.currencies.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException('Moneda no encontrada');
    }

    return currency;
  }

  // ─────────────────────────────────────────────
  // FIND BY CODE
  // ─────────────────────────────────────────────
  async findByCode(code: string) {
    const currency = await this.prisma.currencies.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });

    if (!currency) {
      throw new NotFoundException(`Moneda ${code} no encontrada`);
    }

    return currency;
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: string, dto: UpdateCurrencyDto) {
    await this.findOne(id);

    if (dto.is_base) {
      await this.clearBaseCurrency();
    }

    return this.prisma.currencies.update({
      where: { id },
      data: {
        ...(dto.code && {
          code: dto.code.toUpperCase(),
        }),
        ...(dto.name && {
          name: dto.name,
        }),
        ...(dto.symbol && {
          symbol: dto.symbol,
        }),
        ...(dto.is_base !== undefined && {
          is_base: dto.is_base,
        }),
        ...(dto.active !== undefined && {
          active: dto.active,
        }),
      },
    });
  }

  // ─────────────────────────────────────────────
  // DELETE (soft delete recomendado)
  // ─────────────────────────────────────────────
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.currencies.update({
      where: { id },
      data: {
        active: false,
        deleted_at: new Date(),
      },
    });
  }

  // ─────────────────────────────────────────────
  // GET LATEST RATE
  // ─────────────────────────────────────────────
  async getLatestRate(
    fromCode: string,
    toCode: string,
    rateType?: CurrencyRateType,
  ) {
    const fromCurrency = await this.findByCode(fromCode);
    const toCurrency = await this.findByCode(toCode);

    const where: any = {
      from_currency_id: fromCurrency.id,
      to_currency_id: toCurrency.id,
    };

    if (rateType) {
      where.rate_type = rateType;
    }

    const rate = await this.prisma.currency_rates.findFirst({
      where,
      orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
    });

    return rate ?? null;
  }

  // ─────────────────────────────────────────────
  // GET BASE CURRENCY
  // ─────────────────────────────────────────────
  async getBaseCurrency() {
    const currency = await this.prisma.currencies.findFirst({
      where: {
        is_base: true,
        active: true,
      },
    });

    if (!currency) {
      throw new NotFoundException('No hay moneda base configurada');
    }

    return currency;
  }

  // ─────────────────────────────────────────────
  // PRIVATE
  // ─────────────────────────────────────────────
  private async clearBaseCurrency() {
    await this.prisma.currencies.updateMany({
      where: {
        is_base: true,
      },
      data: {
        is_base: false,
      },
    });
  }
}
