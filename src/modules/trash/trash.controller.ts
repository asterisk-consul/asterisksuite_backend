import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
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
}
