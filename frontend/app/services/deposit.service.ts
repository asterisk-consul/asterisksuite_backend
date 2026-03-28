// services/depositos.service.ts
import { fetchData } from '~/composables/apiService'

export class DepositosService {
  static async findAll() {
    const data = await fetchData<Partial<ApiRegistroCabList>>('/deposito/index')
    return data.rows ?? []
  }
}
