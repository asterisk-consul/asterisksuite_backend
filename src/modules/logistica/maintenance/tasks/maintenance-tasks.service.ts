import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMaintenanceTaskDto } from './dto/maintenance-task.dto';
import { UpdateMaintenanceTaskDto } from './dto/maintenance-task.dto';
import { MaintenanceTaskStatus } from '../enums/maintenance.enums';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class MaintenanceTasksService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findByOrder(orderId: string) {
    return this.prisma.maintenance_tasks.findMany({
      where: { maintenance_order_id: orderId, deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.maintenance_tasks.findFirst({
      where: { id, deleted_at: null },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return task;
  }

  async create(dto: CreateMaintenanceTaskDto, userId: string) {
    const order = await this.prisma.maintenance_orders.findFirst({
      where: { id: dto.maintenance_order_id, deleted_at: null },
    });
    if (!order) throw new BadRequestException('Orden de mantenimiento no encontrada');

    return this.prisma.maintenance_tasks.create({
      data: {
        ...dto,
        estimated_hours: dto.estimated_hours ? Number(dto.estimated_hours) : null,
        created_by: userId,
      },
    });
  }

  async update(id: string, dto: UpdateMaintenanceTaskDto, userId: string) {
    await this.findOne(id);

    const updateData: any = omitUndefined({
      description: dto.description,
      status: dto.status,
      assigned_to: dto.assigned_to,
      estimated_hours: dto.estimated_hours ? Number(dto.estimated_hours) : undefined,
      actual_hours: dto.actual_hours ? Number(dto.actual_hours) : undefined,
      notes: dto.notes,
      updated_by: userId,
    });

    if (dto.status === MaintenanceTaskStatus.IN_PROGRESS && !updateData.started_at) {
      updateData.started_at = new Date();
    }
    if (dto.status === MaintenanceTaskStatus.COMPLETED && !updateData.completed_at) {
      updateData.completed_at = new Date();
    }

    return this.prisma.maintenance_tasks.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.maintenance_tasks.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }
}
