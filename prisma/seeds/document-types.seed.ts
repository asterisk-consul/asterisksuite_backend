import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import 'dotenv/config';

const tenantArg = process.argv[2];

if (!tenantArg) {
  console.error('Usage: npx tsx prisma/seeds/document-types.seed.ts <tenant>');
  console.error('Example: npx tsx prisma/seeds/document-types.seed.ts dev');
  process.exit(1);
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE;
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE environment variable is not defined');
  process.exit(1);
}

const tenantDb = `${tenantArg}_db`;
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`;

console.log(`Connecting to tenant database: ${tenantDb}`);

const pool = new Pool({
  connectionString,
  options: `-c search_path="tenant",public`,
  max: 5,
});

const adapter = new PrismaPg(pool, { schema: 'tenant' });
const prisma = new PrismaClient({ adapter });

// Documentos por defecto - Facturas, Notas, Órdenes, Remitos
const documentTypes = [
  // ═══════════════════════════════════════════════════════════
  // FACTURAS DE VENTA (direction: 1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'FA-A',
    description: 'Factura A - Responsable Inscripto',
    direction: 1,
    category: 'INVOICE',
    letter_type: 'A',
    afip_code: '01',
    requires_cae: true,
    is_electronic: true,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'FB-A',
    description: 'Factura B - Consumidor Final',
    direction: 1,
    category: 'INVOICE',
    letter_type: 'B',
    afip_code: '06',
    requires_cae: true,
    is_electronic: true,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'FC-A',
    description: 'Factura C - Exento',
    direction: 1,
    category: 'INVOICE',
    letter_type: 'C',
    afip_code: '11',
    requires_cae: true,
    is_electronic: true,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'FX-A',
    description: 'Factura X - Comprobante interno',
    direction: 1,
    category: 'INVOICE',
    letter_type: 'X',
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: false,
  },

  // ═══════════════════════════════════════════════════════════
  // NOTAS DE CRÉDITO DE VENTA (direction: 1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'NCA',
    description: 'Nota de Crédito A',
    direction: 1,
    category: 'CREDIT_NOTE',
    letter_type: 'A',
    afip_code: '128',
    requires_cae: true,
    is_electronic: true,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NCB',
    description: 'Nota de Crédito B',
    direction: 1,
    category: 'CREDIT_NOTE',
    letter_type: 'B',
    afip_code: '132',
    requires_cae: true,
    is_electronic: true,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NCC-A',
    description: 'Nota de Crédito C (Venta)',
    direction: 1,
    category: 'CREDIT_NOTE',
    letter_type: 'C',
    afip_code: '203',
    requires_cae: true,
    is_electronic: true,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },

  // ═══════════════════════════════════════════════════════════
  // NOTAS DE DÉBITO DE VENTA (direction: 1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'NDA',
    description: 'Nota de Débito A',
    direction: 1,
    category: 'DEBIT_NOTE',
    letter_type: 'A',
    afip_code: '135',
    requires_cae: true,
    is_electronic: true,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NDB',
    description: 'Nota de Débito B',
    direction: 1,
    category: 'DEBIT_NOTE',
    letter_type: 'B',
    afip_code: '139',
    requires_cae: true,
    is_electronic: true,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NDC-A',
    description: 'Nota de Débito C (Venta)',
    direction: 1,
    category: 'DEBIT_NOTE',
    letter_type: 'C',
    afip_code: '213',
    requires_cae: true,
    is_electronic: true,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
  },

  // ═══════════════════════════════════════════════════════════
  // FACTURAS DE COMPRA (direction: -1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'FA-C',
    description: 'Factura A Compra - Proveedor RI',
    direction: -1,
    category: 'INVOICE',
    letter_type: 'A',
    afip_code: '01',
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'FB-C',
    description: 'Factura B Compra - Proveedor CF',
    direction: -1,
    category: 'INVOICE',
    letter_type: 'B',
    afip_code: '06',
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'FC-C',
    description: 'Factura C Compra - Proveedor Exento',
    direction: -1,
    category: 'INVOICE',
    letter_type: 'C',
    afip_code: '11',
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },

  // ═══════════════════════════════════════════════════════════
  // NOTAS DE CRÉDITO DE COMPRA (direction: -1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'NCA-C',
    description: 'Nota de Crédito Compra A',
    direction: -1,
    category: 'CREDIT_NOTE',
    letter_type: 'A',
    afip_code: '128',
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NCB-C',
    description: 'Nota de Crédito B Compra',
    direction: -1,
    category: 'CREDIT_NOTE',
    letter_type: 'B',
    afip_code: '132',
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NCC-C',
    description: 'Nota de Crédito C Compra',
    direction: -1,
    category: 'CREDIT_NOTE',
    letter_type: 'C',
    afip_code: '203',
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: true,
    affects_tax_book: true,
  },

  // ═══════════════════════════════════════════════════════════
  // NOTAS DE DÉBITO DE COMPRA (direction: -1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'NDA-C',
    description: 'Nota de Débito Compra A',
    direction: -1,
    category: 'DEBIT_NOTE',
    letter_type: 'A',
    afip_code: '135',
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NDB-C',
    description: 'Nota de Débito B Compra',
    direction: -1,
    category: 'DEBIT_NOTE',
    letter_type: 'B',
    afip_code: '139',
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
  },
  {
    code: 'NDC-C',
    description: 'Nota de Débito C Compra',
    direction: -1,
    category: 'DEBIT_NOTE',
    letter_type: 'C',
    afip_code: '213',
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
  },

  // ═══════════════════════════════════════════════════════════
  // ÓRDENES (direction: 1 o -1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'OV',
    description: 'Orden de Venta',
    direction: 1,
    category: 'ORDER',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: false,
    affects_tax_book: false,
  },
  {
    code: 'OC',
    description: 'Orden de Compra',
    direction: -1,
    category: 'ORDER',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: false,
    affects_tax_book: false,
  },

  // ═══════════════════════════════════════════════════════════
  // PRESUPUESTOS (direction: 1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'PRES',
    description: 'Presupuesto',
    direction: 1,
    category: 'QUOTE',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: false,
    affects_tax_book: false,
  },

  // ═══════════════════════════════════════════════════════════
  // RECIBOS (direction: 1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'REC',
    description: 'Recibo de Pago',
    direction: 1,
    category: 'RECEIPT',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: false,
  },

  // ═══════════════════════════════════════════════════════════
  // REMITOS (direction: 1 o -1)
  // ═══════════════════════════════════════════════════════════
  {
    code: 'REM-V',
    description: 'Remito de Venta',
    direction: 1,
    category: 'REMITO',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: false,
    affects_tax_book: false,
  },
  {
    code: 'REM-C',
    description: 'Remito de Compra',
    direction: -1,
    category: 'REMITO',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: false,
    affects_tax_book: false,
  },
  {
    code: 'REM-T',
    description: 'Remito de Traslado',
    direction: 1,
    category: 'REMITO',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: true,
    affects_accounting: false,
    affects_tax_book: false,
  },
];

async function main() {
  console.log('Seeding document types...');

  for (const docType of documentTypes) {
    await prisma.document_types.upsert({
      where: { code: docType.code },
      update: {
        description: docType.description,
        direction: docType.direction,
        category: docType.category,
        letter_type: docType.letter_type,
        afip_code: docType.afip_code,
        requires_cae: docType.requires_cae,
        is_electronic: docType.is_electronic,
        affects_stock: docType.affects_stock,
        affects_accounting: docType.affects_accounting,
        affects_tax_book: docType.affects_tax_book,
      },
      create: {
        code: docType.code,
        description: docType.description,
        direction: docType.direction,
        category: docType.category,
        letter_type: docType.letter_type,
        afip_code: docType.afip_code,
        requires_cae: docType.requires_cae,
        is_electronic: docType.is_electronic,
        affects_stock: docType.affects_stock,
        affects_accounting: docType.affects_accounting,
        affects_tax_book: docType.affects_tax_book,
        active: true,
      },
    });
    console.log(`  ✓ ${docType.code} - ${docType.description}`);
  }

  console.log(`\n${documentTypes.length} tipos de documento creados/actualizados`);
  console.log('Document types seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
