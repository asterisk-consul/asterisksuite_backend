import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { SshModule } from './ssh/ssh.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';

@Module({
  imports: [
    AppConfigModule,
    SshModule,
    BootstrapModule,
  ],
})
export class AppModule { }
