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

export type NodoListaMaestra = {
  id: bigint
  nombre: string
  internalcode: string | null
  externalcode: string | null
  cantidad: number
  ancho: number | null
  largo: number | null
  um: string | null
  ub: number | null
  esTerminal: boolean
  depositos?: {
    id: bigint;
    cantidad: number;
    deposito: string;
  }[];

  categorias?: {
    id: bigint;
    name: string;
  }[];

  hijos: NodoListaMaestra[]
}
