// engineering-calculation.service

import { Injectable } from '@nestjs/common';

import { calculateSurfaceM2, calculateVolumeM3 } from './utils/engineering-dimensions.util';

import { EngineeringCalculatedComponent } from './interface/engineering-calculated-component.interface';

@Injectable()
export class EngineeringCalculationService {
  // ─────────────────────────────────────────────
  // ENTRY POINT
  // ─────────────────────────────────────────────

  calculateTree(tree: any[]) {
    // Filtrar nodos vacíos del root y resolver bottom-up
    const resolvedNodes = tree.filter((node) => node && node.child_product_id).map((node) => this.resolveNode(node));

    const totalWeightKg = resolvedNodes.reduce((acc, n) => acc + n.calculated_weight_kg, 0);

    const totalCost = resolvedNodes.reduce((acc, n) => acc + n.total_cost, 0);

    return {
      total_weight_kg: totalWeightKg,
      total_cost: totalCost,
      tree: resolvedNodes,
      materials: this.flattenResolved(resolvedNodes),
    };
  }

  // ─────────────────────────────────────────────
  // RESOLVER RECURSIVO (bottom-up)
  // ─────────────────────────────────────────────

  private resolveNode(node: any): EngineeringCalculatedComponent {
    // 1. Resolver hijos primero (recursivo), ignorando objetos vacíos {}
    const resolvedChildren: EngineeringCalculatedComponent[] = (node.children ?? [])
      .filter((c: any) => c && c.child_product_id)
      .map((child: any) => this.resolveNode(child));

    // 2. Calcular este nodo según su tipo de cálculo
    const calc = this.calculateComponent(node);

    // 3. Acumular costo de hijos
    const childrenCost = resolvedChildren.reduce((acc, child) => acc + child.total_cost, 0);

    // 4. Costo total = propio + hijos
    const totalCost = calc.own_material_cost + childrenCost;

    return {
      ...calc,
      children_cost: childrenCost,
      total_cost: totalCost,
      children: resolvedChildren,
    };
  }

  // ─────────────────────────────────────────────
  // APLANAR ÁRBOL RESUELTO
  // ─────────────────────────────────────────────

  private flattenResolved(nodes: EngineeringCalculatedComponent[]): EngineeringCalculatedComponent[] {
    const result: EngineeringCalculatedComponent[] = [];
    for (const node of nodes) {
      const { children, ...rest } = node as any;
      result.push(rest);
      if (children?.length) {
        result.push(...this.flattenResolved(children));
      }
    }
    return result;
  }

  // ─────────────────────────────────────────────
  // RESOLVER COSTO UNITARIO DESDE CUALQUIER FUENTE
  // ─────────────────────────────────────────────

  private resolveUnitCost(component: any): number {
    // 1. Si tiene variante con costo en productVariantCosts → usar ese
    if (component.child_variant_id && component.productVariantCosts?.length > 0) {
      const variantCost = component.productVariantCosts[0];
      return Number(variantCost.cost ?? 0);
    }

    // 2. Si no tiene variante → usar child_product.current_cost
    return Number(component.child_product?.current_cost ?? 0);
  }

  // ─────────────────────────────────────────────
  // DISPATCH POR TIPO
  // ─────────────────────────────────────────────

  private calculateComponent(component: any): EngineeringCalculatedComponent {
    const calculationType = component.child_product?.calculation_type ?? 'UNIT';

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
  // COMMON FIELDS
  // ─────────────────────────────────────────────

  private getCommonFields(component: any) {
    return {
      product_id: component.child_product_id,
      product_name: component.child_product?.name || 'Producto',
      product_sku: component.child_product?.sku || null,
      variant_id: component.child_variant_id || null,
      variant_name: component.child_variant?.name || null,
      variant_sku: component.child_variant?.sku || null,
      level: component.level ?? 0,
    };
  }

  // ─────────────────────────────────────────────
  // UNIT
  // ─────────────────────────────────────────────

  private calculateUnitComponent(component: any): EngineeringCalculatedComponent {
    const unitCost = this.resolveUnitCost(component);
    const quantity = Number(component.quantity);
    const ownMaterialCost = quantity * unitCost;

    return {
      ...this.getCommonFields(component),
      quantity,
      calculated_quantity: quantity,
      surface_m2: 0,
      volume_m3: 0,
      calculated_weight_kg: 0,
      waste_percentage: Number(component.waste_percentage || 0),
      unit_cost: unitCost,
      own_material_cost: ownMaterialCost,
      children_cost: 0,
      total_cost: ownMaterialCost,
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

    // current_cost en materiales de tipo SURFACE se espera en $/kg
    const unitCost = this.resolveUnitCost(component);
    const ownMaterialCost = finalWeightKg * unitCost;

    return {
      ...this.getCommonFields(component),
      quantity: Number(component.quantity),
      calculated_quantity: finalWeightKg,
      surface_m2: areaM2,
      volume_m3: volumeM3,
      calculated_weight_kg: finalWeightKg,
      waste_percentage: wastePercentage,
      unit_cost: unitCost,
      own_material_cost: ownMaterialCost,
      children_cost: 0,
      total_cost: ownMaterialCost,
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

    // current_cost en $/metro
    const unitCost = this.resolveUnitCost(component);
    const ownMaterialCost = finalLength * unitCost;

    return {
      ...this.getCommonFields(component),
      quantity: Number(component.quantity),
      calculated_quantity: finalLength,
      surface_m2: 0,
      volume_m3: 0,
      calculated_weight_kg: finalWeightKg,
      waste_percentage: wastePercentage,
      unit_cost: unitCost,
      own_material_cost: ownMaterialCost,
      children_cost: 0,
      total_cost: ownMaterialCost,
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

    // current_cost en $/m3
    const unitCost = this.resolveUnitCost(component);
    const ownMaterialCost = finalVolume * unitCost;

    return {
      ...this.getCommonFields(component),
      quantity: Number(component.quantity),
      calculated_quantity: finalVolume,
      surface_m2: 0,
      volume_m3: finalVolume,
      calculated_weight_kg: 0,
      waste_percentage: wastePercentage,
      unit_cost: unitCost,
      own_material_cost: ownMaterialCost,
      children_cost: 0,
      total_cost: ownMaterialCost,
    };
  }
}
