<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import { ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type EstadoViaje = 'Pendiente' | 'En tránsito' | 'Finalizado'
type EstadoVehiculo = 'Disponible' | 'En ruta' | 'Mantenimiento'
type EstadoCliente = 'Activo' | 'Inactivo'

interface Viaje {
  id: string
  origen: string
  destino: string
  chofer: string
  vehiculo: string
  estado: EstadoViaje
  remitosEntrada: number
  remitosSalida: number
  eta: string
  temperatura: string
}

interface Vehiculo {
  patente: string
  tipo: string
  chofer: string
  km: number
  ultimoService: string
  estado: EstadoVehiculo
  tempActual: string
}

interface StockItem {
  sku: string
  nombre: string
  categoria: 'Congelados' | 'Lácteos' | 'Fiambres' | 'Comidas preparadas'
  deposito: string
  stock: number
  minimo: number
  tempRequerida: string
}

interface OrdenPicking {
  id: string
  producto: string
  sku: string
  cantidad: number
  unidad: string
  destino: string
  completado: boolean
}

interface Cliente {
  empresa: string
  cuit: string
  contacto: string
  viajesActivos: number
  estado: EstadoCliente
}

interface Deposito {
  nombre: string
  ciudad: string
  sectores: number
  ocupacion: number
  tempPromedio: string
  alerta: boolean
}

// ─── ESTADO ──────────────────────────────────────────────────────────────────
const navActivo = ref<
  | 'dashboard'
  | 'viajes'
  | 'depositos'
  | 'picking'
  | 'stock'
  | 'flota'
  | 'clientes'
  | 'reportes'
  | 'permisos'
  | 'empresas'
>('dashboard')

const viajes = ref<Viaje[]>([
  {
    id: 'TRIP-001',
    origen: 'Buenos Aires',
    destino: 'Rosario',
    chofer: 'Juan Pérez',
    vehiculo: 'ABC123',
    estado: 'En tránsito',
    remitosEntrada: 2,
    remitosSalida: 1,
    eta: '14:30',
    temperatura: '-18°C'
  },
  {
    id: 'TRIP-002',
    origen: 'Córdoba',
    destino: 'Mendoza',
    chofer: 'Carlos Gómez',
    vehiculo: 'DEF456',
    estado: 'Pendiente',
    remitosEntrada: 1,
    remitosSalida: 0,
    eta: '18:00',
    temperatura: '-22°C'
  },
  {
    id: 'TRIP-003',
    origen: 'Rosario',
    destino: 'Santa Fe',
    chofer: 'Marta López',
    vehiculo: 'GHI789',
    estado: 'Finalizado',
    remitosEntrada: 3,
    remitosSalida: 3,
    eta: '—',
    temperatura: '+4°C'
  },
  {
    id: 'TRIP-004',
    origen: 'Buenos Aires',
    destino: 'Mar del Plata',
    chofer: 'Roberto Silva',
    vehiculo: 'JKL012',
    estado: 'En tránsito',
    remitosEntrada: 4,
    remitosSalida: 2,
    eta: '16:45',
    temperatura: '-18°C'
  }
])

const vehiculos = ref<Vehiculo[]>([
  {
    patente: 'ABC123',
    tipo: 'Furgón frigorífico',
    chofer: 'Juan Pérez',
    km: 45000,
    ultimoService: '2025-01-15',
    estado: 'En ruta',
    tempActual: '-18°C'
  },
  {
    patente: 'DEF456',
    tipo: 'Semi frigorífico',
    chofer: 'Carlos Gómez',
    km: 120000,
    ultimoService: '2024-11-20',
    estado: 'En ruta',
    tempActual: '-22°C'
  },
  {
    patente: 'GHI789',
    tipo: 'Furgón refrigerado',
    chofer: 'Marta López',
    km: 32000,
    ultimoService: '2025-02-01',
    estado: 'Disponible',
    tempActual: '+4°C'
  },
  {
    patente: 'JKL012',
    tipo: 'Camión frigorífico',
    chofer: 'Roberto Silva',
    km: 88000,
    ultimoService: '2025-01-10',
    estado: 'En ruta',
    tempActual: '-18°C'
  },
  {
    patente: 'MNO345',
    tipo: 'Semi frigorífico',
    chofer: '—',
    km: 210000,
    ultimoService: '2024-09-05',
    estado: 'Mantenimiento',
    tempActual: '—'
  }
])

const stockItems = ref<StockItem[]>([
  {
    sku: 'CON-001',
    nombre: 'Pollo entero IQF',
    categoria: 'Congelados',
    deposito: 'Central Frío',
    stock: 840,
    minimo: 200,
    tempRequerida: '-18°C'
  },
  {
    sku: 'CON-002',
    nombre: 'Hamburguesas res 100g x12',
    categoria: 'Congelados',
    deposito: 'Central Frío',
    stock: 320,
    minimo: 100,
    tempRequerida: '-18°C'
  },
  {
    sku: 'CON-003',
    nombre: 'Empanadas de jamón y queso x12',
    categoria: 'Congelados',
    deposito: 'Norte',
    stock: 42,
    minimo: 80,
    tempRequerida: '-18°C'
  },
  {
    sku: 'LAC-001',
    nombre: 'Leche entera sachet 1L',
    categoria: 'Lácteos',
    deposito: 'Norte',
    stock: 1200,
    minimo: 500,
    tempRequerida: '+4°C'
  },
  {
    sku: 'LAC-002',
    nombre: 'Yogur griego natural 190g',
    categoria: 'Lácteos',
    deposito: 'Central Frío',
    stock: 95,
    minimo: 150,
    tempRequerida: '+4°C'
  },
  {
    sku: 'LAC-003',
    nombre: 'Queso cremoso La Serenísima',
    categoria: 'Lácteos',
    deposito: 'Sur',
    stock: 210,
    minimo: 80,
    tempRequerida: '+4°C'
  },
  {
    sku: 'FIA-001',
    nombre: 'Jamón cocido premium kg',
    categoria: 'Fiambres',
    deposito: 'Sur',
    stock: 18,
    minimo: 30,
    tempRequerida: '+2°C'
  },
  {
    sku: 'FIA-002',
    nombre: 'Salame milano en vara',
    categoria: 'Fiambres',
    deposito: 'Central Frío',
    stock: 85,
    minimo: 40,
    tempRequerida: '+4°C'
  },
  {
    sku: 'COM-001',
    nombre: 'Milanesas napolitanas x4',
    categoria: 'Comidas preparadas',
    deposito: 'Central Frío',
    stock: 155,
    minimo: 60,
    tempRequerida: '-18°C'
  },
  {
    sku: 'COM-002',
    nombre: 'Lasagna bolognesa 400g',
    categoria: 'Comidas preparadas',
    deposito: 'Norte',
    stock: 28,
    minimo: 50,
    tempRequerida: '-18°C'
  }
])

const ordenesPicking = ref<OrdenPicking[]>([
  {
    id: 'ORD-001',
    producto: 'Pollo entero IQF',
    sku: 'CON-001',
    cantidad: 120,
    unidad: 'kg',
    destino: 'TRIP-001',
    completado: false
  },
  {
    id: 'ORD-002',
    producto: 'Leche entera sachet 1L',
    sku: 'LAC-001',
    cantidad: 400,
    unidad: 'unid',
    destino: 'TRIP-002',
    completado: false
  },
  {
    id: 'ORD-003',
    producto: 'Hamburguesas res x12',
    sku: 'CON-002',
    cantidad: 60,
    unidad: 'caj',
    destino: 'TRIP-001',
    completado: true
  },
  {
    id: 'ORD-004',
    producto: 'Jamón cocido premium',
    sku: 'FIA-001',
    cantidad: 15,
    unidad: 'kg',
    destino: 'TRIP-004',
    completado: false
  },
  {
    id: 'ORD-005',
    producto: 'Lasagna bolognesa 400g',
    sku: 'COM-002',
    cantidad: 80,
    unidad: 'unid',
    destino: 'TRIP-004',
    completado: false
  }
])

const clientes = ref<Cliente[]>([
  {
    empresa: 'Carrefour Argentina',
    cuit: '30-67143845-5',
    contacto: 'Diego Ferreyra',
    viajesActivos: 2,
    estado: 'Activo'
  },
  {
    empresa: 'Jumbo Retail SA',
    cuit: '30-52158649-7',
    contacto: 'Laura Vidal',
    viajesActivos: 1,
    estado: 'Activo'
  },
  {
    empresa: 'La Serenísima Dist.',
    cuit: '30-59117566-1',
    contacto: 'Marcos Ruiz',
    viajesActivos: 0,
    estado: 'Inactivo'
  },
  {
    empresa: 'FrioExpress SRL',
    cuit: '30-71234567-8',
    contacto: 'Ana Giménez',
    viajesActivos: 1,
    estado: 'Activo'
  }
])

const depositos = ref<Deposito[]>([
  {
    nombre: 'Central Frío',
    ciudad: 'Buenos Aires',
    sectores: 5,
    ocupacion: 78,
    tempPromedio: '-18°C',
    alerta: false
  },
  {
    nombre: 'Norte',
    ciudad: 'Rosario',
    sectores: 3,
    ocupacion: 91,
    tempPromedio: '+4°C',
    alerta: true
  },
  {
    nombre: 'Sur',
    ciudad: 'Córdoba',
    sectores: 2,
    ocupacion: 43,
    tempPromedio: '+2°C',
    alerta: false
  }
])

// ─── MODALES ─────────────────────────────────────────────────────────────────
const modalNuevoViaje = ref(false)
const modalEditarViaje = ref(false)
const modalNuevoVehiculo = ref(false)
const modalNuevoCliente = ref(false)
const modalNuevaOrden = ref(false)
const modalNuevoStock = ref(false)

const viajeEditando = ref<Viaje | null>(null)
const pickingSeleccionado = ref<string | null>(null)
const filtroViajes = ref('')
const filtroStock = ref('')
const filtroCategoriaStock = ref('')

// Forms
const formViaje = ref({
  origen: '',
  destino: '',
  chofer: '',
  vehiculo: '',
  estado: 'Pendiente' as EstadoViaje,
  remitosEntrada: 0,
  remitosSalida: 0,
  temperatura: '-18°C'
})
const formVehiculo = ref({
  patente: '',
  tipo: 'Furgón frigorífico',
  chofer: '',
  km: 0
})
const formCliente = ref({ empresa: '', cuit: '', contacto: '' })
const formOrden = ref({
  producto: '',
  sku: '',
  cantidad: 1,
  unidad: 'kg',
  destino: ''
})
const formStock = ref({
  sku: '',
  nombre: '',
  categoria: 'Congelados' as StockItem['categoria'],
  deposito: 'Central Frío',
  stock: 100,
  minimo: 20,
  tempRequerida: '-18°C'
})
const formEditarViaje = ref({
  estado: 'Pendiente' as EstadoViaje,
  chofer: '',
  vehiculo: ''
})

// ─── COMPUTED ────────────────────────────────────────────────────────────────
const choferes = computed(() => [
  ...new Set(vehiculos.value.map((v) => v.chofer).filter((c) => c !== '—'))
])
const patentesList = computed(() => vehiculos.value.map((v) => v.patente))

const viajesFiltrados = computed(() => {
  if (!filtroViajes.value) return viajes.value
  return viajes.value.filter((v) => v.estado === filtroViajes.value)
})

const stockFiltrado = computed(() => {
  return stockItems.value.filter((s) => {
    const matchQ =
      !filtroStock.value ||
      s.nombre.toLowerCase().includes(filtroStock.value.toLowerCase()) ||
      s.sku.toLowerCase().includes(filtroStock.value.toLowerCase())
    const matchC =
      !filtroCategoriaStock.value || s.categoria === filtroCategoriaStock.value
    return matchQ && matchC
  })
})

const stockCritico = computed(() =>
  stockItems.value.filter((s) => s.stock <= s.minimo)
)
const pickingPendiente = computed(() =>
  ordenesPicking.value.filter((p) => !p.completado)
)

const kpiViajesActivos = computed(
  () => viajes.value.filter((v) => v.estado === 'En tránsito').length
)
const kpiVehiculosRuta = computed(
  () => vehiculos.value.filter((v) => v.estado === 'En ruta').length
)
const kpiStockCritico = computed(() => stockCritico.value.length)
const kpiPickingPendiente = computed(() => pickingPendiente.value.length)

const viajesEnTransito = computed(
  () => viajes.value.filter((v) => v.estado === 'En tránsito').length
)
const viajesPendientes = computed(
  () => viajes.value.filter((v) => v.estado === 'Pendiente').length
)
const viajesFinalizados = computed(
  () => viajes.value.filter((v) => v.estado === 'Finalizado').length
)

const flotaDisponible = computed(
  () => vehiculos.value.filter((v) => v.estado === 'Disponible').length
)
const flotaEnRuta = computed(
  () => vehiculos.value.filter((v) => v.estado === 'En ruta').length
)
const flotaMantenimiento = computed(
  () => vehiculos.value.filter((v) => v.estado === 'Mantenimiento').length
)

// ─── COLUMNAS TABLAS ─────────────────────────────────────────────────────────
const columnasViajes: TableColumn<Viaje>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'ruta', header: 'Ruta' },
  { accessorKey: 'chofer', header: 'Chofer' },
  { accessorKey: 'vehiculo', header: 'Vehículo' },
  { accessorKey: 'temperatura', header: 'Temperatura' },
  { accessorKey: 'estado', header: 'Estado' },
  { accessorKey: 'remitosEntrada', header: 'Remitos' },
  { accessorKey: 'acciones', header: '' }
]

const columnasStock: TableColumn<StockItem>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'nombre', header: 'Producto' },
  { accessorKey: 'categoria', header: 'Categoría' },
  { accessorKey: 'deposito', header: 'Depósito' },
  { accessorKey: 'tempRequerida', header: 'Temperatura' },
  { accessorKey: 'stock', header: 'Stock' },
  { accessorKey: 'estado', header: 'Estado' },
  { accessorKey: 'acciones', header: '' }
]

const columnasFlota: TableColumn<Vehiculo>[] = [
  { accessorKey: 'patente', header: 'Patente' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'chofer', header: 'Chofer' },
  { accessorKey: 'km', header: 'Km' },
  { accessorKey: 'tempActual', header: 'Temp. actual' },
  { accessorKey: 'estado', header: 'Estado' },
  { accessorKey: 'acciones', header: '' }
]

const columnasClientes: TableColumn<Cliente>[] = [
  { accessorKey: 'empresa', header: 'Empresa' },
  { accessorKey: 'cuit', header: 'CUIT' },
  { accessorKey: 'contacto', header: 'Contacto' },
  { accessorKey: 'viajesActivos', header: 'Viajes activos' },
  { accessorKey: 'estado', header: 'Estado' },
  { accessorKey: 'acciones', header: '' }
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function colorEstadoViaje(estado: EstadoViaje) {
  return { 'En tránsito': 'info', Pendiente: 'warning', Finalizado: 'success' }[
    estado
  ] as 'info' | 'warning' | 'success'
}

function colorEstadoVehiculo(estado: EstadoVehiculo) {
  return { Disponible: 'success', 'En ruta': 'info', Mantenimiento: 'error' }[
    estado
  ] as 'success' | 'info' | 'error'
}

function colorEstadoStock(item: StockItem) {
  if (item.stock <= item.minimo) return 'error'
  if (item.stock <= item.minimo * 1.5) return 'warning'
  return 'success'
}

function labelEstadoStock(item: StockItem) {
  if (item.stock <= item.minimo) return 'Crítico'
  if (item.stock <= item.minimo * 1.5) return 'Bajo'
  return 'Normal'
}

function pctOcupacion(stock: number, minimo: number) {
  return Math.min(100, Math.round((stock / (minimo * 5)) * 100))
}

function colorTemperatura(temp: string) {
  if (temp.startsWith('-')) return 'info'
  if (temp.startsWith('+')) return 'success'
  return 'neutral'
}

function iconCategoria(cat: StockItem['categoria']) {
  return {
    Congelados: '❄️',
    Lácteos: '🥛',
    Fiambres: '🥩',
    'Comidas preparadas': '🍽️'
  }[cat]
}

// ─── ACCIONES VIAJES ─────────────────────────────────────────────────────────
let nextId = 5
function crearViaje() {
  if (!formViaje.value.origen || !formViaje.value.destino) return
  viajes.value.push({
    id: `TRIP-00${nextId++}`,
    origen: formViaje.value.origen,
    destino: formViaje.value.destino,
    chofer: formViaje.value.chofer || choferes.value[0],
    vehiculo: formViaje.value.vehiculo || patentesList.value[0],
    estado: formViaje.value.estado,
    remitosEntrada: formViaje.value.remitosEntrada,
    remitosSalida: formViaje.value.remitosSalida,
    eta: '—',
    temperatura: formViaje.value.temperatura
  })
  formViaje.value = {
    origen: '',
    destino: '',
    chofer: '',
    vehiculo: '',
    estado: 'Pendiente',
    remitosEntrada: 0,
    remitosSalida: 0,
    temperatura: '-18°C'
  }
  modalNuevoViaje.value = false
}

function abrirEditarViaje(viaje: Viaje) {
  viajeEditando.value = viaje
  formEditarViaje.value = {
    estado: viaje.estado,
    chofer: viaje.chofer,
    vehiculo: viaje.vehiculo
  }
  modalEditarViaje.value = true
}

function guardarViaje() {
  if (!viajeEditando.value) return
  const v = viajes.value.find((x) => x.id === viajeEditando.value!.id)
  if (v) {
    v.estado = formEditarViaje.value.estado
    v.chofer = formEditarViaje.value.chofer
    v.vehiculo = formEditarViaje.value.vehiculo
  }
  modalEditarViaje.value = false
}

function eliminarViaje(id: string) {
  viajes.value = viajes.value.filter((v) => v.id !== id)
}

// ─── ACCIONES PICKING ─────────────────────────────────────────────────────────
function togglePicking(id: string) {
  const o = ordenesPicking.value.find((x) => x.id === id)
  if (o) o.completado = !o.completado
}

let nextOrdenId = 6
function crearOrden() {
  if (!formOrden.value.producto) return
  ordenesPicking.value.push({
    id: `ORD-${String(nextOrdenId++).padStart(3, '0')}`,
    producto: formOrden.value.producto,
    sku: formOrden.value.sku || 'CON-000',
    cantidad: formOrden.value.cantidad,
    unidad: formOrden.value.unidad,
    destino: formOrden.value.destino || '—',
    completado: false
  })
  formOrden.value = {
    producto: '',
    sku: '',
    cantidad: 1,
    unidad: 'kg',
    destino: ''
  }
  modalNuevaOrden.value = false
}

// ─── ACCIONES STOCK ───────────────────────────────────────────────────────────
function ajustarStock(sku: string) {
  const s = stockItems.value.find((x) => x.sku === sku)
  if (!s) return
  const nuevo = prompt(
    `"${s.nombre}"\nStock actual: ${s.stock}\nNuevo valor:`,
    String(s.stock)
  )
  if (nuevo !== null && !isNaN(parseInt(nuevo))) s.stock = parseInt(nuevo)
}

function crearStock() {
  if (!formStock.value.nombre) return
  stockItems.value.push({ ...formStock.value })
  formStock.value = {
    sku: '',
    nombre: '',
    categoria: 'Congelados',
    deposito: 'Central Frío',
    stock: 100,
    minimo: 20,
    tempRequerida: '-18°C'
  }
  modalNuevoStock.value = false
}

// ─── ACCIONES FLOTA ───────────────────────────────────────────────────────────
function crearVehiculo() {
  if (!formVehiculo.value.patente) return
  vehiculos.value.push({
    patente: formVehiculo.value.patente.toUpperCase(),
    tipo: formVehiculo.value.tipo,
    chofer: formVehiculo.value.chofer || '—',
    km: formVehiculo.value.km,
    ultimoService: new Date().toISOString().split('T')[0],
    estado: 'Disponible',
    tempActual: '—'
  })
  formVehiculo.value = {
    patente: '',
    tipo: 'Furgón frigorífico',
    chofer: '',
    km: 0
  }
  modalNuevoVehiculo.value = false
}

function rotarEstadoVehiculo(patente: string) {
  const v = vehiculos.value.find((x) => x.patente === patente)
  if (!v) return
  const estados: EstadoVehiculo[] = ['Disponible', 'En ruta', 'Mantenimiento']
  const idx = estados.indexOf(v.estado)
  v.estado = estados[(idx + 1) % estados.length]
}

// ─── ACCIONES CLIENTES ────────────────────────────────────────────────────────
function crearCliente() {
  if (!formCliente.value.empresa) return
  clientes.value.push({
    ...formCliente.value,
    viajesActivos: 0,
    estado: 'Activo'
  })
  formCliente.value = { empresa: '', cuit: '', contacto: '' }
  modalNuevoCliente.value = false
}

function toggleCliente(empresa: string) {
  const c = clientes.value.find((x) => x.empresa === empresa)
  if (c) c.estado = c.estado === 'Activo' ? 'Inactivo' : 'Activo'
}

// ─── NAVEGACIÓN CTAs ──────────────────────────────────────────────────────────
const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'i-heroicons-squares-2x2' },
  { key: 'viajes', label: 'Viajes', icon: 'i-heroicons-truck' },
  {
    key: 'depositos',
    label: 'Depósitos',
    icon: 'i-heroicons-building-storefront'
  },
  {
    key: 'picking',
    label: 'Picking',
    icon: 'i-heroicons-clipboard-document-list'
  },
  { key: 'stock', label: 'Stock', icon: 'i-heroicons-archive-box' },
  { key: 'flota', label: 'Flota', icon: 'i-heroicons-wrench-screwdriver' },
  { key: 'clientes', label: 'Clientes', icon: 'i-heroicons-building-office-2' },
  { key: 'reportes', label: 'Reportes', icon: 'i-heroicons-chart-bar' },
  { key: 'permisos', label: 'Permisos', icon: 'i-heroicons-lock-closed' },
  { key: 'empresas', label: 'Multi-Empresa', icon: 'i-heroicons-globe-alt' }
]

// Permisos state (toggleable)
const permisos = ref({
  'Super Admin': {
    Dashboard: true,
    Viajes: true,
    Depósitos: true,
    Picking: true,
    Stock: true,
    Flota: true,
    Clientes: true,
    Reportes: true,
    Permisos: true,
    'Multi-Empresa': true
  },
  Operador: {
    Dashboard: true,
    Viajes: true,
    Depósitos: true,
    Picking: true,
    Stock: true,
    Flota: false,
    Clientes: false,
    Reportes: false,
    Permisos: false,
    'Multi-Empresa': false
  },
  Chofer: {
    Dashboard: false,
    Viajes: true,
    Depósitos: false,
    Picking: true,
    Stock: false,
    Flota: false,
    Clientes: false,
    Reportes: false,
    Permisos: false,
    'Multi-Empresa': false
  }
})

const empresas = [
  {
    nombre: 'FríoLogística SA',
    plan: 'Enterprise',
    viajes: viajes.value.length,
    vehiculos: vehiculos.value.length,
    activa: true
  },
  {
    nombre: 'ChillChain SRL',
    plan: 'Pro',
    viajes: 8,
    vehiculos: 3,
    activa: true
  },
  {
    nombre: 'FreshDist',
    plan: 'Starter',
    viajes: 2,
    vehiculos: 1,
    activa: false
  }
]

const empresaActual = ref('FríoLogística SA')

// Reportes chart data
const meses = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb']
const viajesPorMes = [18, 24, 16, 32, 22, 29]
const maxViajes = Math.max(...viajesPorMes)

const choferesPerfomance = [
  { nombre: 'Juan Pérez', pct: 96, viajes: 28 },
  { nombre: 'Marta López', pct: 99, viajes: 31 },
  { nombre: 'Carlos Gómez', pct: 82, viajes: 19 },
  { nombre: 'Roberto Silva', pct: 74, viajes: 14 }
]

const pickingOrdenSeleccionada = computed(() =>
  pickingSeleccionado.value
    ? ordenesPicking.value.find((o) => o.id === pickingSeleccionado.value)
    : null
)
</script>

<template>
  <div class="logicore-app">
    <!-- ── SIDEBAR ──────────────────────────────────────────────────── -->
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: navActivo === item.key }"
          @click="navActivo = item.key as typeof navActivo"
        >
          <UIcon :name="item.icon" class="nav-icon" />
          <span>{{ item.label }}</span>
          <UBadge
            v-if="
              item.key === 'viajes' && kpiViajesActivos + viajesPendientes > 0
            "
            :label="String(kpiViajesActivos + viajesPendientes)"
            color="info"
            variant="solid"
            size="xs"
            class="ml-auto"
          />
          <UBadge
            v-if="item.key === 'picking' && kpiPickingPendiente > 0"
            :label="String(kpiPickingPendiente)"
            color="warning"
            variant="solid"
            size="xs"
            class="ml-auto"
          />
          <UBadge
            v-if="item.key === 'stock' && kpiStockCritico > 0"
            :label="String(kpiStockCritico)"
            color="error"
            variant="solid"
            size="xs"
            class="ml-auto"
          />
        </div>
      </nav>

      <div class="sidebar-footer">
        <UAvatar text="SA" size="sm" />
        <div>
          <p class="footer-user">Super Admin</p>
          <p class="footer-empresa">{{ empresaActual }}</p>
        </div>
      </div>
    </aside>

    <!-- ── MAIN ───────────────────────────────────────────────────────── -->
    <main class="main-content">
      <!-- ════════════════════════════════════════════════════ DASHBOARD -->
      <template v-if="navActivo === 'dashboard'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Dashboard Operativo</h1>
            <p class="page-sub">Cadena de frío · Resumen en tiempo real</p>
          </div>
          <UButton icon="i-heroicons-truck" @click="modalNuevoViaje = true">
            Nuevo Viaje
          </UButton>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <UCard class="kpi-card kpi-blue">
            <p class="kpi-label">Viajes activos</p>
            <p class="kpi-value">{{ kpiViajesActivos }}</p>
            <p class="kpi-hint">{{ viajesPendientes }} pendientes</p>
          </UCard>
          <UCard class="kpi-card kpi-cyan">
            <p class="kpi-label">Vehículos en ruta</p>
            <p class="kpi-value">{{ kpiVehiculosRuta }}</p>
            <p class="kpi-hint">de {{ vehiculos.length }} totales</p>
          </UCard>
          <UCard class="kpi-card kpi-red">
            <p class="kpi-label">Stock crítico</p>
            <p class="kpi-value">{{ kpiStockCritico }}</p>
            <p class="kpi-hint">productos bajo mínimo</p>
          </UCard>
          <UCard class="kpi-card kpi-amber">
            <p class="kpi-label">Picking pendiente</p>
            <p class="kpi-value">{{ kpiPickingPendiente }}</p>
            <p class="kpi-hint">órdenes abiertas</p>
          </UCard>
        </div>

        <!-- Contenido dashboard -->
        <div class="dash-grid">
          <!-- Últimos viajes -->
          <UCard>
            <template #header>
              <div class="card-hdr">
                <span class="card-hdr-title">Últimos viajes</span>
                <UButton
                  variant="ghost"
                  size="xs"
                  @click="navActivo = 'viajes'"
                >
                  Ver todos →
                </UButton>
              </div>
            </template>
            <UTable
              :data="viajes.slice(0, 4)"
              :columns="[
                { accessorKey: 'id', header: 'ID' },
                { accessorKey: 'ruta', header: 'Ruta' },
                { accessorKey: 'temperatura', header: 'Temp' },
                { accessorKey: 'estado', header: 'Estado' }
              ]"
            >
              <template #id-data="{ row }">
                <span class="mono-sm text-blue-400">{{ row.id }}</span>
              </template>
              <template #ruta-data="{ row }">
                <span class="text-sm">
                  {{ row.origen }} → {{ row.destino }}
                </span>
              </template>
              <template #temperatura-data="{ row }">
                <UBadge
                  :color="colorTemperatura(row.temperatura)"
                  variant="subtle"
                  :label="row.temperatura"
                />
              </template>
              <template #estado-data="{ row }">
                <UBadge
                  :color="colorEstadoViaje(row.estado)"
                  variant="subtle"
                  :label="row.estado"
                />
              </template>
            </UTable>
          </UCard>

          <!-- Stock crítico -->
          <UCard>
            <template #header>
              <div class="card-hdr">
                <span class="card-hdr-title">❄ Stock crítico</span>
                <UBadge
                  v-if="stockCritico.length"
                  color="error"
                  variant="solid"
                  :label="`${stockCritico.length} alertas`"
                />
              </div>
            </template>
            <div v-if="stockCritico.length === 0" class="empty-state">
              ✓ Sin alertas críticas
            </div>
            <div v-else class="stock-critico-list">
              <div v-for="s in stockCritico" :key="s.sku" class="critico-row">
                <div>
                  <p class="critico-nombre">
                    {{ iconCategoria(s.categoria) }} {{ s.nombre }}
                  </p>
                  <p class="critico-meta">
                    {{ s.sku }} · {{ s.deposito }} · {{ s.tempRequerida }}
                  </p>
                </div>
                <div class="critico-nums">
                  <span class="text-red-400 font-bold">{{ s.stock }}</span>
                  <span class="text-gray-500">/ {{ s.minimo }}</span>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Picking hoy -->
          <UCard>
            <template #header>
              <div class="card-hdr">
                <span class="card-hdr-title">Picking del día</span>
                <UButton
                  variant="ghost"
                  size="xs"
                  @click="navActivo = 'picking'"
                >
                  Ver →
                </UButton>
              </div>
            </template>
            <div class="picking-mini-list">
              <div
                v-for="o in ordenesPicking.slice(0, 4)"
                :key="o.id"
                class="picking-mini-row"
              >
                <UCheckbox
                  :model-value="o.completado"
                  @update:model-value="togglePicking(o.id)"
                />
                <div class="flex-1">
                  <p
                    class="text-sm font-medium"
                    :class="o.completado ? 'line-through text-gray-500' : ''"
                  >
                    {{ o.producto }}
                  </p>
                  <p class="mono-xs text-gray-500">
                    {{ o.sku }} · {{ o.destino }}
                  </p>
                </div>
                <span class="mono-sm">×{{ o.cantidad }} {{ o.unidad }}</span>
              </div>
            </div>
          </UCard>

          <!-- Estado flota -->
          <UCard>
            <template #header>
              <span class="card-hdr-title">Estado de flota</span>
            </template>
            <div class="flota-mini-list">
              <div
                v-for="v in vehiculos.slice(0, 5)"
                :key="v.patente"
                class="flota-mini-row"
              >
                <span class="mono-sm font-bold">{{ v.patente }}</span>
                <span class="text-xs text-gray-400">{{ v.tipo }}</span>
                <UBadge
                  v-if="v.tempActual !== '—'"
                  :color="colorTemperatura(v.tempActual)"
                  variant="subtle"
                  size="xs"
                  :label="v.tempActual"
                />
                <UBadge
                  :color="colorEstadoVehiculo(v.estado)"
                  variant="subtle"
                  size="xs"
                  :label="v.estado"
                />
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <!-- ════════════════════════════════════════════════════ VIAJES -->
      <template v-if="navActivo === 'viajes'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Gestión de Viajes</h1>
            <p class="page-sub">Transporte en cadena de frío</p>
          </div>
          <UButton icon="i-heroicons-plus" @click="modalNuevoViaje = true">
            Nuevo Viaje
          </UButton>
        </div>

        <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr)">
          <UCard class="kpi-card kpi-cyan">
            <p class="kpi-label">En tránsito</p>
            <p class="kpi-value">{{ viajesEnTransito }}</p>
          </UCard>
          <UCard class="kpi-card kpi-amber">
            <p class="kpi-label">Pendientes</p>
            <p class="kpi-value">{{ viajesPendientes }}</p>
          </UCard>
          <UCard class="kpi-card kpi-blue">
            <p class="kpi-label">Finalizados</p>
            <p class="kpi-value">{{ viajesFinalizados }}</p>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <div class="card-hdr">
              <span class="card-hdr-title">Todos los viajes</span>
              <USelect
                v-model="filtroViajes"
                :options="['', 'En tránsito', 'Pendiente', 'Finalizado']"
                placeholder="Filtrar estado"
                size="sm"
                class="w-40"
              />
            </div>
          </template>
          <UTable :data="viajesFiltrados" :columns="columnasViajes">
            <template #id-data="{ row }">
              <span
                class="mono-sm text-blue-400 cursor-pointer"
                @click="abrirEditarViaje(row)"
              >
                {{ row.id }}
              </span>
            </template>
            <template #ruta-data="{ row }">
              <span class="text-sm">{{ row.origen }} → {{ row.destino }}</span>
            </template>
            <template #temperatura-data="{ row }">
              <UBadge
                :color="colorTemperatura(row.temperatura)"
                variant="subtle"
                :label="row.temperatura"
              />
            </template>
            <template #estado-data="{ row }">
              <UBadge
                :color="colorEstadoViaje(row.estado)"
                variant="subtle"
                :label="row.estado"
              />
            </template>
            <template #remitosEntrada-data="{ row }">
              <span class="text-xs text-gray-400">
                {{ row.remitosEntrada }}E / {{ row.remitosSalida }}S
              </span>
            </template>
            <template #acciones-data="{ row }">
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-pencil-square"
                  @click="abrirEditarViaje(row)"
                />
                <UButton
                  size="xs"
                  variant="ghost"
                  color="error"
                  icon="i-heroicons-trash"
                  @click="eliminarViaje(row.id)"
                />
              </div>
            </template>
          </UTable>
        </UCard>
      </template>

      <!-- ════════════════════════════════════════════════════ DEPÓSITOS -->
      <template v-if="navActivo === 'depositos'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Gestión de Depósitos</h1>
            <p class="page-sub">Control de espacios y temperatura</p>
          </div>
        </div>

        <div class="kpi-grid">
          <UCard class="kpi-card kpi-blue">
            <p class="kpi-label">Depósitos</p>
            <p class="kpi-value">{{ depositos.length }}</p>
          </UCard>
          <UCard class="kpi-card kpi-cyan">
            <p class="kpi-label">Ocupación promedio</p>
            <p class="kpi-value">
              {{
                Math.round(
                  depositos.reduce((a, d) => a + d.ocupacion, 0) /
                    depositos.length
                )
              }}%
            </p>
          </UCard>
          <UCard class="kpi-card kpi-amber">
            <p class="kpi-label">Sectores totales</p>
            <p class="kpi-value">
              {{ depositos.reduce((a, d) => a + d.sectores, 0) }}
            </p>
          </UCard>
          <UCard class="kpi-card kpi-red">
            <p class="kpi-label">Alertas capacidad</p>
            <p class="kpi-value">
              {{ depositos.filter((d) => d.alerta).length }}
            </p>
          </UCard>
        </div>

        <div class="depositos-grid">
          <UCard
            v-for="dep in depositos"
            :key="dep.nombre"
            :class="dep.alerta ? 'border border-orange-500/40' : ''"
          >
            <template #header>
              <div class="card-hdr">
                <div>
                  <p class="card-hdr-title">🏭 {{ dep.nombre }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ dep.ciudad }} · {{ dep.sectores }} sectores
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <UBadge
                    :color="colorTemperatura(dep.tempPromedio)"
                    variant="subtle"
                    :label="dep.tempPromedio"
                  />
                  <UBadge
                    v-if="dep.alerta"
                    color="warning"
                    variant="solid"
                    label="Capacidad alta"
                  />
                </div>
              </div>
            </template>

            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-400">Ocupación</span>
                <span
                  :class="
                    dep.ocupacion > 85
                      ? 'text-orange-400 font-bold'
                      : 'text-white'
                  "
                >
                  {{ dep.ocupacion }}%
                </span>
              </div>
              <UProgress
                :value="dep.ocupacion"
                :color="
                  dep.ocupacion > 85
                    ? 'warning'
                    : dep.ocupacion > 60
                      ? 'info'
                      : 'success'
                "
              />
            </div>

            <div class="sectores-grid">
              <div v-for="i in dep.sectores" :key="i" class="sector-chip">
                Sector {{ String.fromCharCode(64 + i) }}
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <!-- ════════════════════════════════════════════════════ PICKING -->
      <template v-if="navActivo === 'picking'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Picking</h1>
            <p class="page-sub">Preparación de órdenes para despacho</p>
          </div>
          <UButton icon="i-heroicons-plus" @click="modalNuevaOrden = true">
            Nueva Orden
          </UButton>
        </div>

        <div class="picking-layout">
          <!-- Lista órdenes -->
          <UCard>
            <template #header>
              <div class="card-hdr">
                <span class="card-hdr-title">Órdenes activas</span>
                <UBadge
                  :label="`${pickingPendiente.length} pendientes`"
                  color="warning"
                  variant="subtle"
                />
              </div>
            </template>
            <div class="picking-list">
              <div
                v-for="orden in ordenesPicking"
                :key="orden.id"
                class="pick-row"
                :class="{
                  'pick-row--selected': pickingSeleccionado === orden.id,
                  'pick-row--done': orden.completado
                }"
                @click="pickingSeleccionado = orden.id"
              >
                <div
                  class="pick-check"
                  :class="{ 'pick-check--done': orden.completado }"
                  @click.stop="togglePicking(orden.id)"
                >
                  <UIcon
                    v-if="orden.completado"
                    name="i-heroicons-check"
                    class="w-3 h-3"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium truncate"
                    :class="
                      orden.completado ? 'line-through text-gray-500' : ''
                    "
                  >
                    {{ orden.producto }}
                  </p>
                  <p class="mono-xs text-gray-500">
                    {{ orden.sku }} · {{ orden.destino }}
                  </p>
                </div>
                <span class="mono-sm shrink-0">
                  ×{{ orden.cantidad }}
                  <span class="text-gray-500 text-xs">{{ orden.unidad }}</span>
                </span>
              </div>
            </div>
          </UCard>

          <!-- Detalle -->
          <UCard>
            <template #header>
              <span class="card-hdr-title">Detalle de orden</span>
            </template>
            <div v-if="!pickingOrdenSeleccionada" class="empty-state">
              Seleccioná una orden para ver el detalle
            </div>
            <div v-else class="pick-detail">
              <div class="pick-detail-id">
                {{ pickingOrdenSeleccionada.id }}
              </div>
              <p class="text-gray-400 text-sm mb-4">
                Destino: {{ pickingOrdenSeleccionada.destino }}
              </p>

              <div class="pick-detail-grid">
                <div class="pick-detail-field">
                  <p class="pick-detail-label">Producto</p>
                  <p class="pick-detail-val">
                    {{ pickingOrdenSeleccionada.producto }}
                  </p>
                </div>
                <div class="pick-detail-field">
                  <p class="pick-detail-label">SKU</p>
                  <p class="pick-detail-val mono-sm text-blue-400">
                    {{ pickingOrdenSeleccionada.sku }}
                  </p>
                </div>
                <div class="pick-detail-field">
                  <p class="pick-detail-label">Cantidad</p>
                  <p class="pick-detail-val text-3xl font-bold text-cyan-400">
                    {{ pickingOrdenSeleccionada.cantidad }}
                    <span class="text-base text-gray-400">
                      {{ pickingOrdenSeleccionada.unidad }}
                    </span>
                  </p>
                </div>
                <div class="pick-detail-field">
                  <p class="pick-detail-label">Estado</p>
                  <UBadge
                    :color="
                      pickingOrdenSeleccionada.completado
                        ? 'success'
                        : 'warning'
                    "
                    variant="subtle"
                    :label="
                      pickingOrdenSeleccionada.completado
                        ? 'Completado'
                        : 'Pendiente'
                    "
                  />
                </div>
              </div>

              <UButton
                v-if="!pickingOrdenSeleccionada.completado"
                block
                class="mt-4"
                icon="i-heroicons-check"
                @click="togglePicking(pickingOrdenSeleccionada.id)"
              >
                Marcar como completado
              </UButton>
              <div v-else class="text-center text-green-400 text-sm mt-4">
                ✓ Orden completada
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <!-- ════════════════════════════════════════════════════ STOCK -->
      <template v-if="navActivo === 'stock'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Stock en Tiempo Real</h1>
            <p class="page-sub">Inventario de cadena de frío consolidado</p>
          </div>
          <UButton icon="i-heroicons-plus" @click="modalNuevoStock = true">
            Agregar Producto
          </UButton>
        </div>

        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr)">
          <UCard class="kpi-card kpi-cyan">
            <p class="kpi-label">❄ Congelados</p>
            <p class="kpi-value">
              {{
                stockItems.filter((s) => s.categoria === 'Congelados').length
              }}
            </p>
          </UCard>
          <UCard class="kpi-card kpi-blue">
            <p class="kpi-label">🥛 Lácteos</p>
            <p class="kpi-value">
              {{ stockItems.filter((s) => s.categoria === 'Lácteos').length }}
            </p>
          </UCard>
          <UCard class="kpi-card kpi-amber">
            <p class="kpi-label">🥩 Fiambres</p>
            <p class="kpi-value">
              {{ stockItems.filter((s) => s.categoria === 'Fiambres').length }}
            </p>
          </UCard>
          <UCard class="kpi-card kpi-red">
            <p class="kpi-label">Críticos</p>
            <p class="kpi-value">{{ kpiStockCritico }}</p>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <div class="card-hdr flex-wrap gap-2">
              <span class="card-hdr-title">Inventario completo</span>
              <div class="flex gap-2 ml-auto">
                <UInput
                  v-model="filtroStock"
                  placeholder="Buscar producto o SKU..."
                  size="sm"
                  icon="i-heroicons-magnifying-glass"
                  class="w-52"
                />
                <USelect
                  v-model="filtroCategoriaStock"
                  :options="[
                    '',
                    'Congelados',
                    'Lácteos',
                    'Fiambres',
                    'Comidas preparadas'
                  ]"
                  placeholder="Categoría"
                  size="sm"
                  class="w-44"
                />
              </div>
            </div>
          </template>
          <UTable :data="stockFiltrado" :columns="columnasStock">
            <template #sku-data="{ row }">
              <span class="mono-xs text-gray-400">{{ row.sku }}</span>
            </template>
            <template #nombre-data="{ row }">
              <span class="text-sm font-medium">
                {{ iconCategoria(row.categoria) }} {{ row.nombre }}
              </span>
            </template>
            <template #categoria-data="{ row }">
              <span class="text-xs text-gray-400">{{ row.categoria }}</span>
            </template>
            <template #tempRequerida-data="{ row }">
              <UBadge
                :color="colorTemperatura(row.tempRequerida)"
                variant="subtle"
                :label="row.tempRequerida"
              />
            </template>
            <template #stock-data="{ row }">
              <div class="flex flex-col gap-1 min-w-24">
                <span class="mono-sm font-bold">
                  {{ row.stock }}
                  <span class="text-gray-500 text-xs">
                    / {{ row.minimo }} mín
                  </span>
                </span>
                <UProgress
                  :value="pctOcupacion(row.stock, row.minimo)"
                  :color="colorEstadoStock(row)"
                  size="xs"
                />
              </div>
            </template>
            <template #estado-data="{ row }">
              <UBadge
                :color="colorEstadoStock(row)"
                variant="subtle"
                :label="labelEstadoStock(row)"
              />
            </template>
            <template #acciones-data="{ row }">
              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-adjustments-horizontal"
                @click="ajustarStock(row.sku)"
              >
                Ajustar
              </UButton>
            </template>
          </UTable>
        </UCard>
      </template>

      <!-- ════════════════════════════════════════════════════ FLOTA -->
      <template v-if="navActivo === 'flota'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Gestión de Flota</h1>
            <p class="page-sub">Vehículos frigoríficos y refrigerados</p>
          </div>
          <UButton icon="i-heroicons-plus" @click="modalNuevoVehiculo = true">
            Agregar Vehículo
          </UButton>
        </div>

        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr)">
          <UCard class="kpi-card kpi-blue">
            <p class="kpi-label">Total flota</p>
            <p class="kpi-value">{{ vehiculos.length }}</p>
          </UCard>
          <UCard class="kpi-card kpi-cyan">
            <p class="kpi-label">En ruta</p>
            <p class="kpi-value">{{ flotaEnRuta }}</p>
          </UCard>
          <UCard class="kpi-card kpi-amber">
            <p class="kpi-label">Disponibles</p>
            <p class="kpi-value">{{ flotaDisponible }}</p>
          </UCard>
          <UCard class="kpi-card kpi-red">
            <p class="kpi-label">Mantenimiento</p>
            <p class="kpi-value">{{ flotaMantenimiento }}</p>
          </UCard>
        </div>

        <UCard>
          <UTable :data="vehiculos" :columns="columnasFlota">
            <template #patente-data="{ row }">
              <span class="mono-sm font-bold">{{ row.patente }}</span>
            </template>
            <template #km-data="{ row }">
              <span class="mono-xs text-gray-400">
                {{ row.km.toLocaleString('es-AR') }} km
              </span>
            </template>
            <template #tempActual-data="{ row }">
              <UBadge
                v-if="row.tempActual !== '—'"
                :color="colorTemperatura(row.tempActual)"
                variant="subtle"
                :label="row.tempActual"
              />
              <span v-else class="text-gray-500 text-xs">—</span>
            </template>
            <template #estado-data="{ row }">
              <UBadge
                :color="colorEstadoVehiculo(row.estado)"
                variant="subtle"
                :label="row.estado"
              />
            </template>
            <template #acciones-data="{ row }">
              <UButton
                size="xs"
                variant="ghost"
                @click="rotarEstadoVehiculo(row.patente)"
              >
                Cambiar estado
              </UButton>
            </template>
          </UTable>
        </UCard>
      </template>

      <!-- ════════════════════════════════════════════════════ CLIENTES -->
      <template v-if="navActivo === 'clientes'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Portal Clientes</h1>
            <p class="page-sub">Cuentas activas y seguimiento</p>
          </div>
          <UButton icon="i-heroicons-plus" @click="modalNuevoCliente = true">
            Nuevo Cliente
          </UButton>
        </div>

        <UCard>
          <UTable :data="clientes" :columns="columnasClientes">
            <template #empresa-data="{ row }">
              <span class="font-semibold">{{ row.empresa }}</span>
            </template>
            <template #cuit-data="{ row }">
              <span class="mono-xs text-gray-400">{{ row.cuit }}</span>
            </template>
            <template #estado-data="{ row }">
              <UBadge
                :color="row.estado === 'Activo' ? 'success' : 'neutral'"
                variant="subtle"
                :label="row.estado"
              />
            </template>
            <template #acciones-data="{ row }">
              <UButton
                size="xs"
                variant="ghost"
                @click="toggleCliente(row.empresa)"
              >
                {{ row.estado === 'Activo' ? 'Desactivar' : 'Activar' }}
              </UButton>
            </template>
          </UTable>
        </UCard>
      </template>

      <!-- ════════════════════════════════════════════════════ REPORTES -->
      <template v-if="navActivo === 'reportes'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Reportes y Analytics</h1>
            <p class="page-sub">KPIs históricos de cadena de frío</p>
          </div>
        </div>

        <div class="kpi-grid">
          <UCard class="kpi-card kpi-cyan">
            <p class="kpi-label">On-time delivery</p>
            <p class="kpi-value">94%</p>
            <p class="kpi-hint">↑ 3% vs mes anterior</p>
          </UCard>
          <UCard class="kpi-card kpi-blue">
            <p class="kpi-label">Km recorridos</p>
            <p class="kpi-value">48.2K</p>
            <p class="kpi-hint">Este mes</p>
          </UCard>
          <UCard class="kpi-card kpi-amber">
            <p class="kpi-label">Alertas de temp.</p>
            <p class="kpi-value">3</p>
            <p class="kpi-hint">↓ 5 vs mes anterior</p>
          </UCard>
          <UCard class="kpi-card kpi-red">
            <p class="kpi-label">Incidentes cadena frío</p>
            <p class="kpi-value">1</p>
            <p class="kpi-hint">vs 4 mes anterior</p>
          </UCard>
        </div>

        <div class="reportes-grid">
          <UCard>
            <template #header>
              <span class="card-hdr-title">Viajes por mes</span>
            </template>
            <div class="bar-chart">
              <div v-for="(val, i) in viajesPorMes" :key="i" class="bar-col">
                <span class="bar-val">{{ val }}</span>
                <div
                  class="bar-fill"
                  :style="{
                    height: `${Math.round((val / maxViajes) * 140)}px`
                  }"
                />
                <span class="bar-label">{{ meses[i] }}</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <span class="card-hdr-title">Performance choferes</span>
            </template>
            <div class="perf-list">
              <div
                v-for="ch in choferesPerfomance"
                :key="ch.nombre"
                class="perf-row"
              >
                <div class="flex justify-between text-sm mb-1">
                  <span>{{ ch.nombre }}</span>
                  <span
                    class="mono-sm"
                    :class="ch.pct >= 90 ? 'text-cyan-400' : 'text-amber-400'"
                  >
                    {{ ch.pct }}%
                  </span>
                </div>
                <UProgress
                  :value="ch.pct"
                  :color="ch.pct >= 90 ? 'success' : 'warning'"
                  size="sm"
                />
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <!-- ════════════════════════════════════════════════════ PERMISOS -->
      <template v-if="navActivo === 'permisos'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Permisos por Rol</h1>
            <p class="page-sub">Control de acceso granular por módulo</p>
          </div>
        </div>

        <div class="permisos-grid">
          <UCard v-for="(modulos, rol) in permisos" :key="rol">
            <template #header>
              <div class="card-hdr">
                <span class="card-hdr-title">{{ rol }}</span>
                <UBadge
                  :color="
                    rol === 'Super Admin'
                      ? 'success'
                      : rol === 'Operador'
                        ? 'info'
                        : 'warning'
                  "
                  variant="subtle"
                  :label="rol"
                />
              </div>
            </template>
            <div
              v-for="(valor, modulo) in modulos"
              :key="modulo"
              class="perm-row"
            >
              <span class="text-sm text-gray-300">{{ modulo }}</span>
              <UToggle
                :model-value="valor"
                @update:model-value="
                  (
                    permisos[rol as keyof typeof permisos] as Record<
                      string,
                      boolean
                    >
                  )[modulo as string] = $event
                "
              />
            </div>
          </UCard>
        </div>
      </template>

      <!-- ════════════════════════════════════════════════════ MULTI-EMPRESA -->
      <template v-if="navActivo === 'empresas'">
        <div class="page-header">
          <div>
            <h1 class="page-title">Multi-Empresa</h1>
            <p class="page-sub">Gestioná múltiples empresas desde un panel</p>
          </div>
        </div>

        <div class="empresas-grid">
          <UCard
            v-for="emp in empresas"
            :key="emp.nombre"
            :class="
              empresaActual === emp.nombre ? 'border border-cyan-500/50' : ''
            "
          >
            <template #header>
              <div class="card-hdr">
                <div>
                  <p class="card-hdr-title">{{ emp.nombre }}</p>
                  <UBadge
                    :label="emp.plan"
                    color="info"
                    variant="subtle"
                    size="xs"
                    class="mt-1"
                  />
                </div>
                <UBadge
                  :color="emp.activa ? 'success' : 'neutral'"
                  variant="subtle"
                  :label="emp.activa ? 'Activa' : 'Inactiva'"
                />
              </div>
            </template>
            <div class="empresa-stats">
              <div class="empresa-stat">
                <p class="text-2xl font-bold text-cyan-400">{{ emp.viajes }}</p>
                <p class="text-xs text-gray-500 uppercase tracking-widest">
                  Viajes
                </p>
              </div>
              <div class="empresa-stat">
                <p class="text-2xl font-bold text-blue-400">
                  {{ emp.vehiculos }}
                </p>
                <p class="text-xs text-gray-500 uppercase tracking-widest">
                  Vehículos
                </p>
              </div>
            </div>
            <UButton
              block
              :variant="empresaActual === emp.nombre ? 'solid' : 'outline'"
              class="mt-3"
              @click="empresaActual = emp.nombre"
            >
              {{
                empresaActual === emp.nombre
                  ? '✓ Empresa activa'
                  : 'Seleccionar'
              }}
            </UButton>
          </UCard>
        </div>
      </template>
    </main>

    <!-- ─────────────────────────── MODALES ────────────────────────────── -->

    <!-- Nuevo Viaje -->
    <UModal v-model:open="modalNuevoViaje" title="🚚 Nuevo Viaje">
      <template #body>
        <div class="modal-form">
          <div class="form-row-2">
            <UFormField label="Origen">
              <UInput
                v-model="formViaje.origen"
                placeholder="Ej: Buenos Aires"
              />
            </UFormField>
            <UFormField label="Destino">
              <UInput v-model="formViaje.destino" placeholder="Ej: Rosario" />
            </UFormField>
          </div>
          <div class="form-row-2">
            <UFormField label="Chofer">
              <USelect
                v-model="formViaje.chofer"
                :options="choferes"
                placeholder="Seleccionar chofer"
              />
            </UFormField>
            <UFormField label="Vehículo">
              <USelect
                v-model="formViaje.vehiculo"
                :options="patentesList"
                placeholder="Patente"
              />
            </UFormField>
          </div>
          <div class="form-row-2">
            <UFormField label="Estado inicial">
              <USelect
                v-model="formViaje.estado"
                :options="['Pendiente', 'En tránsito']"
              />
            </UFormField>
            <UFormField label="Temperatura de carga">
              <USelect
                v-model="formViaje.temperatura"
                :options="['-18°C', '-22°C', '+4°C', '+2°C', '0°C']"
              />
            </UFormField>
          </div>
          <div class="form-row-2">
            <UFormField label="Remitos entrada">
              <UInput
                v-model.number="formViaje.remitosEntrada"
                type="number"
                :min="0"
              />
            </UFormField>
            <UFormField label="Remitos salida">
              <UInput
                v-model.number="formViaje.remitosSalida"
                type="number"
                :min="0"
              />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="modalNuevoViaje = false">
            Cancelar
          </UButton>
          <UButton @click="crearViaje">Crear Viaje</UButton>
        </div>
      </template>
    </UModal>

    <!-- Editar Viaje -->
    <UModal
      v-model:open="modalEditarViaje"
      :title="'Editar ' + (viajeEditando?.id ?? '')"
    >
      <template #body>
        <div class="modal-form">
          <UFormField label="Estado">
            <USelect
              v-model="formEditarViaje.estado"
              :options="['Pendiente', 'En tránsito', 'Finalizado']"
            />
          </UFormField>
          <div class="form-row-2">
            <UFormField label="Chofer">
              <USelect v-model="formEditarViaje.chofer" :options="choferes" />
            </UFormField>
            <UFormField label="Vehículo">
              <USelect
                v-model="formEditarViaje.vehiculo"
                :options="patentesList"
              />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="modalEditarViaje = false">
            Cancelar
          </UButton>
          <UButton @click="guardarViaje">Guardar</UButton>
        </div>
      </template>
    </UModal>

    <!-- Nuevo Vehículo -->
    <UModal v-model:open="modalNuevoVehiculo" title="🚛 Nuevo Vehículo">
      <template #body>
        <div class="modal-form">
          <div class="form-row-2">
            <UFormField label="Patente">
              <UInput v-model="formVehiculo.patente" placeholder="ABC123" />
            </UFormField>
            <UFormField label="Tipo">
              <USelect
                v-model="formVehiculo.tipo"
                :options="[
                  'Furgón frigorífico',
                  'Semi frigorífico',
                  'Camión frigorífico',
                  'Furgón refrigerado'
                ]"
              />
            </UFormField>
          </div>
          <div class="form-row-2">
            <UFormField label="Chofer">
              <USelect
                v-model="formVehiculo.chofer"
                :options="['Sin asignar', ...choferes]"
              />
            </UFormField>
            <UFormField label="Km actuales">
              <UInput v-model.number="formVehiculo.km" type="number" :min="0" />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="modalNuevoVehiculo = false">
            Cancelar
          </UButton>
          <UButton @click="crearVehiculo">Agregar</UButton>
        </div>
      </template>
    </UModal>

    <!-- Nuevo Cliente -->
    <UModal v-model:open="modalNuevoCliente" title="🏢 Nuevo Cliente">
      <template #body>
        <div class="modal-form">
          <UFormField label="Empresa">
            <UInput
              v-model="formCliente.empresa"
              placeholder="Nombre empresa"
            />
          </UFormField>
          <div class="form-row-2">
            <UFormField label="CUIT">
              <UInput v-model="formCliente.cuit" placeholder="30-xxxxxxxx-x" />
            </UFormField>
            <UFormField label="Contacto">
              <UInput
                v-model="formCliente.contacto"
                placeholder="Nombre contacto"
              />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="modalNuevoCliente = false">
            Cancelar
          </UButton>
          <UButton @click="crearCliente">Agregar</UButton>
        </div>
      </template>
    </UModal>

    <!-- Nueva Orden Picking -->
    <UModal v-model:open="modalNuevaOrden" title="📦 Nueva Orden de Picking">
      <template #body>
        <div class="modal-form">
          <div class="form-row-2">
            <UFormField label="Producto">
              <UInput
                v-model="formOrden.producto"
                placeholder="Ej: Pollo IQF"
              />
            </UFormField>
            <UFormField label="SKU">
              <UInput v-model="formOrden.sku" placeholder="CON-001" />
            </UFormField>
          </div>
          <div class="form-row-2">
            <UFormField label="Cantidad">
              <UInput
                v-model.number="formOrden.cantidad"
                type="number"
                :min="1"
              />
            </UFormField>
            <UFormField label="Unidad">
              <USelect
                v-model="formOrden.unidad"
                :options="['kg', 'unid', 'caj', 'pallet', 'lt']"
              />
            </UFormField>
          </div>
          <UFormField label="Destino (viaje)">
            <UInput v-model="formOrden.destino" placeholder="TRIP-001" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="modalNuevaOrden = false">
            Cancelar
          </UButton>
          <UButton @click="crearOrden">Crear Orden</UButton>
        </div>
      </template>
    </UModal>

    <!-- Nuevo Stock -->
    <UModal v-model:open="modalNuevoStock" title="📊 Nuevo Producto en Stock">
      <template #body>
        <div class="modal-form">
          <div class="form-row-2">
            <UFormField label="SKU">
              <UInput v-model="formStock.sku" placeholder="CON-010" />
            </UFormField>
            <UFormField label="Nombre">
              <UInput
                v-model="formStock.nombre"
                placeholder="Nombre del producto"
              />
            </UFormField>
          </div>
          <div class="form-row-2">
            <UFormField label="Categoría">
              <USelect
                v-model="formStock.categoria"
                :options="[
                  'Congelados',
                  'Lácteos',
                  'Fiambres',
                  'Comidas preparadas'
                ]"
              />
            </UFormField>
            <UFormField label="Depósito">
              <USelect
                v-model="formStock.deposito"
                :options="depositos.map((d) => d.nombre)"
              />
            </UFormField>
          </div>
          <div class="form-row-3">
            <UFormField label="Stock inicial">
              <UInput v-model.number="formStock.stock" type="number" :min="0" />
            </UFormField>
            <UFormField label="Stock mínimo">
              <UInput
                v-model.number="formStock.minimo"
                type="number"
                :min="0"
              />
            </UFormField>
            <UFormField label="Temp. requerida">
              <USelect
                v-model="formStock.tempRequerida"
                :options="['-18°C', '-22°C', '+4°C', '+2°C', '0°C']"
              />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton variant="ghost" @click="modalNuevoStock = false">
            Cancelar
          </UButton>
          <UButton @click="crearStock">Agregar Producto</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
/* ── BASE LAYOUT ─────────────────────────────────────────────────── */
.logicore-app {
  display: flex;
  min-height: 100vh;
  background: #080c12;
  font-family: 'DM Sans', 'Geist', ui-sans-serif, system-ui, sans-serif;
  color: #e2e8f0;
}

/* ── SIDEBAR ─────────────────────────────────────────────────────── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #0d1117;
  border-right: 1px solid #1a2235;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-logo {
  padding: 20px 18px 16px;
  border-bottom: 1px solid #1a2235;
}

.logo-marca {
  font-size: 17px;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: -0.5px;
}

.logo-sub {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #475569;
  margin-top: 2px;
}

.sidebar-nav {
  padding: 12px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.14s;
}

.nav-item:hover {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.025);
}

.nav-item.active {
  color: #38bdf8;
  border-left-color: #38bdf8;
  background: rgba(56, 189, 248, 0.06);
}

.nav-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid #1a2235;
}

.footer-user {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.footer-empresa {
  font-size: 11px;
  color: #475569;
}

/* ── MAIN ─────────────────────────────────────────────────────────── */
.main-content {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  min-width: 0;
}

/* ── PAGE HEADER ─────────────────────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.3px;
}

.page-sub {
  font-size: 13px;
  color: #475569;
  margin-top: 2px;
}

/* ── KPI GRID ────────────────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}

.kpi-card {
  position: relative;
  overflow: hidden;
}

.kpi-card::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  filter: blur(28px);
  opacity: 0.25;
  pointer-events: none;
}

.kpi-blue::after {
  background: #3b82f6;
}
.kpi-cyan::after {
  background: #06b6d4;
}
.kpi-amber::after {
  background: #f59e0b;
}
.kpi-red::after {
  background: #ef4444;
}

.kpi-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #475569;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.kpi-blue .kpi-value {
  color: #60a5fa;
}
.kpi-cyan .kpi-value {
  color: #22d3ee;
}
.kpi-amber .kpi-value {
  color: #fbbf24;
}
.kpi-red .kpi-value {
  color: #f87171;
}

.kpi-hint {
  font-size: 11px;
  color: #475569;
  margin-top: 5px;
}

/* ── CARD HEADER ─────────────────────────────────────────────────── */
.card-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.card-hdr-title {
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
}

/* ── DASHBOARD GRID ──────────────────────────────────────────────── */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ── STOCK CRÍTICO ───────────────────────────────────────────────── */
.stock-critico-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.critico-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: rgba(239, 68, 68, 0.06);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.15);
}

.critico-nombre {
  font-size: 13px;
  font-weight: 500;
}
.critico-meta {
  font-size: 11px;
  color: #475569;
  margin-top: 1px;
}
.critico-nums {
  font-size: 14px;
}

/* ── PICKING MINI ────────────────────────────────────────────────── */
.picking-mini-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.picking-mini-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ── FLOTA MINI ──────────────────────────────────────────────────── */
.flota-mini-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.flota-mini-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* ── DEPOSITOS ───────────────────────────────────────────────────── */
.depositos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sectores-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.sector-chip {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

/* ── PICKING ─────────────────────────────────────────────────────── */
.picking-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.picking-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pick-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s;
  border: 1px solid transparent;
}

.pick-row:hover {
  background: rgba(255, 255, 255, 0.03);
}
.pick-row--selected {
  background: rgba(56, 189, 248, 0.06);
  border-color: rgba(56, 189, 248, 0.2);
}
.pick-row--done {
  opacity: 0.55;
}

.pick-check {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid #1e2d3d;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.14s;
  color: #000;
}

.pick-check--done {
  background: #22d3ee;
  border-color: #22d3ee;
}

.pick-detail {
}
.pick-detail-id {
  font-size: 20px;
  font-weight: 800;
  color: #38bdf8;
  font-variant-numeric: tabular-nums;
}
.pick-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}
.pick-detail-field {
  background: #0d1117;
  border-radius: 8px;
  padding: 12px;
}
.pick-detail-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #475569;
  margin-bottom: 4px;
}
.pick-detail-val {
  font-size: 14px;
  font-weight: 600;
}

/* ── REPORTES ────────────────────────────────────────────────────── */
.reportes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 180px;
  padding-top: 20px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bar-val {
  font-size: 10px;
  color: #22d3ee;
  font-variant-numeric: tabular-nums;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #0284c7, #22d3ee);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
  min-height: 4px;
}

.bar-label {
  font-size: 10px;
  color: #475569;
}

.perf-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.perf-row {
}

/* ── PERMISOS ────────────────────────────────────────────────────── */
.permisos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.perm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.perm-row:last-child {
  border-bottom: none;
}

/* ── EMPRESAS ────────────────────────────────────────────────────── */
.empresas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.empresa-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.empresa-stat {
  background: #0d1117;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

/* ── MODAL FORM ──────────────────────────────────────────────────── */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

/* ── UTILS ───────────────────────────────────────────────────────── */
.mono-sm {
  font-size: 12px;
  font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
.mono-xs {
  font-size: 11px;
  font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
}
.empty-state {
  color: #475569;
  font-size: 13px;
  padding: 12px 0;
}
</style>
