declare class CorridorStopDto {
    location_id: string;
    stop_order: number;
}
declare class RouteDto {
    origin_location_id: string;
    destination_location_id: string;
    stops: CorridorStopDto[];
}
export declare class CreateTripDto {
    reference_number?: string;
    week?: string;
    vehicle_combination_id?: string;
    origin_location_id?: string;
    destination_location_id?: string;
    corridor_id?: string;
    route?: RouteDto;
    departure_time?: Date;
    arrival_time?: Date;
    status: string;
    kilometers?: number;
    business_party_id?: string;
}
export {};
