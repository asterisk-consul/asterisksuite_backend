import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';

@Injectable()
export class HrService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ══════════════════════════════════════════════════════════
  // VALES
  // ══════════════════════════════════════════════════════════

  async createVale(dto: CreateHrValeDto, userId: string) {
    const party = await this.prisma.business_parties.findUnique({
      where: { id: dto.party_id },
    });

    if (!party) {
      throw new NotFoundException('Persona no encontrada');
    }

    const lastVale = await this.prisma.hr_vales.findFirst({
      where: { party_id: dto.party_id },
      orderBy: { number: 'desc' },
    });

    const number = (lastVale?.number ?? 0) + 1;

    return this.prisma.hr_vales.create({
      data: {
        number,
        party_id: dto.party_id,
        party_type: dto.party_type,
        type: dto.type as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        date: new Date(dto.date),
        description: dto.description,
        status: 'DRAFT',
        created_by: userId,
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });
  }

  async findAllVales(params?: {
    party_id?: string;
    party_type?: string;
    status?: string;
    type?: string;
  }) {
    const where: any = { deleted_at: null };

    if (params?.party_id) where.party_id = params.party_id;
    if (params?.party_type) where.party_type = params.party_type;
    if (params?.status) where.status = params.status;
    if (params?.type) where.type = params.type;

    return this.prisma.hr_vales.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOneVale(id: string) {
    const vale = await this.prisma.hr_vales.findUnique({
      where: { id },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });

    if (!vale) {
      throw new NotFoundException('Vale no encontrado');
    }

    return vale;
  }

  async confirmVale(id: string, userId: string) {
    const vale = await this.findOneVale(id);

    if (vale.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden confirmar vales en borrador');
    }

    const isDebit = ['RETIRO', 'ADELANTO'].includes(vale.type);

    let account = await this.prisma.hr_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: vale.party_id,
          currency_code: vale.currency_code,
        },
      },
    });

    if (!account) {
      account = await this.prisma.hr_accounts.create({
        data: {
          party_id: vale.party_id,
          party_type: vale.party_type,
          currency_code: vale.currency_code,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = account.balance.toNumber();
    const amount = vale.amount.toNumber();
    const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

    await this.prisma.hr_account_entries.create({
      data: {
        hr_account_id: account.id,
        type: isDebit ? 'VALE_DEBIT' : 'VALE_CREDIT',
        amount,
        currency_code: vale.currency_code,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: `Vale #${vale.number} - ${vale.type}`,
        reference_type: 'hr_vale',
        reference_id: vale.id,
        date: new Date(),
        created_by: userId,
      },
    });

    await this.prisma.hr_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    return this.prisma.hr_vales.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmed_at: new Date(),
        confirmed_by: userId,
        updated_at: new Date(),
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });
  }

  async cancelVale(id: string, userId: string) {
    const vale = await this.findOneVale(id);

    if (vale.status === 'CANCELLED') {
      throw new BadRequestException('El vale ya está anulado');
    }

    if (vale.status === 'CONFIRMED') {
      const isDebit = ['RETIRO', 'ADELANTO'].includes(vale.type);

      const account = await this.prisma.hr_accounts.findUnique({
        where: {
          party_id_currency_code: {
            party_id: vale.party_id,
            currency_code: vale.currency_code,
          },
        },
      });

      if (account) {
        const currentBalance = account.balance.toNumber();
        const amount = vale.amount.toNumber();
        const balanceAfter = isDebit ? currentBalance + amount : currentBalance - amount;

        await this.prisma.hr_account_entries.create({
          data: {
            hr_account_id: account.id,
            type: 'ADJUSTMENT',
            amount,
            currency_code: vale.currency_code,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Anulación Vale #${vale.number}`,
            reference_type: 'hr_vale',
            reference_id: vale.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.hr_accounts.update({
          where: { id: account.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      }
    }

    return this.prisma.hr_vales.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // ══════════════════════════════════════════════════════════
  // CUENTAS CORRIENTES RRHH
  // ══════════════════════════════════════════════════════════

  async getHrAccounts(params?: { party_type?: string }) {
    const where: any = { deleted_at: null, active: true };

    if (params?.party_type) where.party_type = params.party_type;

    return this.prisma.hr_accounts.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { balance: 'desc' },
    });
  }

  async getHrAccountEntries(hrAccountId: string) {
    const account = await this.prisma.hr_accounts.findUnique({
      where: { id: hrAccountId },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });

    if (!account) {
      throw new NotFoundException('Cuenta corriente no encontrada');
    }

    const entries = await this.prisma.hr_account_entries.findMany({
      where: { hr_account_id: hrAccountId, deleted_at: null },
      orderBy: { date: 'desc' },
    });

    return { account, entries };
  }

  async getHrBalance(partyId: string, currencyCode: string) {
    const account = await this.prisma.hr_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
    });

    return { balance: account?.balance ?? 0 };
  }
}
