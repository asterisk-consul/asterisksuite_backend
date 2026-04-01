declare class CreatePickingItemDto {
    product_id: string;
    quantity: string;
}
export declare class CreatePickingOrderDto {
    warehouse_id: string;
    created_by: string;
    dispatch_order_id?: string;
    items: CreatePickingItemDto[];
}
export {};
