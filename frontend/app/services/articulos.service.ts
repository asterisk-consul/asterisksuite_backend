import { fetchData } from '~/composables/apiService'

export class ArticulosService {
  static async findArticulo(id: number) {
    const data = (await fetchData(`/articulo/${id}`)) as Articulo
    return data
  }
}
