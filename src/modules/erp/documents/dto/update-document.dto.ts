import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  // status: 0 = borrador, 1 = confirmado, 2 = anulado
  @IsInt()
  @IsOptional()
  status?: number;

  @IsDateString()
  @IsOptional()
  expected_updated_at?: string;

  /** Campos de entrega que la persona confirmó borrar explícitamente al editar una OV. */
  @IsArray()
  @IsIn([
    'delivery_address',
    'delivery_contact',
    'delivery_phone',
    'delivery_time',
    'delivery_instructions',
    'transport_provider',
    'confirmed_delivery_date',
  ], { each: true })
  @IsOptional()
  clear_delivery_fields?: Array<
    | 'delivery_address'
    | 'delivery_contact'
    | 'delivery_phone'
    | 'delivery_time'
    | 'delivery_instructions'
    | 'transport_provider'
    | 'confirmed_delivery_date'
  >;
}
