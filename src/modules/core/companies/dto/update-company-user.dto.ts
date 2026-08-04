import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateCompanyUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class ChangeUserPasswordDto {
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
