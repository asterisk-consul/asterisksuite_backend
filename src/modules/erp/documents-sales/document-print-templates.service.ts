import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { SaveDocumentPrintTemplateDto } from './document-print-template.dto';

@Injectable()
export class DocumentPrintTemplatesService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() { return this.db.getClientForCurrentContext(); }

  list(category?: string) {
    return this.prisma.document_print_templates.findMany({
      where: { ...(category ? { category } : {}), active: true },
      orderBy: [{ category: 'asc' }, { is_default: 'desc' }, { name: 'asc' }],
    });
  }

  async create(dto: SaveDocumentPrintTemplateDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.is_default) {
        await tx.document_print_templates.updateMany({
          where: { category: dto.category, is_default: true },
          data: { is_default: false, updated_by: userId },
        });
      }
      const count = await tx.document_print_templates.count({ where: { category: dto.category, active: true } });
      return tx.document_print_templates.create({
        data: {
          ...dto,
          is_default: dto.is_default ?? count === 0,
          active: dto.active ?? true,
          config: dto.config as Prisma.InputJsonValue,
          created_by: userId,
          updated_by: userId,
        },
      });
    });
  }

  async update(id: string, dto: SaveDocumentPrintTemplateDto, userId: string) {
    const existing = await this.prisma.document_print_templates.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Plantilla no encontrada');
    if (existing.category !== dto.category) throw new BadRequestException('No se puede cambiar la categoría de la plantilla');
    return this.prisma.$transaction(async (tx) => {
      if (dto.is_default) {
        await tx.document_print_templates.updateMany({
          where: { category: dto.category, is_default: true, id: { not: id } },
          data: { is_default: false, updated_by: userId },
        });
      }
      return tx.document_print_templates.update({
        where: { id },
        data: { ...dto, config: dto.config as Prisma.InputJsonValue, updated_by: userId },
      });
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.document_print_templates.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Plantilla no encontrada');
    if (existing.is_default) throw new BadRequestException('Elegí otra plantilla predeterminada antes de eliminarla');
    return this.prisma.document_print_templates.update({
      where: { id },
      data: { active: false, updated_by: userId },
    });
  }
}
