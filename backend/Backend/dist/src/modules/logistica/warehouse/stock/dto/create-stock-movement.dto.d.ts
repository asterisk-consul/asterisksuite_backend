export declare class CreateStockMovementDto {
    warehouse_id: string;
    product_id: string;
    movement_type: string;
    direction: 'IN' | 'OUT';
    quantity: string;
    reference_type?: string;
    reference_id?: string;
    notes?: string;
    created_by?: string;
}
