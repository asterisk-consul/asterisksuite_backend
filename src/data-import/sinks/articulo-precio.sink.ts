import { Sink } from '../core/interfaces';

export class ArticuloPrecioSink implements Sink<any> {
  async send(data: any[]): Promise<void> {
    try {
      console.log('Guardar en BD:', data);
      // Tu lógica de guardado aquí
      // Ejemplo:
      // await this.articuloPrecioRepository.insert(data);
    } catch (error) {
      console.error('Error al guardar en BD:', error);
      throw error;
    }
  }
}
