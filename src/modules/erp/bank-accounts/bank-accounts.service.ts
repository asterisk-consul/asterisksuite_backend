import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateBankAccountDto, userId: string) {
    return this.prisma.bank_accounts.create({
      data: {
        name: dto.name,
        bank_name: dto.bank_name,
        account_type: dto.account_type,
        cbu: dto.cbu,
        alias: dto.alias,
        account_number: dto.account_number,
        currency_code: dto.currency_code,
        balance: dto.balance ?? 0,
        active: dto.active ?? true,
        created_by: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.bank_accounts.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.bank_accounts.findFirst({
      where: { id, deleted_at: null },
      include: { movements: { orderBy: { date: 'desc' }, take: 20 } },
    });
    if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
    return account;
  }

  async update(id: string, dto: UpdateBankAccountDto, userId: string) {
    await this.findOne(id);
    return this.prisma.bank_accounts.update({
      where: { id },
      data: {
        ...dto,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.bank_accounts.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
        active: false,
      },
    });
  }

  async getMovements(id: string) {
    await this.findOne(id);
    return this.prisma.bank_account_movements.findMany({
      where: { bank_account_id: id, deleted_at: null },
      orderBy: { date: 'desc' },
    });
  }
}
