import { Parser, ParseResult } from '../core/interfaces';
import {
  ArticuloPrecioSchema,
  ArticuloPrecioRaw,
} from '../schemas/articulo-precio.schema';
import { ZodError } from 'zod';

type ArticuloPrecioRow = Record<string, unknown>;

export class ArticuloPrecioParser implements Parser<ArticuloPrecioRaw> {
  parse(raw: unknown[]): ArticuloPrecioRaw[] {
    return raw.map((row) => {
      const r = row as ArticuloPrecioRow;

      const normalized = Object.keys(r).reduce(
        (acc, key) => {
          acc[key.toUpperCase()] = r[key];
          return acc;
        },
        {} as Record<string, unknown>,
      );

      return ArticuloPrecioSchema.parse({
        codigo: normalized.CODIGO,
        precio: normalized.PRECIO,
        proveedor: normalized.PROVEEDOR,
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
            acc[key.toUpperCase()] = r[key];
            return acc;
          },
          {} as Record<string, unknown>,
        );

        const validated = ArticuloPrecioSchema.parse({
          codigo: normalized.CODIGO,
          precio: normalized.PRECIO,
          proveedor: normalized.PROVEEDOR,
        });

        success.push(validated);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push({
            row: index + 2,
            data: row,
            errors: error.issues.map(
              // Cambiado de error.errors a error.issues
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
