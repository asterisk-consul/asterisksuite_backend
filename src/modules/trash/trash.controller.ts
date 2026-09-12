import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TrashService } from '@/common/services/trash.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @RequirePermissions('trash.read')
  // 🗑️ VER TODA LA PAPELERA
  @Get()
  findAll(@Query('days') days?: string, @Query('table') table?: string) {
    return this.trashService.findAllTrash(
      days ? Number(days) : undefined,
      table,
    );
  }

  @RequirePermissions('trash.delete')
  // 🗑️ SOFT DELETE BULK (antes que :table/:id para evitar conflicto de rutas)
  @Delete('bulk/:table')
  softDeleteMany(
    @Param('table') table: string,
    @Body() body: { ids: string[] },
    @CurrentUser() user: AuthUser,
  ) {
    return this.trashService.softDeleteMany(table, body.ids, user.id);
  }

  @RequirePermissions('trash.restore')
  // ♻️ RESTORE BULK (antes que :table/:id para evitar conflicto de rutas)
  @Patch('bulk/:table/restore')
  restoreMany(@Param('table') table: string, @Body() body: { ids: string[] }) {
    return this.trashService.restoreMany(table, body.ids);
  }

  @RequirePermissions('trash.delete')
  // 💀 HARD DELETE BULK (antes que :table/:id para evitar conflicto de rutas)
  @Delete('hard/:table')
  hardDeleteMany(
    @Param('table') table: string,
    @Body() body: { ids: string[] },
  ) {
    return this.trashService.hardDeleteMany(table, body.ids);
  }

  @RequirePermissions('trash.delete')
  // 🗑️ SOFT DELETE GENÉRICO (después de las rutas bulk)
  @Delete(':table/:id')
  softDelete(
    @Param('table') table: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.trashService.softDelete(table, id, user.id);
  }

  @RequirePermissions('trash.restore')
  // ♻️ RESTORE GENÉRICO (después de las rutas bulk)
  @Patch(':table/:id/restore')
  restore(@Param('table') table: string, @Param('id') id: string) {
    return this.trashService.restore(table, id);
  }
}
