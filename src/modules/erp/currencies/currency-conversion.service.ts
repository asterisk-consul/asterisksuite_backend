import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@/generated/prisma/internal/prismaNamespace';
import { CurrencyRateType } from '@/generated/prisma/enums';

import { PrismaService } from '@/prisma/prisma.service';
import { CurrenciesService } from './currencies.service';

export interface ConvertResult {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  rateType: CurrencyRateType;
  convertedAmount: number;
}

export interface ConvertedFields {
  converted_subtotal: number | null;
  converted_exempt_amount: number | null;
  converted_total_taxes: number | null;
  converted_total: number | null;
  converted_taxable_base: number | null;
  converted_paid_amount: number | null;
}

@Injectable()
export class CurrencyConversionService {
  private readonly logger = new Logger(CurrencyConversionService.name);

  constructor(
    private db: PrismaService,
    private currenciesService: CurrenciesService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─────────────────────────────────────────────
  // GET BASE CURRENCY
  // ─────────────────────────────────────────────
  async getBaseCurrency() {
    return this.currenciesService.getBaseCurrency();
  }

  // ─────────────────────────────────────────────
  // CHECK IF BASE CURRENCY
  // ─────────────────────────────────────────────
  async isBaseCurrency(code: string): Promise<boolean> {
    const base = await this.getBaseCurrency();
    return base.code.toUpperCase() === code.toUpperCase();
  }

  // ─────────────────────────────────────────────
  // RESOLVE EXCHANGE RATE
  // ─────────────────────────────────────────────
  async resolveRate(
    fromCode: string,
    toCode: string,
    date?: Date,
    rateType?: CurrencyRateType,
  ): Promise<{ rate: number; rateType: CurrencyRateType; source?: string | null }> {
    // Same currency → rate 1
    if (fromCode.toUpperCase() === toCode.toUpperCase()) {
      return { rate: 1, rateType: rateType ?? ('OFFICIAL' as CurrencyRateType) };
    }

    const fromCurrency = await this.currenciesService.findByCode(fromCode);
    const toCurrency = await this.currenciesService.findByCode(toCode);

    const effectiveDate = date ?? new Date();
    const effectiveRateType = rateType ?? ('OFFICIAL' as CurrencyRateType);

    // Find the latest rate for the given type, or fall back to OFFICIAL
    let rateRecord = await this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: fromCurrency.id,
        to_currency_id: toCurrency.id,
        effective_date: { lte: effectiveDate },
        rate_type: effectiveRateType,
      },
      orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
    });

    // Fallback: try OFFICIAL if requested type not found
    if (!rateRecord && effectiveRateType !== 'OFFICIAL') {
      rateRecord = await this.prisma.currency_rates.findFirst({
        where: {
          from_currency_id: fromCurrency.id,
          to_currency_id: toCurrency.id,
          effective_date: { lte: effectiveDate },
          rate_type: 'OFFICIAL',
        },
        orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
      });
    }

    // Try reverse direction
    if (!rateRecord) {
      rateRecord = await this.prisma.currency_rates.findFirst({
        where: {
          from_currency_id: toCurrency.id,
          to_currency_id: fromCurrency.id,
          effective_date: { lte: effectiveDate },
          rate_type: effectiveRateType,
        },
        orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
      });

      if (rateRecord) {
        return {
          rate: 1 / Number(rateRecord.rate),
          rateType: rateRecord.rate_type,
          source: rateRecord.source,
        };
      }

      // Fallback OFFICIAL reverse
      rateRecord = await this.prisma.currency_rates.findFirst({
        where: {
          from_currency_id: toCurrency.id,
          to_currency_id: fromCurrency.id,
          effective_date: { lte: effectiveDate },
          rate_type: 'OFFICIAL',
        },
        orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
      });

      if (rateRecord) {
        return {
          rate: 1 / Number(rateRecord.rate),
          rateType: rateRecord.rate_type,
          source: rateRecord.source,
        };
      }
    }

    if (!rateRecord) {
      throw new BadRequestException(
        `No se encontró cotización de ${fromCode} → ${toCode} para la fecha ${effectiveDate.toISOString().slice(0, 10)}`,
      );
    }

    return {
      rate: Number(rateRecord.rate),
      rateType: rateRecord.rate_type,
      source: rateRecord.source,
    };
  }

  // ─────────────────────────────────────────────
  // CONVERT AMOUNT
  // ─────────────────────────────────────────────
  async convert(
    amount: number,
    fromCode: string,
    toCode: string,
    date?: Date,
    rateType?: CurrencyRateType,
  ): Promise<ConvertResult> {
    const { rate, rateType: resolvedType, source } = await this.resolveRate(
      fromCode,
      toCode,
      date,
      rateType,
    );

    const convertedAmount = Number((amount * rate).toFixed(2));

    this.logger.debug(
      `Converted ${amount} ${fromCode} → ${convertedAmount} ${toCode} (rate: ${rate}, type: ${resolvedType})`,
    );

    return {
      amount,
      fromCurrency: fromCode,
      toCurrency: toCode,
      exchangeRate: rate,
      rateType: resolvedType,
      convertedAmount,
    };
  }

  // ─────────────────────────────────────────────
  // CONVERT DOCUMENT FIELDS
  // ─────────────────────────────────────────────
  async convertDocumentFields(
    currencyCode: string,
    exchangeRate: number | null,
    rateType: CurrencyRateType | null,
    fields: {
      subtotal?: number;
      exempt_amount?: number;
      total_taxes?: number;
      total?: number;
      taxable_base?: number;
      paid_amount?: number;
    },
    date?: Date,
  ): Promise<ConvertedFields> {
    const base = await this.getBaseCurrency();

    // If currency is base or no exchange rate provided, return nulls
    if (currencyCode.toUpperCase() === base.code.toUpperCase() || !exchangeRate) {
      return {
        converted_subtotal: null,
        converted_exempt_amount: null,
        converted_total_taxes: null,
        converted_total: null,
        converted_taxable_base: null,
        converted_paid_amount: null,
      };
    }

    const rate = exchangeRate;
    const multiply = (val: number | undefined | null): number | null => {
      if (val == null || val === 0) return null;
      return Number((val * rate).toFixed(2));
    };

    return {
      converted_subtotal: multiply(fields.subtotal),
      converted_exempt_amount: multiply(fields.exempt_amount),
      converted_total_taxes: multiply(fields.total_taxes),
      converted_total: multiply(fields.total),
      converted_taxable_base: multiply(fields.taxable_base),
      converted_paid_amount: multiply(fields.paid_amount),
    };
  }

  // ─────────────────────────────────────────────
  // CONVERT SINGLE AMOUNT (for items, taxes, entries)
  // ─────────────────────────────────────────────
  convertAmount(
    amount: number | Decimal | null | undefined,
    exchangeRate: number | Decimal | null | undefined,
  ): number | null {
    if (amount == null || exchangeRate == null) return null;
    const amt = Number(amount);
    const rate = Number(exchangeRate);
    if (amt === 0 || rate === 0) return null;
    return Number((amt * rate).toFixed(2));
  }

  // ─────────────────────────────────────────────
  // VALIDATE FISCAL RATE TYPE
  // ─────────────────────────────────────────────
  validateFiscalRateType(rateType: CurrencyRateType | null | undefined): CurrencyRateType {
    // For fiscal documents (A/B/C), OFFICIAL is required
    // This is a helper; the actual enforcement is in the document service
    if (rateType && rateType !== 'OFFICIAL') {
      this.logger.warn(
        `Rate type ${rateType} used for fiscal document. Consider using OFFICIAL for AFIP compliance.`,
      );
    }
    return rateType ?? 'OFFICIAL';
  }
}
