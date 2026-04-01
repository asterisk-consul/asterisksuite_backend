import { DriverDocumentDto } from './driver-document.dto';
export declare class CreateDriverDto {
    first_name: string;
    last_name: string;
    document?: string;
    phone?: string;
    active?: boolean;
    documents?: DriverDocumentDto[];
}
