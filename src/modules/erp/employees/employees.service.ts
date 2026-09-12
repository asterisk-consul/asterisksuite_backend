import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { validateDocumentNumber } from '@/common/validators/document.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateEmployeeDto, userId: string) {
    // Validar que no envíen ambos user_id y create_user
    if (dto.user_id && dto.create_user) {
      throw new BadRequestException('No se puede enviar user_id y create_user al mismo tiempo');
    }

    // Validar formato de documento
    validateDocumentNumber(dto.document_type, dto.document_number);

    // Validar duplicados por document_type + document_number
    if (dto.document_type && dto.document_number) {
      const existing = await this.prisma.employees.findFirst({
        where: {
          document_type: dto.document_type,
          document_number: dto.document_number,
          deleted_at: null,
        },
      });
      if (existing) {
        throw new BadRequestException(`Ya existe un empleado con ${dto.document_type} ${dto.document_number}`);
      }
    }

    let finalUserId = dto.user_id;

    // Crear usuario en public.users si se solicita
    if (dto.create_user) {
      const publicPrisma = this.db.getDefaultClient();

      const existing = await publicPrisma.users.findUnique({
        where: { email: dto.create_user.email },
      });
      if (existing) {
        throw new BadRequestException('El email ya está registrado');
      }

      const passwordHash = await bcrypt.hash(dto.create_user.password, 10);
      const newUser = await publicPrisma.users.create({
        data: {
          name: dto.create_user.name,
          email: dto.create_user.email,
          password_hash: passwordHash,
          role: dto.create_user.role ?? 'PLATFORM_USER',
        },
      });

      finalUserId = newUser.id;
    }

    // Auto-crear business_party si no se provee party_id
    let partyId = dto.party_id;
    if (partyId) {
      // Validar que el party exista y sea tipo EMPLOYEE
      const party = await this.prisma.business_parties.findFirst({
        where: { id: partyId, deleted_at: null },
      });
      if (!party) {
        throw new NotFoundException('business_party no encontrado');
      }
      if (party.type !== 'EMPLOYEE') {
        throw new BadRequestException(`El business_party tiene tipo "${party.type}", se esperaba "EMPLOYEE"`);
      }
    } else {
      const party = await this.prisma.business_parties.create({
        data: {
          type: 'EMPLOYEE',
          name: dto.business_name || `${dto.first_name} ${dto.last_name}`,
          email: dto.email,
          tax_id: dto.tax_id || dto.document_number,
          document_type: dto.document_type,
          vat_condition: dto.vat_condition,
          exemption_rate: dto.exemption_rate,
          active: dto.is_active ?? true,
          created_by: userId,
          party_locations: dto.locations
            ? { create: dto.locations.map((l) => ({ location_id: l.location_id, label: l.label })) }
            : undefined,
          party_contacts: dto.contacts
            ? { create: dto.contacts.map((c) => ({ first_name: c.first_name, last_name: c.last_name, role: c.role, phone: c.phone, email: c.email })) }
            : undefined,
          party_bank_accounts: dto.bank_accounts
            ? { create: dto.bank_accounts.map((b) => ({ cbu: b.cbu, alias: b.alias, bank_name: b.bank_name, account_type: b.account_type, currency: b.currency, description: b.description, holder_name: b.holder_name, is_default: b.is_default ?? false })) }
            : undefined,
        },
      });
      partyId = party.id;
    }

    // Crear employee
    const employee = await this.prisma.employees.create({
      data: {
        party_id: partyId,
        user_id: finalUserId,
        first_name: dto.first_name,
        last_name: dto.last_name,
        document_type: dto.document_type,
        document_number: dto.document_number,
        position: dto.position,
        department: dto.department,
        hire_date: dto.hire_date ? new Date(dto.hire_date) : undefined,
        salary: dto.salary,
        currency_code: dto.currency_code ?? 'USD',
        default_commission_rate: dto.default_commission_rate ?? null,
        is_salesperson: dto.is_salesperson ?? false,
        is_active: dto.is_active ?? true,
        created_by: userId,
      },
    });

    // Bidireccional: actualizar users.employee_id en public
    if (finalUserId) {
      const publicPrisma = this.db.getDefaultClient();
      await publicPrisma.users.update({
        where: { id: finalUserId },
        data: { employee_id: employee.id },
      });
    }

    return employee;
  }

  async findAll() {
    const employees = await this.prisma.employees.findMany({
      where: { deleted_at: null },
      orderBy: { last_name: 'asc' },
      include: { party: { select: { id: true, name: true } } },
    });

    // Cross-DB lookup: resolver usuarios vinculados desde public.users
    const userIds = employees.filter(e => e.user_id).map(e => e.user_id!) as string[];
    const users = userIds.length > 0
      ? await this.db.getDefaultClient().users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true, active: true },
        })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    return employees.map(e => ({
      ...e,
      user: e.user_id ? (userMap.get(e.user_id) ?? null) : null,
    }));
  }

  async findOne(id: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id, deleted_at: null },
      include: {
        party: {
          include: {
            party_locations: { include: { locations: true } },
            party_contacts: true,
            party_bank_accounts: true,
          },
        },
      },
    });
    if (!employee) throw new NotFoundException('Empleado no encontrado');

    // Cross-DB lookup: resolver user desde public.users
    let user = null;
    if (employee.user_id) {
      user = await this.db.getDefaultClient().users.findUnique({
        where: { id: employee.user_id },
        select: { id: true, name: true, email: true, active: true },
      });
    }

    return { ...employee, user };
  }

  async findByUserId(userId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { user_id: userId, deleted_at: null },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        is_salesperson: true,
        default_commission_rate: true,
        position: true,
        department: true,
      },
    });
    return employee ?? null;
  }

  async update(id: string, dto: UpdateEmployeeDto, userId: string) {
    const employee = await this.findOne(id);

    // Validar duplicados si cambia document_type/document_number
    if (dto.document_type && dto.document_number) {
      const existing = await this.prisma.employees.findFirst({
        where: {
          document_type: dto.document_type,
          document_number: dto.document_number,
          deleted_at: null,
          NOT: { id },
        },
      });
      if (existing) {
        throw new BadRequestException(`Ya existe un empleado con ${dto.document_type} ${dto.document_number}`);
      }
    }

    // Extraer campos de business_party del DTO
    const { locations, contacts, bank_accounts, business_name, email, tax_id, vat_condition, exemption_rate, ...employeeData } = dto;

    // Actualizar business_party si hay campos relacionados
    if (employee.party_id && (business_name || email || tax_id || vat_condition || exemption_rate !== undefined || locations || contacts || bank_accounts)) {
      const partyUpdateData: Record<string, any> = {};
      if (business_name !== undefined) partyUpdateData.name = business_name;
      if (email !== undefined) partyUpdateData.email = email;
      if (tax_id !== undefined) partyUpdateData.tax_id = tax_id;
      if (vat_condition !== undefined) partyUpdateData.vat_condition = vat_condition;
      if (exemption_rate !== undefined) partyUpdateData.exemption_rate = exemption_rate;

      await this.prisma.business_parties.update({
        where: { id: employee.party_id },
        data: {
          ...partyUpdateData,
          party_locations: locations
            ? { deleteMany: {}, create: locations.map((l) => ({ location_id: l.location_id, label: l.label })) }
            : undefined,
          party_contacts: contacts
            ? { deleteMany: {}, create: contacts.map((c) => ({ first_name: c.first_name, last_name: c.last_name, role: c.role, phone: c.phone, email: c.email })) }
            : undefined,
          party_bank_accounts: bank_accounts
            ? { deleteMany: {}, create: bank_accounts.map((b) => ({ cbu: b.cbu, alias: b.alias, bank_name: b.bank_name, account_type: b.account_type, currency: b.currency, description: b.description, holder_name: b.holder_name, is_default: b.is_default ?? false })) }
            : undefined,
        },
      });
    }

    return this.prisma.employees.update({
      where: { id },
      data: {
        ...employeeData,
        hire_date: employeeData.hire_date ? new Date(employeeData.hire_date) : undefined,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  /**
   * Vincular employee con user existente
   */
  async linkUser(id: string, userId: string) {
    const employee = await this.findOne(id);

    // Validar que el user existe en public
    const publicPrisma = this.db.getDefaultClient();
    const user = await publicPrisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Si el employee ya tiene un user vinculado, desvincularlo primero
    if (employee.user_id && employee.user_id !== userId) {
      await publicPrisma.users.update({
        where: { id: employee.user_id },
        data: { employee_id: null },
      });
    }

    // Vincular: employee.user_id → user, users.employee_id → employee
    await this.prisma.employees.update({
      where: { id },
      data: { user_id: userId },
    });

    await publicPrisma.users.update({
      where: { id: userId },
      data: { employee_id: id },
    });

    return { message: 'Empleado vinculado al usuario', employee_id: id, user_id: userId };
  }

  /**
   * Desvincular employee de su user
   */
  async unlinkUser(id: string) {
    const employee = await this.findOne(id);
    if (!employee.user_id) {
      return { message: 'El empleado no tiene usuario vinculado' };
    }

    const publicPrisma = this.db.getDefaultClient();

    // Limpiar ambos lados
    await this.prisma.employees.update({
      where: { id },
      data: { user_id: null },
    });

    await publicPrisma.users.update({
      where: { id: employee.user_id },
      data: { employee_id: null },
    });

    return { message: 'Empleado desvinculado del usuario', employee_id: id };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.employees.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId, is_active: false },
    });
  }
}
