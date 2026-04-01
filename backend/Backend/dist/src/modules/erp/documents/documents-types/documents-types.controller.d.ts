import { DocumentTypesService } from './documents-types.service';
import { CreateDocumentsTypesDto } from './dto/create-documentsTypes.dto';
export declare class DocumentTypesController {
    private readonly service;
    constructor(service: DocumentTypesService);
    create(dto: CreateDocumentsTypesDto): Promise<{
        id: string;
        active: boolean;
        code: string;
        document_sequence_id: string | null;
        description: string;
        direction: number;
        affects_stock: boolean;
        affects_accounting: boolean;
    }>;
}
