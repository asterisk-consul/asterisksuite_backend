import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { TableColumn } from './table.types'

@Injectable()
export class TableBuilder {
  constructor(private prisma: PrismaService) {}

  private tableKey!: string
  private columns!: TableColumn[]
  private model!: any
  private query!: any
  private userId?: bigint

  private select?: any
  private mapRow?: (row: any) => any

  // -------------------------
  // Configuración
  // -------------------------
  for(tableKey: string) {
    this.tableKey = tableKey
    return this
  }

  columnsDef(columns: TableColumn[]) {
    this.columns = columns
    return this
  }

  queryModel(model: any) {
    this.model = model
    return this
  }

  request(query: any) {
    this.query = query
    return this
  }

user(userId?: bigint) {
  this.userId = userId
  return this
}


  selectDef(select: any) {
    this.select = select
    return this
  }

  map(fn: (row: any) => any) {
    this.mapRow = fn
    return this
  }

  // -------------------------
  // Build
  // -------------------------
  async build() {
    const preferences = await this.loadPreferences()

    const page = Number(this.query?.page) || 1
    const limit =
      Number(this.query?.limit) ||
      preferences?.pageSize ||
      25

    const skip = (page - 1) * limit

    const where = this.buildWhere()
    const orderBy = this.buildOrderBy(preferences)

    const rowsRaw = await this.model.findMany({
      select: this.select,
      where,
      skip,
      take: limit,
      orderBy,
    })

    const total = await this.model.count({ where })

    const rows = this.mapRow
      ? rowsRaw.map(this.mapRow)
      : rowsRaw

    return {
      meta: {
        page,
        limit,
        total,
      },
      columns: this.buildColumns(preferences),
      rows,
    }
  }

  // -------------------------
  // Preferencias
  // -------------------------
  private async loadPreferences() {
    if (!this.userId) return null

    return this.prisma.userTablePreference.findUnique({
      where: {
        userId_tableKey: {
          userId: this.userId,
          tableKey: this.tableKey,
        },
      },
    })
  }

  // -------------------------
  // Columnas visibles
  // -------------------------
  private buildColumns(pref: any) {
    const visibleColumns = pref?.visibleColumns as string[] | undefined

    return this.columns.map(col => ({
      ...col,
      visible: visibleColumns
        ? visibleColumns.includes(col.key)
        : col.defaultVisible !== false,
    }))
  }

  // -------------------------
  // Filtros
  // -------------------------
  private buildWhere() {
    if (!this.query?.search) return {}

    const searchable = this.columns.filter(c => c.filterable)

    if (!searchable.length) return {}

    return {
      OR: searchable.map(col => ({
        [col.key]: {
          contains: this.query.search,
          mode: 'insensitive',
        },
      })),
    }
  }

  // -------------------------
  // Orden
  // -------------------------
  private buildOrderBy(pref: any) {
    if (this.query?.sort) {
      const [key, dir] = this.query.sort.split(':')
      return { [key]: dir === 'desc' ? 'desc' : 'asc' }
    }

    if (pref?.sort) {
      return pref.sort
    }

    return undefined
  }
}
