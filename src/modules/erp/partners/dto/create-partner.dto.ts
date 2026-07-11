import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '../../employees/dto/create-user.dto';

export class CreatePartnerDto {
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
  share_percentage?: string;

  @IsOptional()
  @IsString()
  capital_contributed?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
