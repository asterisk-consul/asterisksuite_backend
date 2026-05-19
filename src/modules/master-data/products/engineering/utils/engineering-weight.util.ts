export function calculateWeightKg(
  volumeM3: number,
  densityKgM3: number,
): number {
  return volumeM3 * densityKgM3;
}
