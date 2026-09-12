import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';

import { ProductStructureVersionService } from './product-structure-version.service';

@Module({
  imports: [PrismaModule],
  providers: [ProductStructureVersionService],
  exports: [ProductStructureVersionService],
})
export class ProductStructureVersionModule {}
