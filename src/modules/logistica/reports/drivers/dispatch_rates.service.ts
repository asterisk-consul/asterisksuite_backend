import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../../prisma/prisma.service';
import {
  ReporteChoferesQueryDto,
  ReporteChoferItemDto,
  ReporteChoferesResponseDto,
} from './dto/dispatch_rates_drivers';

@Injectable()
export class ReporteChoferesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ReporteChoferesQueryDto,
  ): Promise<ReporteChoferesResponseDto> {
    const {
      fechaDesde,
      fechaHasta,
      choferId,
      mes,
      cliente,
      corredor,
      numeroViaje,
      page = 1,
      limit = 50,
    } = query;

    const offset = (page - 1) * limit;

    const isValid = (v: any) => v !== undefined && v !== null && v !== '';
    const isValidDate = (v: any) => {
      if (!isValid(v)) return false;
      return !isNaN(new Date(v).getTime());
    };

    // Parámetros compartidos (sin LIMIT/OFFSET)
    const sharedParams: any[] = [];
    const sharedConditions: string[] = [];
    let idx = 1;

    if (isValidDate(fechaDesde)) {
      sharedConditions.push(`d.planned_date >= $${idx++}`);
      sharedParams.push(new Date(fechaDesde as string));
    }

    if (isValidDate(fechaHasta)) {
      sharedConditions.push(`d.planned_date <= $${idx++}`);
      sharedParams.push(new Date(fechaHasta as string));
    }

    if (isValid(choferId)) {
      sharedConditions.push(`dt.driver_id = $${idx++}::uuid`);
      sharedParams.push(choferId);
    }

    if (isValid(mes)) {
      const mesDate = new Date(`${mes}-01`);
      if (!isNaN(mesDate.getTime())) {
        sharedConditions.push(
          `date_trunc('month', d.planned_date) = date_trunc('month', $${idx++}::timestamptz)`,
        );
        sharedParams.push(mesDate);
      }
    }

    if (isValid(cliente)) {
      sharedConditions.push(`bp.name ILIKE $${idx++}`);
      sharedParams.push(`%${cliente}%`);
    }

    if (isValid(corredor)) {
      sharedConditions.push(`c.name ILIKE $${idx++}`);
      sharedParams.push(`%${corredor}%`);
    }

    if (isValid(numeroViaje)) {
      sharedConditions.push(`dt.reference_number ILIKE $${idx++}`);
      sharedParams.push(`%${numeroViaje}%`);
    }

    const whereClause =
      sharedConditions.length > 0
        ? `WHERE ${sharedConditions.join(' AND ')}`
        : '';

    // CTE compartida para reutilizar en ambas queries
    const cteBlock = `
      WITH rates AS (
        SELECT DISTINCT ON (dispatch_id)
          id,
          dispatch_id,
          value
        FROM dispatch_rates
        ORDER BY dispatch_id
      ),
      driver_trips AS (
        SELECT DISTINCT ON (tso.dispatch_order_id)
          tso.dispatch_order_id,
          t.id,
          t.reference_number,
          td.driver_id,
          td.first_name,
          td.last_name,
          td.unit_number
        FROM trip_stop_orders tso
        JOIN trip_stops ts             ON ts.id = tso.trip_stop_id
        JOIN trips t                   ON t.id = ts.trip_id
        LEFT JOIN vw_trips_drivers td  ON td.trip_id = t.id
        WHERE tso.action = 'PICKUP'
        ORDER BY tso.dispatch_order_id, tso.id
      )
    `;

    // ── Main query ──────────────────────────────────────────────────────
    const mainParams = [...sharedParams, limit, offset];
    const limitIdx = idx;
    const offsetIdx = idx + 1;

    const mainQuery = `
      ${cteBlock}
      SELECT
        r.id,
        dt.id                                                               AS "tripId",
        dt.driver_id                                                        AS "choferId",
        dt.first_name                                                       AS "nombre",
        dt.last_name                                                        AS "apellido",
        TRIM(COALESCE(dt.first_name, '') || ' ' || COALESCE(dt.last_name, '')) AS "chofer",
        dt.unit_number                                                      AS "unidad",
        d.id                                                                AS "despachoId",
        d.order_number                                                      AS "numeroCarga",
        d.planned_date                                                      AS "fecha",
        date_trunc('month', d.planned_date)                                AS "mes",
        (l.city || ' / ' || l2.city)                                       AS "origenDestino",
        l.city                                                              AS "origen",
        l2.city                                                             AS "destino",
        bp.name                                                             AS "cliente",
        c.name                                                              AS "corredor",
        dt.reference_number                                                 AS "numeroViaje",
        round(r.value::numeric, 2)                                         AS "tarifa",
        0::numeric                                                          AS "adicional0",
        0::numeric                                                          AS "adicional1",
        0::numeric                                                          AS "adicional2",
        0::numeric                                                          AS "adicional3",
        0::numeric                                                          AS "adicional4",
        0::numeric                                                          AS "adicional5",
        round(r.value::numeric, 2)                                         AS "tarifaTotal",
        round(r.value::numeric * 0.15, 2)                                  AS "comisionChofer",
        sum(round(r.value::numeric * 0.15, 2)) OVER (
          PARTITION BY dt.driver_id, date_trunc('month', d.planned_date)
        )                                                                   AS "totalMesChofer"
      FROM rates r
      JOIN dispatch_orders d    ON d.id = r.dispatch_id
      JOIN business_parties bp  ON bp.id = d.customer_id
      JOIN locations l          ON l.id = d.origin_location_id
      JOIN locations l2         ON l2.id = d.destination_location_id
      LEFT JOIN driver_trips dt ON dt.dispatch_order_id = d.id
      LEFT JOIN corridors c     ON c.id = d.corridor_id
      ${whereClause}
      ORDER BY dt.first_name, dt.last_name, d.planned_date
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const rows = await this.prisma.$queryRawUnsafe<ReporteChoferItemDto[]>(
      mainQuery,
      ...mainParams,
    );

    // ── Count query ─────────────────────────────────────────────────────
    const countQuery = `
      ${cteBlock}
      SELECT COUNT(*) AS count
      FROM rates r
      JOIN dispatch_orders d    ON d.id = r.dispatch_id
      JOIN business_parties bp  ON bp.id = d.customer_id
      JOIN locations l          ON l.id = d.origin_location_id
      JOIN locations l2         ON l2.id = d.destination_location_id
      LEFT JOIN driver_trips dt ON dt.dispatch_order_id = d.id
      LEFT JOIN corridors c     ON c.id = d.corridor_id
      ${whereClause}
    `;

    const countResult = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
      countQuery,
      ...sharedParams,
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
