import { IsString, IsEmail, IsOptional, MinLength, IsIn, IsUUID, Matches, ValidateIf } from 'class-validator';

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

  @ValidateIf((_object, value) => value !== undefined && value !== null && String(value).trim() !== '')
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Usá el formato internacional con + y código de país, por ejemplo +54911XXXXXXXX.',
  })
  whatsapp_phone?: string | null;
}
