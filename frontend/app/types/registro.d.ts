// types/registro.d.ts
declare global {

  type RegistroCabCreate = Partial<RegistroCab>;

  interface RegistroCab {
    id: number | -1
    flowid: number
    articuloGenerar: null
    articuloGenerarId: null
    referenciatexto: string
    externalid: null
    obsinicio: null
    obsverificar: null
    descrip: null
    fecha: string
    fechacompromiso: Date
    fechavencimiento: null
    clientid: number
    clientname: string
    vendedorid: null
    auditorid: null
    ejecutorid: null
    contactosid: number
    parteinteresadatipoid: null
    puestotrabajoid: null
    procesoid: null
    macroprocesoid: null
    condventaid: null
    cuentacontableid: null
    opciondesplegableid: null
    opciondesplegabletexto: null
    totalprecio: null
    totalimpuestos: null
    vendedor: null
    auditor: null
    ejecutor: null
    notas: null
    obsprod: null
    obsventas: null
    obsadm: null
    obsoo: null
    obsactuar: null
    envcontact: string
    envmail: string
    envtelef: string
    envdirec: string
    envlocalid: string
    envprov: number
    envcp: string
    envpais: number
    calidadfinal: null
    statusid: number
    responsableactactualid: number | null
    cuerpos: any[]
    showDependeDe: boolean
    dependeDe: any[]
    instructivoExec: InstructivoExec[]
    xlatitud: number
    xlongitud: number
    depositoarticuloid: null
    articulocantidad: number
    listaprecioid: null
    varcn0: number
    varcn1: number
    varcn2: number
    varcn3: number
    statusflowid: number
    contactos: Contactos
    cuentacontable: Cuentacontable
    currentuser: number
    flow: Flow
    macroproceso: Cuentacontable
    opciondesplegable: Cuentacontable
    pais: Flow
    parteinteresadatipo: Cuentacontable
    proceso: Cuentacontable
    provincia: Flow
    puestotrabajo: Cuentacontable
    requiereCuerpo: boolean
    secuencias: any[]
    status: Status
    statusflows: Statusflows
    responsableactactual: Responsableactactual
  }

  interface Contactos {
    email: string
    id: number
    nombre: string
    perfilid: number
    telefono: string
    tipoid: number
  }

  interface Flow {
    grupo: string
    id: number
    name: string
    parentid?: number
  }

  interface InstructivoExec {
    statusflowid: number
    id: number
  }

  interface Responsableactactual {
    id: number | null
    identificador: string
  }

  interface Status {
    categid: number
    descrip: string
    id: number
  }

  interface Statusflows {
    categid: number
    id: number
    requerirUsuario: boolean
    statusid: number
  }
}

export { }
