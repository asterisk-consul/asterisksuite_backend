import 'dotenv/config';
import { PrismaService } from '@/prisma/prisma.service';
import { ManagementReportsService } from '../management-reports/management-reports.service';
import { OpenWaClient } from './openwa.client';
import { WeeklyWhatsAppReportsRunner } from './weekly-reports.runner';

function readOptions() {
  const args = process.argv.slice(2);
  const companyIndex = args.indexOf('--company-id');
  return {
    dryRun: args.includes('--dry-run'),
    companyId: companyIndex >= 0 ? args[companyIndex + 1] : undefined,
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (!dryRun && process.env.WHATSAPP_REPORTS_ENABLED?.toLowerCase() !== 'true') {
    console.log('Reportes WhatsApp desactivados: establecé WHATSAPP_REPORTS_ENABLED=true para ejecutarlos.');
    return;
  }

  const db = new PrismaService();
  try {
    const reports = new ManagementReportsService(db);
    const runner = new WeeklyWhatsAppReportsRunner(db, reports, new OpenWaClient());
    await runner.run(readOptions());
  } finally {
    await db.onModuleDestroy();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
