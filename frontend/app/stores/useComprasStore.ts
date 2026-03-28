// useComprasStore.ts
import { defineStore } from 'pinia'
import { postData } from '~/composables/apiService'
// ⬆️ Arriba del defineStore
function diffIds(oldIds: number[], newIds: number[]) {
  const setOld = new Set(oldIds)
  return newIds.filter((id) => !setOld.has(id))
}

export const useComprasStore = defineStore('compras', {
  state: (): ComprasState => ({
    comprasA: [],
    comprasB: [],
    loading: false,
    error: null,
    loaded: false,
    comprasSeleccionadas: [],
    clasificando: false,
    lastFetch: null as Date | null
  }),

  actions: {
    /**
     * 👉 Solo carga una vez, no recarga cuando vuelvas a entrar al componente
     */
    async fetchComprasOnce() {
      if (this.loaded) return

      await this.fetchCompras() // fetch real con caché
      this.loaded = true
    },

    /**
     * 👉 Carga completa de compras (SOLO LISTA)
     */
    async fetchCompras(force = false): Promise<void> {
      const CACHE_TIME = 12 * 60 * 60 * 1000 // ⏳ 12 horas
      const now = Date.now()

      const shouldUseCache =
        !force &&
        this.lastFetch &&
        now - this.lastFetch.getTime() < CACHE_TIME &&
        this.comprasA.length > 0 &&
        this.comprasB.length > 0

      if (shouldUseCache) {
        console.log('🟢 Usando datos en caché (12h)')
        return
      }
      console.log('🔄 Cargando compras desde API...')
      this.loading = true
      this.error = null

      try {
        const flowidA = 11080
        const statusidA = 1711
        const flowidB = 11079
        const statusidB = 1692

        const dataA = {
          flowid: flowidA,
          statusid: statusidA,
          pattern: '',
          offset: 0,
          sort: 'referenciatexto',
          descending: false
        }

        const dataB = {
          flowid: flowidB,
          statusid: statusidB,
          pattern: '',
          offset: 0,
          sort: 'referenciatexto',
          descending: false
        }

        // Obtener listas principales A y B
        const [comprasAResList, comprasBResList] = await Promise.all([
          postData<ApiRegistroCabList, typeof dataA>(
            '/workspace/getRegistroCabList',
            dataA
          ),
          postData<ApiRegistroCabList, typeof dataB>(
            '/workspace/getRegistroCabList',
            dataB
          )
        ])

        // Asignar directamente la lista (lazy loading de detalles después)
        this.comprasA = comprasAResList.data.rows || []
        this.comprasB = comprasBResList.data.rows || []

        this.lastFetch = new Date()
        this.loaded = true

        console.log(`✅ Compras A: ${this.comprasA.length} registros`)
        console.log(`✅ Compras B: ${this.comprasB.length} registros`)
      } catch (error) {
        console.error('Error al obtener compras:', error)
        this.error = 'Error al cargar las compras'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateNuevasCompras() {
      const flowidA = 11080
      const statusidA = 1711
      const flowidB = 11079
      const statusidB = 1692

      const dataA = {
        flowid: flowidA,
        statusid: statusidA,
        pattern: '',
        offset: 0,
        sort: 'referenciatexto',
        descending: false
      }
      const dataB = {
        flowid: flowidB,
        statusid: statusidB,
        pattern: '',
        offset: 0,
        sort: 'referenciatexto',
        descending: false
      }

      const [listaA, listaB] = await Promise.all([
        postData<ApiRegistroCabList, typeof dataA>(
          '/workspace/getRegistroCabList',
          dataA
        ),
        postData<ApiRegistroCabList, typeof dataB>(
          '/workspace/getRegistroCabList',
          dataB
        )
      ])

      const nuevosA = diffIds(
        this.comprasA.map((c) => c.id),
        listaA.data.rows.map((r) => r.id)
      )

      const nuevosB = diffIds(
        this.comprasB.map((c) => c.id),
        listaB.data.rows.map((r) => r.id)
      )

      console.log('🆕 IDs nuevos A:', nuevosA)
      console.log('🆕 IDs nuevos B:', nuevosB)

      // Agregar nuevos registros (solo lista)
      if (nuevosA.length) {
        const nuevosRegistrosA = listaA.data.rows.filter((r) =>
          nuevosA.includes(r.id)
        )
        this.comprasA.push(...nuevosRegistrosA)
      }

      if (nuevosB.length) {
        const nuevosRegistrosB = listaB.data.rows.filter((r) =>
          nuevosB.includes(r.id)
        )
        this.comprasB.push(...nuevosRegistrosB)
      }

      console.log('✨ Sync completa sin recargar todo')
    },

    /**
     * 👉 Obtener detalle completo de una compra específica
     */
    async fetchCompraDetalle(id: number): Promise<Compra | null> {
      try {
        const res = await postData<any, { id: number; checkuser: boolean }>(
          '/workspace/getRegistroCabGeneric',
          {
            id: id,
            checkuser: true
          }
        )

        return res.data
      } catch (error) {
        console.error(`Error al obtener detalle de compra ${id}:`, error)
        return null
      }
    },

    /**
     * 👉 Carga TODOS los detalles (Para reportes/Excel)
     * ⚠️ Puede tardar, usar con loading
     */
    async fetchAllDetails(tipo: 'A' | 'B' | 'AMBOS' = 'AMBOS') {
      const idsA = this.comprasA.map((c) => c.id)
      const idsB = this.comprasB.map((c) => c.id)
      const todos: number[] = []

      if (tipo === 'A' || tipo === 'AMBOS') todos.push(...idsA)
      if (tipo === 'B' || tipo === 'AMBOS') todos.push(...idsB)

      console.log(`📥 Descargando detalles para ${todos.length} registros...`)

      // Descargar en lotes de 20 para no saturar
      const batchSize = 20
      let procesados = 0

      for (let i = 0; i < todos.length; i += batchSize) {
        const batch = todos.slice(i, i + batchSize)
        await Promise.all(
          batch.map(async (id) => {
            const detalle = await this.fetchCompraDetalle(id)
            if (detalle) {
              // Actualizar en el store
              if (idsA.includes(id)) {
                const idx = this.comprasA.findIndex((c) => c.id === id)
                if (idx !== -1)
                  this.comprasA[idx] = { ...this.comprasA[idx], ...detalle }
              } else {
                const idx = this.comprasB.findIndex((c) => c.id === id)
                if (idx !== -1)
                  this.comprasB[idx] = { ...this.comprasB[idx], ...detalle }
              }
            }
          })
        )
        procesados += batch.length
        console.log(`📊 Progreso: ${procesados}/${todos.length}`)
      }
      console.log('✅ Carga completa de detalles finalizada')
    },

    async reloadCompras(): Promise<void> {
      this.loaded = false
      await this.fetchCompras(true)
    },

    /**
     * 👉 Crear registros clasificados
     */
    async crearRegistrosClasificados(
      compra: Compra,
      distribuciones: Distribucion[],
      onProgreso?: (info: {
        actual: number
        total: number
        mensaje: string
      }) => void
    ): Promise<{ success: boolean; creados: number; resultados: any[] }> {
      this.clasificando = true
      this.error = null

      const resultados: any[] = []
      const total = distribuciones.length

      if (distribuciones.length === 0) {
        this.error = 'No hay distribuciones para clasificar'
        return { success: false, creados: 0, resultados }
      }

      try {
        for (let i = 0; i < total; i++) {
          const distribucion = distribuciones.at(i)
          if (!distribucion) continue
          // Emitimos progreso hacia el modal
          if (!distribucion.clasificacion) {
            throw new Error(`La distribución ${i + 1} no tiene clasificación`)
          }

          onProgreso?.({
            actual: i + 1,
            total,
            mensaje: `Creando registro ${i + 1} de ${total} (${distribucion.clasificacion.value})`
          })

          const resultado = await postData('/workspace/saveRegistroCab', {
            id: -1,
            flowid: 11088,
            statusid: 1715,
            statusflowid: 781,
            opciondesplegabletexto: distribucion.clasificacion.value,
            clientid: compra.clientid ?? null,
            clientname: compra.clientname ?? null,
            referenciatexto: compra.referenciatexto ?? null,
            fecha: compra.fecha ?? null,
            fechacompromiso: compra.fechacompromiso ?? null,
            totalimpuestos: distribucion.importes.totalimpuestos ?? null,
            totalprecio: distribucion.importes.totalprecio ?? null,
            varcn0: distribucion.importes.varcn0 ?? 0,
            varcn1: distribucion.importes.varcn1 ?? 0,
            varcn2: distribucion.importes.varcn2 ?? 0,
            varcn3: distribucion.importes.varcn3 ?? 0,
            responsableactactualid: '358',
            responsableactactual: { id: '358', identificador: '' },
            obsinicio: compra.obsinicio ?? null,
            obsfin: compra.obsfin ?? null,
            xlatitud: -32.4193186,
            xlongitud: -63.2334244,
            articulos: [],
            cuerpos: [],
            dependeDe: [],
            instructivoExec: []
          })

          resultados.push(resultado)
        }

        await this.reloadCompras()

        return {
          success: true,
          creados: resultados.length,
          resultados
        }
      } catch (error) {
        console.error('Error al crear registros clasificados:', error)
        this.error = 'Error al clasificar las compras'
        throw error
      } finally {
        this.clasificando = false
      }
    },
    limpiarSeleccion(): void {
      this.comprasSeleccionadas = []
    }
  },

  getters: {
    cantidadSeleccionadas: (state): number => state.comprasSeleccionadas.length,
    haySeleccion: (state): boolean => state.comprasSeleccionadas.length > 0
  }
})
