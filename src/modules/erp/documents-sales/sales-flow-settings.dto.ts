import { IsBoolean, IsIn, IsNumber, Max, Min } from 'class-validator';

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
  auto_create_delivery_note!: boolean;

  @IsBoolean()
  allow_partial_delivery!: boolean;
}
