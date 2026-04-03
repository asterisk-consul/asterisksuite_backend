import { TripStatus } from '@/generated/prisma/enums';
export declare class CreateTripDto {
    reference_number?: string;
    week?: string;
    vehicle_combination_id?: string;
    origin_location_id?: string;
    destination_location_id?: string;
    departure_time?: Date;
    arrival_time?: Date;
    status: TripStatus;
    kilometers?: number;
}
