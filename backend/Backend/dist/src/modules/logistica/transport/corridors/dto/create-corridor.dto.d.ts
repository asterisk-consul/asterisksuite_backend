import { CorridorStopDto } from './corridor-stop.dto';
export declare class CreateCorridorDto {
    name?: string;
    origin_location_id: string;
    destination_location_id: string;
    is_template?: boolean;
    stops: CorridorStopDto[];
}
