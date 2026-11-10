export type PlatformModuleRoute = {
  moduleCode: string;
  patterns: RegExp[];
};

// Las reglas más específicas deben ubicarse antes que las generales.
export const PLATFORM_MODULE_ROUTES: PlatformModuleRoute[] = [
  {
    moduleCode: 'CRM',
    patterns: [/^\/api\/erp\/tasks(?:\/|$)/],
  },
  {
    moduleCode: 'MAINTENANCE',
    patterns: [/^\/api\/logistica\/maintenance(?:\/|$)/],
  },
  {
    moduleCode: 'INTERNATIONAL_OPERATIONS',
    patterns: [/^\/api\/international-operations(?:\/|$)/],
  },
  {
    moduleCode: 'MCP',
    // El servidor y OAuth verifican además la empresa de la conexión dentro
    // del controlador, porque el contexto tenant nace después de validar el token MCP.
    patterns: [/^\/api\/mcp(?:\/|$)/],
  },
  {
    moduleCode: 'WHATSAPP',
    patterns: [
      /^\/api\/notifications\/whatsapp(?:\/|$)/,
      /^\/api\/erp\/whatsapp(?:\/|$)/,
    ],
  },
  {
    moduleCode: 'ARCA',
    patterns: [/^\/api\/erp\/arca(?:\/|$)/],
  },
  {
    moduleCode: 'TREASURY',
    patterns: [
      /^\/api\/erp\/(?:bank-accounts|bank-concepts|checks|credit-cards|current-accounts|financial-investments|payment-reports|payments|treasury)(?:\/|$)/,
      /^\/api\/logistica\/(?:cash-boxes|cash-box-movements|cash-box-renditions|cash-box-transfers)(?:\/|$)/,
    ],
  },
  {
    moduleCode: 'ACCOUNTING',
    patterns: [/^\/api\/accounts(?:\/|$)/],
  },
  {
    moduleCode: 'HR',
    patterns: [/^\/api\/(?:hr|erp\/employees|erp\/partners)(?:\/|$)/],
  },
  {
    moduleCode: 'REPORTS',
    patterns: [/^\/api\/(?:sales-reports|reportes)(?:\/|$)/, /^\/api\/erp\/reports(?:\/|$)/],
  },
  {
    moduleCode: 'PURCHASES',
    patterns: [/^\/api\/(?:purchases|documents\/purchases-documents)(?:\/|$)/],
  },
  {
    moduleCode: 'SALES',
    patterns: [/^\/api\/(?:documents\/sales|sales\/my-sales)(?:\/|$)/, /^\/api\/erp\/sales-flow(?:\/|$)/],
  },
  {
    moduleCode: 'LOGISTICS',
    patterns: [
      /^\/api\/(?:corridors|delivery-notes|dispatch-orders|transfer-rates|trips|transport)(?:\/|$)/,
      /^\/api\/logistica\/(?:document-types|picking|vehicles)(?:\/|$)/,
    ],
  },
  {
    moduleCode: 'INVENTORY',
    patterns: [/^\/api\/warehouse(?:\/|$)/, /^\/api\/warehouses(?:\/|$)/],
  },
  {
    moduleCode: 'MANUFACTURING',
    patterns: [/^\/api\/erp\/engineering(?:\/|$)/],
  },
  {
    moduleCode: 'MASTER_DATA',
    patterns: [
      /^\/api\/master-data(?:\/|$)/,
      /^\/api\/(?:products|business-parties|document-types|document-sequences|document-type-sequences|locations|attributes|categories|party-contacts|product-attribute-values|product-categories|product-components|units|tags|warehouses)(?:\/|$)/,
      /^\/api\/(?:attributes|categories|locations|party-contacts|product-attribute-values|product-categories|product-components)(?:\/|$)/,
      /^\/api\/erp\/pricing(?:\/|$)/,
      /^\/api\/erp\/(?:product-tags|product-variants|tags|units|variant-costs)(?:\/|$)/,
      /^\/api\/(?:cost-templates|products\/costing)(?:\/|$)/,
    ],
  },
];

export function resolvePlatformModuleForPath(path: string): string | null {
  const pathname = path.split('?')[0] ?? path;
  return (
    PLATFORM_MODULE_ROUTES.find((entry) => entry.patterns.some((pattern) => pattern.test(pathname)))?.moduleCode ?? null
  );
}
