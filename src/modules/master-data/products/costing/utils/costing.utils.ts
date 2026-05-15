// src/modules/master-data/products/costing/utils/costing.utils.ts

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function safeNumber(value: unknown): number {
  return Number(value ?? 0);
}
