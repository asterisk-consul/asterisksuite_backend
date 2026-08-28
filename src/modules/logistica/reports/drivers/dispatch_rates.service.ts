import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../../prisma/prisma.service';
import { PrismaClient } from '@/generated/prisma/client';

import {
  ReporteChoferesQueryDto,
  ReporteChoferItemDto,
  ReporteChoferesResponseDto,
} from './dto/dispatch_rates_drivers';

@Injectable()
export class ReporteChoferesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(query: ReporteChoferesQueryDto): Promise<ReporteChoferesResponseDto> {
    const { fechaDesde, fechaHasta, choferId, mes, cliente, corredor, numeroViaje, page = 1, limit = 50 } = query;

    const offset = (page - 1) * limit;

    // ── Helpers robustos ────────────────────────────────────────────────
    const isValid = (v: any) => v !== undefined && v !== null && v !== '';

    const isValidDate = (v: any) => {
      if (!isValid(v)) return false;
      const d = new Date(v);
      return !isNaN(d.getTime());
    };

    // ── Condiciones WHERE dinámicas ─────────────────────────────────────
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (isValidDate(fechaDesde)) {
      const fd = new Date(fechaDesde as string);
      conditions.push(`d.planned_date >= $${paramIndex++}`);
      params.push(fd);
    }

    if (isValidDate(fechaHasta)) {
      const fh = new Date(fechaHasta as string);
      conditions.push(`d.planned_date <= $${paramIndex++}`);
      params.push(fh);
    }

    if (isValid(choferId)) {
      conditions.push(`td.driver_id = $${paramIndex++}::uuid`);
      params.push(choferId);
    }

    if (isValid(mes)) {
      const mesDate = new Date(`${mes}-01`);
      if (!isNaN(mesDate.getTime())) {
        conditions.push(`
          date_trunc('month', d.planned_date) =
          date_trunc('month', $${paramIndex++}::timestamptz)
        `);
        params.push(mesDate);
      }
    }

    if (isValid(cliente)) {
      conditions.push(`bp.name ILIKE $${paramIndex++}`);
      params.push(`%${cliente}%`);
    }

    if (isValid(corredor)) {
      conditions.push(`c.name ILIKE $${paramIndex++}`);
      params.push(`%${corredor}%`);
    }
    if (isValid(numeroViaje)) {
      conditions.push(`t.reference_number ILIKE $${paramIndex++}`);
      params.push(`%${numeroViaje}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // ── Query principal ────────────────────────────────────────────────
    const mainQuery = `
      WITH product_amounts AS (
        SELECT
          doi.dispatch_order_id AS dispatch_id,
          (array_agg(doi.id ORDER BY doi.created_at))[1] AS id,
          SUM(doi.quantity * doi.unit_price)::numeric AS value
        FROM dispatch_order_items doi
        GROUP BY doi.dispatch_order_id
      ),
      legacy_amounts AS (
        SELECT
          dr.dispatch_id,
          (array_agg(dr.id ORDER BY dr.created_at))[1] AS id,
          SUM(dr.value)::numeric AS value
        FROM dispatch_rates dr
        WHERE NOT EXISTS (
          SELECT 1 FROM dispatch_order_items doi WHERE doi.dispatch_order_id = dr.dispatch_id
        )
        GROUP BY dr.dispatch_id
      ),
      effective_rates AS (
        SELECT * FROM product_amounts
        UNION ALL
        SELECT * FROM legacy_amounts
      )
      SELECT
        dr.id,
        td.driver_id                                                     AS "choferId",
        td.first_name                                                    AS "nombre",
        td.last_name                                                     AS "apellido",
      TRIM(
  COALESCE(td.first_name, '') || ' ' || COALESCE(td.last_name, '')
) AS "chofer",
        td.unit_number                                                   AS "unidad",
        d.id                                                             AS "despachoId",
        d.order_number                                                   AS "numeroCarga",
        d.planned_date                                                   AS "fecha",
        date_trunc('month', d.planned_date)                             AS "mes",
        (l.city::text || ' / ' || l2.city::text)                        AS "origenDestino",
        l.city                                                           AS "origen",
        l2.city                                                          AS "destino",
        bp.name                                                          AS "cliente",
        c.name                                                           AS "corredor",
        t.reference_number                                               AS "numeroViaje",
        round(dr.value::numeric, 2)                                     AS "tarifa",
        COALESCE(ag.total_adicional_0, 0::numeric)                      AS "adicional0",
        COALESCE(ag.total_adicional_1, 0::numeric)                      AS "adicional1",
        COALESCE(ag.total_adicional_2, 0::numeric)                      AS "adicional2",
        COALESCE(ag.total_adicional_3, 0::numeric)                      AS "adicional3",
        COALESCE(ag.total_adicional_4, 0::numeric)                      AS "adicional4",
        COALESCE(ag.total_adicional_5, 0::numeric)                      AS "adicional5",
        round(
          COALESCE(dr.value::numeric, 0) +
          COALESCE(ag.total_adicional_0, 0) +
          COALESCE(ag.total_adicional_1, 0) +
          COALESCE(ag.total_adicional_2, 0) +
          COALESCE(ag.total_adicional_3, 0) +
          COALESCE(ag.total_adicional_4, 0) +
          COALESCE(ag.total_adicional_5, 0), 2)                         AS "tarifaTotal",
        round((
          COALESCE(dr.value::numeric, 0) +
          COALESCE(ag.total_adicional_0, 0) +
          COALESCE(ag.total_adicional_1, 0) +
          COALESCE(ag.total_adicional_2, 0) +
          COALESCE(ag.total_adicional_3, 0) +
          COALESCE(ag.total_adicional_4, 0) +
          COALESCE(ag.total_adicional_5, 0)
        ) * 0.15, 2)                                                    AS "comisionChofer",
        sum(round((
          COALESCE(dr.value::numeric, 0) +
          COALESCE(ag.total_adicional_0, 0) +
          COALESCE(ag.total_adicional_1, 0) +
          COALESCE(ag.total_adicional_2, 0) +
          COALESCE(ag.total_adicional_3, 0) +
          COALESCE(ag.total_adicional_4, 0) +
          COALESCE(ag.total_adicional_5, 0)
        ) * 0.15, 2)) OVER (
          PARTITION BY td.driver_id, date_trunc('month', d.planned_date)
        )                                                               AS "totalMesChofer"
      FROM effective_rates dr
        JOIN dispatch_orders d        ON d.id = dr.dispatch_id
        JOIN business_parties bp      ON bp.id = d.customer_id
        JOIN locations l              ON l.id = d.origin_location_id
        JOIN locations l2             ON l2.id = d.destination_location_id
        JOIN LATERAL (
          SELECT tso.*
          FROM trip_stop_orders tso
          WHERE tso.dispatch_order_id = d.id
            AND tso.action = 'PICKUP'
          LIMIT 1
        ) tso ON true
        JOIN trip_stops ts  ON ts.id = tso.trip_stop_id
        LEFT JOIN trips t ON t.id = ts.trip_id
        LEFT JOIN vw_trips_drivers td ON td.trip_id = t.id
        LEFT JOIN corridors c         ON c.id = d.corridor_id
        LEFT JOIN (
          SELECT
            NULL::uuid    AS dispatch_id,
            NULL::numeric AS total_adicional_0,
            NULL::numeric AS total_adicional_1,
            NULL::numeric AS total_adicional_2,
            NULL::numeric AS total_adicional_3,
            NULL::numeric AS total_adicional_4,
            NULL::numeric AS total_adicional_5
          WHERE false
        ) ag ON ag.dispatch_id = d.id
      ${whereClause}
      ORDER BY td.first_name, td.last_name, d.planned_date
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(limit, offset);

    const rows = await (this.prisma as unknown as PrismaClient).$queryRawUnsafe<ReporteChoferItemDto[]>(
      mainQuery,
      ...params,
    );

    // ── Count ───────────────────────────────────────────────────────────
    const countQuery = `
      WITH product_amounts AS (
        SELECT doi.dispatch_order_id AS dispatch_id
        FROM dispatch_order_items doi
        GROUP BY doi.dispatch_order_id
      ),
      legacy_amounts AS (
        SELECT dr.dispatch_id
        FROM dispatch_rates dr
        WHERE NOT EXISTS (
          SELECT 1 FROM dispatch_order_items doi WHERE doi.dispatch_order_id = dr.dispatch_id
        )
        GROUP BY dr.dispatch_id
      ),
      effective_rates AS (
        SELECT * FROM product_amounts
        UNION ALL
        SELECT * FROM legacy_amounts
      )
      SELECT COUNT(*) AS count
      FROM effective_rates dr
        JOIN dispatch_orders d        ON d.id = dr.dispatch_id
        JOIN business_parties bp      ON bp.id = d.customer_id
        JOIN locations l              ON l.id = d.origin_location_id
        JOIN locations l2             ON l2.id = d.destination_location_id
        JOIN trip_stops ts            ON ts.stop_order = 1
        JOIN trip_stop_orders tso     ON tso.trip_stop_id = ts.id AND tso.dispatch_order_id = d.id
        JOIN trips t                  ON t.id = ts.trip_id
        LEFT JOIN vw_trips_drivers td ON td.trip_id = t.id
        LEFT JOIN corridors c         ON c.id = d.corridor_id
      ${whereClause}
    `;

    const countParams = params.slice(0, -2);

    const countResult = await (this.prisma as unknown as PrismaClient).$queryRawUnsafe<[{ count: bigint }]>(
      countQuery,
      ...countParams,
    );

    const total = Number(countResult[0]?.count ?? 0);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
