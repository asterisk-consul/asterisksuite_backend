// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
// Assuming you have a module that provides PrismaService
import { PrismaModule } from './prisma/prisma.module.js'; // <-- Add/identify this
import { SshModule } from './ssh/ssh.module.js';
import { BootstrapModule } from './bootstrap/bootstrap.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ArticulosModule } from './articulos/articulos.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';

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
export class AppModule { }
