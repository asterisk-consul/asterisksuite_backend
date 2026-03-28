// types/api.d.ts
declare global {
  interface ApiResponse<T = any> {
    status: number
    data: ApiRegistroCabList | T
  }
  interface ApiRegsitroCab {
    id: number
    status: number
  }
  export interface ApiRegistroCabList {
    cols: string[]
    rows: Row[]
    total: number
  }

  export interface Row {
    id: number
    descrip: string
    fecha: string
    fechacompromiso: string
    fechavencimiento: any
    creationdate: string
    clientid: number
    clientname: string
    totalprecio: number
    totalimpuestos: number
    referenciatexto: string
    vendedor: any
    vendedorid: any
    parteinteresadatipoid: any
    procesoid: any
    puestotrabajoid: any
    auditor: any
    auditorid: any
    ejecutor: number
    ejecutorid: string
    total: number
  }
  export type TypeApiDeposito = ApiDeposito[]

  export interface ApiDeposito {
    id: number
    descrip: string
    activo: boolean
    parentid?: number
    categid: number
    categoria: Categoria
    perfilid: any
    parentDeposito?: ParentDeposito
  }

  export interface Categoria {
    id: number
    name: string
    grupo: string
    parentid: any
    orden: any
    procparentid: any
    macroparentid: any
    notas: any
    valor: any
  }

  export interface ParentDeposito {
    id: number
    descrip: string
    activo: boolean
    parentid?: number
    categid: number
    perfilid: any
  }

  export interface Puesto {
    id: number
    perfilid: number
    categoriaid: number
  }

  export interface CategoriaPerfil {
    id: number
    perfilid: number
    categoriaid: number
  }

  export interface Contacto {
    id: number
    perfilid: number
    nombre: string
    email?: string
    telefono?: string
  }

  export interface Usuario {
    id: number
    perfilid: number
    username: string
    activo: boolean
    roleid?: number | null
  }

  export interface TipoDocumento {
    id: number
    name: string
    grupo: string
    parentid: number | null
  }

  // --- Empleado (singular, no array) ---
  export interface Empleado {
    id: number
    perfilid: number
    legajonro?: string | null
    foto?: string | null
    estcivil?: string | null
    nacionalidad?: string | null
    lugarnacim?: string | null
    profesion?: string | null
    obrasocial?: string | null
    depositoid?: number | null
    puestos?: Puesto[]
  }

  // --- Perfil principal (PLANO, como llega del backend) ---
  export interface ApiPerfil {
    // datos base
    id: number
    activo: boolean
    nombre?: string
    apellido?: string
    identificador?: string
    documento?: string
    razonsocial?: string | null
    notas?: string | null
    externalid?: string | null
    porcentajedesc?: number | null

    // documento
    tipodocumento?: number
    tipodocumentodesc?: string
    tipo_documento?: TipoDocumento

    // ubicación
    xlatitud?: number | null
    xlongitud?: number | null
    zonaid?: number | null
    zona?: any | null

    // relaciones
    empleado?: Empleado
    categorias?: CategoriaPerfil[]
    tipos?: CategoriaPerfil[]
    contactos?: Contacto[]
    usuario?: Usuario
  }
}

export {}
