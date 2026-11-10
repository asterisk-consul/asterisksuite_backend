import { Module } from '@nestjs/common';
import { AccessControlModule } from '@/access-control/access-control.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { FilesModule } from '@/modules/logistica/media/files/files.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [AccessControlModule, PrismaModule, FilesModule, NotificationsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
