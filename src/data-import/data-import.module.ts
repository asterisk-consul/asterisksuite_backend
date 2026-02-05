import { Module } from '@nestjs/common';
import { DataImportController } from './data-import.controller';
import { DataImportService } from './data-import.service';
import { ImportRegistry } from './data-import.registry';
@Module({
  controllers: [DataImportController],
  providers: [DataImportService, ImportRegistry],
})
export class DataImportModule {}
