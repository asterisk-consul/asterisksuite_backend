// src/modules/erp/purchases/dto/product-purchase-detail-response.dto.ts
import { SupplierDetailDto } from './supplier-detail.dto';
import { DocumentTypeDetailDto } from './document-type-detail.dto';
import { TaxDetailDto } from './tax-detail.dto';

export interface ProductPurchaseDetailResponseDto {
  productId: number;
  productCode: string;
  productName: string;
  productCategory: string;
  totalGeneral: number;
  totalTaxes: number;
  suppliers: SupplierDetailDto[];
  documentTypes: DocumentTypeDetailDto[];
  taxes: TaxDetailDto[];
}
