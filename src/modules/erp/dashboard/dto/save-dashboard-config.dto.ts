import { IsString, IsArray, ValidateNested, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class WidgetConfigDto {
  @IsString()
  id!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsNumber()
  position!: number;

  @IsOptional()
  @IsString()
  size?: 'sm' | 'lg';
}

export class SaveDashboardConfigDto {
  @IsString()
  dashboard_key!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WidgetConfigDto)
  widgets!: WidgetConfigDto[];
}
