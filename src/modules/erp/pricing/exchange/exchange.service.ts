import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CurrencyRateType } from '@/generated/prisma/enums';

import { DolarApiQuote } from './interfaces/dolar-api.interface';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);

  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // SINCRONIZAR TODAS LAS MONEDAS OFICIALES
  // =========================================================

  async syncOfficialRates() {
    const response = await fetch('https://dolarapi.com/v1/cotizaciones');

    if (!response.ok) {
      throw new BadRequestException('No se pudieron obtener cotizaciones');
    }

    const data: DolarApiQuote[] = await response.json();

    const ars = await this.prisma.currencies.findFirst({
      where: { code: 'ARS' },
    });

    if (!ars) {
      throw new NotFoundException('Debe existir la moneda base ARS');
    }

    const currencies = await this.prisma.currencies.findMany({
      where: {
        code: {
          in: data.map((item) => item.moneda),
        },
      },
    });

    const currencyMap = new Map(currencies.map((c) => [c.code, c]));

    const results: Awaited<
      ReturnType<typeof this.prisma.currency_rates.create>
    >[] = [];

    for (const item of data) {
      const currency = currencyMap.get(item.moneda);

      if (!currency) {
        this.logger.warn(`Moneda ${item.moneda} no encontrada`);
        continue;
      }

      const existing = await this.findExistingRate({
        from_currency_id: currency.id,
        to_currency_id: ars.id,
        rate_type: CurrencyRateType.OFFICIAL,
      });

      const newRate = Number(item.venta);

      // Si no cambió la cotización → no guardar
      if (existing && Number(existing.rate) === newRate) {
        continue;
      }

      const created = await this.prisma.currency_rates.create({
        data: {
          from_currency_id: currency.id,
          to_currency_id: ars.id,
          rate: newRate,
          source: 'dolarapi',
          rate_type: CurrencyRateType.OFFICIAL,
          effective_date: new Date(item.fechaActualizacion),
        },
      });

      results.push(created);
    }

    return results;
  }

  // =========================================================
  // SINCRONIZAR DÓLARES ESPECIALES
  // =========================================================

  async syncDollarRates() {
    const response = await fetch('https://dolarapi.com/v1/dolares');

    if (!response.ok) {
      throw new BadRequestException('No se pudieron obtener dólares');
    }

    const data: DolarApiQuote[] = await response.json();

    const [ars, usd] = await Promise.all([
      this.prisma.currencies.findFirst({
        where: { code: 'ARS' },
      }),

      this.prisma.currencies.findFirst({
        where: { code: 'USD' },
      }),
    ]);

    if (!ars || !usd) {
      throw new NotFoundException('USD o ARS no existen');
    }

    const results: Awaited<
      ReturnType<typeof this.prisma.currency_rates.create>
    >[] = [];

    for (const item of data) {
      const rateType = this.mapRateType(item.casa);

      const existing = await this.findExistingRate({
        from_currency_id: usd.id,
        to_currency_id: ars.id,
        rate_type: rateType,
      });

      const newRate = Number(item.venta);

      if (existing && Number(existing.rate) === newRate) {
        continue;
      }

      const created = await this.prisma.currency_rates.create({
        data: {
          from_currency_id: usd.id,
          to_currency_id: ars.id,
          rate: newRate,
          source: 'dolarapi',
          rate_type: rateType,
          effective_date: new Date(item.fechaActualizacion),
        },
      });

      results.push(created);
    }

    return results;
  }

  // =========================================================
  // SINCRONIZAR TODO
  // =========================================================

  async syncAllRates() {
    const official = await this.syncOfficialRates();

    const dollars = await this.syncDollarRates();

    return {
      success: true,
      official_created: official.length,
      dollar_created: dollars.length,
      total_created: official.length + dollars.length,
    };
  }

  // =========================================================
  // CONVERTIR MONEDAS
  // =========================================================

  async convertAmount(
    amount: number,
    fromCode: string,
    toCode: string,
    rateType: CurrencyRateType = CurrencyRateType.OFFICIAL,
  ) {
    if (fromCode === toCode) {
      return {
        amount,
        converted_amount: amount,
        rate: 1,
      };
    }

    const fromCurrency = await this.prisma.currencies.findFirst({
      where: {
        code: fromCode,
      },
    });

    const toCurrency = await this.prisma.currencies.findFirst({
      where: {
        code: toCode,
      },
    });

    if (!fromCurrency || !toCurrency) {
      throw new NotFoundException('Moneda no encontrada');
    }

    // =====================================================
    // COTIZACIÓN DIRECTA
    // =====================================================

    const directRate = await this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: fromCurrency.id,
        to_currency_id: toCurrency.id,
        rate_type: rateType,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    if (directRate) {
      return {
        amount,
        rate: Number(directRate.rate),
        converted_amount: round6(amount * Number(directRate.rate)),
      };
    }

    // =====================================================
    // COTIZACIÓN INVERSA
    // =====================================================

    const inverseRate = await this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: toCurrency.id,
        to_currency_id: fromCurrency.id,
        rate_type: rateType,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    if (!inverseRate) {
      throw new NotFoundException(
        `No existe cotización ${fromCode} → ${toCode}`,
      );
    }

    const rate = 1 / Number(inverseRate.rate);

    return {
      amount,
      rate,
      converted_amount: round6(amount * rate),
    };
  }

  // =========================================================
  // OBTENER ÚLTIMA COTIZACIÓN
  // =========================================================

  async getLatestRate(
    fromCode: string,
    toCode: string,
    rateType: CurrencyRateType = CurrencyRateType.OFFICIAL,
  ) {
    const fromCurrency = await this.prisma.currencies.findFirst({
      where: {
        code: fromCode,
      },
    });

    const toCurrency = await this.prisma.currencies.findFirst({
      where: {
        code: toCode,
      },
    });

    if (!fromCurrency || !toCurrency) {
      throw new NotFoundException('Moneda no encontrada');
    }

    return this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: fromCurrency.id,
        to_currency_id: toCurrency.id,
        rate_type: rateType,
      },
      orderBy: {
        effective_date: 'desc',
      },
      include: {
        from_currency: true,
        to_currency: true,
      },
    });
  }

  // =========================================================
  // BUSCAR ÚLTIMA COTIZACIÓN EXISTENTE
  // =========================================================

  private async findExistingRate(params: {
    from_currency_id: string;
    to_currency_id: string;
    rate_type: CurrencyRateType;
  }) {
    return this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: params.from_currency_id,
        to_currency_id: params.to_currency_id,
        rate_type: params.rate_type,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });
  }

  // =========================================================
  // MAPEAR TIPOS
  // =========================================================

  private mapRateType(casa: string): CurrencyRateType {
    switch (casa) {
      case 'oficial':
        return CurrencyRateType.OFFICIAL;

      case 'blue':
        return CurrencyRateType.BLUE;

      case 'bolsa':
        return CurrencyRateType.MEP;

      case 'contadoconliqui':
        return CurrencyRateType.CCL;

      case 'mayorista':
        return CurrencyRateType.WHOLESALE;

      case 'cripto':
        return CurrencyRateType.CRYPTO;

      case 'tarjeta':
        return CurrencyRateType.CARD;

      default:
        return CurrencyRateType.OFFICIAL;
    }
  }
}

// =========================================================
// HELPERS
// =========================================================

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}
