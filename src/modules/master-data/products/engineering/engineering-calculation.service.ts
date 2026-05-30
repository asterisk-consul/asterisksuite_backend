// engineering-calculation.service

import { Injectable } from '@nestjs/common';

import { calculateSurfaceM2, calculateVolumeM3 } from './utils/engineering-dimensions.util';

export interface EngineeringCalculatedComponent {
  product_id: string;

  product_name: string;

  product_sku?: string | null;

  variant_id?: string | null;

  variant_name?: string | null;

  variant_sku?: string | null;

  quantity: number;

  calculated_quantity: number;

  surface_m2: number;

  volume_m3: number;

  calculated_weight_kg: number;

  waste_percentage: number;
}

@Injectable()
export class EngineeringCalculationService {
  calculateTree(tree: any[]) {
    const flattened = this.flatten(tree);

    let totalWeightKg = 0;

    const materials: EngineeringCalculatedComponent[] = flattened.map((item) => {
      const calculation = this.calculateComponent(item);

      totalWeightKg += calculation.calculated_weight_kg;

      return calculation;
    });

    return {
      total_weight_kg: totalWeightKg,
      materials,
    };
  }

  // ─────────────────────────────────────────────
  // FLATTEN TREE
  // ─────────────────────────────────────────────

  private flatten(tree: any[]): any[] {
    const result: any[] = [];

    for (const item of tree) {
      result.push(item);

      if (item.children?.length) {
        result.push(...this.flatten(item.children));
      }
    }

    return result;
  }

  // ─────────────────────────────────────────────
  // MAIN CALCULATION
  // ─────────────────────────────────────────────

  private calculateComponent(component: any): EngineeringCalculatedComponent {
    const product = component.child_product;

    const calculationType = product?.calculation_type ?? 'UNIT';

    switch (calculationType) {
      case 'SURFACE':
        return this.calculateSurfaceComponent(component);

      case 'VOLUME':
        return this.calculateVolumeComponent(component);

      case 'LINEAR':
        return this.calculateLinearComponent(component);

      case 'UNIT':
      default:
        return this.calculateUnitComponent(component);
    }
  }

  // ─────────────────────────────────────────────
  // COMMON DATA
  // ─────────────────────────────────────────────

  private getCommonFields(component: any) {
    return {
      product_id: component.child_product_id,

      product_name: component.child_product?.name || 'Producto',

      product_sku: component.child_product?.sku || null,

      variant_id: component.child_variant_id || null,

      variant_name: component.child_variant?.name || null,

      variant_sku: component.child_variant?.sku || null,
    };
  }

  // ─────────────────────────────────────────────
  // UNIT
  // ─────────────────────────────────────────────

  private calculateUnitComponent(component: any): EngineeringCalculatedComponent {
    return {
      ...this.getCommonFields(component),

      quantity: Number(component.quantity),

      calculated_quantity: Number(component.quantity),

      surface_m2: 0,

      volume_m3: 0,

      calculated_weight_kg: 0,

      waste_percentage: Number(component.waste_percentage || 0),
    };
  }

  // ─────────────────────────────────────────────
  // SURFACE
  // ─────────────────────────────────────────────

  private calculateSurfaceComponent(component: any): EngineeringCalculatedComponent {
    const variant = component.child_variant;

    const thicknessM = Number(variant?.thickness_mm || 0) / 1000;

    const densityKgM3 = Number(variant?.density_kg_m3 || 0);

    const wastePercentage = Number(component.waste_percentage || 0);

    const areaM2 = calculateSurfaceM2(Number(component.length_mm || 0), Number(component.width_mm || 0));

    const volumeM3 = areaM2 * thicknessM;

    const rawWeightKg = volumeM3 * densityKgM3;

    const finalWeightKg = rawWeightKg * (1 + wastePercentage / 100);

    return {
      ...this.getCommonFields(component),

      quantity: Number(component.quantity),

      calculated_quantity: finalWeightKg,

      surface_m2: areaM2,

      volume_m3: volumeM3,

      calculated_weight_kg: finalWeightKg,

      waste_percentage: wastePercentage,
    };
  }

  // ─────────────────────────────────────────────
  // LINEAR
  // ─────────────────────────────────────────────

  private calculateLinearComponent(component: any): EngineeringCalculatedComponent {
    const variant = component.child_variant;

    const wastePercentage = Number(component.waste_percentage || 0);

    const lengthM = Number(component.length_mm || 0) / 1000;

    const finalLength = lengthM * (1 + wastePercentage / 100);

    const weightPerMeterKg = Number(variant?.weight_per_meter_kg || 0);

    const finalWeightKg = finalLength * weightPerMeterKg;

    return {
      ...this.getCommonFields(component),

      quantity: Number(component.quantity),

      calculated_quantity: finalLength,

      surface_m2: 0,

      volume_m3: 0,

      calculated_weight_kg: finalWeightKg,

      waste_percentage: wastePercentage,
    };
  }

  // ─────────────────────────────────────────────
  // VOLUME
  // ─────────────────────────────────────────────

  private calculateVolumeComponent(component: any): EngineeringCalculatedComponent {
    const wastePercentage = Number(component.waste_percentage || 0);

    const volumeM3 = calculateVolumeM3(
      Number(component.length_mm || 0),
      Number(component.width_mm || 0),
      Number(component.height_mm || 0),
    );

    const finalVolume = volumeM3 * (1 + wastePercentage / 100);

    return {
      ...this.getCommonFields(component),

      quantity: Number(component.quantity),

      calculated_quantity: finalVolume,

      surface_m2: 0,

      volume_m3: finalVolume,

      calculated_weight_kg: 0,

      waste_percentage: wastePercentage,
    };
  }
}
