// src/articulos/articulos.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ArticulosController } from './articulos.controller.js';
import { ArticulosService } from './articulos.service.js';

@Module({
  imports: [PrismaModule], // Add this
  controllers: [ArticulosController],
  providers: [ArticulosService], // Remove PrismaService
  exports: [ArticulosService],
})
export class ArticulosModule {}
