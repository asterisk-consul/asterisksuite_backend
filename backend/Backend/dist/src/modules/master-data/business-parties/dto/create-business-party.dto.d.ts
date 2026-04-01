declare class CreatePartyLocationDto {
    location_id: string;
    label?: string;
}
declare class CreatePartyContactDto {
    first_name: string;
    last_name: string;
    role?: string;
    phone?: string;
    email?: string;
}
export declare class CreateBusinessPartyDto {
    type: string;
    name: string;
    tax_id?: string;
    locations?: CreatePartyLocationDto[];
    contacts?: CreatePartyContactDto[];
}
export {};
