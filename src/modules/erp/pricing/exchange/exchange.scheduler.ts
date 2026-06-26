import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { ExchangeService } from './exchange.service';

@Injectable()
export class ExchangeScheduler {
  private readonly logger = new Logger(ExchangeScheduler.name);

  constructor(private readonly exchangeService: ExchangeService) {}

  //cada 1 de 10 a 15 hs arg lunes a viernes
  @Cron('0 10-15 * * 1-5', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
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
