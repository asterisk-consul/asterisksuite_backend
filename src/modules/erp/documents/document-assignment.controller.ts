import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';

export class AssignDocumentDto {
  @IsUUID()
  user_id: string;
}

@Controller('documents/assignment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentAssignmentController {
  constructor(private readonly db: PrismaService) {}

  private context() {
    const context = requestContext.getStore();
    if (!context?.companyId || !context.schema || context.schema === 'public') {
      throw new ForbiddenException('Seleccioná una empresa');
    }
    return context;
  }

  @Get('users')
  @RequirePermissions('documents.update')
  async users() {
    const context = this.context();
    const members = await this.db.getDefaultClient().company_users.findMany({
      where: { company_id: context.companyId, user: { active: true, deleted_at: null } },
      select: { user: { select: { id: true, name: true } } },
    });
    return members.map(({ user }) => user).sort((a, b) => a.name.localeCompare(b.name));
  }

  @Get(':id')
  @RequirePermissions('documents.read')
  async current(@Param('id', ParseUUIDPipe) id: string) {
    this.context();
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
  @RequirePermissions('documents.update')
  async assign(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignDocumentDto) {
    const context = this.context();
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
