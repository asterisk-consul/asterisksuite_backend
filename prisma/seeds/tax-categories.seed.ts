import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/generated/prisma/client'
import 'dotenv/config'

const tenantArg = process.argv[2]

if (!tenantArg) {
  console.error('Usage: npx tsx prisma/seeds/tax-categories.seed.ts <tenant>')
  console.error('Example: npx tsx prisma/seeds/tax-categories.seed.ts dev')
  process.exit(1)
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE environment variable is not defined')
  process.exit(1)
}

const tenantDb = `${tenantArg}_db`
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`

console.log(`Connecting to tenant database: ${tenantDb}`)

const pool = new Pool({
  connectionString,
  options: `-c search_path="tenant",public`,
  max: 5,
})

const adapter = new PrismaPg(pool, { schema: 'tenant' })
const prisma = new PrismaClient({ adapter })

async function ensureIvaTaxes() {
  console.log('📋 Ensuring IVA taxes exist...')
  
  const ivaTaxes = [
    { code: 'IVA_21', name: 'IVA 21%', rate: 21, tax_type: 'IVA', calculation_level: 'line' },
    { code: 'IVA_105', name: 'IVA 10.5%', rate: 10.5, tax_type: 'IVA', calculation_level: 'line' },
    { code: 'IVA_27', name: 'IVA 27%', rate: 27, tax_type: 'IVA', calculation_level: 'line' },
  ]

  for (const tax of ivaTaxes) {
    const existing = await prisma.taxes.findFirst({
      where: { code: tax.code, rate: tax.rate, active: true },
    })
    if (!existing) {
      await prisma.taxes.create({
        data: {
          ...tax,
          is_percentage: true,
          active: true,
        },
      })
      console.log(`  ✅ Created tax: ${tax.name}`)
    } else {
      console.log(`  ℹ️  Tax already exists: ${tax.name}`)
    }
  }
}

async function main() {
  console.log('🌱 Seeding tax categories...')

  // 0. Asegurar que existan los impuestos IVA
  await ensureIvaTaxes()

  // 1. Crear categorías fiscales
  const grav21 = await prisma.tax_categories.upsert({
    where: { code: 'GRAV_21' },
    update: {},
    create: {
      code: 'GRAV_21',
      name: 'Gravado 21%',
      description: 'IVA al 21%',
      active: true,
    },
  })
  console.log('  ✅ GRAV_21:', grav21.id)

  const grav105 = await prisma.tax_categories.upsert({
    where: { code: 'GRAV_105' },
    update: {},
    create: {
      code: 'GRAV_105',
      name: 'Gravado 10.5%',
      description: 'IVA al 10.5%',
      active: true,
    },
  })
  console.log('  ✅ GRAV_105:', grav105.id)

  const grav27 = await prisma.tax_categories.upsert({
    where: { code: 'GRAV_27' },
    update: {},
    create: {
      code: 'GRAV_27',
      name: 'Gravado 27%',
      description: 'IVA al 27%',
      active: true,
    },
  })
  console.log('  ✅ GRAV_27:', grav27.id)

  const exento = await prisma.tax_categories.upsert({
    where: { code: 'EXENTO' },
    update: {},
    create: {
      code: 'EXENTO',
      name: 'Exento',
      description: 'Sin IVA',
      active: true,
    },
  })
  console.log('  ✅ EXENTO:', exento.id)

  const noGrav = await prisma.tax_categories.upsert({
    where: { code: 'NO_GRAV' },
    update: {},
    create: {
      code: 'NO_GRAV',
      name: 'No Gravado',
      description: 'No gravado, no genera crédito fiscal',
      active: true,
    },
  })
  console.log('  ✅ NO_GRAV:', noGrav.id)

  // 2. Buscar impuestos IVA existentes (compatible con ambos códigos)
  const iva21 = await prisma.taxes.findFirst({
    where: { code: { in: ['IVA_21', 'IVA'] }, rate: 21, active: true },
  })
  const iva105 = await prisma.taxes.findFirst({
    where: { code: { in: ['IVA_105', 'IVA'] }, rate: 10.5, active: true },
  })
  const iva27 = await prisma.taxes.findFirst({
    where: { code: { in: ['IVA_27', 'IVA'] }, rate: 27, active: true },
  })

  // 3. Asociar impuestos a categorías
  if (iva21) {
    await prisma.tax_category_taxes.upsert({
      where: {
        tax_category_id_tax_id: {
          tax_category_id: grav21.id,
          tax_id: iva21.id,
        },
      },
      update: {},
      create: {
        tax_category_id: grav21.id,
        tax_id: iva21.id,
        is_included_in_price: false,
        active: true,
      },
    })
    console.log('  ✅ GRAV_21 → IVA 21%')
  } else {
    console.log('  ⚠️  IVA 21% no encontrado en taxes. Crealo manualmente.')
  }

  if (iva105) {
    await prisma.tax_category_taxes.upsert({
      where: {
        tax_category_id_tax_id: {
          tax_category_id: grav105.id,
          tax_id: iva105.id,
        },
      },
      update: {},
      create: {
        tax_category_id: grav105.id,
        tax_id: iva105.id,
        is_included_in_price: false,
        active: true,
      },
    })
    console.log('  ✅ GRAV_105 → IVA 10.5%')
  } else {
    console.log('  ⚠️  IVA 10.5% no encontrado en taxes.')
  }

  if (iva27) {
    await prisma.tax_category_taxes.upsert({
      where: {
        tax_category_id_tax_id: {
          tax_category_id: grav27.id,
          tax_id: iva27.id,
        },
      },
      update: {},
      create: {
        tax_category_id: grav27.id,
        tax_id: iva27.id,
        is_included_in_price: false,
        active: true,
      },
    })
    console.log('  ✅ GRAV_27 → IVA 27%')
  } else {
    console.log('  ⚠️  IVA 27% no encontrado en taxes.')
  }

  console.log('\n🎉 Tax categories seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding tax categories:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
