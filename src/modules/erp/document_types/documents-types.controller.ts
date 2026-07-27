// documents-types.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentsTypesService } from './documents-types.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('documents-types')
@UseGuards(JwtAuthGuard)
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  // @RequirePermissions('documents-types.create')
  @Post()
  create(@Body() dto: CreateDocumentsTypeDto) {
    return this.documentsTypesService.create(dto);
  }

  // @RequirePermissions('documents-types.read')
  @Get()
  findAll(
    @Query('direction') direction?: string,
    @Query('issuer_condition') issuerCondition?: string,
  ) {
    return this.documentsTypesService.findAll(
      direction ? Number(direction) : undefined,
      issuerCondition,
    );
  }

  // @RequirePermissions('documents-types.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsTypesService.findOne(id);
  }

  // @RequirePermissions('documents-types.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentsTypeDto) {
    return this.documentsTypesService.update(id, dto);
  }
}
