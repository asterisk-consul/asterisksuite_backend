import { Module } from '@nestjs/common';
import { DocumentsTypesController } from './documents-types.controller';
import { DocumentsTypesService } from './documents-types.service';
import { CommonErpModule } from '@/common/common-erp.module';

@Module({
  imports: [CommonErpModule],
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService],
  exports: [DocumentsTypesService],
})
export class DocumentsTypesErpModule {}
