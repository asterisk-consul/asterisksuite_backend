import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { CurrencyRateType } from '@/generated/prisma/enums';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';

@Injectable()
export class CurrencyRatesService {
  constructor(private readonly prisma: PrismaService) {}

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
  async findAll() {
    return this.prisma.currency_rates.findMany({
      include: {
        from_currency: true,
        to_currency: true,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
  async findOne(id: string) {
    const rate = await this.prisma.currency_rates.findUnique({
      where: { id },
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
  // DELETE
  // ─────────────────────────────────────────────
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.currency_rates.delete({
      where: { id },
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
