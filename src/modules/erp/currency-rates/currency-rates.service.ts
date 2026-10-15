import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { CurrencyRateType } from '@/generated/prisma/enums';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';

@Injectable()
export class CurrencyRatesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateCurrencyRateDto) {
    if (dto.from_currency_id === dto.to_currency_id) {
      throw new BadRequestException('Las monedas no pueden ser iguales');
    }

    const fromCurrency = await this.prisma.currencies.findUnique({
      where: {
        id: dto.from_currency_id,
      },
    });

    if (!fromCurrency) {
      throw new NotFoundException('Moneda origen no encontrada');
    }

    const toCurrency = await this.prisma.currencies.findUnique({
      where: {
        id: dto.to_currency_id,
      },
    });

    if (!toCurrency) {
      throw new NotFoundException('Moneda destino no encontrada');
    }

    return this.prisma.currency_rates.create({
      data: {
        from_currency_id: dto.from_currency_id,
        to_currency_id: dto.to_currency_id,
        rate: dto.rate,
        source: dto.source,
        effective_date: new Date(dto.effective_date),
        rate_type: dto.rate_type ?? CurrencyRateType.OFFICIAL,
      },
      include: {
        from_currency: true,
        to_currency: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ALL
  // ─────────────────────────────────────────────
  async findAll(params: { page?: number; pageSize?: number } = {}) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(10, params.pageSize ?? 25));
    const where = { deleted_at: null, active: true };

    const [items, total] = await Promise.all([
      this.prisma.currency_rates.findMany({
        where,
        include: {
          from_currency: true,
          to_currency: true,
        },
        orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.currency_rates.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
  async findOne(id: string) {
    const rate = await this.prisma.currency_rates.findFirst({
      where: { id, deleted_at: null },
      include: {
        from_currency: true,
        to_currency: true,
      },
    });

    if (!rate) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return rate;
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: string, dto: UpdateCurrencyRateDto) {
    await this.findOne(id);

    return this.prisma.currency_rates.update({
      where: { id },
      data: {
        ...(dto.rate !== undefined && {
          rate: dto.rate,
        }),

        ...(dto.source !== undefined && {
          source: dto.source,
        }),

        ...(dto.effective_date && {
          effective_date: new Date(dto.effective_date),
        }),

        ...(dto.rate_type && {
          rate_type: dto.rate_type,
        }),
      },
      include: {
        from_currency: true,
        to_currency: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // DELETE (soft delete)
  // ─────────────────────────────────────────────
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.currency_rates.update({
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
    fromCurrencyId: string,
    toCurrencyId: string,
    rateType: CurrencyRateType = CurrencyRateType.OFFICIAL,
  ) {
    const rate = await this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: fromCurrencyId,
        to_currency_id: toCurrencyId,
        rate_type: rateType,
        deleted_at: null,
        active: true,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    if (!rate) {
      throw new NotFoundException('No existe cotización');
    }

    return rate;
  }
}
