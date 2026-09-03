import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

import { AccountsService } from './accounts.service';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @RequirePermissions('accounts.read')
  @Get('export')
  async exportAccounts(
    @Query('format') format: 'xlsx' | 'csv' = 'xlsx',
    @Res() res?: Response,
  ) {
    const result = await this.accountsService.exportToExcel(format);
    res?.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename=${result.filename}`,
    });
    res?.send(result.buffer);
  }

  @RequirePermissions('accounts.create')
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importAccounts(@UploadedFile() file: Express.Multer.File) {
    return this.accountsService.importFromExcel(file.buffer);
  }

  @RequirePermissions('accounts.create')
  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }

  @RequirePermissions('accounts.read')
  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @RequirePermissions('accounts.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @RequirePermissions('accounts.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountsService.update(id, dto);
  }

  @RequirePermissions('accounts.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
