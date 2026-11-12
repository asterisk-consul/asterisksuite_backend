import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

export class CreateDocumentItemTaxDto {
  @IsUUID()
  tax_id!: string;

  @IsNumber()
  tax_rate!: number;

  @IsNumber()
  tax_amount!: number;
}
export class CreateDocumentItemDto {
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  item_instructions?: string;

  @IsUUID()
  @IsOptional()
  product_id?: string;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  variant_id?: string;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  warehouse_id?: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  purchase_unit_id?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.000001)
  @IsOptional()
  unit_conversion_factor?: number;

  @IsNumber()
  @Min(0)
  unit_price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_percentage?: number;

  /** Exact net line amount derived from a manually entered purchase discount. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  net_subtotal_override?: number;

  // ✅ ahora opcional (backend lo calcula)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  // ✅ opcional y solo útil si NO hay producto
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentItemTaxDto)
  @IsOptional()
  taxes?: CreateDocumentItemTaxDto[];
}

export class CreateDocumentTaxDto {
  @IsUUID()
  tax_id!: string;

  @IsNumber()
  tax_rate!: number;

  @IsNumber()
  taxable_base!: number;

  @IsNumber()
  tax_amount!: number;

  @IsOptional()
  manual?: boolean;

  @IsOptional()
  @IsString()
  modification_reason?: string;
}

export class DocumentCommercialAdjustmentDto {
  @IsString()
  @MinLength(1)
  concept!: string;

  @IsString()
  @IsIn(['PERCENTAGE', 'AMOUNT'])
  value_type!: 'PERCENTAGE' | 'AMOUNT';

  @IsString()
  @IsIn(['NET', 'GROSS'])
  basis!: 'NET' | 'GROSS';

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  value!: number;
}

export class CreateDocumentDto {
  @IsUUID()
  document_type_id!: string;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  party_id?: string;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  warehouse_id?: string;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  fiscal_jurisdiction_id?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descrip?: string;

  @IsString()
  @IsOptional()
  currency_code!: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  exchange_rate?: number;

  @IsString()
  @IsOptional()
  rate_type?: string;

  @IsString()
  @IsOptional()
  ref?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  exempt_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_taxes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  /** Total que figura en la factura del proveedor; conserva los impuestos calculados. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  supplier_total?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentItemDto)
  @IsOptional()
  items?: CreateDocumentItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentTaxDto)
  @IsOptional()
  taxes?: CreateDocumentTaxDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentCommercialAdjustmentDto)
  commercial_adjustments?: DocumentCommercialAdjustmentDto[];

  // ─── Presupuesto fields ─────────────────────────
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value === '' ? undefined : value)
  validity_date?: string;

  @IsOptional()
  @IsString()
  warranty_info?: string;

  @IsOptional()
  @IsString()
  exclusions?: string;

  @IsOptional()
  @IsString()
  commercial_notes?: string;

  @IsOptional()
  @IsString()
  product_specifications?: string;

  @IsOptional()
  @IsString()
  internal_notes?: string;

  @IsOptional()
  @IsString()
  terms_and_conditions?: string;

  // ─── Orden de Venta fields ──────────────────────
  @IsOptional()
  @IsString()
  @IsIn(['BAJA', 'MEDIA', 'ALTA', 'URGENTE'], { message: 'Elegí una prioridad válida para la entrega.' })
  @MaxLength(20, { message: 'La prioridad admite hasta 20 caracteres.' })
  priority?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'La dirección de entrega admite hasta 300 caracteres.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  delivery_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El contacto de entrega admite hasta 100 caracteres.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  delivery_contact?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Cada teléfono admite hasta 30 caracteres.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  delivery_phone?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Podés cargar hasta 10 teléfonos de entrega.' })
  @IsString({ each: true, message: 'Cada teléfono debe ser texto.' })
  @MaxLength(30, { each: true, message: 'Cada teléfono admite hasta 30 caracteres.' })
  @Transform(({ value }) => Array.isArray(value)
    ? value.map(item => typeof item === 'string' ? item.trim() : item).filter(item => item !== '')
    : value)
  delivery_phones?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El tiempo de entrega admite hasta 100 caracteres.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  delivery_time?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  delivery_instructions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El transporte admite hasta 100 caracteres.' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  transport_provider?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value === '' ? undefined : value)
  confirmed_delivery_date?: string;

  @IsOptional()
  @IsUUID()
  seller_id?: string | null;

  @IsOptional()
  @IsIn(['EMPLOYEE', 'PARTNER'])
  seller_type?: 'EMPLOYEE' | 'PARTNER' | null;

  @IsOptional()
  commission_rate?: number;

  @IsOptional()
  @IsString()
  commission_base?: string;

  @IsOptional()
  @IsUUID()
  buyer_id?: string;

  // ─── Parent document (OV/OC) ──────────────────────
  @IsOptional()
  @IsUUID()
  parent_document_id?: string;

  // ─── Punto de venta (secuencia) ──────────────────────
  @IsOptional()
  @IsUUID()
  document_sequence_id?: string;
}
