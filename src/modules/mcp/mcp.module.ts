import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { AccessControlModule } from '@/access-control/access-control.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { DocumentsPurchasesModule } from '@/modules/erp/documents-purchases/documents_purchases.module';
import { FilesModule } from '@/modules/logistica/media/files/files.module';
import { McpController } from './mcp.controller';
import { McpOAuthProvider } from './mcp-oauth.provider';
import { McpToolsService } from './mcp-tools.service';

@Module({
  imports: [AuthModule, AccessControlModule, PrismaModule, DocumentsPurchasesModule, FilesModule],
  controllers: [McpController],
  providers: [McpOAuthProvider, McpToolsService],
  exports: [McpOAuthProvider],
})
export class McpModule {}
