import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ExchangeScheduler } from './exchange.scheduler';

@Module({
  imports: [PrismaModule],

  controllers: [ExchangeController],

  providers: [ExchangeService, ExchangeScheduler],

  exports: [ExchangeService],
})
export class ExchangeModule {}
