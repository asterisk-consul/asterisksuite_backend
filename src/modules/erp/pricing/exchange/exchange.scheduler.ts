import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ExchangeScheduler {
  private readonly logger = new Logger(ExchangeScheduler.name);
  private running = false;

  // Por defecto sincroniza una vez al día a las 15:00 de Argentina.
  // El horario puede ajustarse por ambiente sin recompilar.
  @Cron(process.env.EXCHANGE_SYNC_CRON ?? '0 15 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleSyncRates() {
    if (this.running) {
      this.logger.warn('La sincronización anterior todavía está en ejecución; se omite esta corrida');
      return;
    }

    this.running = true;
    const workerPath = join(__dirname, 'exchange-sync.worker.js');

    try {
      this.logger.log('Iniciando sincronización aislada de cotizaciones...');
      await this.runWorker(workerPath);
      this.logger.log('La sincronización aislada de cotizaciones finalizó correctamente');
    } catch (error) {
      this.logger.error('Falló la sincronización aislada de cotizaciones', error);
    } finally {
      this.running = false;
    }
  }

  private runWorker(workerPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [workerPath], {
        env: process.env,
        stdio: 'inherit',
      });
      let settled = false;

      const timeout = setTimeout(() => {
        this.logger.error('La sincronización superó el límite de 10 minutos; se detiene el proceso auxiliar');
        child.kill('SIGTERM');
      }, 10 * 60 * 1000);

      child.once('error', (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(error);
      });

      child.once('spawn', () => {
        this.logger.log(`Proceso auxiliar de cotizaciones iniciado (pid ${child.pid ?? 'desconocido'})`);
      });

      child.once('close', (code, signal) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`El proceso auxiliar terminó con código ${code ?? 'nulo'}${signal ? ` (${signal})` : ''}`));
        }
      });
    });
  }
}
