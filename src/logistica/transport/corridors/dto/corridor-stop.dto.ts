import { IsUUID, IsInt, IsOptional, IsString } from 'class-validator';

export class CorridorStopDto {
  @IsUUID()
  location_id!: string;

  @IsInt()
  stop_order!: number;

  @IsOptional()
  @IsString()
  stop_type?: string;
}
