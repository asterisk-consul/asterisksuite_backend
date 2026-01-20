// src/articulos/articulos.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';
import { TableModule } from '@/tables/table.module';

@Module({
  imports: [PrismaModule,TableModule], // Add this
  controllers: [ArticulosController],
  providers: [ArticulosService], // Remove PrismaService
  exports: [ArticulosService],
})
export class ArticulosModule {}
