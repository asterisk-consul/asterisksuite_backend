import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ArticuloPrecioDTO } from './dto/arbol-costos.dto.js';
import {
  ArticuloSafe,
  ArticuloCompuestoSafe,
  ArbolCostosNodo,
  NodoListaMaestra,
} from './types/arbol-costos.types.js';

@Injectable()
export class ArticulosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.articulos.findMany({
      include: {
        articuloespec: true,
        articuloprecio: true,
        depositosarticulos: {
          select: {
            cantidad: true,
            depositos: {
              select: {
                id: true,
                descrip: true,
              },
            },
          },
        },
        tipoarticulos: true,
        hijos: true,
        articulos_padre: true,
      },
    });
  }

  async findOne(id: number) {
    const articulo = await this.prisma.articulos.findUnique({
      where: { id },
      include: {
        articuloespec: true,
        articuloprecio: true,
        articulopreciohistorico: true,
        depositosarticulos: {
          select: {
            depositos: {
              select: { id: true, descrip: true },
            },
          },
        },
        hijos: true,
        tipoarticulos: true,
        perfilesarticulos: true,
        articulos_padre: true,
      },
    });

    if (!articulo) return null;

    return {
      ...articulo,
      articuloprecio: articulo.articuloprecio.map(
        (p): ArticuloPrecioDTO => ({
          id: p.id,
          articuloid: p.articuloid,
          categid: p.categid,
          precio: p.precio ? Number(p.precio) : null,
          changedate: p.changedate ? p.changedate.toISOString() : null,
          factorconversion: p.factorconversion,
        }),
      ),
    };
  }

  async obtenerArbolCostos(articuloId: number): Promise<ArbolCostosNodo> {
    /** ============================================================
     * 1. Obtener artículos con su precio más reciente
     * ============================================================ */
    const articulos = (await this.prisma.articulos.findMany({
      include: {
        articuloprecio: {
          orderBy: { changedate: 'desc' },
          take: 1,
        },
      },
    })) as unknown as ArticuloSafe[];

    /** ============================================================
     * 2. Obtener relaciones compuestas
     * ============================================================ */
    const compuestos =
      (await this.prisma.articuloscompuestos.findMany()) as unknown as ArticuloCompuestoSafe[];

    /** ============================================================
     * 3. Crear el mapa de nodos
     * ============================================================ */
    const map = new Map<bigint, ArbolCostosNodo>();

    for (const a of articulos) {
      const precioUnitario = Number(a.articuloprecio?.[0]?.precio ?? 0) || 0;

      map.set(a.id, {
        id: a.id,
        nombre: a.nombre ?? '',
        precioUnitario,
        cantidad: 1, // la cantidad del nodo la define el padre
        costoTotal: 0,
        hijos: [],
      });
    }

    /** ============================================================
     * 4. Relacionar nodos padre ↔ hijos
     * ============================================================ */
    for (const comp of compuestos) {
      if (!comp.parentarticuloid || !comp.articuloid) continue;

      const padre = map.get(comp.parentarticuloid);
      const hijo = map.get(comp.articuloid);

      if (!padre || !hijo) continue;

      padre.hijos.push({
        ...hijo,
        cantidad: Number(comp.cantidad ?? 1) || 1,
      });
    }

    /** ============================================================
     * 5. Obtener la raíz solicitada
     * ============================================================ */
    const raiz = map.get(BigInt(articuloId));
    if (!raiz) throw new Error('Artículo no encontrado');

    /** ============================================================
     * 6. Calcular costos recursivamente (ALGORITMO CORREGIDO)
     * ============================================================ */
    this.calcularCosto(raiz);

    return raiz;
  }

  /** ==========================================================
   * FUNCIÓN RECURSIVA PARA CALCULAR COSTOS (Versión correcta)
   * ========================================================== */
  private calcularCosto(nodo: ArbolCostosNodo): number {
    // costo propio solo si tiene precio
    const costoPropio = nodo.precioUnitario > 0 ? nodo.precioUnitario : 0;

    // Si no tiene hijos: su costo total es su costo propio
    nodo.costoTotal = costoPropio;

    if (nodo.hijos.length === 0) {
      return nodo.costoTotal;
    }

    // Sumar hijos multiplicados por la cantidad que el padre requiere
    let sumaHijos = 0;

    for (const h of nodo.hijos) {
      const costoHijo = this.calcularCosto(h);
      const cantidad = Number(h.cantidad ?? 1) || 1;
      sumaHijos += costoHijo * cantidad;
    }

    nodo.costoTotal = costoPropio + sumaHijos;
    return nodo.costoTotal;
  }

  async findListaMaestra(articuloId: number): Promise<NodoListaMaestra> {
    /** ============================================================
     * 1. Traer todos los artículos necesarios
     * ============================================================ */
    const articulos = await this.prisma.articulos.findMany({
      select: {
        id: true,
        nombre: true,
        internalcode: true,
        externalcode: true,
        um: true,
        ub: true,
        depositosarticulos: {
          select: {
            id: true,
            cantidad: true,
            depositos: {
              select: {
                id: true,
                descrip: true,
              },
            },
          },
        },
        tipoarticulos: {
          include: {
            categorias: true,
          },
        },
      },
    });

    /** ============================================================
     * 2. Traer todas las relaciones compuestas con medidas
     * ============================================================ */
    const compuestos = await this.prisma.articuloscompuestos.findMany({
      select: {
        id: true,
        articuloid: true,
        parentarticuloid: true,
        cantidad: true,
        ancho: true,
        largo: true,
      },
    });

    /** ============================================================
     * 3. Crear mapa de artículos
     * ============================================================ */
    const map = new Map<bigint, NodoListaMaestra>();

    for (const a of articulos) {
      map.set(a.id, {
        id: a.id,
        nombre: a.nombre ?? '',
        internalcode: a.internalcode,
        externalcode: a.externalcode,
        um: a.um,
        ub: a.ub,
        cantidad: 1,
        ancho: null,
        largo: null,
        esTerminal: a.internalcode?.startsWith('T') ?? false,

        // ==========================================
        // NUEVO: Depósitos
        // ==========================================
        depositos: a.depositosarticulos.map((d) => ({
          id: d.id,
          cantidad: Number(d.cantidad),
          deposito: d.depositos?.descrip ?? '', // Nunca null
        })),

        // ==========================================
        // NUEVO: Categorías (tipos de artículo)
        // ==========================================
        categorias: a.tipoarticulos.map((t) => ({
          id: t.categorias?.id ?? BigInt(0),
          name: t.categorias?.name ?? '',
        })),

        hijos: [],
      });
    }

    /** ============================================================
     * 4. Construir el árbol
     * ============================================================ */
    for (const comp of compuestos) {
      if (!comp.parentarticuloid || !comp.articuloid) continue;

      const padre = map.get(comp.parentarticuloid);
      const hijo = map.get(comp.articuloid);

      if (!padre || !hijo) continue;

      padre.hijos.push({
        ...hijo,
        cantidad: Number(comp.cantidad ?? 1),
        ancho: comp.ancho !== null ? Number(comp.ancho) : null,
        largo: comp.largo !== null ? Number(comp.largo) : null,
      });
    }

    /** ============================================================
     * 5. Devolver raíz
     * ============================================================ */
    const raiz = map.get(BigInt(articuloId));
    if (!raiz) throw new Error('Artículo no encontrado');

    return raiz;
  }
}
