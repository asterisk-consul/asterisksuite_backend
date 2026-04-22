import {
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── Query (filtros y paginación) ─────────────────────────────────────────────
export class ReporteChoferesQueryDto {
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @IsUUID()
  choferId?: string;

  @IsOptional()
  @IsString()
  mes?: string;

  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsString()
  corredor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  numeroViaje?: string;
}

// ─── Item de respuesta (interfaz, no clase) ───────────────────────────────────
export interface ReporteChoferItemDto {
  id: string;
  choferId: string | null;
  nombre: string | null;
  apellido: string | null;
  chofer: string | null;
  unidad: string | null;
  despachoId: string;
  numeroCarga: string | null;
  fecha: Date | null;
  mes: Date | null;
  origenDestino: string | null;
  origen: string | null;
  destino: string | null;
  cliente: string | null;
  corredor: string | null;
  numeroViaje: string | null;
  tarifa: number | null;
  adicional0: number;
  adicional1: number;
  adicional2: number;
  adicional3: number;
  adicional4: number;
  adicional5: number;
  tarifaTotal: number;
  comisionChofer: number;
  totalMesChofer: number;
}

// ─── Respuesta paginada (interfaz, no clase) ───────────────────────────────────
export interface ReporteChoferesResponseDto {
  data: ReporteChoferItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
