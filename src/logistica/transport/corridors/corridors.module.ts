import { Module } from '@nestjs/common';
import { CorridorsController } from './corridors.controller';
import { CorridorsService } from './corridors.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [CorridorsController],
  providers: [CorridorsService, PrismaService],
  exports: [CorridorsService],
})
export class CorridorsModule {}
