import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentsTypesDto } from './dto/create-documentsTypes.dto';

@Injectable()
export class DocumentTypesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDocumentsTypesDto) {
    return this.prisma.document_types.create({
      data: {
        document_sequence_id: dto.document_sequence_id,
        code: dto.code,
        description: dto.description,
        direction: dto.direction,
        affects_stock: dto.affects_stock,
        affects_accounting: dto.affects_accounting,
        active: dto.active ?? true,
      },
    });
  }
}
