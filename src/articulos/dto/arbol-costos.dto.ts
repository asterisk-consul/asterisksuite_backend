export class ArbolCostosDto {
  id: bigint;
  nombre: string | null;
  descrip: string | null;
  precio: number; // precio propio
  cantidad: number; // cantidad en relación padre → hijo
  costoPropio: number;
  costoTotal: number;
  hijos?: ArbolCostosDto[];
}
