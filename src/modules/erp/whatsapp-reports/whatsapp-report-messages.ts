export type WhatsAppReportKind = 'consolidated' | 'inventory';

export interface WhatsAppReportPeriod {
  from: string;
  to: string;
}

export function createWhatsAppReportCaption(
  kind: WhatsAppReportKind,
  companyName: string,
  period: WhatsAppReportPeriod,
  isTest = false,
  companyCount = 1,
) {
  const reportName = kind === 'consolidated' ? 'reporte consolidado' : 'reporte de inventario y logística';
  const attachment = isTest ? `un PDF de prueba del ${reportName}` : `el ${reportName}`;
  const companyDescription = companyCount > 1 ? `las ${companyCount} empresas seleccionadas` : companyName;
  return `Hola 👋 Te dejo adjunto ${attachment} de ${companyDescription}, correspondiente a la semana del ${formatReportDate(period.from)} al ${formatReportDate(period.to)}. ¡Que tengas un buen día!`;
}

export function createWhatsAppTextTestMessage(companyName: string) {
  return `Hola 👋 Este es un mensaje de prueba de Asterisk Suite para ${companyName}. La conexión con este grupo quedó confirmada. ¡Que tengas un buen día!`;
}

function formatReportDate(value: string) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}
