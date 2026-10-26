import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import type { PrismaTransactionClient } from '@/prisma/prisma.service';

type IdentityExclusions = {
  partyId?: string;
  employeeId?: string;
  partnerId?: string;
};

/** Normalize IDs for duplicate checks (CUIT/CUIL/DNI formatting is ignored). */
export function normalizeIdentityDocument(value?: string | null): string {
  return (value ?? '').replace(/[^a-z0-9]/gi, '').toUpperCase();
}

/**
 * Checks the three entry points that can create a legal/person identity.
 * Keep this query narrow: PostgreSQL normalizes stored values, so the service
 * does not load every document in a tenant into Node memory.
 */
export async function assertPartyIdentityIsUnique(
  prisma: PrismaTransactionClient,
  values: Array<string | null | undefined>,
  exclusions: IdentityExclusions = {},
): Promise<void> {
  const documents = [...new Set(values.map(normalizeIdentityDocument).filter(Boolean))];
  if (!documents.length) return;

  const duplicate = await prisma.$queryRaw(Prisma.sql`
    SELECT candidate.label
    FROM (
      SELECT bp.id::text AS id, NULL::text AS employee_id, NULL::text AS partner_id,
             bp.id::text AS party_id, bp.name AS label, bp.tax_id AS document
      FROM tenant.business_parties bp
      WHERE bp.tax_id IS NOT NULL
      UNION ALL
      SELECT e.id::text, e.id::text, NULL::text, e.party_id::text,
             concat_ws(' ', e.first_name, e.last_name), e.document_number
      FROM tenant.employees e
      WHERE e.deleted_at IS NULL AND e.document_number IS NOT NULL
      UNION ALL
      SELECT p.id::text, NULL::text, p.id::text, p.party_id::text,
             concat_ws(' ', p.first_name, p.last_name), p.document_number
      FROM tenant.partners p
      WHERE p.deleted_at IS NULL AND p.document_number IS NOT NULL
    ) candidate
    WHERE upper(regexp_replace(candidate.document, '[^a-zA-Z0-9]', '', 'g')) = ANY(${documents}::text[])
      AND (${exclusions.partyId ?? null}::text IS NULL OR candidate.party_id IS DISTINCT FROM ${exclusions.partyId ?? null}::text)
      AND (${exclusions.employeeId ?? null}::text IS NULL OR candidate.employee_id IS DISTINCT FROM ${exclusions.employeeId ?? null}::text)
      AND (${exclusions.partnerId ?? null}::text IS NULL OR candidate.partner_id IS DISTINCT FROM ${exclusions.partnerId ?? null}::text)
    LIMIT 1
  `) as Array<{ label: string }>;

  if (duplicate.length) {
    throw new BadRequestException(
      `Ya existe una parte interesada con el mismo CUIT, CUIL o documento (${duplicate[0].label}). Revisá el registro existente antes de crear otro.`,
    );
  }
}
