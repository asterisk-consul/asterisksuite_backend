export interface DolarApiQuote {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
  variacion?: number;
}
