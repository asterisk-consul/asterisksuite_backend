export interface ArticuloPrecioSafe {
  precio: number | null;
}

export interface ArticuloSafe {
  id: bigint;
  nombre: string | null;
  articuloprecio: ArticuloPrecioSafe[];
}

export interface ArticuloCompuestoSafe {
  articuloid: bigint | null;
  parentarticuloid: bigint | null;
  cantidad: number | null;
}

export interface ArbolCostosNodo {
  id: bigint;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  costoTotal: number;
  hijos: ArbolCostosNodo[];
}
