# Política de Versionado del Sistema

## 1. Objetivo

Este documento define la estrategia de **versionado del sistema**, incluyendo:

- Versionado global del sistema
- Versionado interno de módulos
- Manejo de cambios en endpoints y base de datos
- Uso de `versions.json` y `CHANGELOG.md`
- Flujo de releases (`alpha`, `beta`, `release`)
- Criterios para determinar **patch, minor y major**

El objetivo es mantener **consistencia, trazabilidad y estabilidad** a medida que el sistema crece y se agregan nuevos módulos.

---

# 2. Conceptos de Versionado

El sistema utiliza **Semantic Versioning (SemVer)**:

```
MAJOR.MINOR.PATCH
```

Ejemplo:

```
1.2.3
```

### Significado

| Parte | Significado                        |
| ----- | ---------------------------------- |
| MAJOR | Cambios incompatibles              |
| MINOR | Nuevas funcionalidades compatibles |
| PATCH | Correcciones de errores            |

---

# 3. Versionado Global del Sistema

El **versionado global** representa la versión del **sistema completo integrado**, incluyendo todos los módulos.

Ejemplo:

```
1.2.0
```

Esto significa que todos los módulos integrados funcionan correctamente bajo esa versión del sistema.

La versión global se muestra en:

- Navbar del frontend
- Modal de changelog
- Documentación del sistema

---

# 4. Versionado de Módulos

Cada módulo puede tener su propio versionado interno durante desarrollo.

Ejemplo:

| Módulo     | Versión     |
| ---------- | ----------- |
| Transporte | 0.5.3-alpha |
| Compras    | 0.2.1-alpha |
| QR         | 0.1.4-alpha |

Este versionado sirve para:

- control interno de desarrollo
- control de migraciones
- desarrollo paralelo de módulos

El versionado de módulos **no afecta automáticamente la versión global**.

---

# 5. Estados de Release

Las versiones pueden tener un **estado de desarrollo**.

| Estado  | Significado                            |
| ------- | -------------------------------------- |
| Alpha   | Desarrollo interno, cambios frecuentes |
| Beta    | Funcionalidad estable pero en prueba   |
| Release | Versión estable en producción          |

Ejemplos:

```
1.2.0-alpha
1.2.0-beta
1.2.0
```

Flujo típico:

```
1.2.0-alpha → 1.2.0-beta → 1.2.0
```

---

# 6. Cuándo cambiar PATCH, MINOR o MAJOR

## PATCH

Correcciones menores que **no agregan funcionalidad ni rompen compatibilidad**.

Ejemplos:

- Fix de bug en endpoint
- Corrección de lógica
- Ajuste de UI
- Corrección de validación

Ejemplo:

```
1.2.0 → 1.2.1
```

---

## MINOR

Se usa cuando se **agrega funcionalidad nueva compatible**.

Ejemplos:

- nuevo módulo integrado
- nuevos endpoints
- nuevas funcionalidades
- mejoras internas

Ejemplo:

```
1.2.0 → 1.3.0
```

Caso típico en este sistema:

> Se integra un nuevo módulo al sistema.

---

## MAJOR

Se usa cuando un cambio **rompe compatibilidad existente**.

Ejemplos:

- cambio de estructura de base de datos
- cambio incompatible en endpoints
- eliminación de endpoints
- cambio en formato de respuestas de API
- cambios que obligan a modificar otros módulos

Ejemplo:

```
1.3.0 → 2.0.0
```

---

# 7. Cambios en Endpoints

Los cambios en endpoints se clasifican de la siguiente manera.

## Cambios compatibles

Ejemplos:

- agregar campo opcional
- mejorar lógica interna
- agregar endpoint nuevo

Impacto:

```
MINOR o PATCH
```

---

## Cambios incompatibles

Ejemplos:

- eliminar endpoint
- cambiar parámetros obligatorios
- cambiar formato de respuesta
- cambiar contrato de API

Impacto:

```
MAJOR
```

---

# 8. Cambios en Base de Datos

## Cambios compatibles

Ejemplos:

- agregar columna opcional
- crear nueva tabla
- agregar índice

Impacto:

```
MINOR
```

---

## Cambios incompatibles

Ejemplos:

- eliminar columna usada
- cambiar tipo de dato
- modificar tabla compartida entre módulos
- migración que rompe queries existentes

Impacto:

```
MAJOR
```

---

# 9. Archivo versions.json

El archivo `versions.json` mantiene el historial de versiones del sistema.

Se almacenan las últimas **20–30 versiones**.

Ejemplo:

```json
[
  {
    "version": "1.3.0-beta",
    "date": "2026-04-01",
    "stage": "beta",
    "notes": "Integración del módulo de compras",
    "modules": [
      { "name": "transporte", "version": "0.6.0-alpha" },
      { "name": "compras", "version": "0.2.1-alpha" }
    ]
  },
  {
    "version": "1.2.1",
    "date": "2026-03-20",
    "stage": "alpha",
    "notes": "Fix en endpoint de update de vehículos"
  }
]
```

El frontend siempre toma:

```
última versión del array
```

para mostrar la versión actual.

---

# 10. CHANGELOG.md

El archivo `CHANGELOG.md` mantiene un historial **legible por humanos** de cambios importantes.

Ejemplo:

```markdown
# Changelog

## [1.3.0-beta] - 2026-04-01

### Added

- Integración del módulo Compras
- Nuevo endpoint para gestión de órdenes

### Changed

- Optimización de consultas en transporte

### Fixed

- Bug en actualización de vehículos

---

## [1.2.1] - 2026-03-20

### Fixed

- Error en endpoint update de estado
```

---

# 11. Flujo de trabajo recomendado

### 1 Desarrollo de módulo

Cada módulo evoluciona internamente.

Ejemplo:

```
transporte 0.5.3-alpha
```

---

### 2 Integración al sistema

Cuando se integra un módulo:

```
1.2.0 → 1.3.0-beta
```

---

### 3 Pruebas

El sistema pasa por:

```
alpha → beta
```

---

### 4 Release

Cuando todo está estable:

```
1.3.0
```

---

# 12. Ejemplo real de evolución del sistema

```
1.0.0   lanzamiento inicial

1.1.0   módulo transporte

1.1.1   fix update estados

1.2.0   módulo compras

1.2.1   fix endpoint vehículos

1.3.0   módulo QR

2.0.0   cambio en base de datos principal
```

---

# 13. Reglas clave

1. El **versionado global refleja el sistema completo**.
2. El **major solo cambia si se rompe compatibilidad**.
3. Los módulos pueden evolucionar internamente sin afectar el global.
4. Cada release debe registrarse en:

- `versions.json`
- `CHANGELOG.md`

---

# 14. Buenas prácticas

- documentar cada release
- mantener changelog actualizado
- limitar `versions.json` a últimas 20–30 versiones
- evitar cambios incompatibles sin migración
