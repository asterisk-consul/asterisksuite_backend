import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { DocumentsSalesController } from './documents_sales.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsSalesController],
  providers: [DocumentsSalesService],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
