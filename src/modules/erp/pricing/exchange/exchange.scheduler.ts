import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { ExchangeService } from './exchange.service';

@Injectable()
export class ExchangeScheduler {
  private readonly logger = new Logger(ExchangeScheduler.name);

  constructor(private readonly exchangeService: ExchangeService) {}

  // Cada 1 hora
  @Cron('0 * * * *')
  async handleSyncRates() {
    this.logger.log('Sincronizando cotizaciones...');

    try {
      await this.exchangeService.syncAllRates();

      this.logger.log('Cotizaciones sincronizadas');
    } catch (error) {
      this.logger.error('Error sincronizando cotizaciones', error);
    }
  }
}
