import { postData } from '~/composables/apiService'
import type { ApiPerfil } from '~/types'

export class ParteInteresadasService {
  static async findAll(tipo?: number): Promise<ApiPerfil[]> {
    const params: any = {
      offset: 0,
      max: null,
      sort: 'nombre',
      sortOrder: 'asc',
      cols: 'cols-perfil-6'
    }
    if (tipo !== undefined) {
      params.filters = { tipo } // solo agregar si existe
    }

    const data = await postData('/perfil/index', params)

    if (!data?.data?.rows || !Array.isArray(data.data.rows)) return []

    // mapear cada fila a ApiPerfil
    return data.data.rows.map((row: any) => ({
      perfiles: {
        id: row['perfiles.id'],
        nombre: row['perfiles.nombre'],
        apellido: row['perfiles.apellido'],
        identificador: row['perfiles.identificador'],
        razonsocial: row['perfiles.razonsocial'],
        notas: row['perfiles.notas'],
        activo: row['perfiles.activo'],
        documento: row['perfiles.documento'],
        externalid: row['perfiles.externalid'],
        tipodocumento: row['perfiles.tipoprecioid'], // o ajusta si es diferente
        tipodocumentodesc: row['tipo_documento.name'],
        xlatitud: row['perfiles.xlatitud'],
        xlongitud: row['perfiles.xlongitud'],
        zonaid: row['perfiles.zonaid']
      },
      empleados: row['empleados'] ?? [], // si la API incluye esto
      impositivos: row['impositivos'] ?? [],
      usuarios: row['usuarios'] ?? []
    }))
  }

  static async findById(id: number): Promise<ApiPerfil | null> {
    const data = await fetchData(`/perfil/show/${id}`)
    // console.log('Data findById:', data)
    if (data && typeof data === 'object') {
      return data as ApiPerfil
    }
    return null
  }
}
