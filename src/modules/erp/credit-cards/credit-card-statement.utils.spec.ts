import { getCreditCardStatementCycle, splitCreditCardAmount } from './credit-card-statement.utils';

describe('credit-card statement schedule', () => {
  it('puts a purchase on the closing date in that statement and schedules the due date next month', () => {
    const cycle = getCreditCardStatementCycle(new Date('2026-10-20T00:00:00.000Z'), 1, 20, 10);

    expect(cycle.closingDate.toISOString().slice(0, 10)).toBe('2026-10-20');
    expect(cycle.dueDate.toISOString().slice(0, 10)).toBe('2026-11-10');
    expect([cycle.year, cycle.month]).toEqual([2026, 10]);
  });

  it('moves purchases after closing to the next cycle and advances installments by cycle', () => {
    const first = getCreditCardStatementCycle(new Date('2026-10-21T00:00:00.000Z'), 1, 20, 10);
    const second = getCreditCardStatementCycle(new Date('2026-10-21T00:00:00.000Z'), 2, 20, 10);

    expect(first.closingDate.toISOString().slice(0, 10)).toBe('2026-11-20');
    expect(first.dueDate.toISOString().slice(0, 10)).toBe('2026-12-10');
    expect(second.closingDate.toISOString().slice(0, 10)).toBe('2026-12-20');
    expect(second.dueDate.toISOString().slice(0, 10)).toBe('2027-01-10');
  });

  it('clamps closing and due days to the last valid day of each month', () => {
    const cycle = getCreditCardStatementCycle(new Date('2026-01-31T00:00:00.000Z'), 3, 31, 31);

    expect(cycle.closingDate.toISOString().slice(0, 10)).toBe('2026-03-31');
    expect(cycle.dueDate.toISOString().slice(0, 10)).toBe('2026-04-30');
  });

  it('distributes rounding remainder into the final installment', () => {
    expect(splitCreditCardAmount(100, 3)).toEqual([33.33, 33.33, 33.34]);
    expect(splitCreditCardAmount(90.01, 2)).toEqual([45, 45.01]);
  });
});
