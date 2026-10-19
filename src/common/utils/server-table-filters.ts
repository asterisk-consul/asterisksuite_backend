import { BadRequestException } from '@nestjs/common';

export type ServerTableFilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'between'
  | 'gt'
  | 'lt'
  | 'in';

export interface ServerTableFilter {
  column: string;
  operator: ServerTableFilterOperator;
  value: unknown;
}

const ALLOWED_OPERATORS = new Set<ServerTableFilterOperator>([
  'contains',
  'equals',
  'startsWith',
  'endsWith',
  'between',
  'gt',
  'lt',
  'in',
]);

export function parseServerTableFilters(raw?: string): ServerTableFilter[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new BadRequestException('El formato de los filtros de tabla no es válido');
  }

  if (!Array.isArray(parsed) || parsed.length > 20) {
    throw new BadRequestException('Los filtros de tabla no son válidos');
  }

  return parsed.map((candidate) => {
    if (!candidate || typeof candidate !== 'object') {
      throw new BadRequestException('Uno de los filtros de tabla no es válido');
    }

    const filter = candidate as Record<string, unknown>;
    const column = typeof filter.column === 'string' ? filter.column.trim() : '';
    const operator = filter.operator as ServerTableFilterOperator;

    if (!column || !ALLOWED_OPERATORS.has(operator)) {
      throw new BadRequestException('Uno de los filtros de tabla no es válido');
    }

    return { column, operator, value: filter.value };
  });
}

export function stringFilter(value: unknown, operator: ServerTableFilterOperator) {
  const text = String(value ?? '').trim();
  if (!text) return undefined;

  if (operator === 'equals') return { equals: text, mode: 'insensitive' as const };
  if (operator === 'startsWith') return { startsWith: text, mode: 'insensitive' as const };
  if (operator === 'endsWith') return { endsWith: text, mode: 'insensitive' as const };
  return { contains: text, mode: 'insensitive' as const };
}

export function numberFilter(value: unknown, operator: ServerTableFilterOperator) {
  const number = Number(value);
  if (!Number.isFinite(number)) return undefined;
  if (operator === 'gt') return { gt: number };
  if (operator === 'lt') return { lt: number };
  return number;
}

export function dateFilter(value: unknown, operator: ServerTableFilterOperator) {
  if (operator === 'between' && value && typeof value === 'object') {
    const range = value as { start?: string; end?: string };
    const start = range.start ? new Date(range.start) : undefined;
    const end = range.end ? new Date(range.end) : undefined;
    if (end && !Number.isNaN(end.getTime())) end.setHours(23, 59, 59, 999);
    const result = {
      ...(start && !Number.isNaN(start.getTime()) ? { gte: start } : {}),
      ...(end && !Number.isNaN(end.getTime()) ? { lte: end } : {}),
    };
    return Object.keys(result).length ? result : undefined;
  }

  const date = new Date(String(value ?? ''));
  return Number.isNaN(date.getTime()) ? undefined : date;
}
