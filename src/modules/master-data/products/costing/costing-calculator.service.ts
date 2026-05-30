import { Injectable } from '@nestjs/common';
import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';
import { CostRateSnapshot } from './interfaces/calculated-cost.interface';
import { round2 } from './utils/costing.utils';

export interface TemplateComponent {
  cost_component_id: string;
  value_override: number | null;
  order: number;
  component: {
    id: string;
    name: string;
    type: string; // CostComponentType
    value_type: string; // CostValueType
    value: number | null;
  };
}

export interface ComponentCostResult {
  material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  other_cost: number;
  total_cost: number;
  rates_snapshot: Record<string, CostRateSnapshot>;
}

@Injectable()
export class CostingCalculatorService {
  // ─── Cálculo base de material (sin cambios) ───────────────────────────────

  calculateMaterialCost(breakdown: CostBreakdownItem[]): number {
    return round2(
      this.flatten(breakdown).reduce((acc, i) => acc + i.total_cost, 0),
    );
  }

  calculateEngineeringCost(breakdown: CostBreakdownItem[]): number {
    return this.calculateMaterialCost(breakdown);
  }

  calculatePurchaseCost(breakdown: CostBreakdownItem[]): number {
    return this.calculateMaterialCost(breakdown);
  }

  // ─── Nuevo: cálculo por componentes de template ───────────────────────────

  calculateFromComponents(
    materialCost: number,
    components: TemplateComponent[],
  ): ComponentCostResult {
    let runningTotal = materialCost;
    let laborCost = 0;
    let overheadCost = 0;
    let otherCost = 0;
    const ratesSnapshot: Record<string, CostRateSnapshot> = {};

    const sorted = [...components].sort((a, b) => a.order - b.order);

    for (const tc of sorted) {
      const { component, value_override } = tc;

      if (component.type === 'MATERIAL') continue;

      const rate = Number(value_override ?? component.value ?? 0);
      let cost = 0;

      switch (component.value_type) {
        case 'PERCENTAGE_OF_MATERIAL':
          cost = round2(materialCost * rate);
          break;
        case 'PERCENTAGE_OF_TOTAL':
          cost = round2(runningTotal * rate);
          break;
        case 'FIXED_PER_UNIT':
          cost = round2(rate);
          break;
      }

      if (component.type === 'LABOR') laborCost = round2(laborCost + cost);
      if (component.type === 'OVERHEAD')
        overheadCost = round2(overheadCost + cost);
      if (component.type === 'OTHER') otherCost = round2(otherCost + cost);

      runningTotal = round2(runningTotal + cost);

      ratesSnapshot[component.id] = {
        name: component.name,
        type: component.type,
        value_type: component.value_type,
        rate_used: rate,
        cost_applied: cost,
      };
    }

    return {
      material_cost: materialCost,
      labor_cost: laborCost,
      overhead_cost: overheadCost,
      other_cost: otherCost,
      total_cost: runningTotal,
      rates_snapshot: ratesSnapshot,
    };
  }

  // ─── Fallback hardcoded (mientras no hay templates configurados) ──────────

  calculateLaborCost(materialCost: number): number {
    return round2(materialCost * 0.15);
  }

  calculateOverheadCost(materialCost: number): number {
    return round2(materialCost * 0.1);
  }

  // ─── Utils ────────────────────────────────────────────────────────────────

  private flatten(items: CostBreakdownItem[]): CostBreakdownItem[] {
    const result: CostBreakdownItem[] = [];
    for (const item of items) {
      result.push(item);
      if (item.children?.length) result.push(...this.flatten(item.children));
    }
    return result;
  }
}
