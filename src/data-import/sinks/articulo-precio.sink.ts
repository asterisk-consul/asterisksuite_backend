import { Sink } from '../core/interfaces';

export class ArticuloPrecioSink implements Sink<any> {
  async send(data: any[]): Promise<void> {
    await Promise.resolve(); // <- hack limpio
    console.log('Guardar en BD', data);
  }
}
