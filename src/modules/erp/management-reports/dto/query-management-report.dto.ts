import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ManagementReportBasis {
  SALES_ORDER = 'SALES_ORDER',
  INVOICE = 'INVOICE',
  COLLECTION = 'COLLECTION',
}

export enum ManagementReportGroupBy {
  DAY = 'DAY',
  MONTH = 'MONTH',
  PARTY = 'PARTY',
  SELLER = 'SELLER',
  CURRENCY = 'CURRENCY',
}

export enum ManagementPaymentState {
  ALL = 'ALL',
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

export enum ManagementProgressState {
  ALL = 'ALL',
  NONE = 'NONE',
  PARTIAL = 'PARTIAL',
  COMPLETE = 'COMPLETE',
}

export class QueryManagementReportDto {
  @IsEnum(ManagementReportBasis)
  basis!: ManagementReportBasis;

  @IsDateString()
  date_from!: string;

  @IsDateString()
  date_to!: string;

  @IsEnum(ManagementReportGroupBy)
  @IsOptional()
  group_by: ManagementReportGroupBy = ManagementReportGroupBy.MONTH;

  @IsEnum(ManagementPaymentState)
  @IsOptional()
  payment_state: ManagementPaymentState = ManagementPaymentState.ALL;

  @IsString()
  @IsOptional()
  party_id?: string;

  @IsString()
  @IsOptional()
  seller_id?: string;

  @IsString()
  @IsOptional()
  product_id?: string;

  @IsString()
  @IsOptional()
  point_of_sale_id?: string;

  @IsString()
  @IsOptional()
  currency_code?: string;

  @IsEnum(ManagementProgressState)
  @IsOptional()
  invoicing_state: ManagementProgressState = ManagementProgressState.ALL;

  @IsEnum(ManagementProgressState)
  @IsOptional()
  delivery_state: ManagementProgressState = ManagementProgressState.ALL;
}
