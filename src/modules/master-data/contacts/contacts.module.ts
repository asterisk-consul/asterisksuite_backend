import { Module } from '@nestjs/common';
import { PartyContactsService } from './contacts.service';
import { PartyContactsController } from './contacts.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PartyContactsController],
  providers: [PartyContactsService],
  exports: [PartyContactsService],
})
export class PartyContactsModule {}
