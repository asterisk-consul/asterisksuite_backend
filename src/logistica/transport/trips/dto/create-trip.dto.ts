import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsUUID()
  companyId!: string;

  @IsOptional()
  @IsUUID()
  vehicleCombinationId?: string;

  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsOptional()
  @IsUUID()
  originWarehouseId?: string;

  @IsOptional()
  @IsUUID()
  destinationWarehouseId?: string;

  @IsOptional()
  @IsUUID()
  originLocationId?: string;

  @IsOptional()
  @IsUUID()
  destinationLocationId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
