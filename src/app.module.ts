// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
// Assuming you have a module that provides PrismaService
import { PrismaModule } from './prisma/prisma.module'; // <-- Add/identify this
import { SshModule } from './ssh/ssh.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { AuthModule } from './auth/auth.module';
import { ArticulosModule } from './articulos/articulos.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    // 1. Load the configuration FIRST.
    AppConfigModule,
    SshModule,
    PrismaModule,
    BootstrapModule,
    AuthModule,
    ArticulosModule,
    CategoriasModule,
  ],
})
export class AppModule {}
