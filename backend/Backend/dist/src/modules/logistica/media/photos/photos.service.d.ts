import { PrismaService } from '@/prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
export declare class PhotosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePhotoDto): import("../../../../generated/prisma/models").Prisma__entity_photosClient<{
        files: {
            id: string;
            created_at: Date;
            storage_provider: string | null;
            file_path: string;
            public_url: string | null;
            file_name: string | null;
            mime_type: string | null;
            file_size: number | null;
            uploaded_by: string | null;
        };
    } & {
        id: string;
        created_at: Date;
        entity_type: string;
        entity_id: string;
        file_id: string;
        photo_type: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findByEntity(entityType: string, entityId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        files: {
            id: string;
            created_at: Date;
            storage_provider: string | null;
            file_path: string;
            public_url: string | null;
            file_name: string | null;
            mime_type: string | null;
            file_size: number | null;
            uploaded_by: string | null;
        };
    } & {
        id: string;
        created_at: Date;
        entity_type: string;
        entity_id: string;
        file_id: string;
        photo_type: string | null;
    })[]>;
}
