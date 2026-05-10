import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_purchases.service';
import { DocumentsSalesController } from './documents_puerchases.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsSalesController],
  providers: [DocumentsSalesService],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
