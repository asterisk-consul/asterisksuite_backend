import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { GetTablePreferencesDto } from './dto/get-table-preferences.dto';
import { SaveTablePreferencesDto } from './dto/save-table-preferences.dto';
import { UserPreferencesService } from './user-preferences.service';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly preferences: UserPreferencesService) {}

  @Get('table')
  getTablePreferences(
    @CurrentUser() user: AuthUser,
    @Query() query: GetTablePreferencesDto,
  ) {
    return this.preferences.getTablePreferences(user.id, query.tableKey);
  }

  @Put('table')
  saveTablePreferences(
    @CurrentUser() user: AuthUser,
    @Body() dto: SaveTablePreferencesDto,
  ) {
    return this.preferences.saveTablePreferences(user.id, dto);
  }
}
