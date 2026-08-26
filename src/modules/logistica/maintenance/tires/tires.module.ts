import { Module } from '@nestjs/common';
import { TiresService } from './tires.service';
import { TiresController } from './tires.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TiresController],
  providers: [TiresService, PrismaService],
  exports: [TiresService],
})
export class TiresModule {}