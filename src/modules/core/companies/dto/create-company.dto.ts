import { IsString, IsOptional, IsEmail, MaxLength, IsIn } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  taxId?: string;

  @IsOptional()
  @IsIn(['RESPONSABLE_INSCRIPTO', 'MONOTRIBUTO', 'EXENTO'])
  vat_condition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  subdomain?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  schemaName?: string;
}
