import { Sink } from '../core/interfaces';

export class ArticuloPrecioSink implements Sink<any> {
  send(data: any[]) {
    console.log('Guardando en BD:', data);
  }
}
