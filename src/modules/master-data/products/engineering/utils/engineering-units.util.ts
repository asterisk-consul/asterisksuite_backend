export function applyWaste(quantity: number, wastePercentage = 0): number {
  return quantity * (1 + wastePercentage / 100);
}
