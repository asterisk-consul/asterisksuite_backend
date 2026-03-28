# 1. Mejoras de Modelo de Datos

## 1.1 Distancia automática del corredor

Hoy el campo existe:

```text
corridors.total_distance_km
```

Pero idealmente debería **calcularse automáticamente**.

### Idea

Cuando se crea o modifica un corredor:

1. tomar:
   - origin
   - stops
   - destination

2. calcular distancia entre cada punto
3. sumar kilómetros

### Implementación posible

Servicios:

```
route.service.ts
```

Integraciones posibles:

- **OSRM (open source)** recomendado
- Google Directions API
- GraphHopper

Flujo:

```
create corridor
      ↓
calculate route distance
      ↓
save total_distance_km
```

---

# 2. Versionado de Corredores

Problema típico:

Un corredor cambia pero **hay trips históricos usando la versión anterior**.

### Solución

Agregar:

```
corridor_version
```

o

```
version INT
```

Ejemplo:

| id  | name  | version |
| --- | ----- | ------- |
| 1   | Norte | 1       |
| 1   | Norte | 2       |

Trip apunta a:

```
corridor_version_id
```

Beneficio:

✔ auditoría
✔ historial logístico
✔ reproducibilidad de rutas

---

# 3. Plantillas de Corredores

Ya tienes:

```
is_template
```

Esto está muy bien.

Pero podrías agregar:

```
corridor_category
```

Ejemplo:

```
DISTRIBUTION
LONG_HAUL
INTERPLANT
TRANSFER
```

Permite organizar rutas.

---

# 4. Tipos de parada

Tu modelo ya tiene:

```
stop_type
```

Pero conviene formalizarlo.

Ejemplo:

```
PICKUP
DELIVERY
TRANSFER
FUEL
TOLL
REST
```

Esto permite después:

- cálculo de tiempos
- tracking
- operaciones logísticas

---

# 5. Tiempo estimado de viaje

Hoy tienes:

```
estimated_minutes
```

pero podrías calcularlo automáticamente.

### Fórmula simple

```
distance / avg_speed
```

### Fórmula avanzada

usar API de rutas.

Guardar:

```
estimated_departure_time
estimated_arrival_time
```

---

# 6. Soporte para rutas alternativas

Ejemplo real:

```
Córdoba → Rosario
```

Puede tener:

```
Ruta 9
Ruta autopista
Ruta alternativa
```

Modelo posible:

```
corridor_routes
```

```
corridor
   └ routes
         ├ main
         ├ alternative
         └ emergency
```

---

# 7. Restricciones de vehículo

Muchos corredores tienen restricciones.

Ejemplos reales:

- altura máxima
- peso máximo
- prohibición de camiones

Agregar en corredor:

```
max_weight
max_height
max_length
vehicle_type_allowed
```

Esto permite validar:

```
trip.vehicle_combination
```

---

# 8. Geometría del corredor

Hoy guardas solo puntos.

Una mejora importante es guardar **la línea de la ruta**.

Campo:

```
route_geometry
```

Tipo:

```
PostGIS LINESTRING
```

Beneficios:

✔ mostrar ruta exacta en mapa
✔ calcular desvíos
✔ tracking GPS

---

# 9. Cálculo de peajes

Se puede guardar:

```
toll_estimated_cost
```

O mejor:

```
corridor_tolls
```

Ejemplo:

| toll             | price |
| ---------------- | ----- |
| peaje autopista  | 1500  |
| peaje provincial | 800   |

Esto ayuda en **cálculo de costos logísticos**.

---

# 10. Zonas logísticas

Muchos TMS trabajan por zonas.

Ejemplo:

```
NORTE
SUR
CENTRO
PATAGONIA
```

Campo:

```
logistic_zone
```

Sirve para:

- reporting
- planificación
- asignación de viajes

---

# 11. Agrupar corredores

Ejemplo:

```
red logística
```

```
Corredor Norte
Corredor Sur
Corredor Exportación
```

Modelo:

```
corridor_groups
```

---

# 12. Optimización automática de rutas

Esto ya es **nivel avanzado TMS**.

Ejemplo:

```
multi stop optimization
```

Input:

```
locations[]
vehicle
capacity
```

Output:

```
best route
```

Algoritmos:

- VRP (Vehicle Routing Problem)
- OR Tools
- GraphHopper optimization

---

# 13. Generación automática de trips desde corredores

Ejemplo:

```
Corredor Norte
```

Frecuencia:

```
Lunes
Miércoles
Viernes
```

Sistema genera automáticamente:

```
trip schedule
```

Modelo posible:

```
corridor_schedules
```

---

# 14. Métricas del corredor

Muy útil para analytics.

Guardar:

```
avg_trip_time
avg_delay
total_trips
avg_cost
```

Permite optimizar rutas.

---

# 15. Alertas logísticas

Por ejemplo:

```
traffic alert
weather alert
road closure
```

Modelo:

```
corridor_alerts
```

---

# 16. Validación geográfica

Antes de crear un trip:

validar que:

```
origin ∈ corridor
destination ∈ corridor
```

---

# 17. Integración con tracking GPS

Si tienes telemetría:

comparar:

```
truck position
vs
route geometry
```

Detectar:

```
route deviation
```

---

# 18. Modo de transporte

Corredores podrían ser:

```
ROAD
RAIL
SEA
MULTIMODAL
```

---

# 19. Rutas internacionales

Agregar:

```
border_crossing
customs_location
```

---

# 20. Cache de rutas

Si usas APIs de mapas:

guardar resultado.

```
route_cache
```

Evita pagar APIs múltiples veces.

---

# 21. Estado del corredor

Ejemplo:

```
ACTIVE
TEMPORARY_CLOSED
RESTRICTED
```

---

# 22. UI / UX mejoras

Frontend podría mostrar:

- mapa del corredor
- paradas numeradas
- distancia acumulada
- ETA

---

# 23. Generación automática de stops del trip

Cuando se crea un trip desde corredor:

```
trip_stops
```

se generan automáticamente.

Esto permite tracking real.

---

# 24. Prioridad del corredor

Ejemplo:

```
priority
```

Para optimizar asignación.

---

# 25. Testing del sistema de rutas

Agregar tests:

```
route distance calculation
stop ordering
trip creation
```

---

# Roadmap recomendado

### Nivel 1 (corto plazo)

1. cálculo automático de distancia
2. generación de trip_stops
3. tipos de parada
4. ETA automático

---

### Nivel 2

1. geometría de ruta
2. restricciones de vehículo
3. peajes
4. zonas logísticas

---

### Nivel 3

1. optimización de rutas
2. tracking GPS
3. analytics de corredores
