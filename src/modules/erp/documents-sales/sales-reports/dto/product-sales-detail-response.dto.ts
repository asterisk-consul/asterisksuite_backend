// src/modules/erp/purchases/dto/product-purchase-detail-response.dto.ts
import { SupplierDetailDto } from './sales-supplier.dto';
import { DocumentTypeDetailDto } from './document-type-detail.dto';
import { TaxDetailDto } from './sales-taxdetail.dto';
import { SalesMovementResponseDto } from './sales-movement-response.dto';

export interface ProductSalesDetailResponseDto {
  productId: string;
  productCode: string;
  productName: string;
  productCategory: string;
  totalGeneral: number;
  totalTaxes: number;
  suppliers: SupplierDetailDto[];
  exempt_amount: number;
  documentTypes: DocumentTypeDetailDto[];
  taxes: TaxDetailDto[];
  movements: SalesMovementResponseDto[];
}
