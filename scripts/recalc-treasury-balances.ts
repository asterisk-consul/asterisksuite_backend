/**
 * Recalcula saldos y balance_before/after de movimientos de tesorería.
 *
 * Uso:
 *   npx tsx scripts/recalc-treasury-balances.ts <tenant_db> [--box=<id>:<apertura>] [--bank=<id>:<apertura>]
 *
 * Ejemplo:
 *   npx tsx scripts/recalc-treasury-balances.ts empresaa_db --bank=bf3acd06-2f31-4903-8afa-c43380ecebae:17
 *
 * - Cajas: el ancla es el opening_balance de la sesión más antigua (o el override --box).
 * - Bancos: el ancla es el balance_before del primer movimiento (o el override --bank).
 *   Si el primer movimiento fue creado con el bug (balance_before corrupto), pasar el
 *   saldo inicial real con --bank=<id>:<apertura>.
 */
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import 'dotenv/config';

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE;
if (!DATABASE_URL_BASE) {
  throw new Error('DATABASE_URL_BASE environment variable is not defined');
}

const args = process.argv.slice(2);
const tenantDb = args.find((a) => !a.startsWith('--'));
if (!tenantDb) {
  console.error('Uso: npx tsx scripts/recalc-treasury-balances.ts <tenant_db> [--box=<id>:<apertura>] [--bank=<id>:<apertura>]');
  process.exit(1);
}

const overrides = { box: new Map<string, number>(), bank: new Map<string, number>() };
for (const arg of args) {
  const boxMatch = arg.match(/^--box=([^:]+):([\d.]+)$/);
  if (boxMatch) overrides.box.set(boxMatch[1], Number(boxMatch[2]));
  const bankMatch = arg.match(/^--bank=([^:]+):([\d.]+)$/);
  if (bankMatch) overrides.bank.set(bankMatch[1], Number(bankMatch[2]));
}

async function main() {
  const connectionString = `${DATABASE_URL_BASE}${tenantDb}`;
  const pool = new Pool({
    connectionString,
    options: `-c search_path="tenant",public`,
    max: 5,
  });
  const adapter = new PrismaPg(pool, { schema: 'tenant' });
  const prisma = new PrismaClient({ adapter });

  try {
    await recalcCashBoxes(prisma);
    await recalcBankAccounts(prisma);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function recalcCashBoxes(prisma: PrismaClient) {
  const boxes = await prisma.cash_boxes.findMany({ where: { deleted_at: null } });
  console.log(`\n=== CAJAS (${boxes.length}) ===`);

  for (const box of boxes) {
    const currency = box.currency_code ?? '';
    const movements = await prisma.cash_box_movements.findMany({
      where: { cash_box_id: box.id, currency_code: currency, deleted_at: null },
      orderBy: [{ date: 'asc' }, { created_at: 'asc' }],
    });

    let anchor: number;
    if (overrides.box.has(box.id)) {
      anchor = overrides.box.get(box.id)!;
    } else {
      const firstSession = await prisma.cash_box_sessions.findFirst({
        where: { cash_box_id: box.id, deleted_at: null },
        orderBy: { opened_at: 'asc' },
      });
      anchor = firstSession ? Number(firstSession.opening_balance) : 0;
    }

    let running = anchor;
    let changed = 0;
    for (const m of movements) {
      const amount = m.amount.toNumber();
      const before = running;
      const after = running + amount;
      if (m.balance_before.toNumber() !== before || m.balance_after.toNumber() !== after) {
        await prisma.cash_box_movements.update({
          where: { id: m.id },
          data: { balance_before: before, balance_after: after },
        });
        changed++;
      }
      running = after;
    }

    const balanceRow = await prisma.cash_box_balances.findUnique({
      where: { cash_box_id_currency_code: { cash_box_id: box.id, currency_code: currency } },
    });
    if (balanceRow && balanceRow.balance.toNumber() !== running) {
      await prisma.cash_box_balances.update({
        where: { id: balanceRow.id },
        data: { balance: running, updated_at: new Date() },
      });
      console.log(`  [${box.name}] cash_box_balances: ${balanceRow.balance} -> ${running}`);
    }

    console.log(`  [${box.name}] ${movements.length} movimientos, apertura=${anchor}, saldo final=${running}, corregidos=${changed}`);
  }
}

async function recalcBankAccounts(prisma: PrismaClient) {
  const accounts = await prisma.bank_accounts.findMany({ where: { deleted_at: null } });
  console.log(`\n=== BANCOS (${accounts.length}) ===`);

  for (const account of accounts) {
    const movements = await prisma.bank_account_movements.findMany({
      where: { bank_account_id: account.id, deleted_at: null },
      orderBy: [{ date: 'asc' }, { created_at: 'asc' }],
    });

    let anchor: number;
    if (overrides.bank.has(account.id)) {
      anchor = overrides.bank.get(account.id)!;
    } else if (movements.length > 0) {
      anchor = movements[0].balance_before.toNumber();
    } else {
      anchor = account.balance.toNumber();
    }

    let running = anchor;
    let changed = 0;
    for (const m of movements) {
      const amount = m.amount.toNumber();
      const before = running;
      const after = running + amount;
      if (m.balance_before.toNumber() !== before || m.balance_after.toNumber() !== after) {
        await prisma.bank_account_movements.update({
          where: { id: m.id },
          data: { balance_before: before, balance_after: after },
        });
        changed++;
      }
      running = after;
    }

    if (account.balance.toNumber() !== running) {
      await prisma.bank_accounts.update({
        where: { id: account.id },
        data: { balance: running, updated_at: new Date() },
      });
      console.log(`  [${account.name}] balance: ${account.balance} -> ${running}`);
    }

    console.log(`  [${account.name}] ${movements.length} movimientos, apertura=${anchor}, saldo final=${running}, corregidos=${changed}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
