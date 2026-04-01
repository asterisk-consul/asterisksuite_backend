declare class PickingItemDto {
    product_id: string;
    quantity: string;
}
export declare class CreatePickingDto {
    warehouse_id: string;
    created_by: string;
    items: PickingItemDto[];
}
export {};
