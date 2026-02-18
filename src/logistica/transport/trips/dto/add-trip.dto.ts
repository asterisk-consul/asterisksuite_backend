import { IsUUID, IsOptional } from 'class-validator';

export class AddTripCargoDto {
  @IsUUID()
  tripId!: string;

  @IsOptional()
  @IsUUID()
  palletId?: string;

  @IsOptional()
  @IsUUID()
  deliveryNoteId?: string;
}
