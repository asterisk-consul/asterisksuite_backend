import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateTireDto,
  UpdateTireDto,
  InstallTireDto,
  RemoveTireDto,
  RotateTireDto,
  RepairTireDto,
  ScrapTireDto,
  SellTireDto,
  FilterTiresDto,
} from './dto/tire.dto';
import { TireStatus, TireMovementType, TireLocationType, MaintenanceStatus } from '../enums/maintenance.enums';
import { omitUndefined } from '@/common/utils/object.utils';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

@Injectable()
export class TiresService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(filters: FilterTiresDto) {
    const {
      product_id,
      vehicle_id,
      warehouse_id,
      tire_shop_id,
      status,
      serial_number,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = { deleted_at: null };

    if (product_id) where.product_id = product_id;
    if (vehicle_id) where.current_vehicle_id = vehicle_id;
    if (warehouse_id) where.current_warehouse_id = warehouse_id;
    if (tire_shop_id) where.current_tire_shop_id = tire_shop_id;
    if (status) where.status = status;
    if (serial_number) where.serial_number = { contains: serial_number, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.tires.findMany({
        where,
        include: {
          current_vehicle: { select: { id: true, plate: true, brand: true, model: true } },
          current_position: { select: { id: true, position_number: true, axle: true, side: true } },
          current_warehouse: { select: { id: true, name: true, code: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tires.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, tx?: any) {
    const prisma = tx || this.prisma;
    const tire = await prisma.tires.findFirst({
      where: { id, deleted_at: null },
      include: {
        current_vehicle: { select: { id: true, plate: true, brand: true, model: true, type: true } },
        current_position: { select: { id: true, position_number: true, axle: true, side: true, position_type: true } },
        current_warehouse: { select: { id: true, name: true, code: true } },
        purchase_supplier: { select: { id: true, name: true } },
        movements: {
          where: { deleted_at: null },
          orderBy: { date: 'desc' },
          take: 20,
        },
        positions_history: {
          where: { deleted_at: null },
          orderBy: { installed_at: 'desc' },
          take: 20,
        },
      },
    });

    if (!tire) throw new NotFoundException('Cubierta no encontrada');
    return tire;
  }

  async create(dto: CreateTireDto, userId: string) {
    const existing = await this.prisma.tires.findUnique({
      where: { serial_number: dto.serial_number },
    });
    if (existing) throw new ConflictException(`Ya existe una cubierta con número de serie ${dto.serial_number}`);

    const product = await this.prisma.products.findFirst({
      where: { id: dto.product_id, deleted_at: null },
    });
    if (!product) throw new BadRequestException('Producto no encontrado');

    return this.prisma.$transaction(async (tx) => {
      const tire = await tx.tires.create({
        data: {
          ...dto,
          company_id: this.getCompanyId(),
          purchase_unit_cost: dto.purchase_unit_cost ? Number(dto.purchase_unit_cost) : null,
          purchase_date: dto.purchase_date ? new Date(dto.purchase_date) : null,
          status: TireStatus.IN_STOCK,
          created_by: userId,
        },
      });

      if (dto.purchase_document_id) {
        await this.createMovement(tx, {
          tire_id: tire.id,
          movement_type: TireMovementType.PURCHASE,
          date: dto.purchase_date ? new Date(dto.purchase_date) : new Date(),
          notes: `Compra: ${product.name}`,
          user_id: userId,
        });
      }

      if (dto.current_warehouse_id) {
        await this.createMovement(tx, {
          tire_id: tire.id,
          movement_type: TireMovementType.WAREHOUSE_ENTRY,
          from_location_type: TireLocationType.WAREHOUSE,
          to_location_type: TireLocationType.WAREHOUSE,
          to_location_id: dto.current_warehouse_id,
          notes: `Ingreso a depósito`,
          user_id: userId,
        });
      }

      return this.findOne(tire.id, tx);
    });
  }

  async createFromPurchaseLine(purchaseLineId: string, serialNumbers: string[], userId: string) {
    const line = await this.prisma.document_items.findFirst({
      where: { id: purchaseLineId, deleted_at: null },
      include: { document: { include: { business_parties: true } } },
    });
    if (!line) throw new BadRequestException('Línea de compra no encontrada');

    if (serialNumbers.length !== Number(line.quantity)) {
      throw new BadRequestException(
        `Cantidad de números de serie (${serialNumbers.length}) no coincide con cantidad de la línea (${line.quantity})`
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const tires: any[] = [];

      for (const serial of serialNumbers) {
        const existing = await tx.tires.findUnique({ where: { serial_number: serial } });
        if (existing) throw new ConflictException(`Cubierta ${serial} ya existe`);

        const tire = await tx.tires.create({
          data: {
            company_id: this.getCompanyId(),
            product_id: line.product_id!,
            serial_number: serial,
            status: TireStatus.IN_STOCK,
            purchase_document_id: line.document_id,
            purchase_document_line_id: line.id,
            purchase_date: line.document.date,
            purchase_supplier_id: line.document.party_id,
            purchase_unit_cost: Number(line.price),
            purchase_receipt_document_id: line.document.parent_document_id,
            created_by: userId,
          },
        });

        await this.createMovement(tx, {
          tire_id: tire.id,
          movement_type: TireMovementType.PURCHASE,
          date: line.document.date,
          notes: `Compra: ${line.document.number}`,
          user_id: userId,
        });

        await this.createMovement(tx, {
          tire_id: tire.id,
          movement_type: TireMovementType.RECEIPT,
          date: line.document.date,
          notes: `Recepción: ${line.document.number}`,
          user_id: userId,
        });

        tires.push(tire);
      }

      return tires;
    });
  }

  async update(id: string, dto: UpdateTireDto, userId: string) {
    const tire = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.tires.update({
        where: { id },
        data: omitUndefined({
          status: dto.status,
          current_warehouse_id: dto.current_warehouse_id,
          current_tire_shop_id: dto.current_tire_shop_id,
          accumulated_km: dto.accumulated_km ? Number(dto.accumulated_km) : undefined,
          days_in_use: dto.days_in_use,
          updated_by: userId,
        }),
      });

      return this.findOne(id, tx);
    });
  }

  async install(id: string, dto: InstallTireDto, userId: string) {
    const tire = await this.findOne(id);

    if (tire.status !== TireStatus.IN_STOCK) {
      throw new BadRequestException(`La cubierta debe estar en estado IN_STOCK (actual: ${tire.status})`);
    }

    const vehicle = await this.prisma.vehicles.findFirst({
      where: { id: dto.vehicle_id, deleted_at: null },
    });
    if (!vehicle) throw new BadRequestException('Vehículo no encontrado');

    const position = await this.prisma.vehicle_tire_positions.findFirst({
      where: { id: dto.position_id, deleted_at: null },
    });
    if (!position) throw new BadRequestException('Posición no encontrada');

    const occupied = await this.prisma.tires.findFirst({
      where: { current_position_id: dto.position_id, status: TireStatus.INSTALLED, deleted_at: null },
    });
    if (occupied) throw new BadRequestException(`La posición ${position.position_number} ya está ocupada`);

    return this.prisma.$transaction(async (tx) => {
      await tx.tires.update({
        where: { id },
        data: {
          status: TireStatus.INSTALLED,
          current_vehicle_id: dto.vehicle_id,
          current_position_id: dto.position_id,
          current_warehouse_id: null,
          current_tire_shop_id: null,
          installation_count: { increment: 1 },
          vehicle_count: { increment: 1 },
          updated_by: userId,
        },
      });

      await this.createMovement(tx, {
        tire_id: id,
        movement_type: TireMovementType.INSTALLATION,
        vehicle_id: dto.vehicle_id,
        position_id: dto.position_id,
        odometer: Number(dto.odometer),
        from_location_type: TireLocationType.WAREHOUSE,
        to_location_type: TireLocationType.VEHICLE,
        from_location_id: tire.current_warehouse_id,
        to_location_id: dto.vehicle_id,
        notes: `Instalación en ${vehicle.plate} - Posición ${position.position_number}`,
        user_id: userId,
        date: dto.date ? new Date(dto.date) : new Date(),
      });

      await tx.tire_position_history.create({
        data: {
          tire_id: id,
          position_id: dto.position_id,
          vehicle_id: dto.vehicle_id,
          installed_at: dto.date ? new Date(dto.date) : new Date(),
          installed_odometer: Number(dto.odometer),
          created_by: userId,
        },
      });

      return this.findOne(id, tx);
    });
  }

  async remove(id: string, dto: RemoveTireDto, userId: string) {
    const tire = await this.findOne(id);

    if (tire.status !== TireStatus.INSTALLED) {
      throw new BadRequestException(`La cubierta debe estar INSTALLED (actual: ${tire.status})`);
    }

    let newStatus: TireStatus;
    let toLocationType: TireLocationType;

    switch (dto.to_location_type) {
      case TireLocationType.WAREHOUSE:
        newStatus = TireStatus.IN_STOCK;
        toLocationType = TireLocationType.WAREHOUSE;
        break;
      case TireLocationType.TIRE_SHOP:
        newStatus = TireStatus.IN_REPAIR;
        toLocationType = TireLocationType.TIRE_SHOP;
        break;
      case TireLocationType.SCRAP:
        newStatus = TireStatus.SCRAPPED;
        toLocationType = TireLocationType.SCRAP;
        break;
      default:
        newStatus = TireStatus.IN_STOCK;
        toLocationType = TireLocationType.WAREHOUSE;
    }

    return this.prisma.$transaction(async (tx) => {
      const updateData: any = {
        status: newStatus,
        current_vehicle_id: null,
        current_position_id: null,
        updated_by: userId,
      };

      if (toLocationType === TireLocationType.WAREHOUSE && dto.to_location_id) {
        updateData.current_warehouse_id = dto.to_location_id;
        updateData.current_tire_shop_id = null;
      } else if (toLocationType === TireLocationType.TIRE_SHOP && dto.to_location_id) {
        updateData.current_tire_shop_id = dto.to_location_id;
        updateData.current_warehouse_id = null;
      } else {
        updateData.current_warehouse_id = null;
        updateData.current_tire_shop_id = null;
      }

      await tx.tires.update({ where: { id }, data: updateData });

      await this.createMovement(tx, {
        tire_id: id,
        movement_type: TireMovementType.REMOVAL,
        vehicle_id: tire.current_vehicle_id!,
        position_id: tire.current_position_id!,
        odometer: Number(dto.odometer),
        from_location_type: TireLocationType.VEHICLE,
        to_location_type: toLocationType,
        from_location_id: tire.current_vehicle_id,
        to_location_id: dto.to_location_id,
        reason: dto.reason,
        notes: dto.reason,
        user_id: userId,
        date: dto.date ? new Date(dto.date) : new Date(),
      });

      await tx.tire_position_history.updateMany({
        where: { tire_id: id, removed_at: null },
        data: { removed_at: dto.date ? new Date(dto.date) : new Date(), removed_odometer: Number(dto.odometer) },
      });

      return this.findOne(id, tx);
    });
  }

  async rotate(id: string, dto: RotateTireDto, userId: string) {
    const tire = await this.findOne(id);

    if (tire.status !== TireStatus.INSTALLED) {
      throw new BadRequestException(`La cubierta debe estar INSTALLED para rotar`);
    }

    const newPosition = await this.prisma.vehicle_tire_positions.findFirst({
      where: { id: dto.new_position_id, deleted_at: null },
    });
    if (!newPosition) throw new BadRequestException('Nueva posición no encontrada');

    const occupied = await this.prisma.tires.findFirst({
      where: { current_position_id: dto.new_position_id, status: TireStatus.INSTALLED, deleted_at: null, id: { not: id } },
    });
    if (occupied) throw new BadRequestException(`La nueva posición ya está ocupada`);

    return this.prisma.$transaction(async (tx) => {
      await tx.tires.update({
        where: { id },
        data: { current_position_id: dto.new_position_id, updated_by: userId },
      });

      await this.createMovement(tx, {
        tire_id: id,
        movement_type: TireMovementType.ROTATION,
        vehicle_id: tire.current_vehicle_id!,
        position_id: dto.new_position_id,
        odometer: Number(dto.odometer),
        from_location_type: TireLocationType.VEHICLE,
        to_location_type: TireLocationType.VEHICLE,
        from_location_id: tire.current_position_id,
        to_location_id: dto.new_position_id,
        notes: `Rotación de posición ${tire.current_position?.position_number} a ${newPosition.position_number}`,
        user_id: userId,
        date: dto.date ? new Date(dto.date) : new Date(),
      });

      await tx.tire_position_history.updateMany({
        where: { tire_id: id, removed_at: null },
        data: { removed_at: dto.date ? new Date(dto.date) : new Date(), removed_odometer: Number(dto.odometer) },
      });

      await tx.tire_position_history.create({
        data: {
          tire_id: id,
          position_id: dto.new_position_id,
          vehicle_id: tire.current_vehicle_id!,
          installed_at: dto.date ? new Date(dto.date) : new Date(),
          installed_odometer: Number(dto.odometer),
          created_by: userId,
        },
      });

      return this.findOne(id, tx);
    });
  }

  async repair(id: string, dto: RepairTireDto, userId: string) {
    const tire = await this.findOne(id);

    const movementType = dto.is_retread ? TireMovementType.RETREAD : TireMovementType.REPAIR;

    return this.prisma.$transaction(async (tx) => {
      await tx.tires.update({
        where: { id },
        data: {
          status: TireStatus.IN_REPAIR,
          current_vehicle_id: null,
          current_position_id: null,
          current_tire_shop_id: dto.supplier_id,
          repair_count: dto.is_retread ? undefined : { increment: 1 },
          retread_count: dto.is_retread ? { increment: 1 } : undefined,
          total_repair_cost: dto.is_retread
            ? undefined
            : { increment: Number(dto.cost) },
          total_retread_cost: dto.is_retread ? { increment: Number(dto.cost) } : undefined,
          updated_by: userId,
        },
      });

      await this.createMovement(tx, {
        tire_id: id,
        movement_type: movementType,
        vehicle_id: tire.current_vehicle_id ?? undefined,
        position_id: tire.current_position_id ?? undefined,
        odometer: dto.odometer ? Number(dto.odometer) : undefined,
        from_location_type: tire.current_vehicle_id ? TireLocationType.VEHICLE : TireLocationType.WAREHOUSE,
        to_location_type: TireLocationType.TIRE_SHOP,
        from_location_id: tire.current_vehicle_id ?? tire.current_warehouse_id,
        to_location_id: dto.supplier_id,
        notes: dto.description,
        user_id: userId,
        date: dto.date ? new Date(dto.date) : new Date(),
      });

      // Crear orden de mantenimiento vinculada
      await tx.maintenance_orders.create({
        data: {
          company_id: this.getCompanyId(),
          number: `MO-${Date.now()}`,
          asset_type: 'TIRE',
          asset_id: id,
          tire_id: id,
          vehicle_id: tire.current_vehicle_id,
          category: 'TIRES',
          maintenance_type: 'CORRECTIVE',
          priority: 'MEDIUM',
          status: MaintenanceStatus.COMPLETED,
          title: dto.is_retread ? 'Recapado de cubierta' : 'Reparación de cubierta',
          description: dto.description,
          reported_problem: 'Reparación/recapado en gomería',
          diagnosis: dto.description,
          solution: 'Trabajo realizado en gomería externa',
          reported_at: dto.date ? new Date(dto.date) : new Date(),
          completed_at: dto.date ? new Date(dto.date) : new Date(),
          odometer: dto.odometer ? Number(dto.odometer) : undefined,
          supplier_id: dto.supplier_id,
          actual_cost: Number(dto.cost),
          services_cost: Number(dto.cost),
          notes: `Factura: ${dto.document_id || 'pendiente'}`,
          created_by: userId,
        },
      });

      return this.findOne(id, tx);
    });
  }

  async scrap(id: string, dto: ScrapTireDto, userId: string) {
    const tire = await this.findOne(id);

    if (tire.status === TireStatus.SCRAPPED || tire.status === TireStatus.SOLD) {
      throw new BadRequestException('La cubierta ya fue dada de baja o vendida');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.tires.update({
        where: { id },
        data: { status: TireStatus.SCRAPPED, current_vehicle_id: null, current_position_id: null, current_warehouse_id: null, current_tire_shop_id: null, updated_by: userId },
      });

      await this.createMovement(tx, {
        tire_id: id,
        movement_type: TireMovementType.SCRAP,
        from_location_type: tire.current_vehicle_id ? TireLocationType.VEHICLE : tire.current_tire_shop_id ? TireLocationType.TIRE_SHOP : TireLocationType.WAREHOUSE,
        to_location_type: TireLocationType.SCRAP,
        from_location_id: tire.current_vehicle_id ?? tire.current_warehouse_id ?? tire.current_tire_shop_id,
        reason: dto.reason,
        notes: dto.reason,
        user_id: userId,
        date: dto.date ? new Date(dto.date) : new Date(),
      });

      return this.findOne(id, tx);
    });
  }

  async sell(id: string, dto: SellTireDto, userId: string) {
    const tire = await this.findOne(id);

    if (tire.status === TireStatus.SCRAPPED || tire.status === TireStatus.SOLD) {
      throw new BadRequestException('La cubierta ya fue dada de baja o vendida');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.tires.update({
        where: { id },
        data: { status: TireStatus.SOLD, current_vehicle_id: null, current_position_id: null, current_warehouse_id: null, current_tire_shop_id: null, updated_by: userId },
      });

      await this.createMovement(tx, {
        tire_id: id,
        movement_type: TireMovementType.SALE,
        from_location_type: tire.current_vehicle_id ? TireLocationType.VEHICLE : tire.current_tire_shop_id ? TireLocationType.TIRE_SHOP : TireLocationType.WAREHOUSE,
        to_location_type: TireLocationType.CUSTOMER,
        from_location_id: tire.current_vehicle_id ?? tire.current_warehouse_id ?? tire.current_tire_shop_id,
        to_location_id: dto.customer_id,
        notes: `Venta a cliente - Precio: ${dto.sale_price}`,
        user_id: userId,
        date: dto.date ? new Date(dto.date) : new Date(),
      });

      return this.findOne(id, tx);
    });
  }

  async softDelete(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.tires.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }

  private async createMovement(
    tx: any,
    data: {
      tire_id: string;
      movement_type: TireMovementType;
      date?: Date;
      vehicle_id?: string;
      position_id?: string;
      odometer?: number;
      from_location_id?: string;
      to_location_id?: string;
      from_location_type?: TireLocationType;
      to_location_type?: TireLocationType;
      reason?: string;
      notes?: string;
      user_id: string;
    }
  ) {
    return tx.tire_movements.create({
      data: {
        ...data,
        date: data.date || new Date(),
        odometer: data.odometer ? Number(data.odometer) : null,
        created_by: data.user_id,
      },
    });
  }

  private getCompanyId(): string {
    const id = getCurrentCompanyId();
    if (!id) throw new BadRequestException('No se pudo resolver la empresa actual');
    return id;
  }
}
