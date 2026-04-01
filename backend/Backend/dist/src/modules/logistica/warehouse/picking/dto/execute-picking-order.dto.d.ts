declare class PickingSourceDto {
    picking_item_id: string;
    pallet_id: string;
    quantity: string;
}
export declare class ExecutePickingDto {
    picking_order_id: string;
    result_pallet_id: string;
    user_id: string;
    sources: PickingSourceDto[];
}
export {};
