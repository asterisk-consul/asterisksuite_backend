import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class CreateEmployeeDto {
  @IsOptional()
  @IsUUID()
  party_id?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDto)
  create_user?: CreateUserDto;

  @IsString()
  @MaxLength(100)
  first_name!: string;

  @IsString()
  @MaxLength(100)
  last_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  document_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  document_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsDateString()
  hire_date?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency_code?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
