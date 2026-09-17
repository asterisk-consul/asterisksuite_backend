import { Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { TrashService } from '@/common/services/trash.service';

@Module({
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
