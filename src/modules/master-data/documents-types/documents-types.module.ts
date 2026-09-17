import { Module } from '@nestjs/common';
import { DocumentsTypesService } from './documents-types.service';
import { DocumentsTypesController } from './documents-types.controller';

@Module({
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService],
  exports: [DocumentsTypesService],
})
export class DocumentsTypesModule {}
