// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
// Assuming you have a module that provides PrismaService
import { PrismaModule } from './prisma/prisma.module.js'; // <-- Add/identify this
import { SshModule } from './ssh/ssh.module.js';
import { BootstrapModule } from './bootstrap/bootstrap.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ArticulosModule } from './articulos/articulos.module.js';

@Module({
  imports: [
    // 1. Load the configuration FIRST.
    AppConfigModule,

    // 2. Load the PrismaModule AFTER the configuration is loaded and global.
    PrismaModule,

    // 3. Load other modules that depend on the database/config.
    SshModule,
    BootstrapModule,
    AuthModule,
    ArticulosModule,
  ],
})
export class AppModule {}
