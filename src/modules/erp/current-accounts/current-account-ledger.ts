const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const DOCUMENT_ACCOUNT_ENTRY_REFERENCE_TYPES = [
  'document',
  'document_reversal',
  'order_invoice_replacement',
  'order_invoice_replacement_reversal',
];

/** Reconstruye el saldo corrido de una cuenta corriente por fecha efectiva. */
export async function recalculateCurrentAccountLedger(prisma: any, currentAccountId: string) {
  const account = await prisma.current_accounts.findUnique({
    where: { id: currentAccountId },
    select: { balance: true },
  });
  if (!account) return;

  const entries = await prisma.current_account_entries.findMany({
    where: { current_account_id: currentAccountId, deleted_at: null },
    orderBy: [{ date: 'asc' }, { created_at: 'asc' }, { id: 'asc' }],
    select: { id: true, date: true, balance_before: true, balance_after: true },
  });

  const totalDelta = entries.reduce(
    (sum: number, entry: any) => sum + Number(entry.balance_after) - Number(entry.balance_before),
    0,
  );
  let runningBalance = money(Number(account.balance) - totalDelta);

  for (const entry of entries) {
    const delta = money(Number(entry.balance_after) - Number(entry.balance_before));
    const balanceBefore = runningBalance;
    const balanceAfter = money(balanceBefore + delta);
    if (Number(entry.balance_before) !== balanceBefore || Number(entry.balance_after) !== balanceAfter) {
      await prisma.current_account_entries.update({
        where: { id: entry.id },
        data: { balance_before: balanceBefore, balance_after: balanceAfter },
      });
    }
    runningBalance = balanceAfter;
  }

  await prisma.current_accounts.update({
    where: { id: currentAccountId },
    data: {
      balance: runningBalance,
      last_entry_date: entries.at(-1)?.date ?? null,
      updated_at: new Date(),
    },
  });

  return runningBalance;
}

/** Retira los efectos corrientes de un documento anulado y reconstruye el saldo. */
export async function removeDocumentAccountEffects(prisma: any, documentId: string, userId: string) {
  const entries = await prisma.current_account_entries.findMany({
    where: {
      reference_id: documentId,
      reference_type: { in: DOCUMENT_ACCOUNT_ENTRY_REFERENCE_TYPES },
      deleted_at: null,
    },
    orderBy: { created_at: 'asc' },
  });

  const entriesByAccount = new Map<string, typeof entries>();
  for (const entry of entries) {
    const accountEntries = entriesByAccount.get(entry.current_account_id) ?? [];
    accountEntries.push(entry);
    entriesByAccount.set(entry.current_account_id, accountEntries);
  }

  for (const [accountId, accountEntries] of entriesByAccount) {
    const removedDelta = accountEntries.reduce(
      (sum, entry) => sum + Number(entry.balance_after) - Number(entry.balance_before),
      0,
    );
    const account = await prisma.current_accounts.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });
    if (!account) continue;

    const now = new Date();
    await prisma.current_account_entries.updateMany({
      where: { id: { in: accountEntries.map(entry => entry.id) } },
      data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
    });
    await prisma.current_accounts.update({
      where: { id: accountId },
      data: { balance: Number(account.balance) - removedDelta, updated_at: now, updated_by: userId },
    });
    await recalculateCurrentAccountLedger(prisma, accountId);
  }

  return entries.length;
}
