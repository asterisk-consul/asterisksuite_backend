# Nuxt Dashboard Template

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

### Sistema de Layouts

- **Layout Único**: `app/layouts/default.vue`
- **Barra Lateral Condicional**: Oculta en la ruta `/login` (propiedad computada `showSidebar`)
- **Componentes**:
  - Barra lateral colapsable/redimensionable con navegación
  - Búsqueda tipo paleta de comandos (atajos de teclado vía `useDashboard`)
  - Notificación tipo toast para consentimiento de cookies en la primera visita

### Atajos de Teclado

Definidos en `app/composables/useDashboard.ts`:

- `g-h`: Página de inicio (Home)
- `g-i`: Bandeja de entrada (Inbox)
- `g-c`: Clientes (Customers)
- `g-s`: Configuración (Settings)
- `n`: Alternar panel deslizante de notificaciones

### Organización de Componentes

Los componentes se organizan por característica/página en `app/components/`:

- `compras/`: Componentes de gestión de compras
- `customers/`: Componentes relacionados con clientes
- `home/`: Componentes del dashboard/página de inicio
- `inbox/`: Componentes de bandeja de entrada/mensajes
- `kilometros/`: Componentes de seguimiento de kilómetros
- `settings/`: Componentes de la página de configuración

### Sistema de Tipos

Definiciones de TypeScript en `app/types/`:

- `api.d.ts`: Tipos de respuesta de API
- `articulos.d.ts`: Tipos de productos/artículos
- `compras.d.ts`: Tipos de compras
- `csv.d.ts`: Tipos de análisis CSV
- `registro.d.ts`: Tipos de registro/grabación
- `ui.d.ts`: Tipos de componentes de UI
- Los tipos globales están aliasados vía `@types` en la configuración de nuxt

### Utilidades y Ayudantes (Helpers)

`app/utils/` contiene utilidades auto-importadas:

- `formatDate.ts`: Ayudantes de formato de fecha
- `formatMoneda.ts`: Formato de moneda
- `parseNumber.ts`: Utilidades de análisis de números
- Todas las exportaciones están disponibles globalmente sin importaciones

### Estructura de Navegación

La navegación está centralizada en `app/data/navigation.ts`:

- Estructura de dos niveles: Navegación principal + Navegación de pie de página
- Principal: Inicio, Kilómetros, Compras, Configuración (con hijos anidados)
- Pie de página: Enlace a documentación externa, Ayuda y Soporte

## Estilo de Código y Convenciones

### Configuración de ESLint

- Reglas personalizadas en `eslint.config.mjs`:
  - Permitir múltiples raíces de plantilla en Vue
  - Máximo 3 atributos por línea (línea simple)
  - Salto de línea de operador deshabilitado
  - Las funciones flecha requieren paréntesis
  - Reglas estilísticas: comma-dangle 'never', brace-style '1tbs'

### Configuración de Prettier

- Comillas simples
- Sin puntos y coma
- Sin comas finales (trailing commas)
- Ignorar sensibilidad de espacios en blanco en HTML
- Sin indentación para script/style en archivos Vue

### TypeScript

- Modo estricto habilitado (heredado de los valores predeterminados de Nuxt 4)
- Referencias a archivos generados `.nuxt/tsconfig.*`
- Ejecutar `pnpm typecheck` para validar tipos antes de hacer commit

## Dependencias Clave

### Framework de UI

- **@nuxt/ui v4.1.0**: Biblioteca principal de componentes de UI
- **@unovis/vue + @unovis/ts**: Componentes de visualización de datos

### Estado y Composición

- **Pinia**: Gestión de estado
- **@vueuse/nuxt**: Utilidades de composición de Vue
- **@pinia/nuxt**: Integración de Pinia con Nuxt

### Procesamiento de Datos

- **papaparse**: Análisis (parsing) de CSV
- **xlsx**: Procesamiento de archivos Excel (vía SheetJS CDN)
- **zod v4.1.12**: Validación de esquemas
- **date-fns + dayjs**: Manipulación de fechas

### Íconos

- **@iconify-json/lucide**: Set de íconos Lucide
- **@iconify-json/simple-icons**: Set de íconos Simple Icons

## Notas Importantes

### Al Trabajar con Autenticación

- Verifica siempre la validez del token vía `useAuthStore().isTokenExpiring()`
- El umbral de refresco de token es 20 minutos antes de expirar
- Usa `setToken()` desde `apiService` para actualizar el estado global del token
- La persistencia basada en cookies significa que los tokens sobreviven a las recargas de página

### Al Agregar Nuevos Endpoints de API

- Agrega funciones de envoltura (wrapper) en `app/service/apiService.ts`
- Usa el genérico `fetchData<T>` para GET o `postData<T, B>` para POST
- El token se inyecta automáticamente si está disponible
- Tipifica tus respuestas para seguridad de tipos

### Al Crear Nuevas Páginas

- Colócalas en `app/pages/` (enrutamiento automático de Nuxt)
- Todas las páginas excepto `/login` requieren autenticación (vía middleware global)
- Actualiza `app/data/navigation.ts` si la página debe aparecer en la barra lateral
- Agrega atajo de teclado en `useDashboard.ts` si es necesario

### Al Agregar Nuevos Stores

- Colócalos en `app/stores/` con el patrón de nombre `use*Store.ts`
- Usa el estilo de API de composición de Pinia (con `defineStore` + función flecha)
- Auto-importado, no es necesario importar explícitamente en componentes
- Considera la persistencia en cookies para estados críticos (ver patrón `useAuthStore`)

### Al Agregar Utilidades

- Colócalas en `app/utils/` para disponibilidad de auto-importación
- Exporta funciones con nombre (evita exportaciones por defecto/default exports)
- Las funciones están disponibles globalmente en todos los componentes/composables sin importaciones

### Desarrollo de Componentes

- Usa componentes de Nuxt UI desde `@nuxt/ui` (auto-importados)
- Sigue la organización basada en características en `app/components/[feature]/`
- Vue 3 Composition API + patrón `<script setup>`
- TypeScript en todos los archivos `.vue` vía `lang="ts"`

```

```
