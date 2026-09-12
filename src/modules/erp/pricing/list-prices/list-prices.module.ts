import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ListPricesService } from './list-prices.service';
import { ListPricesController } from './list-prices.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ListPricesController],
  providers: [ListPricesService],
  exports: [ListPricesService],
})
export class ListPricesModule {}
