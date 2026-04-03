import { DispatchStatus } from '@/generated/prisma/enums';
export declare class DispatchRateDto {
    rate_id: string;
    value: number;
}
export declare class CreateDispatchOrderDto {
    order_number: string;
    status?: DispatchStatus;
    requires_stock?: boolean;
    customer_id?: string;
    origin_location_id?: string;
    destination_location_id?: string;
    corridor_id?: string;
    planned_date?: string;
    rates?: DispatchRateDto[];
}
declare const UpdateDispatchOrderDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDispatchOrderDto>>;
export declare class UpdateDispatchOrderDto extends UpdateDispatchOrderDto_base {
    rates?: DispatchRateDto[];
}
export {};
