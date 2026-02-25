import { Module } from '@nestjs/common';
import { PalletsService } from './pallets.service';
import { PalletsController } from './pallets.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PalletsController],
  providers: [PalletsService],
})
export class PalletsModule {}
