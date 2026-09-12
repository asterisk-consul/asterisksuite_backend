export interface EngineeringNode {
  id: string;

  parent_product_id: string;

  child_product_id: string;

  quantity: number;

  children: EngineeringNode[];
}
