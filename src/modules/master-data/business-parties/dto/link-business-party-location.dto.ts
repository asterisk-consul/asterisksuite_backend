import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class LinkBusinessPartyLocationDto {
  @IsUUID()
  location_id!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;
}
