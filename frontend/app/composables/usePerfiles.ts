export function usePerfiles(tipo?: number) {
  const store = usePerfilesStore()
  const { entities, loading } = storeToRefs(store)

  async function load(tipoParam?: number, detalleCompleto = false) {
    if (loading.value) return
    await store.fetchAll(tipoParam ?? tipo, detalleCompleto)
  }

  /* =========================
   * Select options
   * ========================= */
  function selectOptions(categoriaid?: number) {
    return entities.value
      .filter((p) => {
        if (!categoriaid) return true

        const puestos = p.empleado?.puestos ?? []
        return puestos.some((pu: Puesto) => pu.categoriaid === categoriaid)
      })
      .map((p) => {
        const label =
          p.identificador ??
          p.razonsocial ??
          `${p.apellido ?? ''}`.trim() ??
          '-'

        return {
          label,
          value: p.id
        }
      })
  }

  /* =========================
   * Finders
   * ========================= */

  function findById(id?: number) {
    return entities.value.find((p) => p.id === id)
  }

  function findByNombre(nombre?: string) {
    if (!nombre) return undefined

    const normalized = normalize(nombre)

    return entities.value.find((p) => {
      const label =
        p.identificador ?? p.razonsocial ?? `${p.apellido ?? ''}`.trim()

      return normalize(label) === normalized
    })
  }

  /* =========================
   * Resolvers (para import)
   * ========================= */

  function resolveIdByNombre(nombre?: string): number | null {
    const perfil = findByNombre(nombre)
    return perfil?.id ?? null
  }

  function resolveOrThrow(nombre: string): number {
    const id = resolveIdByNombre(nombre)
    if (!id) {
      throw new Error(`Perfil no encontrado: ${nombre}`)
    }
    return id
  }

  /* =========================
   * Utils
   * ========================= */

  function normalize(value: string) {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
  }

  return {
    loading,
    load,
    entities,
    selectOptions,
    findById,
    findByNombre,
    resolveIdByNombre,
    resolveOrThrow
  }
}
