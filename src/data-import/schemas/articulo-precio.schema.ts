import { z } from 'zod';

const parsePrecio = z.preprocess(
  (val) => {
    if (val === null || val === undefined || val === '') return 0;
    const str = String(val).trim();
    if (/^[0-9]+$/.test(str)) return parseInt(str, 10);

    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');

    // No separators
    if (lastDot === -1 && lastComma === -1) return parseFloat(str) || 0;

    // Only dots → European thousands (no decimals)
    if (lastDot !== -1 && lastComma === -1) {
      return parseFloat(str.replace(/\./g, '')) || 0;
    }

    // Only comma → could be decimal
    if (lastComma !== -1 && lastDot === -1) {
      const afterComma = str.length - lastComma - 1;
      if (afterComma <= 3) {
        return parseFloat(str.replace(',', '.')) || 0;
      }
      return parseFloat(str.replace(/,/g, '')) || 0;
    }

    // Both present: last one is decimal separator
    if (lastComma > lastDot) {
      // "1.234,56" → remove dots, comma→dot
      return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
    } else {
      // "1,234.56" → remove commas
      return parseFloat(str.replace(/,/g, '')) || 0;
    }
  },
  z.number(),
);

export const ArticuloPrecioSchema = z.object({
  codigo: z.string(),
  precio: parsePrecio,
});

export type ArticuloPrecioRaw = z.infer<typeof ArticuloPrecioSchema>;
