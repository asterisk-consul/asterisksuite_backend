import { IsString, IsEmail, IsOptional, MinLength, IsIn, IsUUID } from 'class-validator';

export class CreateCompanyUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  @IsIn(['OWNER', 'ADMIN', 'USER'])
  role?: string = 'USER';

  @IsOptional()
  @IsUUID()
  link_employee_id?: string;

  @IsOptional()
  @IsUUID()
  link_partner_id?: string;
}
