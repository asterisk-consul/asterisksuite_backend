import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateDeliveryNoteDto {
  @IsUUID()
  company_id!: string;

  @IsString()
  type!: string; // OUTBOUND | INBOUND | INTERNAL

  @IsString()
  number!: string;

  @IsString()
  status!: string; // DRAFT | CONFIRMED | CANCELLED

  @IsOptional()
  @IsUUID()
  party_id?: string;

  @IsOptional()
  @IsUUID()
  trip_id?: string;
}
