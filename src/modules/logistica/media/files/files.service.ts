import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import { CreateFileDto } from './dto/create-file.dto';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

function uuid(): string {
  return crypto.randomUUID();
}

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const DEFAULT_RETENTION_DAYS = 30;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_TYPES = [...IMAGE_TYPES, 'application/pdf'];
const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf',
};

const ENTITY_CONFIG: Record<string, { maxImages: number; maxWidth: number; subfolder: string }> = {
  product: { maxImages: 5, maxWidth: 1200, subfolder: 'products' },
  company: { maxImages: 1, maxWidth: 800, subfolder: 'companies' },
  document: { maxImages: 10, maxWidth: 1600, subfolder: 'documents' },
  payment: { maxImages: 10, maxWidth: 1600, subfolder: 'payments' },
  check: { maxImages: 5, maxWidth: 1600, subfolder: 'checks' },
  check_deposit: { maxImages: 5, maxWidth: 1600, subfolder: 'check-deposits' },
  cash_box_movement: { maxImages: 5, maxWidth: 1600, subfolder: 'cash-box-movements' },
  cash_box_transfer: { maxImages: 10, maxWidth: 1600, subfolder: 'cash-box-transfers' },
  intake: { maxImages: 10, maxWidth: 1600, subfolder: 'intake' },
};

type FileLibraryAssociation = {
  entity_type: string;
  entity_id: string;
  label: string;
  url?: string | null;
};

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private get retentionDays(): number {
    const configured = Number(process.env.MEDIA_RETENTION_DAYS);
    return Number.isFinite(configured) && configured >= 0 ? configured : DEFAULT_RETENTION_DAYS;
  }

  private get tenantQuotaBytes(): number | null {
    const configuredMb = Number(process.env.MEDIA_TENANT_QUOTA_MB);
    return Number.isFinite(configuredMb) && configuredMb > 0
      ? configuredMb * 1024 * 1024
      : null;
  }

  private async assertWithinQuota(incomingBytes: number) {
    const quotaBytes = this.tenantQuotaBytes;
    if (!quotaBytes) return;
    const usage = await this.prisma.files.aggregate({
      where: { deleted_at: null },
      _sum: { file_size: true },
    });
    const usedBytes = Number(usage._sum.file_size || 0);
    if (usedBytes + incomingBytes > quotaBytes) {
      throw new BadRequestException(
        `La empresa alcanzó el límite de almacenamiento de ${Math.round(quotaBytes / 1024 / 1024)} MB`,
      );
    }
  }

  private getTenantUploadRoot(): string {
    const companyId = getCurrentCompanyId();
    const safeTenant = companyId?.match(/^[a-f0-9-]{36}$/i) ? companyId : 'unscoped';
    return path.join(UPLOAD_DIR, safeTenant);
  }

  private getStorageRoots(): string[] {
    // El segundo root conserva compatibilidad con archivos creados antes de separar por tenant.
    return [this.getTenantUploadRoot(), UPLOAD_DIR];
  }

  private buildResponse(fileRecord: any, photo: any, isImage: boolean, deduplicated: boolean) {
    return {
      id: fileRecord.id,
      photo_id: photo.id,
      file_uuid: fileRecord.id,
      url: isImage
        ? `/api/media/files/${fileRecord.id}/medium`
        : `/api/media/files/${fileRecord.id}/view`,
      thumb_url: isImage ? `/api/media/files/${fileRecord.id}/thumb` : null,
      medium_url: isImage ? `/api/media/files/${fileRecord.id}/medium` : null,
      file_name: fileRecord.file_name,
      file_size: fileRecord.file_size,
      mime_type: fileRecord.mime_type,
      deduplicated,
    };
  }

  private async findDuplicate(contentHash: string, fileSize: number) {
    const indexed = await this.prisma.files.findUnique({
      where: { content_hash: contentHash },
    });
    if (indexed) return indexed;

    // Compatibilidad con archivos anteriores a la incorporación del hash.
    const legacyCandidates = await this.prisma.files.findMany({
      where: {
        content_hash: null,
        file_size: fileSize,
        deleted_at: null,
      },
      take: 100,
      orderBy: { created_at: 'asc' },
    });

    for (const candidate of legacyCandidates) {
      const physicalPath = candidate.file_path && fs.existsSync(candidate.file_path)
        ? candidate.file_path
        : this.getOriginalFilePath(candidate.id);
      if (!physicalPath) continue;
      const candidateHash = crypto.createHash('sha256').update(fs.readFileSync(physicalPath)).digest('hex');
      try {
        await this.prisma.files.update({
          where: { id: candidate.id },
          data: { content_hash: candidateHash },
        });
      } catch (error: any) {
        // Otro archivo legacy con el mismo contenido ya obtuvo el índice único.
        if (error?.code !== 'P2002') throw error;
      }
      if (candidateHash === contentHash) {
        return this.prisma.files.findUnique({ where: { content_hash: contentHash } });
      }
    }

    return null;
  }

  create(dto: CreateFileDto) {
    return this.prisma.files.create({
      data: dto,
    });
  }

  findById(id: string) {
    return this.prisma.files.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.files.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findLibrary(query: { page?: string; pageSize?: string; search?: string; sort?: string; order?: string } = {}) {
    const page = Math.max(1, Number.parseInt(query.page || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(query.pageSize || '25', 10) || 25));
    const search = query.search?.trim().slice(0, 120);
    const sortField = ['created_at', 'file_name', 'file_size', 'mime_type'].includes(query.sort || '')
      ? query.sort!
      : 'created_at';
    const sortOrder = query.order === 'asc' ? 'asc' : 'desc';
    const where: any = {
      deleted_at: null,
      ...(search ? { file_name: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [records, total, storage, imageStorage, pdfStorage] = await Promise.all([
      this.prisma.files.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortField]: sortOrder },
        select: {
          id: true,
          file_name: true,
          mime_type: true,
          file_size: true,
          uploaded_by: true,
          created_at: true,
          entity_photos: {
            where: { deleted_at: null },
            take: 10,
            orderBy: { created_at: 'desc' },
            select: { entity_type: true, entity_id: true },
          },
        },
      }),
      this.prisma.files.count({ where }),
      this.prisma.files.aggregate({
        where: { deleted_at: null },
        _count: { id: true },
        _sum: { file_size: true },
      }),
      this.prisma.files.aggregate({
        where: { deleted_at: null, mime_type: { startsWith: 'image/' } },
        _count: { id: true },
        _sum: { file_size: true },
      }),
      this.prisma.files.aggregate({
        where: { deleted_at: null, mime_type: 'application/pdf' },
        _count: { id: true },
        _sum: { file_size: true },
      }),
    ]);

    const fileIds = records.map((file) => file.id);
    const idsByType = new Map<string, string[]>();
    for (const file of records) {
      for (const relation of file.entity_photos) {
        const ids = idsByType.get(relation.entity_type) ?? [];
        ids.push(relation.entity_id);
        idsByType.set(relation.entity_type, ids);
      }
    }
    const uniqueIds = (type: string) => [...new Set(idsByType.get(type) ?? [])];

    const [transfers, payments, documents, checks, intakes, cashMovements, bankMovements, authorizations, uploaders] = await Promise.all([
      uniqueIds('cash_box_transfer').length
        ? this.prisma.cash_box_transfers.findMany({ where: { id: { in: uniqueIds('cash_box_transfer') } }, select: { id: true, source_name: true, dest_name: true, description: true, status: true } })
        : Promise.resolve([]),
      uniqueIds('payment').length
        ? this.prisma.payments.findMany({ where: { id: { in: uniqueIds('payment') } }, select: { id: true, number: true, type: true, description: true } })
        : Promise.resolve([]),
      uniqueIds('document').length
        ? this.prisma.documents.findMany({ where: { id: { in: uniqueIds('document') } }, select: { id: true, number: true, document_types: { select: { description: true, system_modules: { select: { code: true } } } } } })
        : Promise.resolve([]),
      [...uniqueIds('check'), ...uniqueIds('check_deposit')].length
        ? this.prisma.checks.findMany({ where: { id: { in: [...new Set([...uniqueIds('check'), ...uniqueIds('check_deposit')])] } }, select: { id: true, check_number: true, issuer_name: true } })
        : Promise.resolve([]),
      uniqueIds('intake').length
        ? this.prisma.intake_records.findMany({ where: { id: { in: uniqueIds('intake') }, deleted_at: null }, select: { id: true, title: true } })
        : Promise.resolve([]),
      uniqueIds('cash_box_movement').length
        ? this.prisma.cash_box_movements.findMany({ where: { id: { in: uniqueIds('cash_box_movement') }, deleted_at: null }, select: { id: true, description: true, cash_box_id: true } })
        : Promise.resolve([]),
      fileIds.length
        ? this.prisma.bank_account_movements.findMany({ where: { attachment_file_id: { in: fileIds }, deleted_at: null }, select: { id: true, attachment_file_id: true, description: true, bank_account_id: true, reference: true, bank_account: { select: { bank_name: true, name: true } } } })
        : Promise.resolve([]),
      fileIds.length
        ? this.prisma.fiscal_authorizations.findMany({ where: { attachment_file_id: { in: fileIds }, deleted_at: null }, select: { id: true, attachment_file_id: true, authorization_type: true, code: true } })
        : Promise.resolve([]),
      this.db.getDefaultClient().users.findMany({
        where: { id: { in: [...new Set(records.map((file) => file.uploaded_by).filter(Boolean) as string[])] } },
        select: { id: true, name: true, email: true },
      }),
    ]);

    const transferMap = new Map(transfers.map((row: any) => [row.id, row]));
    const paymentMap = new Map(payments.map((row: any) => [row.id, row]));
    const documentMap = new Map(documents.map((row: any) => [row.id, row]));
    const checkMap = new Map(checks.map((row: any) => [row.id, row]));
    const intakeMap = new Map(intakes.map((row: any) => [row.id, row]));
    const movementMap = new Map(cashMovements.map((row: any) => [row.id, row]));
    const uploaderMap = new Map<string, { name: string | null; email: string | null }>(
      uploaders.map((row: any) => [row.id, row]),
    );
    const associationsByFile = new Map<string, FileLibraryAssociation[]>();
    const addAssociation = (fileId: string, association: FileLibraryAssociation) => {
      const items = associationsByFile.get(fileId) ?? [];
      items.push(association);
      associationsByFile.set(fileId, items);
    };

    const typeLabels: Record<string, string> = {
      document: 'Documento', payment: 'Pago o cobro', check: 'Cheque',
      check_deposit: 'Depósito de cheques', cash_box_movement: 'Movimiento de caja',
      cash_box_transfer: 'Transferencia', intake: 'Captura',
    };

    for (const file of records) {
      for (const relation of file.entity_photos) {
        const id = relation.entity_id;
        let label = `${typeLabels[relation.entity_type] ?? relation.entity_type} · ${id.slice(0, 8)}`;
        let url: string | null = null;
        if (relation.entity_type === 'cash_box_transfer') {
          const row: any = transferMap.get(id);
          label = row?.description || `Transferencia ${row?.source_name ?? ''} → ${row?.dest_name ?? ''}`.trim();
          url = `/erp/treasury/cash-box-transfers?transferId=${id}`;
        } else if (relation.entity_type === 'payment') {
          const row: any = paymentMap.get(id);
          label = row ? `${row.type === 'PAYMENT' ? 'Pago' : 'Cobro'} #${row.number}${row.description ? ` · ${row.description}` : ''}` : label;
          url = `/erp/treasury/payments/${id}`;
        } else if (relation.entity_type === 'document') {
          const row: any = documentMap.get(id);
          if (row) {
            const moduleCode = row.document_types?.system_modules?.code;
            label = `${row.document_types?.description ?? 'Documento'} #${row.number}`;
            url = moduleCode === 'PURCHASES'
              ? `/erp/purchases/purchases-documents/${id}`
              : `/erp/sales/${id}`;
          }
        } else if (relation.entity_type === 'check' || relation.entity_type === 'check_deposit') {
          const row: any = checkMap.get(id);
          label = row
            ? `${relation.entity_type === 'check_deposit' ? 'Depósito de cheque' : 'Cheque'} ${row.check_number} · ${row.issuer_name}`
            : label;
          url = `/erp/treasury/checks/${id}/edit`;
        } else if (relation.entity_type === 'intake') {
          const row: any = intakeMap.get(id);
          label = row?.title ? `Captura · ${row.title}` : label;
          url = '/erp/treasury/intake';
        } else if (relation.entity_type === 'cash_box_movement') {
          const row: any = movementMap.get(id);
          label = row?.description ? `Movimiento de caja · ${row.description}` : label;
          url = row?.cash_box_id ? `/erp/treasury/cash-boxes/${row.cash_box_id}` : null;
        }
        addAssociation(file.id, { entity_type: relation.entity_type, entity_id: id, label, url });
      }
    }

    for (const row of bankMovements as any[]) {
      addAssociation(row.attachment_file_id, {
        entity_type: 'bank_account_movement',
        entity_id: row.id,
        label: `Movimiento bancario · ${row.description || row.reference || row.id.slice(0, 8)}`,
        url: `/erp/treasury/bank-accounts/${row.bank_account_id}`,
      });
    }
    for (const row of authorizations as any[]) {
      addAssociation(row.attachment_file_id, {
        entity_type: 'fiscal_authorization',
        entity_id: row.id,
        label: `${row.authorization_type} · ${row.code}`,
      });
    }

    return {
      items: records.map((file) => ({
        id: file.id,
        file_name: file.file_name || 'Archivo sin nombre',
        mime_type: file.mime_type || 'application/octet-stream',
        file_size: file.file_size || 0,
        created_at: file.created_at,
        uploaded_by_name: file.uploaded_by
          ? uploaderMap.get(file.uploaded_by)?.name || uploaderMap.get(file.uploaded_by)?.email || 'Usuario'
          : '—',
        associations: associationsByFile.get(file.id) ?? [],
      })),
      page,
      page_size: pageSize,
      total,
      total_pages: Math.ceil(total / pageSize),
      storage_active_files: storage._count.id,
      storage_original_bytes: Number(storage._sum.file_size ?? 0),
      storage_breakdown: [
        {
          category: 'images',
          files: imageStorage._count.id,
          bytes: Number(imageStorage._sum.file_size ?? 0),
        },
        {
          category: 'pdf',
          files: pdfStorage._count.id,
          bytes: Number(pdfStorage._sum.file_size ?? 0),
        },
        {
          category: 'other',
          files: Math.max(0, storage._count.id - imageStorage._count.id - pdfStorage._count.id),
          bytes: Math.max(
            0,
            Number(storage._sum.file_size ?? 0)
              - Number(imageStorage._sum.file_size ?? 0)
              - Number(pdfStorage._sum.file_size ?? 0),
          ),
        },
      ],
    };
  }

  async assertTransferAttachmentTarget(transferId: string, userId: string) {
    const transfer = await this.prisma.cash_box_transfers.findFirst({
      where: { id: transferId, record_side: 'source', deleted_at: null },
      select: { id: true, source_type: true, source_id: true },
    });
    if (!transfer) throw new BadRequestException('No se encontró una transferencia de origen en esta empresa');

    const companyId = getCurrentCompanyId();
    if (!companyId) throw new ForbiddenException('No se pudo determinar la empresa de origen');
    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
      select: { role: true },
    });
    if (!membership) throw new ForbiddenException('No tienes acceso a la empresa de origen');
    if (membership.role === 'USER') {
      const sourceRole = transfer.source_type === 'cash_box'
        ? await this.prisma.cash_box_user_roles.findUnique({
            where: { cash_box_id_user_id: { cash_box_id: transfer.source_id, user_id: userId } },
            select: { user_id: true },
          })
        : await this.prisma.bank_account_user_roles.findUnique({
            where: { bank_account_id_user_id: { bank_account_id: transfer.source_id, user_id: userId } },
            select: { user_id: true },
          });
      if (!sourceRole) throw new ForbiddenException('No tienes acceso al fondo de origen de esta transferencia');
    }
  }

  findPhotoAssociation(photoId: string) {
    return this.prisma.entity_photos.findUnique({
      where: { id: photoId },
      select: { entity_type: true, entity_id: true },
    });
  }

  async upload(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    photoType?: string,
    userId?: string,
  ) {
    // Validate file
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    const maxFileSize = file.mimetype === 'application/pdf' ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxFileSize) {
      throw new BadRequestException(`El archivo excede el tamaño máximo de ${maxFileSize / 1024 / 1024} MB`);
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`);
    }

    const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.document;

    // Check max images per entity
    const existingCount = await this.prisma.entity_photos.count({
      where: {
        entity_type: entityType,
        entity_id: entityId,
        deleted_at: null,
      },
    });

    if (existingCount >= config.maxImages) {
      throw new BadRequestException(
        `Máximo ${config.maxImages} imágenes permitidas para ${entityType}`
      );
    }

    await this.purgeExpiredFiles();

    const contentHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const isImage = IMAGE_TYPES.includes(file.mimetype);

    // Reutilizar el archivo físico cuando el mismo contenido ya existe en este tenant.
    const duplicate = await this.findDuplicate(contentHash, file.size);

    if (duplicate) {
      const physicalPath = duplicate.file_path && fs.existsSync(duplicate.file_path)
        ? duplicate.file_path
        : this.getOriginalFilePath(duplicate.id);

      if (physicalPath) {
        const existingRelation = await this.prisma.entity_photos.findFirst({
          where: {
            entity_type: entityType,
            entity_id: entityId,
            file_id: duplicate.id,
            deleted_at: null,
          },
        });

        await this.prisma.files.update({
          where: { id: duplicate.id },
          data: { deleted_at: null, deleted_by: null, purge_after: null },
        });

        const photo = existingRelation || await this.prisma.entity_photos.create({
          data: {
            entity_type: entityType,
            entity_id: entityId,
            file_id: duplicate.id,
            photo_type: photoType || 'default',
            ...(userId ? { created_by: userId } : {}),
          },
        });

        return this.buildResponse(duplicate, photo, isImage, true);
      }

      // El registro quedó sin archivo físico: se retira para permitir reconstruirlo.
      await this.prisma.files.delete({ where: { id: duplicate.id } });
    }

    await this.assertWithinQuota(file.size);

    // Los archivos nuevos quedan separados físicamente por empresa.
    const subDir = path.join(this.getTenantUploadRoot(), config.subfolder);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    // Create file record first to get the Prisma-generated ID
    const fileData: any = {
      storage_provider: 'local',
      file_path: '', // will update after saving
      public_url: '',
      file_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      content_hash: contentHash,
    };

    if (userId) {
      fileData.uploaded_by = userId;
    }

    const fileRecord = await this.prisma.files.create({
      data: fileData,
    });

    // Use the Prisma-generated ID as the filename
    const baseName = fileRecord.id;

    const safeExtension = path.extname(file.originalname).toLowerCase() || (isImage ? '.img' : '.pdf');
    const originalPath = path.join(subDir, `${baseName}_original${safeExtension}`);

    try {
      fs.writeFileSync(originalPath, file.buffer);

      if (isImage) {
        const mediumBuffer = await sharp(file.buffer).rotate()
          .resize(800, null, { withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
        const thumbBuffer = await sharp(file.buffer).rotate()
          .resize(240, null, { withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();
        fs.writeFileSync(path.join(subDir, `${baseName}_medium.webp`), mediumBuffer);
        fs.writeFileSync(path.join(subDir, `${baseName}_thumb.webp`), thumbBuffer);
      }

      // Update file record with correct path
      await this.prisma.files.update({
        where: { id: fileRecord.id },
        data: {
          file_path: originalPath,
          public_url: `/api/media/files/${fileRecord.id}/download`,
        },
      });

      // Create entity_photo record
      const photoData: any = {
        entity_type: entityType,
        entity_id: entityId,
        file_id: fileRecord.id,
        photo_type: photoType || 'default',
      };

      if (userId) {
        photoData.created_by = userId;
      }

      const photo = await this.prisma.entity_photos.create({
        data: photoData,
      });

      return this.buildResponse(
        { ...fileRecord, file_path: originalPath, public_url: `/api/media/files/${fileRecord.id}/download` },
        photo,
        isImage,
        false,
      );
    } catch (error) {
      this.deletePhysicalVariants(fileRecord.id, originalPath);
      await this.prisma.files.delete({ where: { id: fileRecord.id } }).catch(() => undefined);
      throw error;
    }
  }

  getFilePath(fileUuid: string, variant: string = 'full'): string | null {
    const subfolders = ['products', 'companies', 'documents', 'payments', 'checks', 'check-deposits', 'cash-box-movements', 'cash-box-transfers', 'intake'];
    for (const root of this.getStorageRoots()) {
      for (const subfolder of subfolders) {
        const filePath = path.join(root, subfolder, `${fileUuid}_${variant}.webp`);
        if (fs.existsSync(filePath)) {
          return filePath;
        }
        for (const entity of subfolders) {
          const oldPath = path.join(root, subfolder, `${entity}_${fileUuid}_${variant}.webp`);
          if (fs.existsSync(oldPath)) {
            return oldPath;
          }
        }
      }
    }
    return null;
  }

  private getOriginalFilePath(fileUuid: string): string | null {
    const subfolders = ['products', 'companies', 'documents', 'payments', 'checks', 'check-deposits', 'cash-box-movements', 'cash-box-transfers', 'intake'];
    for (const root of this.getStorageRoots()) {
      for (const subfolder of subfolders) {
        const directory = path.join(root, subfolder);
        if (!fs.existsSync(directory)) continue;
        const match = fs.readdirSync(directory).find((name) => name.startsWith(`${fileUuid}_original.`));
        if (match) return path.join(directory, match);
      }
    }
    return null;
  }

  private deletePhysicalVariants(fileUuid: string, originalPath?: string | null) {
    const candidates = new Set<string>();
    if (originalPath) candidates.add(originalPath);
    const discoveredOriginal = this.getOriginalFilePath(fileUuid);
    if (discoveredOriginal) candidates.add(discoveredOriginal);
    for (const variant of ['full', 'medium', 'thumb']) {
      const variantPath = this.getFilePath(fileUuid, variant);
      if (variantPath) candidates.add(variantPath);
    }

    for (const candidate of candidates) {
      const resolved = path.resolve(candidate);
      const uploadRoot = path.resolve(UPLOAD_DIR);
      if (resolved !== uploadRoot && !resolved.startsWith(`${uploadRoot}${path.sep}`)) {
        this.logger.warn(`Se omitió la eliminación de una ruta fuera de uploads: ${resolved}`);
        continue;
      }
      try {
        if (fs.existsSync(resolved)) fs.unlinkSync(resolved);
      } catch (error) {
        this.logger.warn(`No se pudo eliminar ${resolved}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  async purgeExpiredFiles() {
    const now = new Date();
    const expired = await this.prisma.files.findMany({
      where: {
        deleted_at: { not: null },
        purge_after: { lte: now },
        entity_photos: { none: { deleted_at: null } },
      },
      take: 50,
    });

    for (const file of expired) {
      this.deletePhysicalVariants(file.id, file.file_path);
      await this.prisma.files.delete({ where: { id: file.id } });
    }

    return expired.length;
  }

  async getStorageUsage() {
    const [active, pendingPurge] = await Promise.all([
      this.prisma.files.aggregate({
        where: { deleted_at: null },
        _count: { id: true },
        _sum: { file_size: true },
      }),
      this.prisma.files.aggregate({
        where: { deleted_at: { not: null } },
        _count: { id: true },
        _sum: { file_size: true },
      }),
    ]);
    const quotaBytes = this.tenantQuotaBytes;
    const usedBytes = Number(active._sum.file_size || 0);
    return {
      active_files: active._count.id,
      original_bytes: usedBytes,
      pending_purge_files: pendingPurge._count.id,
      pending_purge_bytes: Number(pendingPurge._sum.file_size || 0),
      quota_bytes: quotaBytes,
      usage_percentage: quotaBytes ? Number(((usedBytes / quotaBytes) * 100).toFixed(2)) : null,
      retention_days: this.retentionDays,
    };
  }

  private getPhysicalFileMetadata(fileUuid: string) {
    const filePath = this.getOriginalFilePath(fileUuid) || this.getFilePath(fileUuid, 'full');
    if (!filePath || !fs.existsSync(filePath)) return null;
    const extension = path.extname(filePath).toLowerCase();
    return {
      filePath,
      fileName: `Comprobante${extension || ''}`,
      mimeType: MIME_BY_EXTENSION[extension] || 'application/octet-stream',
      fileSize: fs.statSync(filePath).size,
    };
  }

  async getStoredFile(fileUuid: string, variant: 'original' | 'full' | 'medium' | 'thumb' = 'original') {
    const record = await this.prisma.files.findFirst({ where: { id: fileUuid, deleted_at: null } });
    if (!record) {
      const physical = this.getPhysicalFileMetadata(fileUuid);
      if (!physical) return null;
      const requestedPath = variant === 'original' ? physical.filePath : this.getFilePath(fileUuid, variant) || physical.filePath;
      return {
        record: { mime_type: physical.mimeType, file_name: physical.fileName },
        filePath: requestedPath,
      };
    }
    if (variant === 'original') return { record, filePath: record.file_path };
    const variantPath = this.getFilePath(fileUuid, variant);
    return { record, filePath: variantPath || record.file_path };
  }

  async findByEntity(entityType: string, entityId: string) {
    await this.purgeExpiredFiles();
    const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.document;

    console.log('[findByEntity] entityType:', entityType, 'entityId:', entityId, 'config:', config);

    const photos = await this.prisma.entity_photos.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: {
        files: true,
      },
      orderBy: { created_at: 'asc' },
    });

    console.log('[findByEntity] raw count:', photos.length);

    // Filtrar eliminados en JS
    const active = photos.filter((p) => !p.deleted_at);
    const fileRecords = active.length
      ? await this.prisma.files.findMany({ where: { id: { in: active.map((p) => p.file_id) } } })
      : [];
    const fileMap = new Map(fileRecords.map((file) => [file.id, file]));

    console.log('[findByEntity] active count:', active.length);

    return active.map((p) => {
      const storedFile = fileMap.get(p.file_id) || p.files;
      const physical = this.getPhysicalFileMetadata(p.file_id);
      let fileSize = Number(storedFile?.file_size) || physical?.fileSize || 0;
      if (!fileSize && storedFile?.file_path) {
        try {
          fileSize = fs.statSync(storedFile.file_path).size;
        } catch {
          // El archivo puede pertenecer a un almacenamiento externo o ya no existir.
        }
      }

      return {
        id: p.id,
        photo_type: p.photo_type,
        file_id: p.file_id,
        url: (storedFile?.mime_type || physical?.mimeType)?.startsWith('image/')
          ? `/api/media/files/${p.file_id}/medium`
          : `/api/media/files/${p.file_id}/view`,
        download_url: `/api/media/files/${p.file_id}/download`,
        thumb_url: (storedFile?.mime_type || physical?.mimeType)?.startsWith('image/') ? `/api/media/files/${p.file_id}/thumb` : null,
        medium_url: (storedFile?.mime_type || physical?.mimeType)?.startsWith('image/') ? `/api/media/files/${p.file_id}/medium` : null,
        file_name: storedFile?.file_name || physical?.fileName || 'Comprobante adjunto',
        file_size: fileSize,
        mime_type: storedFile?.mime_type || physical?.mimeType || 'application/octet-stream',
      };
    });
  }

  async deletePhoto(photoId: string, userId?: string) {
    const photo = await this.prisma.entity_photos.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new BadRequestException('Foto no encontrada');
    }

    // Soft delete - registra quién y cuándo
    await this.prisma.entity_photos.update({
      where: { id: photoId },
      data: {
        deleted_at: new Date(),
        deleted_by: userId || null,
      },
    });

    const activeReferences = await this.prisma.entity_photos.count({
      where: { file_id: photo.file_id, deleted_at: null },
    });

    if (activeReferences === 0) {
      const purgeAfter = new Date();
      purgeAfter.setUTCDate(purgeAfter.getUTCDate() + this.retentionDays);
      await this.prisma.files.update({
        where: { id: photo.file_id },
        data: {
          deleted_at: new Date(),
          deleted_by: userId || null,
          purge_after: purgeAfter,
        },
      });

      if (this.retentionDays === 0) {
        await this.purgeExpiredFiles();
      }
    }

    return {
      success: true,
      file_retained: activeReferences > 0,
      purge_after_days: activeReferences > 0 ? null : this.retentionDays,
    };
  }
}
