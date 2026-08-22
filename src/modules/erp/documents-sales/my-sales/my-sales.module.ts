import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { MySalesService } from './my-sales.service';
import { MySalesController } from './my-sales.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MySalesController],
  providers: [MySalesService],
  exports: [MySalesService],
})
export class MySalesModule {}
