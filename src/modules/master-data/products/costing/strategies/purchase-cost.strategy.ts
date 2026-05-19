import { Injectable } from '@nestjs/common';

import { ManualCostStrategy } from './manual-cost.strategy';

@Injectable()
export class PurchaseCostStrategy {
  constructor(private readonly manualStrategy: ManualCostStrategy) {}

  async calculate(productId: string) {
    return this.manualStrategy.calculate(productId);
  }
}
