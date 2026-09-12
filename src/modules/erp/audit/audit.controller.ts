import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { AuditService } from './audit.service';
import { QueryAuditDto } from './dto/query-audit.dto';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('erp/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @RequirePermissions('audit.read')
  @Get()
  findAll(@Query() query: QueryAuditDto) {
    return this.auditService.findAll(query);
  }

  @RequirePermissions('audit.read')
  @Get('stats')
  getStats(@Query('days') days?: string) {
    return this.auditService.getStats(days ? Number(days) : 7);
  }

  @RequirePermissions('audit.read')
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Query('days') days?: string) {
    return this.auditService.findByUser(userId, days ? Number(days) : undefined);
  }

  @RequirePermissions('audit.read')
  @Get(':table/:recordId')
  findByRecord(@Param('table') table: string, @Param('recordId') recordId: string) {
    return this.auditService.findByRecord(table, recordId);
  }
}
