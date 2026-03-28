import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsOptional()
  @IsUUID()
  fromTripId?: string;

  @IsOptional()
  @IsUUID()
  toTripId?: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
