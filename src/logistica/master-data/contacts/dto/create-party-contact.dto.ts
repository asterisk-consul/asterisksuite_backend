import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePartyContactDto {
  @IsUUID()
  party_id!: string;

  @IsString()
  @MaxLength(100)
  first_name!: string;

  @IsString()
  @MaxLength(100)
  last_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;
}
