import { IsUUID, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDriverDto {
  @IsUUID()
  companyId!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsDateString()
  licenseExpiration?: string;
}
