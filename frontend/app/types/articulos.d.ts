// types/articulo.d.ts
declare global {
  interface ArticuloResponse {
    status: number
    data: Articulo
  }

  interface Camion {
    patente: string
  }

  interface Articulo {
    activo: boolean
    articuloprecios: Articuloprecio[]
    articulosDepositos: ArticulosDeposito[]
    categid: number
    categoria: Categoria2
    categoriaPadre: CategoriaPadre
    cuentacontable: Cuentacontable
    id: number
    internalcode: string
    isamedida: boolean
    ischeque: boolean
    isservice: boolean
    nombre: string
    tipoarticuloid: number[]
    tipos: Tipo[]
  }

  interface Articuloprecio {
    articuloid: number
    categid: number
    categoria: Categoria
    changedate: string
    factorconversion: number
    id: number
    precio: number
  }

  interface Categoria {
    id: number
    name: string
  }

  interface Categoria2 {
    grupo: string
    id: number
    name: string
    parentid: number
  }

  interface CategoriaPadre {
    grupo: string
    id: number
    name: string
  }

  interface ArticulosDeposito {
    articuloid: number
    cantcomprometida: number
    cantidad: number
    cantminrepo: number
    canttransito: number
    compraminima: number
    deposito: Deposito
    depositoid: number
    id: number
    nivelobj: number
    permitenegativo: boolean
    puntorepo: number
  }

  interface Deposito {
    activo: boolean
    descrip: string
    id: number
  }

  interface Tipo {
    articuloid: number
    categid: number
    id: number
  }
}

export {}
