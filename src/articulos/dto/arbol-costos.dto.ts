export class ArbolCostosDto {
  id: number;
  nombre: string | null;
  descrip: string | null;
  precio: number; // precio propio
  cantidad: number; // cantidad en relación padre → hijo
  costoPropio: number;
  costoTotal: number;
  hijos?: ArbolCostosDto[];
}

export interface ArticuloPrecioDTO {
  id: bigint;
  articuloid: bigint | null;
  categid: bigint | null;
  precio: number | null; // <-- cambiamos Decimal a number
  changedate: string | null;
  factorconversion: number | null;
}
