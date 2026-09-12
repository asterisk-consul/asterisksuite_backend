import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import 'dotenv/config';

const tenantArg = process.argv[2];
if (!tenantArg) {
  console.error('Usage: npx tsx prisma/seeds/accounts.seed.ts <tenant>');
  process.exit(1);
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE;
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE not defined');
  process.exit(1);
}

const tenantDb = `${tenantArg}_db`;
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`;

const pool = new Pool({ connectionString, options: `-c search_path="tenant",public`, max: 5 });
const adapter = new PrismaPg(pool, { schema: 'tenant' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding accounts...');

  // Helper to get account ID by code
  const getAccountId = async (code: string) => {
    const acc = await prisma.accounts.findFirst({ where: { code } });
    return acc?.id;
  };

  // Helper to create account
  const createAccount = async (code: string, name: string, type: string, parentCode?: string) => {
    const parentId = parentCode ? await getAccountId(parentCode) : null;
    return prisma.accounts.upsert({
      where: { code },
      update: { name, account_type: type as any, parent_id: parentId },
      create: { code, name, account_type: type as any, parent_id: parentId, active: true }
    });
  };

  // ══════════════════════════════════════════════════════════
  // NIVEL 1: CLASES
  // ══════════════════════════════════════════════════════════
  await createAccount('1', 'ACTIVO', 'ASSET');
  await createAccount('2', 'PASIVO', 'LIABILITY');
  await createAccount('3', 'PATRIMONIO NETO', 'EQUITY');
  await createAccount('4', 'INGRESOS', 'REVENUE');
  await createAccount('5', 'COSTOS', 'EXPENSE');
  await createAccount('6', 'GASTOS', 'EXPENSE');

  // ══════════════════════════════════════════════════════════
  // NIVEL 2: GRUPOS
  // ══════════════════════════════════════════════════════════
  // ACTIVOS
  await createAccount('1.1', 'Caja y Bancos', 'ASSET', '1');
  await createAccount('1.2', 'Créditos por Ventas', 'ASSET', '1');
  await createAccount('1.3', 'Créditos Fiscales', 'ASSET', '1');
  await createAccount('1.4', 'Depósitos a Plazo', 'ASSET', '1');
  await createAccount('1.5', 'Mercaderías', 'ASSET', '1');
  await createAccount('1.6', 'Documentos a Cobrar', 'ASSET', '1');
  await createAccount('1.7', 'Anticipos', 'ASSET', '1');
  await createAccount('1.8', 'Otros Créditos', 'ASSET', '1');

  // PASIVOS
  await createAccount('2.1', 'Deudas Comerciales', 'LIABILITY', '2');
  await createAccount('2.2', 'Obligaciones con el Fisco', 'LIABILITY', '2');
  await createAccount('2.3', 'Deudas Bancarias', 'LIABILITY', '2');
  await createAccount('2.4', 'Remuneraciones a Pagar', 'LIABILITY', '2');
  await createAccount('2.5', 'Cargas Sociales a Pagar', 'LIABILITY', '2');
  await createAccount('2.6', 'Documentos a Pagar', 'LIABILITY', '2');

  // PATRIMONIO NETO
  await createAccount('3.1', 'Capital Social', 'EQUITY', '3');
  await createAccount('3.2', 'Ajuste de Valores', 'EQUITY', '3');
  await createAccount('3.3', 'Resultados No Distribuidos', 'EQUITY', '3');

  // INGRESOS
  await createAccount('4.1', 'Ingresos por Ventas', 'REVENUE', '4');
  await createAccount('4.2', 'Otros Ingresos', 'REVENUE', '4');
  await createAccount('4.3', 'Descuentos y Bonificaciones', 'REVENUE', '4');

  // COSTOS
  await createAccount('5.1', 'Costo de Mercadería Vendida', 'EXPENSE', '5');
  await createAccount('5.2', 'Costo de Servicios', 'EXPENSE', '5');

  // GASTOS
  await createAccount('6.1', 'Sueldos y Jornales', 'EXPENSE', '6');
  await createAccount('6.2', 'Cargas Sociales', 'EXPENSE', '6');
  await createAccount('6.3', 'Gastos Bancarios', 'EXPENSE', '6');
  await createAccount('6.4', 'Gastos Generales', 'EXPENSE', '6');
  await createAccount('6.5', 'Servicios Públicos', 'EXPENSE', '6');
  await createAccount('6.6', 'Impuestos y Tasas', 'EXPENSE', '6');

  // ══════════════════════════════════════════════════════════
  // NIVEL 3: CUENTAS DETALLE
  // ══════════════════════════════════════════════════════════
  // CAJA Y BANCOS
  await createAccount('1.1.1', 'Caja General', 'ASSET', '1.1');
  await createAccount('1.1.2', 'Banco Galicia', 'ASSET', '1.1');
  await createAccount('1.1.3', 'Banco Santander', 'ASSET', '1.1');
  await createAccount('1.1.4', 'Banco Nación', 'ASSET', '1.1');

  // CRÉDITOS FISCALES
  await createAccount('1.3.1', 'IVA Débito Fiscal', 'ASSET', '1.3');
  await createAccount('1.3.2', 'IVA Crédito Fiscal', 'ASSET', '1.3');
  await createAccount('1.3.3', 'Percepción IIBB', 'ASSET', '1.3');
  await createAccount('1.3.4', 'Retención IVA', 'ASSET', '1.3');
  await createAccount('1.3.5', 'Retención IIBB', 'ASSET', '1.3');

  // MERCADERÍAS
  await createAccount('1.5.1', 'Mercaderías General', 'ASSET', '1.5');
  await createAccount('1.5.2', 'Mercadería en Tránsito', 'ASSET', '1.5');

  // DEUDAS COMERCIALES
  await createAccount('2.1.1', 'Proveedores Nacionales', 'LIABILITY', '2.1');
  await createAccount('2.1.2', 'Proveedores del Exterior', 'LIABILITY', '2.1');

  // OBLIGACIONES CON EL FISCO
  await createAccount('2.2.1', 'IVA Débito Fiscal a Pagar', 'LIABILITY', '2.2');
  await createAccount('2.2.2', 'IVA Crédito Fiscal', 'LIABILITY', '2.2');
  await createAccount('2.2.3', 'Percepciones IVA', 'LIABILITY', '2.2');
  await createAccount('2.2.4', 'Retenciones IVA', 'LIABILITY', '2.2');
  await createAccount('2.2.5', 'Percepciones IIBB', 'LIABILITY', '2.2');
  await createAccount('2.2.6', 'Retenciones IIBB', 'LIABILITY', '2.2');
  await createAccount('2.2.7', 'Retenciones Ganancias', 'LIABILITY', '2.2');
  await createAccount('2.2.8', 'Retenciones SUSS', 'LIABILITY', '2.2');

  // GASTOS BANCARIOS
  await createAccount('6.3.1', 'Comisiones Bancarias', 'EXPENSE', '6.3');
  await createAccount('6.3.2', 'Imp. Débitos y Créditos', 'EXPENSE', '6.3');
  await createAccount('6.3.3', 'Gastos por Cheques', 'EXPENSE', '6.3');

  console.log('\nPlan de cuentas creado correctamente');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
