/**
 * Seed SQL — Módulo central con TODOS los datos seed
 *
 * Usado por:
 * - companies.service.ts (al crear empresa)
 * - seed-all.ts (para tenants existentes)
 * - rbac.seed.ts (para tenants existentes)
 *
 * IMPORTANTE: Agregar aquí al agregar nuevos permisos, tipos de documento, impuestos, etc.
 */

import { Pool } from 'pg'

// ════════════════════════════════════════════════════════════════
// RBAC — PERMISOS
// ════════════════════════════════════════════════════════════════

export const RBAC_PERMISSIONS = [
  // ─── Access Control ────────────────────────────────────────
  { code: 'roles.read', description: 'Ver roles' },
  { code: 'roles.create', description: 'Crear roles' },
  { code: 'roles.update', description: 'Editar roles' },
  { code: 'roles.delete', description: 'Eliminar roles' },
  { code: 'roles.manage_permissions', description: 'Asignar permisos a roles' },
  { code: 'roles.test', description: 'Probar permisos de usuarios' },
  { code: 'permissions.read', description: 'Ver catálogo de permisos' },
  { code: 'users.read_roles', description: 'Ver roles de un usuario' },
  { code: 'users.assign_roles', description: 'Asignar roles a usuarios' },
  { code: 'users.read_permissions', description: 'Ver permisos efectivos de un usuario' },

  // ─── Master Data - Products ────────────────────────────────
  { code: 'products.read', description: 'Ver productos' },
  { code: 'products.create', description: 'Crear productos' },
  { code: 'products.update', description: 'Editar productos' },
  { code: 'products.delete', description: 'Eliminar productos' },

  // ─── ERP - Documents ──────────────────────────────────────
  { code: 'documents.read', description: 'Ver documentos' },
  { code: 'documents.create', description: 'Crear documentos' },
  { code: 'documents.update', description: 'Editar documentos' },
  { code: 'documents.delete', description: 'Eliminar documentos' },
  { code: 'documents.confirm', description: 'Confirmar documentos' },
  { code: 'documents.cancel', description: 'Cancelar documentos' },

  // ─── ERP - Currencies ─────────────────────────────────────
  { code: 'currencies.read', description: 'Ver monedas' },
  { code: 'currencies.create', description: 'Crear monedas' },
  { code: 'currencies.update', description: 'Editar monedas' },
  { code: 'currencies.delete', description: 'Eliminar monedas' },

  // ─── ERP - Taxes ──────────────────────────────────────────
  { code: 'taxes.read', description: 'Ver impuestos' },
  { code: 'taxes.create', description: 'Crear impuestos' },
  { code: 'taxes.update', description: 'Editar impuestos' },
  { code: 'taxes.delete', description: 'Eliminar impuestos' },

  // ─── ERP - Autorizaciones fiscales (CAI/CAE/CAEA) ─────────
  { code: 'fiscal-authorizations.read', description: 'Ver autorizaciones fiscales y alertas' },
  { code: 'fiscal-authorizations.create', description: 'Crear autorizaciones fiscales' },
  { code: 'fiscal-authorizations.update', description: 'Editar, renovar o anular autorizaciones fiscales' },
  { code: 'fiscal-authorizations.delete', description: 'Eliminar autorizaciones fiscales sin uso' },
  { code: 'fiscal-authorizations.configure-alerts', description: 'Configurar alertas y políticas de autorizaciones fiscales' },

  // ─── ERP - Accounts ───────────────────────────────────────
  { code: 'accounts.read', description: 'Ver cuentas contables' },
  { code: 'accounts.create', description: 'Crear cuentas contables' },
  { code: 'accounts.update', description: 'Editar cuentas contables' },
  { code: 'accounts.delete', description: 'Eliminar cuentas contables' },

  // ─── Inventory - Units ────────────────────────────────────
  { code: 'units.read', description: 'Ver unidades de medida' },
  { code: 'units.create', description: 'Crear unidades de medida' },
  { code: 'units.update', description: 'Editar unidades de medida' },
  { code: 'units.delete', description: 'Eliminar unidades de medida' },

  // ─── Inventory - Categories ───────────────────────────────
  { code: 'categories.read', description: 'Ver categorías' },
  { code: 'categories.create', description: 'Crear categorías' },
  { code: 'categories.update', description: 'Editar categorías' },
  { code: 'categories.delete', description: 'Eliminar categorías' },

  // ─── Logística - Warehouses ───────────────────────────────
  { code: 'warehouses.read', description: 'Ver almacenes' },
  { code: 'warehouses.create', description: 'Crear almacenes' },
  { code: 'warehouses.update', description: 'Editar almacenes' },
  { code: 'warehouses.delete', description: 'Eliminar almacenes' },
  { code: 'stock.replenishment.read', description: 'Ver necesidades de reposición' },
  { code: 'stock.replenishment.configure', description: 'Configurar políticas de reposición' },
  { code: 'stock.replenishment.execute', description: 'Ejecutar sugerencias de reposición' },

  // ─── Logística - Trips ────────────────────────────────────
  { code: 'trips.read', description: 'Ver viajes' },
  { code: 'trips.create', description: 'Crear viajes' },
  { code: 'trips.update', description: 'Editar viajes' },
  { code: 'trips.delete', description: 'Eliminar viajes' },

  // ─── Core - Companies ─────────────────────────────────────
  { code: 'companies.read', description: 'Ver empresas' },
  { code: 'companies.create', description: 'Crear empresas' },
  { code: 'companies.update', description: 'Editar empresas' },
  { code: 'companies.delete', description: 'Eliminar empresas' },

  // ─── Treasury - Cash Boxes ────────────────────────────────
  { code: 'cash_boxes.read', description: 'Ver cajas' },
  { code: 'cash_boxes.create', description: 'Crear cajas' },
  { code: 'cash_boxes.update', description: 'Editar cajas' },
  { code: 'cash_boxes.delete', description: 'Eliminar cajas' },
  { code: 'cash_boxes.open', description: 'Abrir sesión de caja' },
  { code: 'cash_boxes.close', description: 'Cerrar sesión de caja' },
  { code: 'cash_boxes.force_close', description: 'Forzar cierre de sesión' },

  // ─── Treasury - Cash Box Movements ────────────────────────
  { code: 'cash_box_movements.read', description: 'Ver movimientos de caja' },
  { code: 'cash_box_movements.create', description: 'Crear movimientos de caja' },

  // ─── Treasury - Cash Box Renditions ───────────────────────
  { code: 'cash_box_renditions.read', description: 'Ver rendiciones de caja' },
  { code: 'cash_box_renditions.create', description: 'Crear rendiciones de caja' },
  { code: 'cash_box_renditions.approve', description: 'Aprobar rendiciones de caja' },
  { code: 'cash_box_renditions.reject', description: 'Rechazar rendiciones de caja' },
  { code: 'cash_box_renditions.delete', description: 'Eliminar rendiciones de caja' },

  // ─── Treasury - Cash Box Transfers ────────────────────────
  { code: 'cash_box_transfers.read', description: 'Ver transferencias entre cajas' },
  { code: 'cash_box_transfers.create', description: 'Crear transferencias entre cajas' },
  { code: 'cash_box_transfers.confirm', description: 'Confirmar transferencias entre cajas' },
  { code: 'cash_box_transfers.cancel', description: 'Cancelar transferencias entre cajas' },
  { code: 'cash_box_transfers.delete', description: 'Eliminar transferencias entre cajas' },

  // ─── Treasury - Bank Accounts ─────────────────────────────
  { code: 'bank_accounts.read', description: 'Ver cuentas bancarias' },
  { code: 'bank_accounts.create', description: 'Crear cuentas bancarias' },
  { code: 'bank_accounts.update', description: 'Editar cuentas bancarias' },
  { code: 'bank_accounts.delete', description: 'Eliminar cuentas bancarias' },

  // ─── Treasury - Bank Concepts & Movements ─────────────────
  { code: 'bank_concepts.read', description: 'Ver conceptos bancarios' },
  { code: 'bank_concepts.manage', description: 'Administrar conceptos bancarios' },
  { code: 'bank_movements.create', description: 'Registrar movimientos bancarios' },
  { code: 'bank_movements.cancel', description: 'Anular movimientos bancarios' },
  { code: 'bank_expenses.read', description: 'Ver reporte de gastos bancarios' },
  { code: 'bank_expenses.export', description: 'Exportar reporte de gastos bancarios' },
  { code: 'financial_investments.read', description: 'Ver inversiones financieras' },
  { code: 'financial_investments.create', description: 'Constituir inversiones financieras' },
  { code: 'financial_investments.update', description: 'Actualizar valuaciones de inversiones' },
  { code: 'financial_investments.settle', description: 'Rescatar, liquidar o renovar inversiones' },

  // ─── Treasury - Payments ──────────────────────────────────
  { code: 'payments.read', description: 'Ver pagos' },
  { code: 'payments.create', description: 'Crear pagos' },
  { code: 'payments.update', description: 'Editar pagos' },
  { code: 'payments.delete', description: 'Eliminar pagos' },
  { code: 'payments.confirm', description: 'Confirmar pagos' },
  { code: 'payments.reverse', description: 'Anular pagos' },
  { code: 'payments.reject', description: 'Rechazar pagos' },
  { code: 'payments.mark_as_paid', description: 'Marcar pagos como pagados' },

  // ─── Treasury - Credit cards and settlements ─────────────
  { code: 'credit_cards.company.read', description: 'Ver tarjetas corporativas y sus consumos' },
  { code: 'credit_cards.company.create', description: 'Crear tarjetas corporativas' },
  { code: 'credit_cards.company.update', description: 'Editar tarjetas corporativas' },
  { code: 'credit_cards.company.use', description: 'Utilizar tarjetas corporativas en pagos' },
  { code: 'credit_cards.company.reverse', description: 'Anular consumos de tarjetas corporativas' },
  { code: 'credit_cards.company.pay_statement', description: 'Pagar cuotas y resúmenes de tarjetas corporativas' },
  { code: 'card_collections.read', description: 'Ver cobros realizados con tarjeta' },
  { code: 'card_collections.create', description: 'Registrar cobros con tarjeta' },
  { code: 'card_collections.confirm', description: 'Confirmar cobros con tarjeta' },
  { code: 'card_collections.reverse', description: 'Anular cobros con tarjeta' },
  { code: 'card_settlements.read', description: 'Ver liquidaciones de tarjetas' },
  { code: 'card_settlements.confirm', description: 'Registrar acreditaciones de tarjetas' },
  { code: 'card_settlements.reconcile', description: 'Conciliar liquidaciones de tarjetas' },
  { code: 'card_settlements.reverse', description: 'Revertir liquidaciones de tarjetas' },
  { code: 'card_settings.read', description: 'Ver configuración de tarjetas y canales' },
  { code: 'card_settings.manage', description: 'Administrar tarjetas, adquirentes y canales de cobro' },
  { code: 'card_reports.read', description: 'Ver reportes de tarjetas' },
  { code: 'card_reports.sales', description: 'Ver reporte de cobros con tarjeta' },
  { code: 'card_reports.settlements', description: 'Ver reporte de liquidaciones de tarjeta' },
  { code: 'card_reports.corporate_cards', description: 'Ver reporte de tarjetas corporativas' },
  { code: 'card_reports.cash_flow', description: 'Ver proyección financiera de tarjetas' },
  { code: 'card_reports.export', description: 'Exportar reportes de tarjetas' },

  // ─── Capturas de comprobantes ───────────────────────────────
  { code: 'intake.read', description: 'Ver menú y bandeja de capturas' },
  { code: 'intake.create', description: 'Crear capturas en borrador' },
  { code: 'intake.upload', description: 'Adjuntar imágenes o PDF a capturas' },
  { code: 'intake.send', description: 'Enviar capturas a otro usuario' },
  { code: 'intake.delete', description: 'Eliminar capturas propias en borrador' },
  { code: 'intake.process', description: 'Procesar capturas asignadas' },

  // ─── ERP - Currency Rates ─────────────────────────────────
  { code: 'currency_rates.read', description: 'Ver tipos de cambio' },
  { code: 'currency_rates.create', description: 'Crear tipos de cambio' },
  { code: 'currency_rates.update', description: 'Editar tipos de cambio' },
  { code: 'currency_rates.delete', description: 'Eliminar tipos de cambio' },

  // ─── ERP - Document Types ─────────────────────────────────
  { code: 'document_types.read', description: 'Ver tipos de documento' },
  { code: 'document_types.create', description: 'Crear tipos de documento' },
  { code: 'document_types.update', description: 'Editar tipos de documento' },
  { code: 'document_types.delete', description: 'Eliminar tipos de documento' },

  // ─── ERP - Sales ──────────────────────────────────────────
  { code: 'sales.read', description: 'Ver ventas' },
  { code: 'sales.create', description: 'Crear ventas' },
  { code: 'sales.update', description: 'Editar ventas' },
  { code: 'sales.delete', description: 'Eliminar ventas' },
  { code: 'sales.confirm', description: 'Confirmar ventas' },
  { code: 'sales.cancel', description: 'Cancelar ventas' },

  // ─── ERP - Purchases ──────────────────────────────────────
  { code: 'purchases.read', description: 'Ver compras' },
  { code: 'purchases.create', description: 'Crear compras' },
  { code: 'purchases.update', description: 'Editar compras' },
  { code: 'purchases.delete', description: 'Eliminar compras' },
  { code: 'purchases.confirm', description: 'Confirmar compras' },
  { code: 'purchases.cancel', description: 'Cancelar compras' },

  // ─── Documentos por circuito y categoría ────────────────
  ...(['sales', 'purchases'] as const).flatMap((scope) =>
    ([
      ['quotes', 'presupuestos'],
      ['orders', scope === 'sales' ? 'órdenes de venta' : 'órdenes de compra'],
      ['invoices', 'facturas'],
      ['delivery_notes', 'remitos'],
      ['credit_notes', 'notas de crédito'],
      ['debit_notes', 'notas de débito'],
      ['receipts', 'recibos'],
      ['opening_balances', 'saldos iniciales'],
    ] as const).flatMap(([category, label]) =>
      ([
        ['read', 'Ver'],
        ['create', 'Crear'],
        ['update', 'Editar'],
        ['confirm', 'Confirmar'],
        ['cancel', 'Anular'],
        ['delete', 'Eliminar'],
      ] as const).map(([action, verb]) => ({
        code: `${scope}.${category}.${action}`,
        description: `${verb} ${label} de ${scope === 'sales' ? 'ventas' : 'compras'}`,
      })),
    ),
  ),

  // ─── Master Data - Business Parties ────────────────────────
  { code: 'business_parties.read', description: 'Ver terceros' },
  { code: 'business_parties.create', description: 'Crear terceros' },
  { code: 'business_parties.update', description: 'Editar terceros' },
  { code: 'business_parties.delete', description: 'Eliminar terceros' },

  // ─── Master Data - Contacts ───────────────────────────────
  { code: 'contacts.read', description: 'Ver contactos' },
  { code: 'contacts.create', description: 'Crear contactos' },
  { code: 'contacts.update', description: 'Editar contactos' },
  { code: 'contacts.delete', description: 'Eliminar contactos' },

  // ─── Master Data - Locations ──────────────────────────────
  { code: 'locations.read', description: 'Ver ubicaciones' },
  { code: 'locations.create', description: 'Crear ubicaciones' },
  { code: 'locations.update', description: 'Editar ubicaciones' },
  { code: 'locations.delete', description: 'Eliminar ubicaciones' },

  // ─── Master Data - Product Variants ────────────────────────
  { code: 'product_variants.read', description: 'Ver variantes de producto' },
  { code: 'product_variants.create', description: 'Crear variantes de producto' },
  { code: 'product_variants.update', description: 'Editar variantes de producto' },
  { code: 'product_variants.delete', description: 'Eliminar variantes de producto' },

  // ─── Master Data - Product Components ──────────────────────
  { code: 'product_components.read', description: 'Ver componentes de producto' },
  { code: 'product_components.create', description: 'Crear componentes de producto' },
  { code: 'product_components.update', description: 'Editar componentes de producto' },
  { code: 'product_components.delete', description: 'Eliminar componentes de producto' },

  // ─── Master Data - Product Attributes ──────────────────────
  { code: 'attributes.read', description: 'Ver atributos' },
  { code: 'attributes.create', description: 'Crear atributos' },
  { code: 'attributes.update', description: 'Editar atributos' },
  { code: 'attributes.delete', description: 'Eliminar atributos' },

  // ─── Master Data - Product Attribute Values ────────────────
  { code: 'product_attribute_values.read', description: 'Ver valores de atributo' },
  { code: 'product_attribute_values.create', description: 'Crear valores de atributo' },
  { code: 'product_attribute_values.update', description: 'Editar valores de atributo' },
  { code: 'product_attribute_values.delete', description: 'Eliminar valores de atributo' },

  // ─── Master Data - Product Categories ──────────────────────
  { code: 'product_categories.read', description: 'Ver categorías de producto' },
  { code: 'product_categories.create', description: 'Asignar categorías a producto' },
  { code: 'product_categories.delete', description: 'Quitar categorías de producto' },

  // ─── Master Data - Product Tags ────────────────────────────
  { code: 'tags.read', description: 'Ver etiquetas' },
  { code: 'tags.create', description: 'Crear etiquetas' },
  { code: 'tags.update', description: 'Editar etiquetas' },
  { code: 'tags.delete', description: 'Eliminar etiquetas' },
  { code: 'product_tags.read', description: 'Ver etiquetas de producto' },
  { code: 'product_tags.create', description: 'Asignar etiquetas a producto' },
  { code: 'product_tags.delete', description: 'Quitar etiquetas de producto' },

  // ─── Engineering ──────────────────────────────────────────
  { code: 'engineering.read', description: 'Ver estructura de producto' },
  { code: 'engineering.create', description: 'Crear componentes de ingeniería' },
  { code: 'engineering.update', description: 'Editar estructura de producto' },
  { code: 'engineering.delete', description: 'Eliminar componentes de ingeniería' },

  // ─── Cost Templates ───────────────────────────────────────
  { code: 'cost_templates.read', description: 'Ver plantillas de costo' },
  { code: 'cost_templates.create', description: 'Crear plantillas de costo' },
  { code: 'cost_templates.update', description: 'Editar plantillas de costo' },
  { code: 'cost_templates.delete', description: 'Eliminar plantillas de costo' },

  // ─── Cost Components ──────────────────────────────────────
  { code: 'cost_components.read', description: 'Ver componentes de costo' },
  { code: 'cost_components.create', description: 'Crear componentes de costo' },
  { code: 'cost_components.update', description: 'Editar componentes de costo' },
  { code: 'cost_components.delete', description: 'Eliminar componentes de costo' },

  // ─── Document Sequences ───────────────────────────────────
  { code: 'document_sequences.read', description: 'Ver secuencias de documento' },
  { code: 'document_sequences.create', description: 'Crear secuencias de documento' },

  // ─── Logística - Drivers ──────────────────────────────────
  { code: 'drivers.read', description: 'Ver choferes' },
  { code: 'drivers.create', description: 'Crear choferes' },
  { code: 'drivers.update', description: 'Editar choferes' },
  { code: 'drivers.delete', description: 'Eliminar choferes' },

  // ─── Logística - Vehicles ─────────────────────────────────
  { code: 'vehicles.read', description: 'Ver vehículos' },
  { code: 'vehicles.create', description: 'Crear vehículos' },
  { code: 'vehicles.update', description: 'Editar vehículos' },
  { code: 'vehicles.delete', description: 'Eliminar vehículos' },

  // ─── Logística - Vehicle Combinations ──────────────────────
  { code: 'vehicle_combinations.read', description: 'Ver combinaciones de vehículo' },
  { code: 'vehicle_combinations.create', description: 'Crear combinaciones de vehículo' },
  { code: 'vehicle_combinations.update', description: 'Editar combinaciones de vehículo' },
  { code: 'vehicle_combinations.delete', description: 'Eliminar combinaciones de vehículo' },

  // ─── Logística - Corridors ─────────────────────────────────
  { code: 'corridors.read', description: 'Ver corredores' },
  { code: 'corridors.create', description: 'Crear corredores' },
  { code: 'corridors.update', description: 'Editar corredores' },
  { code: 'corridors.delete', description: 'Eliminar corredores' },

  // ─── Logística - Transfer Rates ────────────────────────────
  { code: 'transfer_rates.read', description: 'Ver tarifas de transferencia' },
  { code: 'transfer_rates.create', description: 'Crear tarifas de transferencia' },
  { code: 'transfer_rates.update', description: 'Editar tarifas de transferencia' },
  { code: 'transfer_rates.delete', description: 'Eliminar tarifas de transferencia' },

  // ─── Logística - Dispatch Orders ──────────────────────────
  { code: 'dispatch_orders.read', description: 'Ver órdenes de despacho' },
  { code: 'dispatch_orders.create', description: 'Crear órdenes de despacho' },
  { code: 'dispatch_orders.update', description: 'Editar órdenes de despacho' },
  { code: 'dispatch_orders.delete', description: 'Eliminar órdenes de despacho' },

  // ─── Logística - Delivery Notes ───────────────────────────
  { code: 'delivery_notes.read', description: 'Ver notas de entrega' },
  { code: 'delivery_notes.create', description: 'Crear notas de entrega' },
  { code: 'delivery_notes.update', description: 'Editar notas de entrega' },
  { code: 'delivery_notes.confirm', description: 'Confirmar notas de entrega' },
  { code: 'delivery_notes.delete', description: 'Eliminar notas de entrega' },

  // ─── Logística - Transport Document Types ──────────────────
  { code: 'transport_document_types.read', description: 'Ver tipos de documento de transporte' },
  { code: 'transport_document_types.create', description: 'Crear tipos de documento de transporte' },
  { code: 'transport_document_types.update', description: 'Editar tipos de documento de transporte' },
  { code: 'transport_document_types.delete', description: 'Eliminar tipos de documento de transporte' },

  // ─── Warehouse - Pallets ──────────────────────────────────
  { code: 'pallets.read', description: 'Ver pallets' },
  { code: 'pallets.create', description: 'Crear pallets' },
  { code: 'pallets.update', description: 'Editar pallets' },
  { code: 'pallets.delete', description: 'Eliminar pallets' },

  // ─── Warehouse - Picking ──────────────────────────────────
  { code: 'picking.read', description: 'Ver picking' },
  { code: 'picking.create', description: 'Crear órdenes de picking' },
  { code: 'picking.execute', description: 'Ejecutar picking' },
  { code: 'picking.transfer', description: 'Transferir pallets' },

  // ─── Warehouse - Stock ────────────────────────────────────
  { code: 'stock.read', description: 'Ver stock' },
  { code: 'stock.movements', description: 'Ver movimientos de stock' },
  { code: 'stock.create', description: 'Crear movimientos de stock' },

  // ─── Fabricación ──────────────────────────────────────────
  { code: 'production.read', description: 'Acceder a fabricación y consultar materiales' },
  { code: 'production.execute', description: 'Registrar fabricaciones y movimientos de materiales' },
  { code: 'production.history', description: 'Ver el historial de fabricación' },
  { code: 'production.manage_bom', description: 'Configurar BOM e ingeniería de productos' },
  { code: 'production.view_costs', description: 'Ver costos de fabricación' },

  // ─── Media ────────────────────────────────────────────────
  { code: 'media.read', description: 'Ver archivos' },
  { code: 'media.upload', description: 'Subir archivos' },

  // ─── Trash ────────────────────────────────────────────────
  { code: 'trash.read', description: 'Ver papelera' },
  { code: 'trash.restore', description: 'Restaurar elementos' },
  { code: 'trash.delete', description: 'Eliminar permanentemente' },

  // ─── Data Import ──────────────────────────────────────────
  { code: 'data_import.execute', description: 'Ejecutar importaciones' },
  { code: 'products.import', description: 'Importar productos' },
  { code: 'products.export', description: 'Exportar productos' },
  { code: 'business_parties.import', description: 'Importar clientes y proveedores' },
  { code: 'business_parties.export', description: 'Exportar clientes y proveedores' },
  { code: 'sales.documents.import', description: 'Importar documentos de venta' },
  { code: 'sales.documents.export', description: 'Exportar documentos de venta' },
  { code: 'purchases.documents.import', description: 'Importar documentos de compra' },
  { code: 'purchases.documents.export', description: 'Exportar documentos de compra' },
  { code: 'accounts.import', description: 'Importar plan de cuentas' },
  { code: 'accounts.export', description: 'Exportar plan de cuentas' },
  { code: 'treasury.payments.import', description: 'Importar pagos y cobros' },
  { code: 'treasury.payments.export', description: 'Exportar pagos y cobros' },
  { code: 'sales.reports.export', description: 'Exportar reportes de ventas' },
  { code: 'purchases.reports.export', description: 'Exportar reportes de compras' },
  { code: 'treasury.reports.export', description: 'Exportar reportes de tesorería' },
  { code: 'logistics.reports.export', description: 'Exportar reportes logísticos' },

  // ─── ERP - HR (Employees, Partners, Vales) ───────────────
  { code: 'employees.read', description: 'Ver empleados' },
  { code: 'employees.create', description: 'Crear empleados' },
  { code: 'employees.update', description: 'Editar empleados' },
  { code: 'employees.delete', description: 'Eliminar empleados' },
  { code: 'partners.read', description: 'Ver socios' },
  { code: 'partners.create', description: 'Crear socios' },
  { code: 'partners.update', description: 'Editar socios' },
  { code: 'partners.delete', description: 'Eliminar socios' },
  { code: 'vales.read', description: 'Ver vales' },
  { code: 'vales.create', description: 'Crear vales' },
  { code: 'vales.update', description: 'Editar vales' },
  { code: 'vales.delete', description: 'Eliminar vales' },
  { code: 'vales.approve', description: 'Aprobar vales' },
  { code: 'vales.reject', description: 'Rechazar vales' },

  // ─── ERP - Checks ─────────────────────────────────────────
  { code: 'checks.read', description: 'Ver cheques' },
  { code: 'checks.create', description: 'Crear cheques' },
  { code: 'checks.update', description: 'Editar cheques' },
  { code: 'checks.delete', description: 'Eliminar cheques' },
  { code: 'checks.deposit', description: 'Depositar cheques' },
  { code: 'checks.endorse', description: 'Endosar cheques' },
  { code: 'checks.reject', description: 'Rechazar cheques' },

  // ─── International Operations ─────────────────────────────
  { code: 'international_operations.read', description: 'Ver operaciones internacionales' },
  { code: 'international_operations.create', description: 'Crear operaciones internacionales' },
  { code: 'international_operations.update', description: 'Editar operaciones internacionales' },
  { code: 'international_operations.delete', description: 'Eliminar operaciones internacionales' },
]

// ════════════════════════════════════════════════════════════════
// RBAC — ROLES
// ════════════════════════════════════════════════════════════════

export const RBAC_ROLES = [
  {
    code: 'admin',
    name: 'Administrador',
    description: 'Acceso total al sistema',
    is_system: true,
    permissionCodes: RBAC_PERMISSIONS.map((p) => p.code),
  },
  {
    code: 'manager',
    name: 'Gerente',
    description: 'Acceso a módulos de negocio sin administración de roles',
    is_system: true,
    permissionCodes: RBAC_PERMISSIONS
      .filter((p) => !p.code.startsWith('roles.') && !p.code.startsWith('users.') && !p.code.startsWith('permissions.'))
      .map((p) => p.code),
  },
  {
    code: 'user',
    name: 'Usuario',
    description: 'Lectura y escritura básica',
    is_system: true,
    permissionCodes: [
      'products.read', 'products.create', 'products.update',
      'documents.read', 'documents.create', 'documents.update',
      'sales.read', 'sales.create', 'sales.update',
      'purchases.read', 'purchases.create', 'purchases.update',
      'currencies.read', 'taxes.read', 'accounts.read',
      'units.read', 'units.create', 'units.update',
      'categories.read', 'categories.create', 'categories.update',
      'warehouses.read', 'trips.read', 'companies.read',
      'cash_boxes.read', 'cash_boxes.open', 'cash_boxes.close',
      'cash_box_movements.read', 'cash_box_renditions.read', 'cash_box_transfers.read',
      'bank_accounts.read', 'payments.read', 'payments.create', 'payments.update',
      'bank_concepts.read', 'bank_movements.create', 'bank_expenses.read',
      'financial_investments.read',
      'intake.read', 'intake.create', 'intake.upload', 'intake.send', 'intake.delete', 'intake.process',
      'business_parties.read', 'contacts.read', 'locations.read',
      'product_variants.read', 'product_components.read',
      'attributes.read', 'tags.read',
      'drivers.read', 'vehicles.read', 'vehicle_combinations.read',
      'international_operations.read', 'international_operations.create', 'international_operations.update',
    ],
  },
  {
    code: 'viewer',
    name: 'Observador',
    description: 'Solo lectura',
    is_system: true,
    permissionCodes: RBAC_PERMISSIONS.filter((p) => p.code.endsWith('.read')).map((p) => p.code),
  },
  {
    code: 'capturist',
    name: 'Capturista',
    description: 'Carga y envía imágenes o PDF sin acceso al resto de Tesorería',
    is_system: true,
    permissionCodes: ['intake.read', 'intake.create', 'intake.upload', 'intake.send', 'intake.delete'],
  },
]

// ════════════════════════════════════════════════════════════════
// SQL — UNIDADES DE MEDIDA
// ════════════════════════════════════════════════════════════════

export const SQL_UNITS = `
WITH defaults(name, symbol, unit_type) AS (
  VALUES
    ('Unidad', 'u', 'UNIT'::tenant."UnitType"),
    ('Pieza', 'pza', 'UNIT'::tenant."UnitType"),
    ('Barra', 'barra', 'UNIT'::tenant."UnitType"),
    ('Rollo', 'rollo', 'UNIT'::tenant."UnitType"),
    ('Caja', 'caja', 'UNIT'::tenant."UnitType"),
    ('Metro', 'm', 'LENGTH'::tenant."UnitType"),
    ('Centímetro', 'cm', 'LENGTH'::tenant."UnitType"),
    ('Milímetro', 'mm', 'LENGTH'::tenant."UnitType"),
    ('Kilómetro', 'km', 'LENGTH'::tenant."UnitType"),
    ('Kilogramo', 'kg', 'WEIGHT'::tenant."UnitType"),
    ('Gramo', 'g', 'WEIGHT'::tenant."UnitType"),
    ('Tonelada', 't', 'WEIGHT'::tenant."UnitType"),
    ('Litro', 'l', 'VOLUME'::tenant."UnitType"),
    ('Mililitro', 'ml', 'VOLUME'::tenant."UnitType"),
    ('Metro cúbico', 'm³', 'VOLUME'::tenant."UnitType"),
    ('Metro cuadrado', 'm²', 'AREA'::tenant."UnitType"),
    ('Centímetro cuadrado', 'cm²', 'AREA'::tenant."UnitType")
)
INSERT INTO tenant.units (id, name, symbol, unit_type, active)
SELECT gen_random_uuid(), d.name, d.symbol, d.unit_type, true
FROM defaults d
WHERE NOT EXISTS (
  SELECT 1
  FROM tenant.units u
  WHERE lower(u.name) = lower(d.name)
     OR lower(u.symbol) = lower(d.symbol)
);
`

// ════════════════════════════════════════════════════════════════
// SQL — IMPUESTOS
// ════════════════════════════════════════════════════════════════

export const SQL_TAXES = `
-- Impuestos IVA
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'IVA_21', 'IVA 21%', 'IVA', 21.000, true, true, 'line'),
  (gen_random_uuid(), 'IVA_105', 'IVA 10.5%', 'IVA', 10.500, true, true, 'line'),
  (gen_random_uuid(), 'IVA_27', 'IVA 27%', 'IVA', 27.000, true, true, 'line'),
  (gen_random_uuid(), 'IVA_0', 'IVA 0%', 'IVA', 0.000, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA1', 'IVA 21% (Importación)', 'IVA', 21.000, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA2', 'IVA 10.5% (Importación)', 'IVA', 10.500, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA3', 'IVA 27% (Importación)', 'IVA', 27.000, true, true, 'line')
ON CONFLICT DO NOTHING;

-- Percepciones
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'PERC_IIBB', 'Percepción IIBB', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_IVA', 'Percepción IVA', 'PERCEPCION', 3.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_GANANCIAS', 'Percepción Ganancias', 'PERCEPCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_SUSS', 'Percepción SUSS', 'PERCEPCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_IIBB', 'Percepción IIBB (Compra)', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_MUN', 'Percepción Municipal (Compra)', 'PERCEPCION', 2.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_IVA', 'Percepción IVA (Compra)', 'PERCEPCION', 3.000, true, true, 'DOCUMENT')
ON CONFLICT DO NOTHING;

-- Retenciones
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'RET_IVA', 'Retención IVA', 'RETENCION', 3.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_IIBB', 'Retención IIBB', 'RETENCION', 2.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_GANANCIAS', 'Retención Ganancias', 'RETENCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_SUSS', 'Retención SUSS', 'RETENCION', 1.000, true, true, 'DOCUMENT')
ON CONFLICT DO NOTHING;

-- Impuestos Internos
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'IIII', 'Impuestos Internos', 'IMPUESTO_INTERNO', 10.000, true, true, 'line')
ON CONFLICT DO NOTHING;
`

// ════════════════════════════════════════════════════════════════
// SQL — CATEGORÍAS FISCALES
// ════════════════════════════════════════════════════════════════

export const SQL_TAX_CATEGORIES = `
INSERT INTO tenant.tax_categories (id, code, name, description, active)
VALUES
  (gen_random_uuid(), 'GRAV_21', 'Gravado 21%', 'IVA al 21%', true),
  (gen_random_uuid(), 'GRAV_105', 'Gravado 10.5%', 'IVA al 10.5%', true),
  (gen_random_uuid(), 'GRAV_27', 'Gravado 27%', 'IVA al 27%', true),
  (gen_random_uuid(), 'EXENTO', 'Exento', 'Sin IVA', true),
  (gen_random_uuid(), 'NO_GRAV', 'No Gravado', 'No gravado, no genera credito fiscal', true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, active = true;
`

// ════════════════════════════════════════════════════════════════
// SQL — ASOCIACIONES CATEGORÍA ↔ IMPUESTO
// ════════════════════════════════════════════════════════════════

export const SQL_TAX_CATEGORY_TAXES = `
INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT gen_random_uuid(), tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_21' AND t.rate = 21.000
WHERE tc.code = 'GRAV_21'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT gen_random_uuid(), tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_105' AND t.rate = 10.500
WHERE tc.code = 'GRAV_105'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT gen_random_uuid(), tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_27' AND t.rate = 27.000
WHERE tc.code = 'GRAV_27'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;
`

// ════════════════════════════════════════════════════════════════
// SQL — CATEGORÍA FISCAL POR DEFECTO PARA PRODUCTOS
// ════════════════════════════════════════════════════════════════

export const SQL_PRODUCT_TAX_CATEGORY = `
UPDATE tenant.products
SET tax_category_id = (
  SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_21' LIMIT 1
)
WHERE tax_category_id IS NULL;
`

// ════════════════════════════════════════════════════════════════
// SQL — TIPOS DE DOCUMENTO
// ════════════════════════════════════════════════════════════════

export const SQL_DOCUMENT_TYPES = `
-- Facturas de venta
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'FA-A', 'Factura A - Responsable Inscripto', 1, 'INVOICE', 'A', '01', true, true, true, true, true, true, true),
  (gen_random_uuid(), 'FB-A', 'Factura B - Consumidor Final', 1, 'INVOICE', 'B', '06', true, true, true, true, true, true, true),
  (gen_random_uuid(), 'FC-A', 'Factura C - Exento', 1, 'INVOICE', 'C', '11', true, true, true, true, true, true, true),
  (gen_random_uuid(), 'FX-A', 'Factura X - Comprobante interno', 1, 'INVOICE', 'X', null, false, false, true, true, false, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code, requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic, affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting, affects_tax_book = EXCLUDED.affects_tax_book,
  affects_payment = EXCLUDED.affects_payment;

-- Notas de crédito venta
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'NCA', 'Nota de Crédito A', 1, 'CREDIT_NOTE', 'A', '128', true, true, true, true, true, false, true),
  (gen_random_uuid(), 'NCB', 'Nota de Crédito B', 1, 'CREDIT_NOTE', 'B', '132', true, true, true, true, true, false, true),
  (gen_random_uuid(), 'NCC-A', 'Nota de Crédito C (Venta)', 1, 'CREDIT_NOTE', 'C', '203', true, true, true, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Notas de débito venta
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'NDA', 'Nota de Débito A', 1, 'DEBIT_NOTE', 'A', '135', true, true, false, true, true, false, true),
  (gen_random_uuid(), 'NDB', 'Nota de Débito B', 1, 'DEBIT_NOTE', 'B', '139', true, true, false, true, true, false, true),
  (gen_random_uuid(), 'NDC-A', 'Nota de Débito C (Venta)', 1, 'DEBIT_NOTE', 'C', '213', true, true, false, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Facturas de compra
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'FA-C', 'Factura A Compra - Proveedor RI', -1, 'INVOICE', 'A', '01', false, false, true, true, true, true, true),
  (gen_random_uuid(), 'FB-C', 'Factura B Compra - Proveedor CF', -1, 'INVOICE', 'B', '06', false, false, true, true, true, true, true),
  (gen_random_uuid(), 'FC-C', 'Factura C Compra - Proveedor Exento', -1, 'INVOICE', 'C', '11', false, false, true, true, true, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Notas de compra
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'NCA-C', 'Nota de Crédito Compra A', -1, 'CREDIT_NOTE', 'A', '128', false, false, true, true, true, false, true),
  (gen_random_uuid(), 'NCB-C', 'Nota de Crédito B Compra', -1, 'CREDIT_NOTE', 'B', '132', false, false, true, true, true, false, true),
  (gen_random_uuid(), 'NCC-C', 'Nota de Crédito C Compra', -1, 'CREDIT_NOTE', 'C', '203', false, false, true, true, true, false, true),
  (gen_random_uuid(), 'NDA-C', 'Nota de Débito Compra A', -1, 'DEBIT_NOTE', 'A', '135', false, false, false, true, true, false, true),
  (gen_random_uuid(), 'NDB-C', 'Nota de Débito B Compra', -1, 'DEBIT_NOTE', 'B', '139', false, false, false, true, true, false, true),
  (gen_random_uuid(), 'NDC-C', 'Nota de Débito C Compra', -1, 'DEBIT_NOTE', 'C', '213', false, false, false, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Órdenes
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'OV', 'Orden de Venta', 1, 'ORDER', null, null, false, false, false, false, false, false, true),
  (gen_random_uuid(), 'OC', 'Orden de Compra', -1, 'ORDER', null, null, false, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Presupuestos
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'PRES', 'Presupuesto', 1, 'QUOTE', null, null, false, false, false, false, false, false, true),
  (gen_random_uuid(), 'PRE-C', 'Presupuesto de Compra', -1, 'QUOTE', null, null, false, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Recibos
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'REC', 'Recibo de Pago', 1, 'RECEIPT', null, null, false, false, false, true, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Remitos
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'REM-V', 'Remito de Venta', 1, 'REMITO', null, null, false, false, true, false, false, false, true),
  (gen_random_uuid(), 'REM-C', 'Remito de Compra', -1, 'REMITO', null, null, false, false, true, false, false, false, true),
  (gen_random_uuid(), 'REM-T', 'Remito de Traslado', 1, 'REMITO', null, null, false, false, true, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Saldos iniciales
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'SI-C', 'Saldo Inicial (Cliente)', 1, 'OPENING_BALANCE', null, null, false, false, false, true, false, true, true),
  (gen_random_uuid(), 'SI-P', 'Saldo Inicial (Proveedor)', -1, 'OPENING_BALANCE', null, null, false, false, false, true, false, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Vales RRHH
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'VALE', 'Recibo de Sueldo / Vale RRHH', -1, 'VALE', null, null, false, false, false, true, false, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Regla única de inventario: sólo los remitos realizan movimientos físicos.
UPDATE tenant.document_types
SET affects_stock = ((category = 'REMITO') IS TRUE)
WHERE deleted_at IS NULL;
`

// ════════════════════════════════════════════════════════════════
// SQL — DOCUMENT TYPES ↔ IMPUESTOS
// ════════════════════════════════════════════════════════════════

export const SQL_DOCUMENT_TYPE_TAXES = `
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('FA-A', 'FB-A', 'FC-A', 'FX-A')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('NCA', 'NCB')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('NDA', 'NDB')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('FA-C', 'FB-C', 'FC-C')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code = 'NCA-C'
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code = 'NDA-C'
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;
`

// ════════════════════════════════════════════════════════════════
// SQL — CONCEPTOS BANCARIOS
// ════════════════════════════════════════════════════════════════

export const SQL_BANK_CONCEPTS = `
INSERT INTO tenant.bank_concepts (
  id, code, name, description, concept_type, nature, accounting_account,
  calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage,
  affects_balance, requires_receipt, available_manual, available_payments, available_settlements, is_active
)
VALUES
  (gen_random_uuid(), 'COMISION', 'Comisión bancaria', 'Comisión por servicios bancarios', 'COMMISSION', 'DEBIT', '6201', true, 21.000, true, true, 0.800, true, false, true, true, true, true),
  (gen_random_uuid(), 'COMISION_DEP', 'Comisión por depósito', 'Comisión al depositar cheques o efectivo', 'COMMISSION', 'DEBIT', '6201', true, 21.000, true, true, 0.500, true, false, true, true, true, true),
  (gen_random_uuid(), 'COMISION_TRANSF', 'Comisión por transferencia', 'Comisión al transferir fondos', 'COMMISSION', 'DEBIT', '6201', true, 21.000, true, true, 0.500, true, false, true, true, true, true),
  (gen_random_uuid(), 'COMISION_MANT', 'Comisión por mantenimiento', 'Cargo fijo mensual de mantenimiento', 'COMMISSION', 'DEBIT', '6201', true, 21.000, true, true, NULL, true, false, true, true, true, true),
  (gen_random_uuid(), 'COMISION_CARD', 'Comisión de acreditación', 'Comisión por acreditación de tarjetas', 'COMMISSION', 'DEBIT', '6201', true, 21.000, true, true, NULL, true, false, true, false, true, true),
  (gen_random_uuid(), 'IMP_DEBITOS', 'Imp. Débitos y Créditos', 'Impuesto a los débitos y créditos bancarios', 'TAX', 'DEBIT', '6202', false, NULL, false, false, 0.600, true, false, true, true, true, true),
  (gen_random_uuid(), 'IMP_SELLOS', 'Imp. Sellos', 'Impuesto de sellos', 'TAX', 'DEBIT', '6202', false, NULL, false, false, 1.000, true, false, true, true, true, true),
  (gen_random_uuid(), 'IMP_CHEQUE', 'Imp. al Cheque', 'Impuesto a los cheques', 'TAX', 'DEBIT', '6202', false, NULL, false, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'GASTO_ADMIN', 'Gasto administrativo', 'Gastos varios de administración bancaria', 'EXPENSE', 'DEBIT', '6203', false, NULL, false, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'GASTO_COBRANZA', 'Gasto de cobranza', 'Gastos por cobranza de cheques', 'EXPENSE', 'DEBIT', '6203', false, NULL, false, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'INTERES_DESC', 'Interés por descubierto', 'Interés por descubierto bancario', 'INTEREST', 'DEBIT', '6204', false, NULL, false, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'INTERES_PUNT', 'Interés punitorio', 'Interés punitorio por mora', 'INTEREST', 'DEBIT', '6204', false, NULL, false, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'INTERES_CAP', 'Interés capitalizable', 'Interés que se capitaliza', 'INTEREST', 'DEBIT', '6204', false, NULL, false, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'RETENCION_BANCARIA', 'Retención bancaria', 'Retención sufrida aplicada por el banco', 'RETENTION', 'DEBIT', '6202', false, NULL, true, false, NULL, true, false, true, true, false, true),
  (gen_random_uuid(), 'AJUSTE_BCRA', 'Ajuste BCRA', 'Ajuste por resolución BCRA', 'ADJUSTMENT', 'DEBIT', '6205', false, NULL, false, false, NULL, true, false, true, false, false, true),
  (gen_random_uuid(), 'DIF_CAMBIO', 'Diferencia de cambio', 'Diferencia por tipo de cambio', 'ADJUSTMENT', 'DEBIT', '6205', false, NULL, false, false, NULL, true, false, true, false, false, true),
  (gen_random_uuid(), 'ACRED_NO_IDENT', 'Acreditación no identificada', 'Crédito bancario pendiente de identificar', 'OTHER', 'CREDIT', NULL, false, NULL, false, false, NULL, true, false, true, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  nature = EXCLUDED.nature,
  affects_balance = EXCLUDED.affects_balance,
  requires_receipt = EXCLUDED.requires_receipt,
  available_manual = EXCLUDED.available_manual,
  available_payments = EXCLUDED.available_payments,
  available_settlements = EXCLUDED.available_settlements;
`

// ════════════════════════════════════════════════════════════════
// SQL — SECUENCIAS DE DOCUMENTOS
// ════════════════════════════════════════════════════════════════

export const SQL_REPAIR_DOCUMENT_SEQUENCES = `
-- Incorporar asociaciones del campo legado antes de detectar series compartidas.
INSERT INTO document_type_sequences (id, document_type_id, sequence_id, is_default, created_at)
SELECT gen_random_uuid(), dt.id, dt.document_sequence_id, true, CURRENT_TIMESTAMP
FROM document_types dt
WHERE dt.document_sequence_id IS NOT NULL
  AND dt.deleted_at IS NULL
ON CONFLICT (document_type_id, sequence_id) DO NOTHING;

DROP TABLE IF EXISTS seed_sequence_split;
CREATE TEMP TABLE seed_sequence_split AS
WITH usage AS (
  SELECT
    dts.sequence_id,
    dts.document_type_id,
    dts.created_at,
    dts.id,
    COUNT(d.id) AS document_count
  FROM document_type_sequences dts
  LEFT JOIN documents d
    ON d.document_sequence_id = dts.sequence_id
   AND d.document_type_id = dts.document_type_id
  GROUP BY dts.sequence_id, dts.document_type_id, dts.created_at, dts.id
), ranked AS (
  SELECT
    usage.*,
    ROW_NUMBER() OVER (
      PARTITION BY usage.sequence_id
      ORDER BY usage.document_count DESC, usage.created_at, usage.id
    ) AS position,
    COUNT(*) OVER (PARTITION BY usage.sequence_id) AS linked_types
  FROM usage
)
SELECT
  sequence_id AS old_sequence_id,
  document_type_id,
  position,
  CASE WHEN position = 1 THEN sequence_id ELSE gen_random_uuid() END AS target_sequence_id
FROM ranked
WHERE linked_types > 1;

INSERT INTO document_sequences (
  id, name, automatic, range_start, range_end, point_of_sale, current_number,
  prefix, active, created_at, updated_at, created_by, updated_by
)
SELECT
  split.target_sequence_id,
  LEFT(source.name || ' · ' || dt.code, 50),
  source.automatic,
  source.range_start,
  source.range_end,
  source.point_of_sale,
  COALESCE(MAX(doc.number), GREATEST(COALESCE(source.range_start, 1), 1) - 1),
  source.prefix,
  source.active,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  source.created_by,
  source.updated_by
FROM seed_sequence_split split
JOIN document_sequences source ON source.id = split.old_sequence_id
JOIN document_types dt ON dt.id = split.document_type_id
LEFT JOIN documents doc
  ON doc.document_sequence_id = split.old_sequence_id
 AND doc.document_type_id = split.document_type_id
WHERE split.position > 1
GROUP BY split.target_sequence_id, source.id, dt.code;

UPDATE documents doc
SET document_sequence_id = split.target_sequence_id
FROM seed_sequence_split split
WHERE split.position > 1
  AND doc.document_sequence_id = split.old_sequence_id
  AND doc.document_type_id = split.document_type_id;

UPDATE fiscal_authorizations fiscal_auth
SET document_sequence_id = split.target_sequence_id
FROM seed_sequence_split split
WHERE split.position > 1
  AND fiscal_auth.document_sequence_id = split.old_sequence_id
  AND fiscal_auth.document_type_id = split.document_type_id;

UPDATE document_types dt
SET document_sequence_id = split.target_sequence_id
FROM seed_sequence_split split
WHERE split.position > 1
  AND dt.id = split.document_type_id
  AND dt.document_sequence_id = split.old_sequence_id;

DELETE FROM document_type_sequences relation
USING seed_sequence_split split
WHERE split.position > 1
  AND relation.sequence_id = split.old_sequence_id
  AND relation.document_type_id = split.document_type_id;

INSERT INTO document_type_sequences (id, document_type_id, sequence_id, is_default, created_at)
SELECT gen_random_uuid(), document_type_id, target_sequence_id, true, CURRENT_TIMESTAMP
FROM seed_sequence_split
WHERE position > 1
ON CONFLICT (document_type_id, sequence_id) DO UPDATE SET is_default = true;

-- Quitar únicamente copias vacías generadas por los seeds históricos cuando el
-- tipo ya posee otra serie. No se tocan series con documentos o autorizaciones.
DROP TABLE IF EXISTS seed_obsolete_sequence_links;
CREATE TEMP TABLE seed_obsolete_sequence_links AS
SELECT link.document_type_id, link.sequence_id
FROM document_type_sequences link
JOIN document_types dt ON dt.id = link.document_type_id
JOIN document_sequences sequence ON sequence.id = link.sequence_id
WHERE (
    sequence.name IN ('Ventas A', 'Ventas B', 'Ventas C', 'Compras A', 'Compras B', 'Compras C')
    OR sequence.name LIKE '% · ' || dt.code
  )
  AND NOT EXISTS (
    SELECT 1 FROM documents doc
    WHERE doc.document_type_id = link.document_type_id
      AND doc.document_sequence_id = link.sequence_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM fiscal_authorizations fiscal_auth
    WHERE fiscal_auth.document_type_id = link.document_type_id
      AND fiscal_auth.document_sequence_id = link.sequence_id
  )
  AND EXISTS (
    SELECT 1 FROM document_type_sequences alternative
    WHERE alternative.document_type_id = link.document_type_id
      AND alternative.sequence_id <> link.sequence_id
  );

UPDATE document_types dt
SET document_sequence_id = replacement.sequence_id
FROM seed_obsolete_sequence_links obsolete
CROSS JOIN LATERAL (
  SELECT alternative.sequence_id
  FROM document_type_sequences alternative
  LEFT JOIN documents doc
    ON doc.document_type_id = alternative.document_type_id
   AND doc.document_sequence_id = alternative.sequence_id
  WHERE alternative.document_type_id = obsolete.document_type_id
    AND alternative.sequence_id <> obsolete.sequence_id
  GROUP BY alternative.sequence_id, alternative.is_default, alternative.created_at
  ORDER BY COUNT(doc.id) DESC, alternative.is_default DESC, alternative.created_at
  LIMIT 1
) replacement
WHERE dt.id = obsolete.document_type_id
  AND dt.document_sequence_id = obsolete.sequence_id;

DELETE FROM document_type_sequences link
USING seed_obsolete_sequence_links obsolete
WHERE link.document_type_id = obsolete.document_type_id
  AND link.sequence_id = obsolete.sequence_id;

UPDATE document_sequences sequence
SET deleted_at = CURRENT_TIMESTAMP,
    active = false
WHERE EXISTS (
    SELECT 1 FROM seed_obsolete_sequence_links obsolete
    WHERE obsolete.sequence_id = sequence.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM document_type_sequences link
    WHERE link.sequence_id = sequence.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM documents doc
    WHERE doc.document_sequence_id = sequence.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM fiscal_authorizations fiscal_auth
    WHERE fiscal_auth.document_sequence_id = sequence.id
  );

DROP TABLE IF EXISTS seed_obsolete_sequence_links;

-- Nunca reutilizar números, incluso si el documento fue anulado o eliminado.
UPDATE document_sequences sequence
SET current_number = GREATEST(
  sequence.current_number,
  0,
  COALESCE((
    SELECT MAX(doc.number)
    FROM documents doc
    WHERE doc.document_sequence_id = sequence.id
  ), GREATEST(COALESCE(sequence.range_start, 1), 1) - 1)
)
WHERE sequence.deleted_at IS NULL;

DROP TABLE IF EXISTS seed_sequence_split;
`

export const SQL_DOCUMENT_SEQUENCES = `
INSERT INTO document_sequences (
  id, name, automatic, range_start, range_end, point_of_sale, current_number, prefix, active
)
SELECT gen_random_uuid(), seed.name, true, 1, 9999999, seed.point_of_sale, 0, seed.prefix, true
FROM (VALUES
  ('FA-A', 'Factura A Venta', '0001', 'FA'),
  ('FB-A', 'Factura B Venta', '0001', 'FB'),
  ('FC-A', 'Factura C Venta', '0001', 'FC'),
  ('FX-A', 'Factura X Venta', '0001', 'FX'),
  ('NCA', 'Nota de Crédito A Venta', '0001', 'NCA'),
  ('NCB', 'Nota de Crédito B Venta', '0001', 'NCB'),
  ('NCC-A', 'Nota de Crédito C Venta', '0001', 'NCC'),
  ('NDA', 'Nota de Débito A Venta', '0001', 'NDA'),
  ('NDB', 'Nota de Débito B Venta', '0001', 'NDB'),
  ('NDC-A', 'Nota de Débito C Venta', '0001', 'NDC'),
  ('FA-C', 'Factura A Compra', '0002', 'FA-C'),
  ('FB-C', 'Factura B Compra', '0002', 'FB-C'),
  ('FC-C', 'Factura C Compra', '0002', 'FC-C'),
  ('NCA-C', 'Nota de Crédito A Compra', '0002', 'NCA-C'),
  ('NCB-C', 'Nota de Crédito B Compra', '0002', 'NCB-C'),
  ('NCC-C', 'Nota de Crédito C Compra', '0002', 'NCC-C'),
  ('NDA-C', 'Nota de Débito A Compra', '0002', 'NDA-C'),
  ('NDB-C', 'Nota de Débito B Compra', '0002', 'NDB-C'),
  ('NDC-C', 'Nota de Débito C Compra', '0002', 'NDC-C'),
  ('OV', 'Órdenes de Venta', '0001', 'OV'),
  ('OC', 'Órdenes de Compra', '0002', 'OC'),
  ('PRES', 'Presupuestos', '0001', 'PRES'),
  ('PRE-C', 'Presupuestos de Compra', '0002', 'PRE-C'),
  ('REC', 'Recibos', '0001', 'REC'),
  ('REM-V', 'Remitos de Venta', '0001', 'REM-V'),
  ('REM-C', 'Remitos de Compra', '0002', 'REM-C'),
  ('REM-T', 'Remitos de Traslado', '0001', 'REM-T'),
  ('SI-C', 'Saldos Iniciales Clientes', '0001', 'SI-C'),
  ('SI-P', 'Saldos Iniciales Proveedores', '0002', 'SI-P'),
  ('VALE', 'Vales RRHH', '0003', 'VALE')
) AS seed(code, name, point_of_sale, prefix)
JOIN document_types dt ON dt.code = seed.code AND dt.deleted_at IS NULL
WHERE NOT EXISTS (
  SELECT 1 FROM document_type_sequences current_link
  WHERE current_link.document_type_id = dt.id
)
AND dt.document_sequence_id IS NULL
AND NOT EXISTS (
  SELECT 1 FROM document_sequences existing
  WHERE existing.name = seed.name AND existing.deleted_at IS NULL
);

INSERT INTO document_sequences (
  id, name, automatic, range_start, range_end, point_of_sale, current_number, prefix, active
)
SELECT gen_random_uuid(), seed.name, true, 1, 9999999, seed.point_of_sale, 0, seed.prefix, true
FROM (VALUES
  ('Operaciones Internacionales', '0003', 'IMP'),
  ('MAINTENANCE_ORDER', '0000', 'MO')
) AS seed(name, point_of_sale, prefix)
WHERE NOT EXISTS (
  SELECT 1 FROM document_sequences existing
  WHERE existing.name = seed.name AND existing.deleted_at IS NULL
);

UPDATE document_sequences
SET range_start = GREATEST(COALESCE(range_start, 1), 1),
    range_end = COALESCE(range_end, 9999999)
WHERE deleted_at IS NULL
;
`

// ════════════════════════════════════════════════════════════════
// SQL — VINCULACIÓN SECUIANCIAS ↔ TIPOS DE DOCUMENTO
// ════════════════════════════════════════════════════════════════

export const SQL_LINK_SEQUENCES = `
DROP TABLE IF EXISTS seed_document_sequence_defaults;
CREATE TEMP TABLE seed_document_sequence_defaults (code text, sequence_name text);
INSERT INTO seed_document_sequence_defaults (code, sequence_name) VALUES
  ('FA-A', 'Factura A Venta'), ('FB-A', 'Factura B Venta'),
  ('FC-A', 'Factura C Venta'), ('FX-A', 'Factura X Venta'),
  ('NCA', 'Nota de Crédito A Venta'), ('NCB', 'Nota de Crédito B Venta'),
  ('NCC-A', 'Nota de Crédito C Venta'), ('NDA', 'Nota de Débito A Venta'),
  ('NDB', 'Nota de Débito B Venta'), ('NDC-A', 'Nota de Débito C Venta'),
  ('FA-C', 'Factura A Compra'), ('FB-C', 'Factura B Compra'),
  ('FC-C', 'Factura C Compra'), ('NCA-C', 'Nota de Crédito A Compra'),
  ('NCB-C', 'Nota de Crédito B Compra'), ('NCC-C', 'Nota de Crédito C Compra'),
  ('NDA-C', 'Nota de Débito A Compra'), ('NDB-C', 'Nota de Débito B Compra'),
  ('NDC-C', 'Nota de Débito C Compra'), ('OV', 'Órdenes de Venta'),
  ('OC', 'Órdenes de Compra'), ('PRES', 'Presupuestos'),
  ('PRE-C', 'Presupuestos de Compra'), ('REC', 'Recibos'),
  ('REM-V', 'Remitos de Venta'), ('REM-C', 'Remitos de Compra'),
  ('REM-T', 'Remitos de Traslado'), ('SI-C', 'Saldos Iniciales Clientes'),
  ('SI-P', 'Saldos Iniciales Proveedores'), ('VALE', 'Vales RRHH');

-- Sólo completar tipos sin serie. Las configuraciones existentes se conservan.
UPDATE document_types dt
SET document_sequence_id = sequence.id
FROM seed_document_sequence_defaults defaults
JOIN document_sequences sequence
  ON sequence.name = defaults.sequence_name AND sequence.deleted_at IS NULL
WHERE dt.code = defaults.code
  AND dt.deleted_at IS NULL
  AND dt.document_sequence_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM document_type_sequences current_link
    WHERE current_link.document_type_id = dt.id
  );

INSERT INTO document_type_sequences (id, document_type_id, sequence_id, is_default, created_at)
SELECT gen_random_uuid(), doc_type.id, doc_type.document_sequence_id, true, CURRENT_TIMESTAMP
FROM document_types doc_type
WHERE doc_type.document_sequence_id IS NOT NULL
  AND doc_type.deleted_at IS NULL
ON CONFLICT (document_type_id, sequence_id) DO UPDATE SET is_default = true;

DROP TABLE IF EXISTS seed_document_sequence_defaults;
`

// ════════════════════════════════════════════════════════════════
// HELPER — Ejecutar SQL contra un tenant
// ════════════════════════════════════════════════════════════════

export async function executeSeedSql(connectionString: string, sql: string): Promise<void> {
  const pool = new Pool({
    connectionString,
    options: '-c search_path=tenant,public',
    max: 1,
  })
  try {
    await pool.query('BEGIN')
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .map(s => s.split('\n').filter(line => !line.trim().startsWith('--')).join('\n').trim())
      .filter(s => s.length > 0)

    for (const stmt of statements) {
      await pool.query(stmt)
    }
    await pool.query('COMMIT')
  } catch (error) {
    await pool.query('ROLLBACK')
    throw error
  } finally {
    await pool.end()
  }
}
