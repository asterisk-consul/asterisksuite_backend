import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import 'dotenv/config';

const tenantArg = process.argv[2];

if (!tenantArg) {
  console.error('Usage: npx tsx prisma/seeds/bank-concepts.seed.ts <tenant>');
  process.exit(1);
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE;
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE not defined');
  process.exit(1);
}

const tenantDb = `${tenantArg}_db`;
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`;

console.log(`Connecting to: ${tenantDb}`);

const pool = new Pool({
  connectionString,
  options: `-c search_path="tenant",public`,
  max: 5,
});

const adapter = new PrismaPg(pool, { schema: 'tenant' });
const prisma = new PrismaClient({ adapter });

const concepts = [
  // COMISIONES
  { code: 'COMISION', name: 'Comisión bancaria', description: 'Comisión por servicios bancarios', concept_type: 'COMMISSION', accounting_account: '6201', calculates_iva: true, iva_rate: 21.0, generates_credit: true, impacts_iva_book: true, default_percentage: 0.8 },
  { code: 'COMISION_DEP', name: 'Comisión por depósito', description: 'Comisión al depositar cheques o efectivo', concept_type: 'COMMISSION', accounting_account: '6201', calculates_iva: true, iva_rate: 21.0, generates_credit: true, impacts_iva_book: true, default_percentage: 0.5 },
  { code: 'COMISION_TRANSF', name: 'Comisión por transferencia', description: 'Comisión al transferir fondos', concept_type: 'COMMISSION', accounting_account: '6201', calculates_iva: true, iva_rate: 21.0, generates_credit: true, impacts_iva_book: true, default_percentage: 0.5 },
  { code: 'COMISION_MANT', name: 'Comisión mantenimiento', description: 'Cargo fijo mensual', concept_type: 'COMMISSION', accounting_account: '6201', calculates_iva: true, iva_rate: 21.0, generates_credit: true, impacts_iva_book: true, default_percentage: null },

  // IMPUESTOS BANCARIOS
  { code: 'IMP_DEBITOS', name: 'Imp. Débitos y Créditos', description: 'Impuesto a débitos y créditos bancarios', concept_type: 'TAX', accounting_account: '6202', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: 0.6 },
  { code: 'IMP_SELLOS', name: 'Imp. Sellos', description: 'Impuesto de sellos', concept_type: 'TAX', accounting_account: '6202', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: 1.0 },
  { code: 'IMP_CHEQUE', name: 'Imp. al Cheque', description: 'Impuesto a los cheques', concept_type: 'TAX', accounting_account: '6202', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },

  // GASTOS
  { code: 'GASTO_ADMIN', name: 'Gasto administrativo', description: 'Gastos varios bancarios', concept_type: 'EXPENSE', accounting_account: '6203', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },
  { code: 'GASTO_COBRANZA', name: 'Gasto de cobranza', description: 'Gastos por cobranza', concept_type: 'EXPENSE', accounting_account: '6203', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },

  // INTERESES
  { code: 'INTERES_DESC', name: 'Interés descubierto', description: 'Interés por descubierto', concept_type: 'INTEREST', accounting_account: '6204', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },
  { code: 'INTERES_PUNT', name: 'Interés punitorio', description: 'Interés por mora', concept_type: 'INTEREST', accounting_account: '6204', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },

  // AJUSTES
  { code: 'AJUSTE_BCRA', name: 'Ajuste BCRA', description: 'Ajuste por resolución', concept_type: 'ADJUSTMENT', accounting_account: '6205', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },
  { code: 'DIF_CAMBIO', name: 'Diferencia de cambio', description: 'Diferencia por tipo de cambio', concept_type: 'ADJUSTMENT', accounting_account: '6205', calculates_iva: false, iva_rate: null, generates_credit: false, impacts_iva_book: false, default_percentage: null },
];

async function main() {
  console.log('Seeding bank concepts...');

  for (const c of concepts) {
    await prisma.bank_concepts.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
    console.log(`  ✓ ${c.code} - ${c.name}`);
  }

  console.log(`\n${concepts.length} conceptos bancarios creados`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
