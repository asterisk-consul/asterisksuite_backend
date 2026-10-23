export interface CreditCardStatementCycle {
  closingDate: Date;
  dueDate: Date;
  month: number;
  year: number;
}

function dateInMonth(year: number, monthIndex: number, day: number): Date {
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, monthIndex, Math.min(Math.max(1, day), lastDay)));
}

export function getCreditCardStatementCycle(
  purchaseDate: Date,
  installmentNumber: number,
  closingDay: number,
  dueDay: number,
): CreditCardStatementCycle {
  const purchaseYear = purchaseDate.getUTCFullYear();
  const purchaseMonth = purchaseDate.getUTCMonth();
  const purchaseDay = purchaseDate.getUTCDate();
  const firstClosingMonth = purchaseMonth + (purchaseDay <= closingDay ? 0 : 1);
  const closingMonth = firstClosingMonth + Math.max(0, installmentNumber - 1);
  const closingDate = dateInMonth(purchaseYear, closingMonth, closingDay);
  const dueDate = dateInMonth(purchaseYear, closingMonth + 1, dueDay);

  return {
    closingDate,
    dueDate,
    month: closingDate.getUTCMonth() + 1,
    year: closingDate.getUTCFullYear(),
  };
}

export function splitCreditCardAmount(amount: number, installments: number): number[] {
  const count = Math.max(1, Math.floor(installments));
  const cents = Math.round((Number(amount) + Number.EPSILON) * 100);
  const baseCents = Math.floor(cents / count);
  const remainder = cents - baseCents * count;

  return Array.from({ length: count }, (_, index) => (baseCents + (index === count - 1 ? remainder : 0)) / 100);
}
