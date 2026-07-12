import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';

@Injectable()
export class CurrentAccountsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async addEntry(dto: CreateCurrentAccountEntryDto, userId: string) {
    // Buscar o crear cuenta corriente
    let account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: dto.party_id,
          currency_code: dto.currency_code,
        },
      },
    });

    if (!account) {
      account = await this.prisma.current_accounts.create({
        data: {
          party_id: dto.party_id,
          party_type: dto.party_type,
          currency_code: dto.currency_code,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = account.balance.toNumber();
    const isDebit = ['PAYMENT', 'LOAN', 'CHECK_ISSUED', 'TRANSFER'].includes(dto.type);
    const balanceAfter = isDebit ? currentBalance - dto.amount : currentBalance + dto.amount;

    const entry = await this.prisma.current_account_entries.create({
      data: {
        current_account_id: account.id,
        type: dto.type as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: dto.description,
        reference_type: dto.reference_type,
        reference_id: dto.reference_id,
        payment_id: dto.payment_id,
        date: dto.date ? new Date(dto.date) : new Date(),
        created_by: userId,
      },
    });

    // Actualizar saldo
    await this.prisma.current_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    return entry;
  }

  async findByParty(partyId: string) {
    return this.prisma.current_accounts.findMany({
      where: { party_id: partyId, deleted_at: null },
      include: {
        party: { select: { id: true, name: true } },
      },
    });
  }

  async getEntries(partyId: string, currencyCode?: string) {
    const account = await this.prisma.current_accounts.findFirst({
      where: {
        party_id: partyId,
        ...(currencyCode ? { currency_code: currencyCode } : {}),
        deleted_at: null,
      },
    });

    if (!account) return [];

    return this.prisma.current_account_entries.findMany({
      where: { current_account_id: account.id, deleted_at: null },
      orderBy: { date: 'desc' },
    });
  }

  async getStatement(partyId: string, currencyCode: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
      include: {
        party: { select: { id: true, name: true } },
        entries: { orderBy: { date: 'asc' } },
      },
    });

    if (!account) throw new NotFoundException('Cuenta corriente no encontrada');

    return {
      account,
      balance: account.balance,
      entries: account.entries,
    };
  }

  async getBalance(partyId: string, currencyCode: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
    });

    return {
      party_id: partyId,
      currency_code: currencyCode,
      balance: account?.balance ?? 0,
    };
  }
}
