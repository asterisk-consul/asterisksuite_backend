import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
