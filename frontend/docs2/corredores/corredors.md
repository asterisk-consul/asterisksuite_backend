# Documentación – Sistema de Corredores y Trips

## 1. Objetivo

El sistema de **corredores (corridors)** permite modelar rutas logísticas reutilizables dentro del sistema de transporte.

Un **corredor** representa un trayecto entre un origen y un destino, pudiendo incluir múltiples paradas intermedias.

Los **trips** pueden:

- utilizar un **corredor existente**
- crear un **corredor dinámico** específico para ese viaje

Esto permite soportar:

- rutas logísticas fijas (ej: Norte 1, Norte 2)
- rutas eventuales creadas al momento de planificar un viaje

---

# 2. Modelo de Datos

## Tabla `corridors`

Representa una ruta logística reutilizable.

Campos principales:

| Campo                   | Tipo      | Descripción                           |
| ----------------------- | --------- | ------------------------------------- |
| id                      | uuid      | Identificador del corredor            |
| company_id              | uuid      | Empresa propietaria                   |
| name                    | varchar   | Nombre del corredor                   |
| description             | varchar   | Descripción                           |
| origin_location_id      | uuid      | Ubicación de origen                   |
| destination_location_id | uuid      | Ubicación de destino                  |
| is_template             | boolean   | Indica si es un corredor reutilizable |
| total_distance_km       | decimal   | Distancia total                       |
| estimated_minutes       | int       | Tiempo estimado                       |
| active                  | boolean   | Estado                                |
| created_at              | timestamp | Fecha creación                        |

Relaciones:

```
corridors
 ├─ origin_location
 ├─ destination_location
 ├─ corridorStops
 └─ trips
```

---

## Tabla `corridor_stops`

Define las paradas intermedias de un corredor.

| Campo             | Tipo    | Descripción                         |
| ----------------- | ------- | ----------------------------------- |
| id                | uuid    | Identificador                       |
| corridor_id       | uuid    | Corredor                            |
| location_id       | uuid    | Ubicación                           |
| stop_order        | int     | Orden de parada                     |
| stop_type         | varchar | Tipo (pickup / delivery / transfer) |
| distance_km       | decimal | Distancia acumulada                 |
| estimated_minutes | int     | Tiempo estimado                     |

Relaciones:

```
corridor_stops
 ├─ corridor
 └─ location
```

---

## Tabla `trips`

Representa un viaje logístico.

Campos relevantes para corredores:

| Campo                   | Tipo    | Descripción         |
| ----------------------- | ------- | ------------------- |
| corridorsId             | uuid    | Corredor asociado   |
| origin_location_id      | uuid    | Origen              |
| destination_location_id | uuid    | Destino             |
| kilometers              | decimal | Distancia del viaje |

Relación:

```
trip
 └─ corridor
      └─ corridorStops
```

---

# 3. Flujo de Creación de Trips

Un trip puede crearse de dos formas.

---

# Caso 1 – Usar corredor existente

El frontend envía:

```json
{
  "company_id": "uuid",
  "status": "PLANNED",
  "corridor_id": "uuid"
}
```

Proceso backend:

```
Trip
   ↓
Se asocia corridor existente
```

Resultado:

```
Trip
 └─ Corridor
      ├─ Origin
      ├─ Stops
      └─ Destination
```

---

# Caso 2 – Crear corredor dinámico

El frontend envía una ruta completa:

```json
{
  "company_id": "uuid",
  "status": "PLANNED",
  "route": {
    "origin_location_id": "uuid",
    "destination_location_id": "uuid",
    "stops": [
      {
        "location_id": "uuid",
        "stop_order": 1
      },
      {
        "location_id": "uuid",
        "stop_order": 2
      }
    ]
  }
}
```

Proceso backend:

```
1 Crear corridor
2 Crear corridor_stops
3 Crear trip
4 Asociar corridor al trip
```

Resultado:

```
Trip
 └─ Corridor (dinámico)
      └─ Stops
```

---

# 4. Estructura de Servicios

## TripsService

Responsable de:

- CRUD de trips
- asociación con corredores
- creación de corredores dinámicos

Métodos principales:

```
findAll(company_id)
findOne(id)

create(dto)
update(id)

updateStatus(id)

remove(id)
```

Rates:

```
addRate()
updateRate()
removeRate()
```

---

# 5. Estructura de Endpoints

## Trips

```
GET /trips/:company_id
```

Lista todos los viajes de la empresa.

---

```
GET /trips/detail/:id
```

Obtiene detalle del viaje incluyendo:

- corredor
- paradas
- tarifas

---

```
POST /trips
```

Crea un viaje.

Permite:

- corredor existente
- corredor dinámico

---

```
PATCH /trips/:id
```

Actualizar viaje.

---

```
PATCH /trips/:id/status/:status
```

Actualizar estado.

---

```
DELETE /trips/:id
```

Eliminar viaje.

---

# 6. Relaciones de Dominio

Diagrama conceptual:

```
Company
   │
   ├── Locations
   │
   ├── Corridors
   │      │
   │      └── CorridorStops
   │
   └── Trips
          │
          └── Corridor
```

---

# 7. Beneficios del Diseño

Este diseño permite:

✔ rutas reutilizables
✔ rutas dinámicas
✔ escalabilidad logística
✔ cálculo de distancias
✔ planificación de entregas
✔ tracking de paradas

---

# 8. Posibles Extensiones Futuras

El modelo soporta fácilmente:

### Tracking de viaje

```
trip_stops
trip_events
trip_positions
```

---

### Optimización de rutas

Integración con:

- Google Directions
- OSRM
- GraphHopper

---

### Costos automáticos

```
km * tarifa
peajes
combustible
tiempo conductor
```

---

# 9. Buenas prácticas recomendadas

1️⃣ No modificar corredores históricos usados por trips
2️⃣ Usar `is_template` para corredores reutilizables
3️⃣ Corredores dinámicos deben tener `is_template = false`

---

# 10. Próximo paso recomendado

Antes de seguir programando, el siguiente paso ideal sería documentar también:

**Trip Stops**

porque es lo que usan todos los **TMS profesionales**.

Modelo:

```
trip
 └─ trip_stops
       ├─ arrival_time
       ├─ departure_time
       ├─ status
       └─ location
```

Esto permite:

- tracking real
- control de entregas
- ETA
