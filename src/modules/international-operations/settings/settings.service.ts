import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateIntlOpsSettingsDto } from './dto/update-intl-ops-settings.dto';

export const DEFAULT_CONTAINER_FIELDS: Record<string, boolean> = {
  container_number: true,
  container_type: true,
  seal_number: true,
  booking_number: false,
  bill_of_lading: false,
  vessel_name: false,
  voyage_number: false,
  origin_port: true,
  destination_port: true,
  estimated_departure_date: true,
  estimated_arrival_date: true,
  weight: true,
  volume: true,
  notes: true,
};

export const DEFAULT_OPERATION_FIELDS: Record<string, boolean> = {
  name: true,
  operation_type: true,
  transport_type: true,
  currency_code: true,
  incoterm: true,
  origin_location_id: true,
  destination_location_id: true,
  estimated_departure_date: true,
  estimated_arrival_date: true,
  customs_broker_op_number: false,
  sim_number: false,
  supplier_purchase_order: false,
  notes: true,
};

@Injectable()
export class IntlOpsSettingsService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getSettings() {
    const record = await this.prisma.international_operation_settings.upsert({
      where: { settings_key: 'default' },
      update: {},
      create: {
        settings_key: 'default',
        container_fields: DEFAULT_CONTAINER_FIELDS,
        operation_fields: DEFAULT_OPERATION_FIELDS,
      },
    });
    // Merge defaults para registros viejos que no tengan las claves nuevas
    return {
      ...record,
      container_fields: { ...DEFAULT_CONTAINER_FIELDS, ...((record.container_fields as Record<string, boolean>) ?? {}) },
      operation_fields: { ...DEFAULT_OPERATION_FIELDS, ...((record.operation_fields as Record<string, boolean>) ?? {}) },
    };
  }

  async updateSettings(dto: UpdateIntlOpsSettingsDto, userId: string) {
    return this.prisma.international_operation_settings.upsert({
      where: { settings_key: 'default' },
      update: {
        ...(dto.container_fields !== undefined && { container_fields: dto.container_fields }),
        ...(dto.operation_fields !== undefined && { operation_fields: dto.operation_fields }),
        ...(dto.operation_statuses !== undefined && { operation_statuses: dto.operation_statuses }),
        ...(dto.container_statuses !== undefined && { container_statuses: dto.container_statuses }),
        updated_by: userId,
      },
      create: {
        settings_key: 'default',
        container_fields: dto.container_fields ?? DEFAULT_CONTAINER_FIELDS,
        operation_fields: dto.operation_fields ?? DEFAULT_OPERATION_FIELDS,
        operation_statuses: dto.operation_statuses ?? null,
        container_statuses: dto.container_statuses ?? null,
        created_by: userId,
        updated_by: userId,
      },
    });
  }
}
