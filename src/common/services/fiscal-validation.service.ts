import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

export interface FiscalContextResult {
  issuerVatCondition: string;
  partnerVatCondition: string;
}

@Injectable()
export class FiscalValidationService {
  constructor(private readonly db: PrismaService) {}

  getValidLetterTypes(issuerCondition: string): string[] {
    const map: Record<string, string[]> = {
      RESPONSABLE_INSCRIPTO: ['A', 'B'],
      MONOTRIBUTO: ['C'],
      EXENTO: ['C'],
    };
    return map[issuerCondition] ?? [];
  }

  /**
   * Matriz emisor × receptor → letra esperada.
   * RI + RI → A
   * RI + Mono/CF/Exento → B
   * Mono/Exento + * → C
   */
  getExpectedLetterType(issuer: string, partner: string): string | null {
    const issuerNorm = issuer.toUpperCase();
    if (issuerNorm === 'MONOTRIBUTO' || issuerNorm === 'EXENTO') return 'C';

    const partnerNorm = partner.toUpperCase();
    if (partnerNorm === 'RI' || partnerNorm === 'RESPONSABLE_INSCRIPTO')
      return 'A';
    return 'B';
  }

  /**
   * Resuelve y valida el contexto fiscal para documentos con letter_type (facturas).
   *
   * - SALE:    emisor = company, receptor = partner
   * - PURCHASE: emisor = partner, receptor = company
   *
   * Si no hay letter_type (presupuestos, órdenes, remitos), retorna sin validar.
   * Si no hay party_id, retorna solo la condición del emisor.
   */
  async resolveFiscalContext(params: {
    direction: 'SALE' | 'PURCHASE';
    partyId?: string;
    documentLetterType?: string;
  }): Promise<FiscalContextResult> {
    const { direction, partyId, documentLetterType } = params;

    const company = await this.db.getDefaultClient().companies.findUnique({
      where: { id: getCurrentCompanyId() ?? '' },
      select: { vat_condition: true },
    });

    const issuerVatCondition = company?.vat_condition ?? '';

    if (!partyId || !documentLetterType) {
      return { issuerVatCondition, partnerVatCondition: '' };
    }

    const partner = await this.db
      .getClientForCurrentContext()
      .business_parties.findUnique({
        where: { id: partyId },
        select: { vat_condition: true, name: true },
      });

    if (!partner?.vat_condition) {
      const role = direction === 'SALE' ? 'cliente' : 'proveedor';
      throw new BadRequestException(
        `El ${role} "${partner?.name ?? partyId}" no tiene condición fiscal (IVA) asignada. ` +
          `Asigne una condición fiscal antes de crear un comprobante.`,
      );
    }

    const partnerVatCondition = partner.vat_condition;

    const issuerForValidation =
      direction === 'SALE' ? issuerVatCondition : partnerVatCondition;
    const partnerForValidation =
      direction === 'SALE' ? partnerVatCondition : issuerVatCondition;

    const expectedLetter = this.getExpectedLetterType(
      issuerForValidation,
      partnerForValidation,
    );
    if (expectedLetter && documentLetterType !== expectedLetter) {
      const issuerLabel =
        direction === 'SALE' ? 'emisor' : 'emisor (proveedor)';
      const partnerLabel =
        direction === 'SALE' ? 'receptor' : 'receptor (empresa)';
      throw new BadRequestException(
        `Para ${issuerLabel} "${issuerForValidation}" y ${partnerLabel} "${partnerForValidation}", ` +
          `el comprobante debe ser letra ${expectedLetter} (usó letra ${documentLetterType}).`,
      );
    }

    return { issuerVatCondition, partnerVatCondition };
  }
}
