// src/bootstrap/bootstrap.module.ts
import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { SshModule } from '../ssh/ssh.module';

@Module({
    imports: [SshModule],  // <-- IMPORTANTE
    providers: [BootstrapService],
})
export class BootstrapModule { }
