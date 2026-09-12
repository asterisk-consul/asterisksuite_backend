import { Parser, ParseResult } from '../core/interfaces';

interface ProductRow {
  SKU?: string;
  Nombre?: string;
  'Nombre *'?: string;
  'Tipo de producto'?: string;
  Tipo?: string;
  Descripción?: string;
  'Activo (SÍ/NO)'?: string;
  'Activo (SI/NO)'?: string;
  Activo?: string;
  'Maneja stock (SÍ/NO)'?: string;
  'Maneja stock (SI/NO)'?: string;
  'Maneja stock'?: string;
  'Requiere refrigeración (SÍ/NO)'?: string;
  'Refrigeracion (SI/NO)'?: string;
  Refrigeracion?: string;
  'Tiene precio (SÍ/NO)'?: string;
  'Tiene precio (SI/NO)'?: string;
  Precio?: string;
  'Es tipo tarifa (SÍ/NO)'?: string;
  'Es tipo tarifa (SI/NO)'?: string;
  'Es compuesto (SÍ/NO)'?: string;
  'Compuesto (SI/NO)'?: string;
  Compuesto?: string;
  'Calcula costo auto (SÍ/NO)'?: string;
  'Calcula costo auto (SI/NO)'?: string;
  'Tiene ingeniería (SÍ/NO)'?: string;
  'Ingenieria (SI/NO)'?: string;
  Ingenieria?: string;
  'Tipo de cálculo'?: string;
  'Tipo calculo'?: string;
  'Fuente de costo'?: string;
  'Fuente costo'?: string;
  'Costo actual'?: string;
  'ID'?: string;
  [key: string]: any;
}

export interface ParsedProduct {
  sku: string | null;
  name: string;
  product_type: string;
  description: string | null;
  active: boolean;
  manages_stock: boolean;
  requires_refrigeration: boolean;
  price_enabled: boolean;
  is_rate_type: boolean;
  is_composed: boolean;
  auto_calculate_cost: boolean;
  has_engineering: boolean;
  calculation_type: string | null;
  cost_source: string | null;
}

export class ProductParser implements Parser<ParsedProduct> {
  parse(raw: unknown[]): ParsedProduct[] {
    return this.parseWithErrors(raw).success;
  }

  parseWithErrors(raw: unknown[]): ParseResult<ParsedProduct> {
    const success: ParsedProduct[] = [];
    const errors: Array<{ row: number; data: unknown; errors: string[] }> = [];

    (raw as ProductRow[]).forEach((row, index) => {
      const rowNum = index + 2;

      // Get name (required)
      const name = (row['Nombre'] || row['Nombre *'] || '').toString().trim();
      if (!name) {
        errors.push({ row: rowNum, data: row, errors: ['Nombre es obligatorio'] });
        return;
      }

      // Parse boolean fields - acepta múltiples variantes de headers
      const parseBool = (val: any): boolean => {
        if (typeof val === 'boolean') return val;
        const str = (val || '').toString().trim().toLowerCase();
        return str === 'sí' || str === 'si' || str === 'yes' || str === 'true' || str === '1';
      };

      success.push({
        sku: (row['SKU'] || null)?.toString().trim() || null,
        name,
        product_type: (row['Tipo de producto'] || row['Tipo'] || 'FINISHED_PRODUCT').toString().trim().toUpperCase(),
        description: (row['Descripción'] || null)?.toString().trim() || null,
        active: parseBool(row['Activo (SÍ/NO)'] || row['Activo (SI/NO)'] || row['Activo']),
        manages_stock: parseBool(row['Maneja stock (SÍ/NO)'] || row['Maneja stock (SI/NO)'] || row['Maneja stock']),
        requires_refrigeration: parseBool(row['Requiere refrigeración (SÍ/NO)'] || row['Refrigeracion (SI/NO)'] || row['Refrigeracion']),
        price_enabled: parseBool(row['Tiene precio (SÍ/NO)'] || row['Tiene precio (SI/NO)'] || row['Precio']),
        is_rate_type: parseBool(row['Es tipo tarifa (SÍ/NO)'] || row['Es tipo tarifa (SI/NO)']),
        is_composed: parseBool(row['Es compuesto (SÍ/NO)'] || row['Compuesto (SI/NO)'] || row['Compuesto']),
        auto_calculate_cost: parseBool(row['Calcula costo auto (SÍ/NO)'] || row['Calcula costo auto (SI/NO)']),
        has_engineering: parseBool(row['Tiene ingeniería (SÍ/NO)'] || row['Ingenieria (SI/NO)'] || row['Ingenieria']),
        calculation_type: (row['Tipo de cálculo'] || row['Tipo calculo'] || null)?.toString().trim().toUpperCase() || null,
        cost_source: (row['Fuente de costo'] || row['Fuente costo'] || null)?.toString().trim().toUpperCase() || null,
      });
    });

    return { success, errors };
  }
}
