import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TableService } from './table.service';
import { SaveTablePreferenceDto } from './dto/save-table-preference.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('tables/preferences')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  save(@CurrentUser('id') userId: bigint, @Body() dto: SaveTablePreferenceDto) {
    return this.tableService.savePreference(userId, dto);
  }

  @Get(':tableKey')
  get(@CurrentUser('id') userId: bigint, @Param('tableKey') tableKey: string) {
    return this.tableService.getPreference(userId, tableKey);
  }
}
