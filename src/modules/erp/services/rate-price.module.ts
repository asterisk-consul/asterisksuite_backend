import { Module } from '@nestjs/common';
import { RatePriceService } from './rate-price.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RatePriceService],
  exports: [RatePriceService],
})
export class RatePriceModule {}
