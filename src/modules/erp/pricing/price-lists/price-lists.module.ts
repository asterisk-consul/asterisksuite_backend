import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { PriceListsService } from './price-lists.service';
import { PriceListsController } from './price-lists.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PriceListsController],
  providers: [PriceListsService],
  exports: [PriceListsService],
})
export class PriceListsModule {}
