import { Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { TrashService } from '@/common/services/trash.service';
import { HrModule } from '@/modules/erp/hr/hr.module';

@Module({
  imports: [HrModule],
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
