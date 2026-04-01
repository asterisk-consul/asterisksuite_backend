declare class CreateVehicleDocumentDto {
    documentTypeId: string;
    expirationDate?: string;
}
export declare class CreateVehicleDto {
    type: string;
    plate: string;
    brand?: string;
    model?: string;
    year?: number;
    maxWeight?: number;
    maxVolume?: number;
    refrigeration?: boolean;
    documents?: CreateVehicleDocumentDto[];
}
export {};
