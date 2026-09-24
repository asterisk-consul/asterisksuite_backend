const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Reconstruye los saldos corridos de una cuenta sin necesitar una columna de
 * saldo inicial. El saldo base se obtiene del saldo actual menos el efecto de
 * todos los movimientos activos, por lo que también funciona con cuentas ya
 * existentes.
 *
 * Debe llamarse después de crear, modificar o anular un movimiento y, cuando
 * corresponda, dentro de la misma transacción que originó ese cambio.
 */
export async function recalculateBankAccountLedger(prisma: any, bankAccountId: string) {
  const account = await prisma.bank_accounts.findUnique({
    where: { id: bankAccountId },
    select: { balance: true },
  });
  if (!account) return;

  const movements = await prisma.bank_account_movements.findMany({
    where: { bank_account_id: bankAccountId, deleted_at: null },
    orderBy: [{ date: 'asc' }, { created_at: 'asc' }, { id: 'asc' }],
    select: { id: true, balance_before: true, balance_after: true },
  });

  const totalDelta = movements.reduce(
    (sum: number, movement: any) => sum + Number(movement.balance_after) - Number(movement.balance_before),
    0,
  );
  let runningBalance = money(Number(account.balance) - totalDelta);

  for (const movement of movements) {
    const delta = money(Number(movement.balance_after) - Number(movement.balance_before));
    const balanceBefore = runningBalance;
    const balanceAfter = money(balanceBefore + delta);
    if (
      Number(movement.balance_before) !== balanceBefore ||
      Number(movement.balance_after) !== balanceAfter
    ) {
      await prisma.bank_account_movements.update({
        where: { id: movement.id },
        data: { balance_before: balanceBefore, balance_after: balanceAfter },
      });
    }
    runningBalance = balanceAfter;
  }

  await prisma.bank_accounts.update({
    where: { id: bankAccountId },
    data: { balance: runningBalance, updated_at: new Date() },
  });

  return runningBalance;
}
