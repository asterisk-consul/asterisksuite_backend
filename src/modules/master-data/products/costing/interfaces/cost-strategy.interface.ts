// interfaces/cost-strategy.interface.ts
import { TemplateComponent } from '../costing-calculator.service';
import { CalculatedCost } from './calculated-cost.interface';

export interface CostStrategyOptions {
  productId: string;
  currencyId: string;
  templateComponents: TemplateComponent[];
  costTemplateId: string | null;
}

export interface ICostStrategy {
  calculate(options: CostStrategyOptions): Promise<CalculatedCost>;
}
