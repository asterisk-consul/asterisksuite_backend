import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@/generated/prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CurrencyRateType } from '@/generated/prisma/enums';

import { DolarApiQuote } from './interfaces/dolar-api.interface';

type Tx = Prisma.TransactionClient;

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);

  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // SYNC TODO
  // =========================================================

  async syncAllRates() {
    return this.prisma.$transaction(async (tx) => {
      const official = await this.syncOfficialRates(tx);

      const dollars = await this.syncDollarRates(tx);

      return {
        success: true,
        official_created: official.length,
        dollar_created: dollars.length,
        total_created: official.length + dollars.length,
      };
    });
  }

  // =========================================================
  // SYNC MONEDAS OFICIALES
  // https://dolarapi.com/v1/cotizaciones
  // =========================================================

  async syncOfficialRates(tx?: Tx) {
    const prisma = tx ?? this.prisma;

    const data = await this.fetchWithTimeout<DolarApiQuote[]>(
      'https://dolarapi.com/v1/cotizaciones',
    );

    // =====================================================
    // ASEGURAR ARS
    // =====================================================

    const ars = await this.findOrCreateCurrency(
      {
        code: 'ARS',
        name: 'Peso Argentino',
        symbol: '$',
      },
      prisma,
    );

    const results: Prisma.currency_ratesGetPayload<{}>[] = [];

    // =====================================================
    // TRAER ÚLTIMAS COTIZACIONES
    // =====================================================

    const latestRates = await prisma.currency_rates.findMany({
      where: {
        to_currency_id: ars.id,
        rate_type: CurrencyRateType.OFFICIAL,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    const latestMap = new Map<string, number>();

    for (const rate of latestRates) {
      const key = `${rate.from_currency_id}_${rate.rate_type}`;

      if (!latestMap.has(key)) {
        latestMap.set(key, Number(rate.rate));
      }
    }

    // =====================================================
    // LOOP
    // =====================================================

    for (const item of data) {
      const currency = await this.findOrCreateCurrency(
        {
          code: item.moneda,
          name: item.nombre,
          symbol: this.getCurrencySymbol(item.moneda),
        },
        prisma,
      );

      const newRate = Number(item.venta);

      const key = `${currency.id}_${CurrencyRateType.OFFICIAL}`;

      const existingRate = latestMap.get(key);

      // Si la cotización no cambió → no insertar histórico duplicado
      if (existingRate === newRate) {
        continue;
      }

      const created = await prisma.currency_rates.upsert({
        where: {
          from_currency_id_to_currency_id_effective_date_rate_type: {
            from_currency_id: currency.id,
            to_currency_id: ars.id,
            effective_date: new Date(item.fechaActualizacion),
            rate_type: CurrencyRateType.OFFICIAL,
          },
        },
        update: { rate: newRate },
        create: {
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
  // SYNC DÓLARES ESPECIALES
  // https://dolarapi.com/v1/dolares
  // =========================================================

  async syncDollarRates(tx?: Tx) {
    const prisma = tx ?? this.prisma;

    const data = await this.fetchWithTimeout<DolarApiQuote[]>(
      'https://dolarapi.com/v1/dolares',
    );

    // =====================================================
    // ASEGURAR MONEDAS
    // =====================================================

    const ars = await this.findOrCreateCurrency(
      {
        code: 'ARS',
        name: 'Peso Argentino',
        symbol: '$',
      },
      prisma,
    );

    const usd = await this.findOrCreateCurrency(
      {
        code: 'USD',
        name: 'Dólar Estadounidense',
        symbol: 'US$',
      },
      prisma,
    );

    const results: Prisma.currency_ratesGetPayload<{}>[] = [];

    for (const item of data) {
      // Ya viene desde cotizaciones oficiales
      if (item.casa === 'oficial') {
        continue;
      }

      const rateType = this.mapRateType(item.casa);

      const existing = await prisma.currency_rates.findFirst({
        where: {
          from_currency_id: usd.id,
          to_currency_id: ars.id,
          rate_type: rateType,
        },
        orderBy: {
          effective_date: 'desc',
        },
      });

      const newRate = Number(item.venta);

      // No guardar duplicados
      if (existing && Number(existing.rate) === newRate) {
        continue;
      }
      const created = await prisma.currency_rates.upsert({
        where: {
          from_currency_id_to_currency_id_effective_date_rate_type: {
            from_currency_id: usd.id,
            to_currency_id: ars.id,
            effective_date: new Date(item.fechaActualizacion),
            rate_type: rateType,
          },
        },
        update: { rate: newRate },
        create: {
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
  // CONVERTIR MONEDA
  // =========================================================

  async convertAmount(
    amount: number,
    fromCode: string,
    toCode: string,
    rateType: CurrencyRateType = CurrencyRateType.OFFICIAL,
  ) {
    const normalizedFrom = fromCode.toUpperCase();
    const normalizedTo = toCode.toUpperCase();

    // =====================================================
    // MISMA MONEDA
    // =====================================================

    if (normalizedFrom === normalizedTo) {
      return {
        amount,
        from: normalizedFrom,
        to: normalizedTo,
        rate_type: rateType,
        rate: 1,
        converted_amount: amount,
      };
    }

    // =====================================================
    // BUSCAR MONEDAS
    // =====================================================

    const [fromCurrency, toCurrency] = await Promise.all([
      this.prisma.currencies.findUnique({
        where: {
          code: normalizedFrom,
        },
      }),

      this.prisma.currencies.findUnique({
        where: {
          code: normalizedTo,
        },
      }),
    ]);

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
      const rate = Number(directRate.rate);

      return {
        amount,
        from: normalizedFrom,
        to: normalizedTo,
        rate_type: rateType,
        rate,
        converted_amount: round6(amount * rate),
        inverse: false,
        effective_date: directRate.effective_date,
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
        `No existe cotización ${normalizedFrom} → ${normalizedTo}`,
      );
    }

    const rate = 1 / Number(inverseRate.rate);

    return {
      amount,
      from: normalizedFrom,
      to: normalizedTo,
      rate_type: rateType,
      rate: round6(rate),
      converted_amount: round6(amount * rate),
      inverse: true,
      effective_date: inverseRate.effective_date,
    };
  }

  // =========================================================
  // GET RATE
  // =========================================================

  async getLatestRate(
    fromCode: string,
    toCode: string,
    rateType: CurrencyRateType = CurrencyRateType.OFFICIAL,
  ) {
    const fromCurrency = await this.prisma.currencies.findUnique({
      where: {
        code: fromCode.toUpperCase(),
      },
    });

    const toCurrency = await this.prisma.currencies.findUnique({
      where: {
        code: toCode.toUpperCase(),
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
  // FIND OR CREATE CURRENCY
  // =========================================================

  private async findOrCreateCurrency(
    params: {
      code: string;
      name: string;
      symbol: string;
    },
    prisma: Tx | PrismaService,
  ) {
    const code = params.code.toUpperCase();

    const existing = await prisma.currencies.findUnique({
      where: {
        code,
      },
    });

    if (existing) {
      return existing;
    }

    this.logger.log(`Creando moneda ${code}`);

    return prisma.currencies.create({
      data: {
        code,
        name: params.name,
        symbol: params.symbol,
        active: true,
        is_base: code === 'ARS',
      },
    });
  }

  // =========================================================
  // FETCH CON TIMEOUT
  // =========================================================

  private async fetchWithTimeout<T>(url: string, timeoutMs = 5000): Promise<T> {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new BadRequestException(`Error consultando ${url}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new BadRequestException(`Timeout consultando ${url}`);
      }

      throw error;
    }
  }

  // =========================================================
  // MAP RATE TYPE
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

  // =========================================================
  // SYMBOLS
  // =========================================================

  private getCurrencySymbol(code: string): string {
    switch (code.toUpperCase()) {
      case 'ARS':
        return '$';

      case 'USD':
        return 'US$';

      case 'EUR':
        return '€';

      case 'BRL':
        return 'R$';

      case 'CLP':
        return '$';

      case 'UYU':
        return '$U';

      default:
        return code.toUpperCase();
    }
  }
}

// =========================================================
// HELPERS
// =========================================================

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}
