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
  // SINCRONIZAR TODAS LAS MONEDAS
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
        code: { in: data.map((item) => item.moneda) },
      },
    });

    const currencyMap = new Map(currencies.map((c) => [c.code, c]));

    const createPromises = data.flatMap((item) => {
      const currency = currencyMap.get(item.moneda);

      if (!currency) {
        this.logger.warn(`Moneda ${item.moneda} no encontrada`);
        return [];
      }

      return this.prisma.currency_rates.create({
        data: {
          from_currency_id: currency.id,
          to_currency_id: ars.id,
          rate: Number(item.venta),
          source: 'dolarapi',
          rate_type: CurrencyRateType.OFFICIAL,
          effective_date: new Date(item.fechaActualizacion),
        },
      });
    });

    return Promise.all(createPromises);
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
      this.prisma.currencies.findFirst({ where: { code: 'ARS' } }),
      this.prisma.currencies.findFirst({ where: { code: 'USD' } }),
    ]);

    if (!ars || !usd) {
      throw new NotFoundException('USD o ARS no existen');
    }

    return Promise.all(
      data.map((item) =>
        this.prisma.currency_rates.create({
          data: {
            from_currency_id: usd.id,
            to_currency_id: ars.id,
            rate: Number(item.venta),
            source: 'dolarapi',
            rate_type: this.mapRateType(item.casa),
            effective_date: new Date(item.fechaActualizacion),
          },
        }),
      ),
    );
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
        converted_amount: amount * Number(directRate.rate),
      };
    }

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
      throw new NotFoundException('No existe cotización');
    }

    const rate = 1 / Number(inverseRate.rate);

    return {
      amount,
      rate,
      converted_amount: amount * rate,
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
