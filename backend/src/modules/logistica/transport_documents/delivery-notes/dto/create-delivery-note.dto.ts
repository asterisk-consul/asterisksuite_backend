import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateDeliveryNoteDto {
  @IsString()
  type!: string; // OUTBOUND / INBOUND

  @IsString()
  pointOfSale!: string; // talonario

  @IsUUID()
  partyId!: string;

  @IsOptional()
  @IsUUID()
  pickingOrderId?: string;

  @IsOptional()
  @IsUUID()
  tripId?: string;
}
