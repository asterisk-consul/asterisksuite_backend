import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SshService } from '../ssh/ssh.service';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
    private readonly logger = new Logger(BootstrapService.name);

    constructor(
        private readonly config: ConfigService,
        private readonly sshService: SshService,
    ) { }

    async onApplicationBootstrap() {
        const port: number =
            this.config.get<number>('SSH_LOCAL_PORT') ??
            this.config.get<number>('PG_PORT') ??
            5433;

        try {
            this.logger.log('Creando SSH tunnel...');
            await this.sshService.createSSHTunnel(port);
            this.logger.log('SSH tunnel listo');
        } catch (e) {
            this.logger.error('SSH tunnel fallido', e);
        }
    }
}
