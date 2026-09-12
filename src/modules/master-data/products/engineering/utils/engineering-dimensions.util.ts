export function mmToMeters(mm: number): number {
  return mm / 1000;
}

export function calculateSurfaceM2(lengthMm: number, widthMm: number): number {
  const lengthM = mmToMeters(lengthMm);

  const widthM = mmToMeters(widthMm);

  return lengthM * widthM;
}

export function calculateVolumeM3(
  lengthMm: number,
  widthMm: number,
  heightMm: number,
): number {
  const lengthM = mmToMeters(lengthMm);

  const widthM = mmToMeters(widthMm);

  const heightM = mmToMeters(heightMm);

  return lengthM * widthM * heightM;
}
