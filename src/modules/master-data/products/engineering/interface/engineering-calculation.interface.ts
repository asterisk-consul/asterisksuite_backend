import { ResolvedComponent } from './resolved-component.interface';

export interface EngineeringCalculation {
  total_weight_kg: number;

  materials: ResolvedComponent[];
}
