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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
    affects_payment: true,
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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
    affects_payment: true,
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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
    affects_payment: true,
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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: false,
    affects_payment: true,
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
    affects_stock: false,
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
    affects_stock: false,
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
    affects_stock: false,
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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
    affects_payment: true,
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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
    affects_payment: true,
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
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: true,
    affects_payment: true,
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
    affects_stock: false,
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
    affects_stock: false,
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
    affects_stock: false,
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
  // PRESUPUESTOS (direction: 1 y -1)
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
  {
    code: 'PRE-C',
    description: 'Presupuesto de Compra',
    direction: -1,
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
  {
    code: 'SI-C',
    description: 'Saldo Inicial (Cliente)',
    direction: 1,
    category: 'OPENING_BALANCE',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: false,
  },
  {
    code: 'SI-P',
    description: 'Saldo Inicial (Proveedor)',
    direction: -1,
    category: 'OPENING_BALANCE',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: false,
  },
  {
    code: 'VALE',
    description: 'Recibo de Sueldo / Vale RRHH',
    direction: -1,
    category: 'VALE',
    letter_type: null,
    afip_code: null,
    requires_cae: false,
    is_electronic: false,
    affects_stock: false,
    affects_accounting: true,
    affects_tax_book: false,
    affects_payment: true,
  },
];

// Secuencias por defecto para los nuevos tipos
const sequences = [
  { name: 'Presupuestos', point_of_sale: '0001', prefix: 'PRES', forCategory: 'QUOTE' },
  { name: 'Órdenes de Venta', point_of_sale: '0001', prefix: 'OV', forCategory: 'ORDER', direction: 1 },
  { name: 'Órdenes de Compra', point_of_sale: '0001', prefix: 'OC', forCategory: 'ORDER', direction: -1 },
  { name: 'Remitos de Venta', point_of_sale: '0001', prefix: 'REM', forCategory: 'REMITO', direction: 1 },
  { name: 'Remitos de Compra', point_of_sale: '0001', prefix: 'REMC', forCategory: 'REMITO', direction: -1 },
  { name: 'Facturas A Venta', point_of_sale: '0001', prefix: 'FA', forCategory: 'INVOICE', direction: 1, letterType: 'A' },
  { name: 'Facturas B Venta', point_of_sale: '0001', prefix: 'FB', forCategory: 'INVOICE', direction: 1, letterType: 'B' },
  { name: 'Facturas C Venta', point_of_sale: '0001', prefix: 'FC', forCategory: 'INVOICE', direction: 1, letterType: 'C' },
  { name: 'Facturas X Venta', point_of_sale: '0001', prefix: 'FX', forCategory: 'INVOICE', direction: 1, letterType: 'X' },
  { name: 'Facturas A Compra', point_of_sale: '0001', prefix: 'FA-C', forCategory: 'INVOICE', direction: -1, letterType: 'A' },
  { name: 'Facturas B Compra', point_of_sale: '0001', prefix: 'FB-C', forCategory: 'INVOICE', direction: -1, letterType: 'B' },
  { name: 'Facturas C Compra', point_of_sale: '0001', prefix: 'FC-C', forCategory: 'INVOICE', direction: -1, letterType: 'C' },
  { name: 'Notas de Crédito A', point_of_sale: '0001', prefix: 'NCA', forCategory: 'CREDIT_NOTE', direction: 1, letterType: 'A' },
  { name: 'Saldos Iniciales Clientes', point_of_sale: '0001', prefix: 'SI-C', forCategory: 'OPENING_BALANCE', direction: 1 },
  { name: 'Saldos Iniciales Proveedores', point_of_sale: '0001', prefix: 'SI-P', forCategory: 'OPENING_BALANCE', direction: -1 },
  { name: 'Notas de Crédito B', point_of_sale: '0001', prefix: 'NCB', forCategory: 'CREDIT_NOTE', direction: 1, letterType: 'B' },
  { name: 'Notas de Débito A', point_of_sale: '0001', prefix: 'NDA', forCategory: 'DEBIT_NOTE', direction: 1, letterType: 'A' },
  { name: 'Notas de Débito B', point_of_sale: '0001', prefix: 'NDB', forCategory: 'DEBIT_NOTE', direction: 1, letterType: 'B' },
  { name: 'Recibos', point_of_sale: '0001', prefix: 'REC', forCategory: 'RECEIPT' },
  { name: 'VALES', point_of_sale: '0003', prefix: 'V', forCategory: 'VALE' },
  { name: 'Operaciones Internacionales', point_of_sale: '0003', prefix: 'IMP', forCategory: null },
  { name: 'MAINTENANCE_ORDER', point_of_sale: '0000', prefix: 'MO', forCategory: null },
];

async function main() {
  console.log('Seeding document types...');

  // 1. Crear document_types
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
        affects_payment: docType.affects_payment ?? false,
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
        affects_payment: docType.affects_payment ?? false,
        active: true,
      },
    });
    console.log(`  ✓ ${docType.code} - ${docType.description}`);
  }

  console.log(`\n${documentTypes.length} tipos de documento creados/actualizados`);

  // 2. Crear secuencias
  console.log('\nSeeding document sequences...');

  for (const seq of sequences) {
    const existing = await prisma.document_sequences.findFirst({
      where: { point_of_sale: seq.point_of_sale, prefix: seq.prefix },
    });

    if (existing) {
      console.log(`  → ${seq.prefix} ya existe, vinculando...`);
    } else {
      await prisma.document_sequences.create({
        data: {
          name: seq.name,
          point_of_sale: seq.point_of_sale,
          prefix: seq.prefix,
          current_number: 0,
          automatic: true,
          active: true,
        },
      });
      console.log(`  ✓ ${seq.prefix} - ${seq.name}`);
    }
  }

  // 3. Vincular document_types ↔ sequences via junction table
  console.log('\nLinking document_types ↔ sequences via junction table...');

  for (const seq of sequences) {
    const sequence = await prisma.document_sequences.findFirst({
      where: { point_of_sale: seq.point_of_sale, prefix: seq.prefix },
    });

    if (!sequence) continue;

    // Find matching document types
    const where: any = { category: seq.forCategory };
    if (seq.direction) where.direction = seq.direction;
    if (seq.letterType) where.letter_type = seq.letterType;

    const docTypes = await prisma.document_types.findMany({ where });

    for (const dt of docTypes) {
      const existingLink = await prisma.document_type_sequences.findFirst({
        where: { document_type_id: dt.id, sequence_id: sequence.id },
      });

      if (existingLink) continue;

      await prisma.document_type_sequences.create({
        data: {
          document_type_id: dt.id,
          sequence_id: sequence.id,
          is_default: true,
        },
      });
      console.log(`  ✓ ${dt.code} → ${seq.prefix}`);
    }
  }

  console.log('\nDocument types seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
