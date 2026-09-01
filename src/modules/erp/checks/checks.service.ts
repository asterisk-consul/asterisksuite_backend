import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';

@Injectable()
export class ChecksService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateCheckDto, userId: string) {
    return this.prisma.checks.create({
      data: {
        payment_id: dto.payment_id,
        bank_account_id: dto.bank_account_id,
        check_number: dto.check_number,
        bank_name: dto.bank_name,
        bank_branch: dto.bank_branch,
        account_number: dto.account_number,
        issuer_name: dto.issuer_name,
        issuer_id: dto.issuer_id,
        amount: dto.amount,
        available_amount: dto.amount,
        currency_code: dto.currency_code,
        issue_date: new Date(dto.issue_date),
        due_date: new Date(dto.due_date),
        is_own: dto.is_own ?? false,
        notes: dto.notes,
        payment_date: dto.payment_date ? new Date(dto.payment_date) : null,
        status: 'PENDING',
        created_by: userId,
      },
    });
  }

  async findAvailable(isOwn?: boolean) {
    const where: Record<string, any> = {
      deleted_at: null,
      status: 'PENDING',
      // Con aplicación parcial: disponible si nunca se usó (null) o le queda saldo
      AND: [
        {
          OR: [
            { available_amount: null },
            { available_amount: { gt: 0 } },
          ],
        },
      ],
    };
    // Sin isOwn → devolver propios y de terceros
    if (isOwn !== undefined) where.is_own = isOwn;

    return this.prisma.checks.findMany({
      where,
      orderBy: { due_date: 'asc' },
      include: {
        bank_account: {
          select: { id: true, name: true, bank_name: true, currency_code: true },
        },
      },
    });
  }

  async findAll(filters?: {
    status?: string;
    is_own?: boolean;
    bank_name?: string;
    due_before?: string;
    user_id?: string;
  }) {
    const where: Record<string, any> = { deleted_at: null };

    if (filters?.status) where.status = filters.status;
    if (filters?.is_own !== undefined) where.is_own = filters.is_own;
    if (filters?.bank_name) where.bank_name = { contains: filters.bank_name, mode: 'insensitive' };
    if (filters?.due_before) {
      where.due_date = { lte: new Date(filters.due_before) };
    }
    if (filters?.user_id) where.created_by = filters.user_id;

    return this.prisma.checks.findMany({
      where,
      orderBy: { due_date: 'asc' },
      include: {
        payment: {
          select: {
            id: true,
            number: true,
            type: true,
            amount: true,
            party_id: true,
            party_type: true,
            party: { select: { id: true, name: true, type: true } },
          },
        },
        bank_account: {
          select: { id: true, name: true, bank_name: true, currency_code: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const check = await this.prisma.checks.findFirst({
      where: { id, deleted_at: null },
      include: {
        payment: {
          select: { id: true, number: true, type: true, amount: true, party_id: true },
        },
      },
    });
    if (!check) throw new NotFoundException('Cheque no encontrado');
    return check;
  }

  async update(id: string, dto: UpdateCheckDto, userId: string) {
    const check = await this.findOne(id);

    const data: Record<string, any> = {
      updated_at: new Date(),
      updated_by: userId,
    };

    if (dto.check_number !== undefined) data.check_number = dto.check_number;
    if (dto.issue_date !== undefined) data.issue_date = new Date(dto.issue_date);
    if (dto.currency_code !== undefined) data.currency_code = dto.currency_code;
    if (dto.bank_name !== undefined && dto.bank_name !== '') data.bank_name = dto.bank_name;
    if (dto.bank_account_id !== undefined) data.bank_account_id = dto.bank_account_id;
    if (dto.bank_branch !== undefined) data.bank_branch = dto.bank_branch;
    if (dto.account_number !== undefined) data.account_number = dto.account_number;
    if (dto.issuer_name !== undefined && dto.issuer_name !== '') data.issuer_name = dto.issuer_name;
    if (dto.issuer_id !== undefined) data.issuer_id = dto.issuer_id;
    if (dto.due_date) data.due_date = new Date(dto.due_date);
    if (dto.status) data.status = dto.status;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.payment_date) data.payment_date = new Date(dto.payment_date);
    if (dto.deposit_date) data.deposit_date = new Date(dto.deposit_date);
    if (dto.clearing_date) data.clearing_date = new Date(dto.clearing_date);

    // Cambio de monto: ajustar el saldo disponible coherentemente
    if (dto.amount !== undefined && Number(dto.amount) !== Number(check.amount)) {
      const appliedTotal = await this.prisma.payment_checks.aggregate({
        where: { check_id: id },
        _sum: { amount_applied: true },
      });
      const applied = appliedTotal._sum.amount_applied?.toNumber() ?? 0;
      const newAmount = Number(dto.amount);
      if (newAmount < applied) {
        throw new BadRequestException(
          `El cheque tiene ${applied.toFixed(2)} aplicado(s) en pagos; el nuevo monto no puede ser menor`,
        );
      }
      data.amount = newAmount;
      if (check.available_amount == null) {
        // Nunca usado: el disponible pasa a ser el nuevo monto
        data.available_amount = newAmount;
      } else {
        // Parcialmente usado: ajustar por la diferencia
        data.available_amount = Number((Number(check.available_amount) + (newAmount - Number(check.amount))).toFixed(2));
      }
    }

    await this.prisma.checks.update({
      where: { id },
      data,
    });

    return this.findOne(id);
  }

  async clear(id: string, userId: string) {
    const check = await this.findOne(id);
    if (check.is_own) {
      throw new BadRequestException('Los cheques propios se procesan por scheduler');
    }
    if (!['PENDING', 'CONFIRMED'].includes(check.status)) {
      throw new BadRequestException('Solo se pueden cobrar cheques pendientes o confirmados');
    }
    if (!check.bank_account_id) {
      throw new BadRequestException('El cheque no tiene cuenta bancaria asociada. Editá el cheque y asignale una cuenta.');
    }

    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: check.bank_account_id },
    });
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }

    const currentBalance = Number(bankAccount.balance);
    const balanceAfter = currentBalance + Number(check.amount);

    await this.prisma.$transaction(async (tx) => {
      await tx.checks.update({
        where: { id },
        data: {
          status: 'CLEARED',
          clearing_date: new Date(),
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      await tx.bank_account_movements.create({
        data: {
          bank_account_id: check.bank_account_id!,
          type: 'COLLECTION',
          amount: Number(check.amount),
          currency_code: check.currency_code,
          exchange_rate: check.exchange_rate,
          rate_type: check.rate_type,
          converted_amount: check.converted_amount,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: `Cheque #${check.check_number} acreditado`,
          reference_type: 'check',
          reference_id: check.id,
          payment_id: check.payment_id,
          date: new Date(),
          created_by: userId,
        },
      });

      await tx.bank_accounts.update({
        where: { id: check.bank_account_id! },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    });

    return this.findOne(id);
  }

  async deposit(id: string, dto: { bank_account_id: string; amount?: number }, userId: string) {
    const check = await this.findOne(id);
    if (check.is_own) {
      throw new BadRequestException('Los cheques propios se procesan por scheduler');
    }
    if (!['PENDING', 'CONFIRMED'].includes(check.status)) {
      throw new BadRequestException('Solo se pueden depositar cheques pendientes o confirmados');
    }

    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: dto.bank_account_id },
    });
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria destino no encontrada');
    }

    const depositAmount = dto.amount ?? Number(check.amount);

    const currentBalance = Number(bankAccount.balance);
    const balanceAfter = currentBalance + depositAmount;

    await this.prisma.$transaction(async (tx) => {
      await tx.checks.update({
        where: { id },
        data: {
          status: 'CLEARED',
          bank_account_id: dto.bank_account_id,
          deposit_date: new Date(),
          clearing_date: new Date(),
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      await tx.bank_account_movements.create({
        data: {
          bank_account_id: dto.bank_account_id,
          type: 'COLLECTION',
          amount: depositAmount,
          currency_code: check.currency_code,
          exchange_rate: check.exchange_rate,
          rate_type: check.rate_type,
          converted_amount: check.converted_amount,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: `Cheque #${check.check_number} depositado`,
          reference_type: 'check',
          reference_id: check.id,
          payment_id: check.payment_id,
          date: new Date(),
          created_by: userId,
        },
      });

      await tx.bank_accounts.update({
        where: { id: dto.bank_account_id },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    });

    return this.findOne(id);
  }

  async revert(id: string, userId: string) {
    const check = await this.findOne(id);
    if (check.status !== 'CLEARED') {
      throw new BadRequestException('Solo se pueden revertir cheques depositados');
    }
    if (!check.bank_account_id) {
      throw new BadRequestException('El cheque no tiene cuenta bancaria asociada');
    }

    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: check.bank_account_id },
    });
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }

    const movement = await this.prisma.bank_account_movements.findFirst({
      where: {
        reference_type: 'check',
        reference_id: check.id,
        type: 'COLLECTION',
        deleted_at: null,
      },
    });

    const currentBalance = Number(bankAccount.balance);
    const revertAmount = movement ? Number(movement.amount) : Number(check.amount);
    const balanceAfter = currentBalance - revertAmount;

    await this.prisma.$transaction(async (tx) => {
      await tx.checks.update({
        where: { id },
        data: {
          status: 'PENDING',
          deposit_date: null,
          clearing_date: null,
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      if (movement) {
        await tx.bank_account_movements.update({
          where: { id: movement.id },
          data: {
            deleted_at: new Date(),
            deleted_by: userId,
          },
        });
      }

      await tx.bank_accounts.update({
        where: { id: check.bank_account_id! },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    });

    return this.findOne(id);
  }

  async bounce(id: string, userId: string) {
    await this.prisma.checks.update({
      where: { id },
      data: {
        status: 'BOUNCED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });

    return this.findOne(id);
  }

  async confirm(id: string, userId: string) {
    const check = await this.findOne(id);
    if (!check.is_own) {
      throw new BadRequestException('Solo se pueden confirmar cheques propios');
    }
    if (check.status !== 'PENDING') {
      throw new BadRequestException('Solo se pueden confirmar cheques pendientes');
    }
    if (!check.bank_account_id) {
      throw new BadRequestException('El cheque no tiene cuenta bancaria asociada. Editá el cheque y asignale una cuenta.');
    }

    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: check.bank_account_id },
    });
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }

    const currentBalance = Number(bankAccount.balance);
    const balanceAfter = currentBalance - Number(check.amount);

    await this.prisma.$transaction(async (tx) => {
      await tx.checks.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          confirmed_by: userId,
          confirmed_at: new Date(),
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      await tx.bank_account_movements.create({
        data: {
          bank_account_id: check.bank_account_id!,
          type: 'CHECK_ISSUED',
          amount: -Number(check.amount),
          currency_code: check.currency_code,
          exchange_rate: check.exchange_rate,
          rate_type: check.rate_type,
          converted_amount: check.converted_amount,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: `Cheque #${check.check_number} procesado`,
          reference_type: 'check',
          reference_id: check.id,
          payment_id: check.payment_id,
          date: new Date(),
          created_by: userId,
        },
      });

      await tx.bank_accounts.update({
        where: { id: check.bank_account_id! },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    });

    return this.findOne(id);
  }

  async reject(id: string, userId: string) {
    const check = await this.findOne(id);
    if (!check.is_own) {
      throw new BadRequestException('Solo se pueden rechazar cheques propios');
    }

    await this.prisma.checks.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });

    return this.findOne(id);
  }

  async findUpcoming(days: number = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.prisma.checks.findMany({
      where: {
        deleted_at: null,
        status: 'PENDING',
        is_own: true,
        due_date: { gte: today, lte: futureDate },
      },
      orderBy: { due_date: 'asc' },
    });
  }

  async findPendingNotification() {
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);

    return this.prisma.checks.findMany({
      where: {
        deleted_at: null,
        status: 'PENDING',
        is_own: true,
        payment_date: { lte: twoDaysFromNow },
        notification_sent: false,
      },
    });
  }

  async markNotificationSent(id: string) {
    return this.prisma.checks.update({
      where: { id },
      data: { notification_sent: true },
    });
  }

  async remove(id: string, userId: string) {
    const check = await this.findOne(id);
    if (check.status === 'CLEARED') {
      throw new BadRequestException('No se puede eliminar un cheque ya cobrado');
    }

    return this.prisma.checks.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}
