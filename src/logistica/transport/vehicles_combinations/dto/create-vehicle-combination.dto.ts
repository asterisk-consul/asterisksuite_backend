import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateVehicleCombinationDto {
  @IsUUID()
  companyId!: string;

  @IsUUID()
  tractorId!: string;

  @IsOptional()
  @IsUUID()
  trailerId?: string;

  @IsDateString()
  validFrom!: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
