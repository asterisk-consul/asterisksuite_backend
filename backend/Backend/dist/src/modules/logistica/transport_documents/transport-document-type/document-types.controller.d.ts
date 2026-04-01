import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
export declare class DocumentTypesController {
    private readonly service;
    constructor(service: DocumentTypesService);
    create(dto: CreateDocumentTypeDto): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        entity: string;
    }>;
    findAll(entity?: 'VEHICLE' | 'DRIVER'): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        entity: string;
    }[]>;
    update(id: string, dto: UpdateDocumentTypeDto): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        entity: string;
    }>;
    deactivate(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        entity: string;
    }>;
    activate(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        entity: string;
    }>;
}
