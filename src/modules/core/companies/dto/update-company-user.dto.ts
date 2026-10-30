import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches, ValidateIf } from 'class-validator';

export class UpdateCompanyUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf((_object, value) => value !== undefined && value !== null && String(value).trim() !== '')
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Usá el formato internacional con + y código de país, por ejemplo +54911XXXXXXXX.',
  })
  whatsapp_phone?: string | null;
}

export class ChangeUserPasswordDto {
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
