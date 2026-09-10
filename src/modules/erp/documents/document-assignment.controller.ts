import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import type { Request } from 'express';
import { DocumentAccessService } from '@/access-control/services/document-access.service';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';

export class AssignDocumentDto {
  @IsUUID()
  user_id: string;
}

@Controller('documents/assignment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentAssignmentController {
  constructor(private readonly db: PrismaService, private readonly documentAccess: DocumentAccessService) {}

  private context() {
    const context = requestContext.getStore();
    if (!context?.companyId || !context.schema || context.schema === 'public') {
      throw new ForbiddenException('Seleccioná una empresa');
    }
    return context;
  }

  @Get('users')
  async users(@CurrentUser() user: AuthUser, @Req() req: Request) {
    const context = this.context();
    const role = req['companyUserRole'] as string | undefined;
    const [sales, purchases] = await Promise.all([
      this.documentAccess.allowedCategories(user.id, role, 'sales', 'update'),
      this.documentAccess.allowedCategories(user.id, role, 'purchases', 'update'),
    ]);
    if (sales?.length === 0 && purchases?.length === 0) throw new ForbiddenException('No tenés permiso para reasignar documentos');
    const members = await this.db.getDefaultClient().company_users.findMany({
      where: { company_id: context.companyId, user: { active: true, deleted_at: null } },
      select: { user: { select: { id: true, name: true } } },
    });
    return members.map(({ user }) => user).sort((a, b) => a.name.localeCompare(b.name));
  }

  @Get(':id')
  async current(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    this.context();
    await this.documentAccess.assertAnyDocument(user.id, req['companyUserRole'] as string | undefined, id, 'read');
    const document = await this.db.getClientForCurrentContext().documents.findFirst({
      where: { id, deleted_at: null },
      select: { assigned_to: true },
    });
    if (!document) throw new NotFoundException('Documento no encontrado');
    if (!document.assigned_to) return null;
    return this.db.getDefaultClient().users.findUnique({
      where: { id: document.assigned_to },
      select: { id: true, name: true },
    });
  }

  @Patch(':id')
  async assign(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignDocumentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const context = this.context();
    await this.documentAccess.assertAnyDocument(user.id, req['companyUserRole'] as string | undefined, id, 'update');
    const member = await this.db.getDefaultClient().company_users.findFirst({
      where: { company_id: context.companyId, user_id: dto.user_id, user: { active: true, deleted_at: null } },
      select: { user: { select: { id: true, name: true } } },
    });
    if (!member) throw new BadRequestException('El usuario debe estar activo y pertenecer a esta empresa');
    const document = await this.db.getClientForCurrentContext().documents.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
    if (!document) throw new NotFoundException('Documento no encontrado');
    await this.db.getClientForCurrentContext().documents.update({
      where: { id, deleted_at: null },
      data: { assigned_to: dto.user_id },
    });
    return member.user;
  }
}
