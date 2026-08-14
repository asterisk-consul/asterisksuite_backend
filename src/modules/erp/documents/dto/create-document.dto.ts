import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateDocumentItemTaxDto {
  @IsUUID()
  tax_id!: string;

  @IsNumber()
  tax_rate!: number;

  @IsNumber()
  tax_amount!: number;
}
export class CreateDocumentItemDto {
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unit_price!: number;

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
}

export class CreateDocumentDto {
  @IsUUID()
  document_type_id!: string;

  @IsUUID()
  @IsOptional()
  party_id?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
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

  // ─── Presupuesto fields ─────────────────────────
  @IsOptional()
  @IsDateString()
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
  internal_notes?: string;

  @IsOptional()
  @IsString()
  terms_and_conditions?: string;

  // ─── Orden de Venta fields ──────────────────────
  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  delivery_address?: string;

  @IsOptional()
  @IsString()
  delivery_contact?: string;

  @IsOptional()
  @IsString()
  delivery_phone?: string;

  @IsOptional()
  @IsString()
  delivery_time?: string;

  @IsOptional()
  @IsString()
  delivery_instructions?: string;

  @IsOptional()
  @IsString()
  transport_provider?: string;

  @IsOptional()
  @IsDateString()
  confirmed_delivery_date?: string;

  @IsOptional()
  @IsUUID()
  seller_id?: string;

  @IsOptional()
  commission_rate?: number;

  @IsOptional()
  @IsUUID()
  buyer_id?: string;

  // ─── Parent document (OV/OC) ──────────────────────
  @IsOptional()
  @IsUUID()
  parent_document_id?: string;
}
