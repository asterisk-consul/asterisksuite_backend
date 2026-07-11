import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
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

    // Crear employee
    const employee = await this.prisma.employees.create({
      data: {
        party_id: dto.party_id,
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
    return this.prisma.employees.findMany({
      where: { deleted_at: null },
      orderBy: { last_name: 'asc' },
      include: { party: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id, deleted_at: null },
      include: { party: true },
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

  async update(id: string, dto: UpdateEmployeeDto, userId: string) {
    await this.findOne(id);
    return this.prisma.employees.update({
      where: { id },
      data: {
        ...dto,
        hire_date: dto.hire_date ? new Date(dto.hire_date) : undefined,
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
