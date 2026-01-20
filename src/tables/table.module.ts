import { Module } from '@nestjs/common';
import { TableBuilder } from './table.builder';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],  // Importa PrismaModule para tener PrismaService
  providers: [TableBuilder],
  exports: [TableBuilder],
})
export class TableModule {}