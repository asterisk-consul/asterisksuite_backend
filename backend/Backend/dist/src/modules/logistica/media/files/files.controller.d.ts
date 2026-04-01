import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
export declare class FilesController {
    private readonly service;
    constructor(service: FilesService);
    create(dto: CreateFileDto): import("../../../../generated/prisma/models").Prisma__filesClient<{
        id: string;
        created_at: Date;
        storage_provider: string | null;
        file_path: string;
        public_url: string | null;
        file_name: string | null;
        mime_type: string | null;
        file_size: number | null;
        uploaded_by: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        created_at: Date;
        storage_provider: string | null;
        file_path: string;
        public_url: string | null;
        file_name: string | null;
        mime_type: string | null;
        file_size: number | null;
        uploaded_by: string | null;
    }[]>;
    findOne(id: string): import("../../../../generated/prisma/models").Prisma__filesClient<{
        id: string;
        created_at: Date;
        storage_provider: string | null;
        file_path: string;
        public_url: string | null;
        file_name: string | null;
        mime_type: string | null;
        file_size: number | null;
        uploaded_by: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
