import { Module } from '@nestjs/common';
import { DispatchOrdersService } from './dispatch-orders.service';
import { DispatchOrdersController } from './dispatch-orders.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [DispatchOrdersController],
  providers: [DispatchOrdersService],
  imports: [PrismaModule],
})
export class DispatchOrdersModule {}
