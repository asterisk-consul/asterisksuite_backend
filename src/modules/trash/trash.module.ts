import { Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { TrashService } from '@/common/services/trash.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TrashController],
  providers: [TrashService, PrismaService],
})
export class TrashModule {}
