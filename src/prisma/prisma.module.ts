import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MemoryDiagnosticsService } from './memory-diagnostics.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, MemoryDiagnosticsService],
  exports: [PrismaService],
})
export class PrismaModule {}
