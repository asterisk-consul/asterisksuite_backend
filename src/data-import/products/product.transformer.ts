import { Transformer } from '../core/interfaces';
import { ParsedProduct } from './product.parser';

export class ProductTransformer implements Transformer<ParsedProduct, ParsedProduct> {
  async transform(products: ParsedProduct[]): Promise<ParsedProduct[]> {
    // Validate and normalize product types
    const validTypes = ['RAW_MATERIAL', 'FINISHED_PRODUCT', 'SEMI_FINISHED', 'SERVICE', 'RATES'];
    const validCostSources = ['MANUAL', 'PURCHASE', 'ENGINEERING', 'BOM', 'RATE'];
    const validCalcTypes = ['UNIT', 'SURFACE', 'VOLUME', 'LINEAR'];

    return products.map(product => ({
      ...product,
      product_type: validTypes.includes(product.product_type) ? product.product_type : 'FINISHED_PRODUCT',
      cost_source: product.cost_source && validCostSources.includes(product.cost_source) ? product.cost_source : 'MANUAL',
      calculation_type: product.calculation_type && validCalcTypes.includes(product.calculation_type) ? product.calculation_type : null,
    }));
  }
}
