import { BadRequestException } from '@nestjs/common';

const DOC_PATTERNS: Record<string, { regex: RegExp; label: string }> = {
  CUIT:      { regex: /^\d{11}$/,  label: '11 dígitos' },
  CUIL:      { regex: /^\d{11}$/,  label: '11 dígitos' },
  DNI:       { regex: /^\d{7,8}$/, label: '7 u 8 dígitos' },
  LE:        { regex: /^\d{7,8}$/, label: '7 u 8 dígitos' },
  LC:        { regex: /^\d{7,8}$/, label: '7 u 8 dígitos' },
  PASAPORTE: { regex: /^[A-Za-z0-9]{5,20}$/, label: '5-20 caracteres alfanuméricos' },
};

/**
 * Validates document_number against document_type format rules.
 * Strips non-numeric characters for numeric document types.
 * Throws BadRequestException if format is invalid.
 */
export function validateDocumentNumber(documentType?: string, documentNumber?: string): void {
  if (!documentType || !documentNumber) return;

  // Strip dashes and spaces for numeric types
  const cleaned = documentType !== 'PASAPORTE'
    ? documentNumber.replace(/[\s\-]/g, '')
    : documentNumber;

  const rule = DOC_PATTERNS[documentType];
  if (!rule) return; // Unknown type, skip validation

  if (!rule.regex.test(cleaned)) {
    throw new BadRequestException(
      `El ${documentType} debe tener ${rule.label}. Valor recibido: "${documentNumber}"`
    );
  }
}
