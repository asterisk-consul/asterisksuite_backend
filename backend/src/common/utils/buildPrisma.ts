type AnyRecord = Record<string, unknown>;

export function omitUndefinedDeep<T>(obj: T): T {
  // ✅ Manejo de arrays tipado correctamente
  if (Array.isArray(obj)) {
    const arr = obj as unknown as unknown[];

    return arr.map((item) => omitUndefinedDeep(item)) as unknown as T;
  }

  // ✅ Manejo de objetos
  if (obj !== null && typeof obj === 'object') {
    const result: AnyRecord = {};

    for (const key in obj as AnyRecord) {
      const value = (obj as AnyRecord)[key];

      if (value === undefined || value === null) continue;

      result[key] = omitUndefinedDeep(value);
    }

    return result as T;
  }

  // ✅ Primitivos
  return obj;
}

// 🔹 Tipos de relaciones
type RelationArrayConfig<Item> = {
  type: 'array';
  map: (item: Item) => AnyRecord;
};

type RelationConfig<T> = {
  [K in keyof T]?: T[K] extends Array<infer U> ? RelationArrayConfig<U> : never;
};

// 🔹 Builder principal
export function buildPrismaUpdate<T extends object>(
  dto: T,
  relations?: RelationConfig<T>,
) {
  const data: AnyRecord = {};

  for (const key in dto) {
    const value = dto[key];

    // ✅ solo ignorar undefined
    if (value === undefined) continue;

    const relationConfig = relations?.[key as keyof T];

    // ✅ relaciones
    if (
      relationConfig &&
      relationConfig.type === 'array' &&
      Array.isArray(value)
    ) {
      data[key] = {
        deleteMany: {},
        create: (value as Parameters<typeof relationConfig.map>[0][]).map(
          (item) => omitUndefinedDeep(relationConfig.map(item)),
        ),
      };
      continue;
    }

    // 🔥 manejo de fechas
    if (key === 'planned_date' && value) {
      data[key] = new Date(value as string);
      continue;
    }

    // ✅ permitir null
    data[key] = value;
  }

  return data;
}
