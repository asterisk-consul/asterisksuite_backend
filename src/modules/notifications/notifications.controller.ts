import { Body, Controller, Delete, Get, Patch, Param, Post, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { NotificationsService } from './notifications.service';
import { DismissNotificationAlertDto } from './dismiss-notification-alert.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('take') take?: string) {
    return this.notifications.listForUser(user.id, take);
  }

  @Get('dismissals')
  listDismissals(@CurrentUser() user: AuthUser) {
    return this.notifications.listActiveDismissals(user.id);
  }

  @Post('dismissals')
  dismissAlert(@CurrentUser() user: AuthUser, @Body() dto: DismissNotificationAlertDto) {
    return this.notifications.dismissAlert(user.id, dto.alert_key);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: AuthUser) {
    return this.notifications.markAllRead(user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.notifications.markRead(id, user.id);
  }

  @Patch(':id/dismiss')
  dismiss(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.notifications.dismiss(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.notifications.remove(id, user.id);
  }
}
