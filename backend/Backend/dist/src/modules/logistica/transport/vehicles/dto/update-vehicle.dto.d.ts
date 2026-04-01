declare class UpdateVehicleDocumentDto {
    id?: string;
    documentTypeId?: string;
    expirationDate?: string;
    remove?: boolean;
}
export declare class UpdateVehicleDto {
    plate?: string;
    type?: string;
    brand?: string;
    model?: string;
    year?: number;
    maxWeight?: number;
    maxVolume?: number;
    refrigeration?: boolean;
    active?: boolean;
    documents?: UpdateVehicleDocumentDto[];
}
export {};
