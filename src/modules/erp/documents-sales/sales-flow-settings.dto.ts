import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsUUID, Max, Min, ValidateNested } from 'class-validator';

export class SalesFlowCommissionAssignmentDto {
  @IsIn(['EMPLOYEE', 'PARTNER'])
  seller_type!: 'EMPLOYEE' | 'PARTNER';

  @IsUUID()
  seller_id!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  participation_rate!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  commission_rate!: number;

  @IsIn(['INVOICED', 'PAID'])
  commission_base!: 'INVOICED' | 'PAID';
}

export class UpdateSalesFlowCommissionSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesFlowCommissionAssignmentDto)
  assignments!: SalesFlowCommissionAssignmentDto[];
}

export class UpdatePartnerShareSettingsDto {
  @IsIn(['ORDER', 'INVOICED'])
  partner_share_basis!: 'ORDER' | 'INVOICED';
}

export class UpdateSalesFlowSettingsDto {
  @IsIn(['INVOICE', 'ORDER', 'ORDER_THEN_INVOICE'])
  accounting_basis!: string;

  @IsIn(['INVOICE', 'ORDER', 'BOTH'])
  payment_document_basis!: string;

  @IsBoolean()
  require_payment_for_delivery!: boolean;

  @IsNumber()
  @Min(0)
  @Max(100)
  delivery_payment_percentage!: number;

  @IsBoolean()
  require_invoice_for_delivery!: boolean;

  @IsBoolean()
  @IsOptional()
  require_order_delivery_address?: boolean;

  @IsBoolean()
  @IsOptional()
  warn_when_order_delivery_data_empty?: boolean;

  @IsBoolean()
  auto_create_delivery_note!: boolean;

  @IsBoolean()
  allow_partial_delivery!: boolean;

  @IsBoolean()
  @IsOptional()
  reserve_stock_on_order_confirmation?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_partial_stock_reservation?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_backorder_without_stock?: boolean;

  @IsBoolean()
  @IsOptional()
  prompt_order_assignee_on_confirmation?: boolean;

  @IsBoolean()
  @IsOptional()
  require_order_assignee_on_confirmation?: boolean;

  @IsUUID()
  @IsOptional()
  default_order_assignee_id?: string | null;

  @IsUUID()
  @IsOptional()
  default_order_auditor_id?: string | null;
}
