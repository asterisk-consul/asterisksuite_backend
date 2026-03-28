// composables/useDistribuciones.ts

import { distribucionSchema } from '~/schemas/distribuciones.schema'

export const useDistribuciones = (
  compraOriginal: Ref<Partial<Compra>>,
  opcionesCamiones: Ref<Array<{ label: string; value: string }>>
) => {
  // ====== FUNCIÓN AUXILIAR ======
  const crearDistribucionVacia = (): Distribucion => ({
    clasificacion: undefined,
    porcentaje: 0,
    bloqueada: false,
    importes: {
      totalimpuestos: 0,
      totalprecio: 0,
      varcn0: 0,
      varcn1: 0,
      varcn2: 0,
      varcn3: 0
    }
  })

  // ====== ESTADO ======
  const distribuciones = ref<Distribucion[]>([
    { ...crearDistribucionVacia(), porcentaje: 1 }
  ])

  // ====== CRUD BÁSICO ======
  // --- añadir dentro de tu composable, preferentemente cerca de las otras funciones ---
  const recalcularPorcentajes = () => {
    const total = distribuciones.value.length
    if (total === 0) return

    // Suma de porcentajes bloqueados (por si ya existen)
    const porcentajeBloqueado = distribuciones.value
      .filter((d) => d.bloqueada)
      .reduce((sum, d) => sum + (d.porcentaje || 0), 0)

    // Distribuciones no bloqueadas
    const noBloqueadas = distribuciones.value.filter((d) => !d.bloqueada)
    const restante = Math.max(0, 1 - porcentajeBloqueado)
    const porcentajePorNoBloqueada = noBloqueadas.length
      ? restante / noBloqueadas.length
      : 0

    // Asignar porcentaje a las no bloqueadas (las bloqueadas mantienen su valor)
    distribuciones.value.forEach((dist) => {
      if (!dist.bloqueada) {
        dist.porcentaje = Math.round(porcentajePorNoBloqueada * 10000) / 10000
      } else {
        // normalizar a 4 decimales si viene con otra precisión
        dist.porcentaje = Math.round((dist.porcentaje || 0) * 10000) / 10000
      }
    })

    // Corregir posible error por redondeo: ajustar la primera no-bloqueada (si existe)
    const suma = distribuciones.value.reduce(
      (s, d) => s + (d.porcentaje || 0),
      0
    )
    const diff = Math.round((1 - suma) * 10000) / 10000
    if (Math.abs(diff) > 0 && noBloqueadas.length > 0) {
      const idx = distribuciones.value.findIndex((d) => !d.bloqueada)
      if (idx >= 0) {
        distribuciones.value[idx].porcentaje =
          Math.round(
            ((distribuciones.value[idx].porcentaje || 0) + diff) * 10000
          ) / 10000
      }
    }

    // Recalcular importes para cada distribución (no activar ajuste recíproco aquí)
    distribuciones.value.forEach((_, i) =>
      calcularImportesPorPorcentaje(i, false)
    )
  }

  // ===== Modificaciones a funciones existentes =====

  const agregarDistribucion = () => {
    distribuciones.value.push(crearDistribucionVacia())
    recalcularPorcentajes()
  }

  const eliminarDistribucion = (index: number) => {
    if (distribuciones.value.length > 1) {
      distribuciones.value.splice(index, 1)
      recalcularPorcentajes()
    }
  }

  const toggleBloqueo = (index: number) => {
    const dist = distribuciones.value[index]
    if (dist) {
      dist.bloqueada = !dist.bloqueada
      // Al cambiar el bloqueo, redistribuimos porcentajes y recalculamos importes
      recalcularPorcentajes()
    }
  }

  // ====== CÁLCULOS ======
  const calcularImportesPorPorcentaje = (
    index: number,
    ajustarOtras = false
  ) => {
    const dist = distribuciones.value[index]
    if (!dist) return

    const p = dist.porcentaje
    const compra = compraOriginal.value

    dist.importes = {
      totalimpuestos: Math.round((compra.totalimpuestos || 0) * p * 100) / 100,
      totalprecio: Math.round((compra.totalprecio || 0) * p * 100) / 100,
      varcn0: Math.round((compra.varcn0 || 0) * p * 100) / 100,
      varcn1: Math.round((compra.varcn1 || 0) * p * 100) / 100,
      varcn2: Math.round((compra.varcn2 || 0) * p * 100) / 100,
      varcn3: Math.round((compra.varcn3 || 0) * p * 100) / 100
    }

    if (ajustarOtras) {
      ajustarDistribucionesNoBloquedas(index)
    }
  }

  const calcularPorcentajePorImporte = (
    index: number,
    campo: keyof ImportesDistribuidos,
    ajustarOtras = false
  ) => {
    const dist = distribuciones.value[index]
    if (!dist) return

    const compra = compraOriginal.value
    const valorOriginal = compra[campo] || 0

    // Evitar división por cero
    if (valorOriginal === 0) {
      console.warn(
        `El valor original de ${campo} es 0, no se puede calcular el porcentaje`
      )
      return
    }

    const valorDistribuido = dist.importes[campo] || 0
    const nuevoPorcentaje = valorDistribuido / valorOriginal

    // Validar que el porcentaje esté en rango válido
    if (nuevoPorcentaje < 0 || nuevoPorcentaje > 1) {
      console.warn(`Porcentaje fuera de rango: ${nuevoPorcentaje * 100}%`)
      return
    }

    dist.porcentaje = Math.round(nuevoPorcentaje * 10000) / 10000 // 4 decimales

    // Recalcular todos los importes con el nuevo porcentaje
    calcularImportesPorPorcentaje(index, ajustarOtras)
  }
  const actualizarPorcentajeDesdeImporte = (
    index: number,
    campo:
      | 'totalimpuestos'
      | 'totalprecio'
      | 'varcn0'
      | 'varcn1'
      | 'varcn2'
      | 'varcn3',
    ajustarOtras = false
  ) => {
    calcularPorcentajePorImporte(index, campo, ajustarOtras)
  }

  const totalesDistribuidos = computed(() => {
    return distribuciones.value.reduce(
      (acc, dist) => ({
        totalimpuestos:
          acc.totalimpuestos + (dist.importes.totalimpuestos || 0),
        totalprecio: acc.totalprecio + (dist.importes.totalprecio || 0),
        varcn0: acc.varcn0 + (dist.importes.varcn0 || 0),
        varcn1: acc.varcn1 + (dist.importes.varcn1 || 0),
        varcn2: acc.varcn2 + (dist.importes.varcn2 || 0),
        varcn3: acc.varcn3 + (dist.importes.varcn3 || 0)
      }),
      {
        totalimpuestos: 0,
        totalprecio: 0,
        varcn0: 0,
        varcn1: 0,
        varcn2: 0,
        varcn3: 0
      }
    )
  })

  // ====== VALIDACIONES ======
  const r2 = (n: number | null | undefined) => Math.round((n || 0) * 100) / 100

  const isEqual = (a: number | undefined, b: number, tolerance = 0.01) => {
    return Math.abs(r2(a) - r2(b)) <= tolerance
  }

  const totalesCoincidenCompletamente = computed(() => {
    const compra = compraOriginal.value
    const totales = totalesDistribuidos.value

    return (
      isEqual(compra.totalimpuestos, totales.totalimpuestos) &&
      isEqual(compra.totalprecio, totales.totalprecio) &&
      isEqual(compra.varcn0, totales.varcn0) &&
      isEqual(compra.varcn1, totales.varcn1) &&
      isEqual(compra.varcn2, totales.varcn2) &&
      isEqual(compra.varcn3, totales.varcn3)
    )
  })

  const esDistribucionValida = (dist: Distribucion): boolean => {
    try {
      distribucionSchema.parse(dist)
      return true
    } catch {
      return false
    }
  }

  // ====== ACCIONES AVANZADAS ======
  const prorraterarEquitativamente = () => {
    const noBloqueadas = distribuciones.value.filter((d) => !d.bloqueada)

    if (noBloqueadas.length === 0) {
      console.warn('No hay distribuciones desbloqueadas para prorratear')
      return
    }

    const porcentajeBloqueado = distribuciones.value
      .filter((d) => d.bloqueada)
      .reduce((sum, d) => sum + d.porcentaje, 0)

    const porcentajeDisponible = 1 - porcentajeBloqueado
    const porcentajePorDist = porcentajeDisponible / noBloqueadas.length

    distribuciones.value.forEach((dist, index) => {
      if (!dist.bloqueada) {
        dist.porcentaje = porcentajePorDist
        calcularImportesPorPorcentaje(index)
      }
    })
  }

  const distribuirTodosCamiones = () => {
    const camiones = opcionesCamiones.value

    if (camiones.length === 0) {
      console.warn('No hay camiones disponibles para distribuir')
      return
    }

    const porcentaje = 1 / camiones.length
    const compra = compraOriginal.value

    distribuciones.value = camiones.map((camion) => ({
      clasificacion: camion,
      porcentaje,
      bloqueada: false,
      importes: {
        totalimpuestos:
          Math.round((compra.totalimpuestos || 0) * porcentaje * 100) / 100,
        totalprecio:
          Math.round((compra.totalprecio || 0) * porcentaje * 100) / 100,
        varcn0: Math.round((compra.varcn0 || 0) * porcentaje * 100) / 100,
        varcn1: Math.round((compra.varcn1 || 0) * porcentaje * 100) / 100,
        varcn2: Math.round((compra.varcn2 || 0) * porcentaje * 100) / 100,
        varcn3: Math.round((compra.varcn3 || 0) * porcentaje * 100) / 100
      }
    }))
  }

  const ajustarDistribucionesNoBloquedas = (indexModificado: number) => {
    const distModificada = distribuciones.value[indexModificado]

    // No ajustar si la distribución modificada está bloqueada
    if (!distModificada || distModificada.bloqueada) return

    // Obtener distribuciones no bloqueadas (excluyendo la modificada)
    const noBloqueadas = distribuciones.value.filter(
      (d, i) => !d.bloqueada && i !== indexModificado
    )

    // Si no hay otras distribuciones para ajustar, salir
    if (noBloqueadas.length === 0) return

    // Calcular porcentaje bloqueado total
    const porcentajeBloqueado = distribuciones.value
      .filter((d) => d.bloqueada)
      .reduce((sum, d) => sum + d.porcentaje, 0)

    // Calcular porcentaje restante para distribuir
    const porcentajeRestante =
      1 - porcentajeBloqueado - distModificada.porcentaje

    // Prevenir porcentajes negativos
    if (porcentajeRestante < 0) {
      console.warn('El porcentaje total excede 100%')
      return
    }

    const porcentajePorDist = porcentajeRestante / noBloqueadas.length

    // Actualizar distribuciones no bloqueadas
    distribuciones.value.forEach((dist, index) => {
      if (!dist.bloqueada && index !== indexModificado) {
        dist.porcentaje = Math.max(0, porcentajePorDist)
        calcularImportesPorPorcentaje(index)
      }
    })
  }

  // ====== FILTROS ======
  const getOpcionesDisponibles = (indexActual: number) => {
    // Obtener valores ya seleccionados (excluyendo el índice actual)
    const seleccionados = distribuciones.value
      .map((dist, idx) =>
        idx !== indexActual ? dist.clasificacion?.value : null
      )
      .filter(Boolean) as string[]

    // Filtrar opciones que no estén seleccionadas
    return opcionesCamiones.value.filter(
      (opcion) => !seleccionados.includes(opcion.value)
    )
  }

  // al final del composable, antes del `return { ... }`
  recalcularPorcentajes()

  // ====== RETURN ======
  return {
    // Estado
    distribuciones,
    totalesDistribuidos,
    totalesCoincidenCompletamente,

    // CRUD
    agregarDistribucion,
    eliminarDistribucion,
    toggleBloqueo,

    // Cálculos
    calcularImportesPorPorcentaje,
    calcularPorcentajePorImporte,
    actualizarPorcentajeDesdeImporte,

    // Validaciones
    esDistribucionValida,

    // Acciones
    prorraterarEquitativamente,
    distribuirTodosCamiones,
    ajustarDistribucionesNoBloquedas,

    // Utilidades
    getOpcionesDisponibles
  }
}
