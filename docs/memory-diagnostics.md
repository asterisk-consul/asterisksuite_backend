# Diagnóstico de memoria del backend

El diagnóstico está desactivado por defecto. Para medir una ejecución local, configurar:

```env
MEMORY_DIAGNOSTICS_INTERVAL_MS=10000
MEMORY_DIAGNOSTICS_FORCE_GC=true
```

Compilar y ejecutar con:

```bash
pnpm run build
pnpm run start:memory
```

En Windows, los snapshots se toman desde `chrome://inspect` → **inspect** → pestaña **Memory**. El comando `start:memory` es compatible con Windows.

`MEMORY_DIAGNOSTICS_FORCE_GC` requiere `--expose-gc` y sirve únicamente para una prueba controlada. No debe dejarse activo en producción porque ejecutar GC en intervalos puede agregar pausas.

Cada muestra incluye:

- `rssMb`: memoria residente total vista por el sistema operativo.
- `heapUsedMb`: objetos JavaScript vivos.
- `externalMb` y `arrayBuffersMb`: buffers, archivos y memoria nativa referenciada por JavaScript.
- `tenantClients`: clientes Prisma tenant retenidos en caché.
- `publicPool` y `tenantPools`: conexiones PostgreSQL totales, libres y esperando.
- `activeResources`: sockets, timers y otros recursos activos de Node.

## Prueba reproducible

1. Iniciar el backend y esperar tres muestras sin actividad.
2. Ejecutar repetidamente el flujo sospechoso durante 5 a 10 minutos.
3. Dejar el backend sin actividad durante al menos 7 minutos. El TTL predeterminado de clientes tenant es de 5 minutos y la limpieza se ejecuta una vez por minuto.
4. Comparar el mínimo estable de `heapUsedMb` antes y después, no una muestra tomada antes de un GC.
5. Si `heapUsedMb` sigue subiendo, abrir `chrome://inspect`, seleccionar el proceso Node y tomar snapshots de heap antes y después del flujo.

Interpretación rápida:

- Sube `heapUsedMb`: objetos JavaScript retenidos; comparar snapshots por *Retained Size*.
- Sube `externalMb`/`arrayBuffersMb`: revisar cargas de archivos, XLSX, imágenes y `Buffer`.
- Sube `tenantClients`: revisar rotación de empresas y liberación por TTL.
- Suben conexiones o `TCPSocketWrap`: revisar consultas/transacciones que no terminan.
- Sólo sube `rssMb`, pero el heap después de GC queda estable: normalmente es memoria reservada por V8 o librerías nativas, no una fuga de objetos.

## Límites de la caché multi-tenant

Los valores predeterminados pueden ajustarse mediante:

```env
TENANT_CLIENT_IDLE_TTL_MS=300000
TENANT_CLIENT_CACHE_MAX=8
```

Los clientes inactivos vencen a los cinco minutos. Si se supera el máximo, la limpieza expulsa primero los clientes menos utilizados que no tengan consultas ni conexiones ocupadas. Nunca se cierra un pool con trabajo activo.

Los schedulers multi-tenant usan clientes temporales y los desconectan después de procesar cada empresa. De este modo, las tareas de reservas, cheques, alertas fiscales y cotizaciones no llenan la caché utilizada por las solicitudes web. La sincronización de cotizaciones consulta DolarApi una sola vez por ejecución y reutiliza ese resultado para todos los tenants.

La sincronización de cotizaciones se ejecuta cada 30 minutos de manera predeterminada. Puede configurarse mediante `EXCHANGE_SYNC_CRON`; sólo se crea un registro histórico cuando el valor cambia y cada documento conserva su propia cotización.

En Linux, iniciar con `pnpm run start:memory:linux` y pedir un snapshot con:

```bash
kill -USR2 <PID_NODE>
```

El archivo `.heapsnapshot` puede abrirse en Chrome DevTools, pestaña **Memory**.
