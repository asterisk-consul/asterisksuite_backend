// src/bootstrap/bootstrap.module.ts
import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service.js';
import { SshModule } from '../ssh/ssh.module.js';

@Module({
    imports: [SshModule],  // <-- IMPORTANTE
    providers: [BootstrapService],
})
export class BootstrapModule { }
