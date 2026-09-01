import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { InternationalOperationsService } from './international-operations.service';
import { ContainersService } from './containers/containers.service';
import { EventsService } from './events/events.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { UpdateOperationStatusDto } from './dto/update-status.dto';
import { CreateContainerDto } from './containers/dto/create-container.dto';
import { UpdateContainerDto } from './containers/dto/update-container.dto';
import { CreateEventDto } from './events/dto/create-event.dto';
import { AssociateDocumentDto } from './dto/associate-document.dto';
import { AssociateQuoteDto } from './dto/associate-quote.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { OperationStatus } from '@/generated/prisma/enums';

@UseGuards(JwtAuthGuard)
@Controller('international-operations')
export class InternationalOperationsController {
  constructor(
    private readonly operationsService: InternationalOperationsService,
    private readonly containersService: ContainersService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @RequirePermissions('international_operations.create')
  create(@Body() dto: CreateOperationDto) {
    return this.operationsService.create(dto);
  }

  @Get()
  @RequirePermissions('international_operations.read')
  findAll(
    @Query('status') status?: OperationStatus,
    @Query('supplier_id') supplier_id?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.operationsService.findAll({
      status,
      supplier_id,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @RequirePermissions('international_operations.read')
  findOne(@Param('id') id: string) {
    return this.operationsService.findOne(id);
  }

  @Get(':id/summary')
  @RequirePermissions('international_operations.read')
  getSummary(@Param('id') id: string) {
    return this.operationsService.getSummary(id);
  }

  @Patch(':id')
  @RequirePermissions('international_operations.update')
  update(@Param('id') id: string, @Body() dto: UpdateOperationDto) {
    return this.operationsService.update(id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('international_operations.update')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOperationStatusDto) {
    return this.operationsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @RequirePermissions('international_operations.delete')
  remove(@Param('id') id: string) {
    return this.operationsService.remove(id);
  }

  @Post(':id/documents')
  @RequirePermissions('international_operations.update')
  associateDocument(@Param('id') id: string, @Body() dto: AssociateDocumentDto) {
    return this.operationsService.associateDocument(id, dto.document_id, dto.expense_type, dto.container_id, dto.custom_expense_description, dto.exchange_rate);
  }

  @Delete(':id/documents/:docId')
  @RequirePermissions('international_operations.update')
  disassociateDocument(@Param('id') id: string, @Param('docId') docId: string) {
    return this.operationsService.disassociateDocument(id, docId);
  }

  @Post(':id/payments')
  @RequirePermissions('international_operations.update')
  associatePayment(@Param('id') id: string, @Body('payment_id') payment_id: string, @Body('container_id') container_id?: string) {
    return this.operationsService.associatePayment(id, payment_id, container_id);
  }

  @Delete(':id/payments/:payId')
  @RequirePermissions('international_operations.update')
  disassociatePayment(@Param('id') id: string, @Param('payId') payId: string) {
    return this.operationsService.disassociatePayment(id, payId);
  }

  @Post(':id/purchase-orders')
  @RequirePermissions('international_operations.update')
  associatePurchaseOrder(@Param('id') id: string, @Body('document_id') document_id: string) {
    return this.operationsService.associatePurchaseOrder(id, document_id);
  }

  @Delete(':id/purchase-orders/:poId')
  @RequirePermissions('international_operations.update')
  disassociatePurchaseOrder(@Param('id') id: string, @Param('poId') poId: string) {
    return this.operationsService.disassociatePurchaseOrder(id, poId);
  }

  @Post(':id/quotes')
  @RequirePermissions('international_operations.update')
  associateQuote(@Param('id') id: string, @Body() dto: AssociateQuoteDto) {
    return this.operationsService.associateQuote(id, dto.document_id);
  }

  @Patch(':id/quotes/:quoteId/status')
  @RequirePermissions('international_operations.update')
  updateQuoteStatus(@Param('id') id: string, @Param('quoteId') quoteId: string, @Body() dto: UpdateQuoteStatusDto) {
    return this.operationsService.updateQuoteStatus(id, quoteId, dto.status);
  }

  @Delete(':id/quotes/:quoteId')
  @RequirePermissions('international_operations.update')
  disassociateQuote(@Param('id') id: string, @Param('quoteId') quoteId: string) {
    return this.operationsService.disassociateQuote(id, quoteId);
  }

  @Post(':id/containers')
  @RequirePermissions('international_operations.update')
  createContainer(@Param('id') id: string, @Body() dto: CreateContainerDto) {
    return this.containersService.create(id, dto);
  }

  @Get(':id/containers')
  @RequirePermissions('international_operations.read')
  findAllContainers(@Param('id') id: string) {
    return this.containersService.findAll(id);
  }

  @Get('containers/:containerId')
  @RequirePermissions('international_operations.read')
  findOneContainer(@Param('containerId') containerId: string) {
    return this.containersService.findOne(containerId);
  }

  @Patch('containers/:containerId')
  @RequirePermissions('international_operations.update')
  updateContainer(@Param('containerId') containerId: string, @Body() dto: UpdateContainerDto) {
    return this.containersService.update(containerId, dto);
  }

  @Delete('containers/:containerId')
  @RequirePermissions('international_operations.delete')
  removeContainer(@Param('containerId') containerId: string) {
    return this.containersService.remove(containerId);
  }

  @Post('containers/:containerId/events')
  @RequirePermissions('international_operations.update')
  createEvent(@Param('containerId') containerId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.create(containerId, dto);
  }

  @Get('containers/:containerId/events')
  @RequirePermissions('international_operations.read')
  findAllEvents(@Param('containerId') containerId: string) {
    return this.eventsService.findAll(containerId);
  }

  @Delete('events/:eventId')
  @RequirePermissions('international_operations.update')
  removeEvent(@Param('eventId') eventId: string) {
    return this.eventsService.remove(eventId);
  }
}
