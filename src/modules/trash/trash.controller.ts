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
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  // 🗑️ VER TODA LA PAPELERA
  @Get()
  findAll(@Query('days') days?: string, @Query('table') table?: string) {
    return this.trashService.findAllTrash(
      days ? Number(days) : undefined,
      table,
    );
  }

  // 🗑️ SOFT DELETE GENÉRICO
  @Delete(':table/:id')
  softDelete(
    @Param('table') table: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.trashService.softDelete(table, id, user.id);
  }

  // ♻️ RESTORE GENÉRICO
  @Patch(':table/:id/restore')
  restore(@Param('table') table: string, @Param('id') id: string) {
    return this.trashService.restore(table, id);
  }

  // 🗑️ SOFT DELETE BULK
  @Delete('bulk/:table')
  softDeleteMany(
    @Param('table') table: string,
    @Body() body: { ids: string[] },
    @CurrentUser() user: AuthUser,
  ) {
    return this.trashService.softDeleteMany(table, body.ids, user.id);
  }

  // ♻️ RESTORE BULK
  @Patch('bulk/:table/restore')
  restoreMany(@Param('table') table: string, @Body() body: { ids: string[] }) {
    return this.trashService.restoreMany(table, body.ids);
  }

  // 💀 HARD DELETE BULK
  @Delete('hard/:table')
  hardDeleteMany(
    @Param('table') table: string,
    @Body() body: { ids: string[] },
  ) {
    return this.trashService.hardDeleteMany(table, body.ids);
  }
}
