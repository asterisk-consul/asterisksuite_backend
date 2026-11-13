export const MANAGEMENT_REPORT_PERMISSIONS = [
  { code: 'management_reports.read', description: 'Ver todos los reportes (acceso general)' },
  { code: 'management_reports.management.read', description: 'Ver el resumen gerencial' },
  { code: 'management_reports.consolidated.read', description: 'Ver el reporte consolidado de empresas' },
  { code: 'management_reports.financial_results.read', description: 'Ver resultado y composición por empresa' },
  { code: 'management_reports.sales_products.read', description: 'Ver productos vendidos por empresa' },
  { code: 'management_reports.builder.read', description: 'Diseñar y ejecutar reportes personalizados' },
  { code: 'management_reports.customers.read', description: 'Ver el reporte de clientes' },
  { code: 'management_reports.suppliers.read', description: 'Ver el reporte de proveedores' },
  { code: 'management_reports.hr.read', description: 'Ver el reporte de empleados y socios' },
  { code: 'management_reports.treasury.read', description: 'Ver el reporte de bancos, cajas y cheques' },
  { code: 'management_reports.documents.read', description: 'Ver el reporte de documentos' },
  { code: 'management_reports.inventory.read', description: 'Ver el reporte de inventario y logística' },
] as const;
