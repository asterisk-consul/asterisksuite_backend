import { Parser, ParseResult } from '../core/interfaces';
import {
  ArticuloPrecioSchema,
  ArticuloPrecioRaw,
} from '../schemas/articulo-precio.schema';
import { ZodError } from 'zod';

type ArticuloPrecioRow = Record<string, unknown>;

function normalizeHeader(header: string): string {
  return header
    .normalize('NFD') // separa acentos
    .replace(/\p{Diacritic}/gu, '') // elimina acentos
    .toUpperCase()
    .trim();
}

export class ArticuloPrecioParser implements Parser<ArticuloPrecioRaw> {

  parse(raw: unknown[]): ArticuloPrecioRaw[] {
    return raw.map((row) => {

      const r = row as ArticuloPrecioRow;

      const normalized = Object.keys(r).reduce(
        (acc, key) => {
          acc[normalizeHeader(key)] = r[key];
          return acc;
        },
        {} as Record<string, unknown>,
      );

      return ArticuloPrecioSchema.parse({
        codigo: normalized['CODIGO DE ARTICULO'],
        precio: normalized['IMPORTE MONEDA EXTRANJERA ULTIMA COMPRA'],
      });
    });
  }

  parseWithErrors(raw: unknown[]): ParseResult<ArticuloPrecioRaw> {

    const success: ArticuloPrecioRaw[] = [];
    const errors: ParseResult<ArticuloPrecioRaw>['errors'] = [];

    raw.forEach((row, index) => {
      try {

        const r = row as ArticuloPrecioRow;

        const normalized = Object.keys(r).reduce(
          (acc, key) => {
            acc[normalizeHeader(key)] = r[key];
            return acc;
          },
          {} as Record<string, unknown>,
        );

        const validated = ArticuloPrecioSchema.parse({
          codigo: normalized['CODIGO DE ARTICULO'],
          precio: normalized['IMPORTE MONEDA EXTRANJERA ULTIMA COMPRA'],
        });

        success.push(validated);

      } catch (error) {

        if (error instanceof ZodError) {

          errors.push({
            row: index + 2, // +2 porque excel tiene header
            data: row,
            errors: error.issues.map(
              (e) => `${e.path.join('.')}: ${e.message}`,
            ),
          });

        } else {

          errors.push({
            row: index + 2,
            data: row,
            errors: ['Error desconocido al parsear'],
          });

        }
      }
    });

    return { success, errors };
  }
}