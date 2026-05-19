import { Injectable } from '@nestjs/common';

import {
  calculateSurfaceM2,
  calculateVolumeM3,
} from './utils/engineering-dimensions.util';

@Injectable()
export class EngineeringCalculationService {
  calculateTree(tree: any[]) {
    const flattened = this.flatten(tree);

    let totalWeightKg = 0;

    const materials = flattened.map((item) => {
      const calculation = this.calculateComponent(item);

      totalWeightKg += calculation.calculated_weight_kg;

      return calculation;
    });

    return {
      total_weight_kg: totalWeightKg,
      materials,
    };
  }

  private flatten(tree: any[]): any[] {
    const result: any[] = []; // ✅ explicit type annotation

    for (const item of tree) {
      result.push(item);

      if (item.children?.length) {
        result.push(...this.flatten(item.children));
      }
    }

    return result;
  }

  private calculateComponent(component: any) {
    const variant = component.child_variant;

    const thicknessMm = Number(variant?.thickness_mm || 0);
    const densityKgM3 = Number(variant?.density_kg_m3 || 0);
    const costPrice = Number(variant?.cost_price || 0); // ✅ pull from variant

    const lengthMm = Number(component.length_mm || 0);
    const widthMm = Number(component.width_mm || 0);
    const heightMm = Number(component.height_mm || thicknessMm);

    const volumeM3 = calculateVolumeM3(lengthMm, widthMm, heightMm);
    const surfaceM2 = calculateSurfaceM2(lengthMm, widthMm);
    const calculatedWeightKg = volumeM3 * densityKgM3;

    return {
      product_id: component.child_product_id,
      variant_id: component.child_variant_id,
      product_name: component.child_product_name,
      quantity: Number(component.quantity),
      surface_m2: surfaceM2,
      volume_m3: volumeM3,
      calculated_weight_kg: calculatedWeightKg,
      cost_price: costPrice, // ✅ now available downstream
    };
  }
}
