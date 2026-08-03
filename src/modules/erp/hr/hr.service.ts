import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';

@Injectable()
export class HrService {
  private readonly logger = new Logger(HrService.name);

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

    const vales = await this.prisma.hr_vales.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Resolver created_by a nombre de usuario
    const userIds = [...new Set(vales.map(v => v.created_by).filter(Boolean))] as string[];
    const users = userIds.length > 0
      ? await this.db.getDefaultClient().users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true },
        })
      : [];
    const userMap = new Map(users.map(u => [u.id, u.name]));

    return vales.map(v => ({
      ...v,
      created_by_name: v.created_by ? (userMap.get(v.created_by) ?? null) : null,
    }));
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

      const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);

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

    // Crear documento VALE + current_account_entry
    const doc = await this.createValeDocument(vale, userId);

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
    // SUELDO, ADELANTO, EXTRAS = empleado recibe dinero (crédito)
    // RETIRO, REEMBOLSO, PRESTAMO = socio retira/devuelve (débito)
    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);

      // Revertir hr_account_entries
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

      // Revertir documento y current_account_entries
      await this.reverseValeDocument(vale, userId);
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
  // CREAR DOCUMENTO VALE + CURRENT ACCOUNT ENTRY
  // ══════════════════════════════════════════════════════════

  private async createValeDocument(vale: any, userId: string) {
    // Buscar document_type con category = 'VALE'
    const valeDocType = await this.prisma.document_types.findFirst({
      where: { category: 'VALE', active: true },
    });

    if (!valeDocType) {
      this.logger.warn('No se encontró document_type con category VALE');
      return null;
    }

    // Buscar sequence para numeración
    let nextNumber = 1;
    if (valeDocType.document_sequence_id) {
      const sequence = await this.prisma.document_sequences.findUnique({
        where: { id: valeDocType.document_sequence_id },
      });
      if (sequence) {
        nextNumber = (sequence.current_number ?? 0) + 1;
        await this.prisma.document_sequences.update({
          where: { id: sequence.id },
          data: { current_number: nextNumber },
        });
      }
    } else {
      // Sin secuencia: usar max number + 1
      this.logger.warn(`VALE sin secuencia asociada. Usando numeración automática.`);
      const lastDoc = await this.prisma.documents.findFirst({
        where: { document_type_id: valeDocType.id },
        orderBy: { number: 'desc' },
        select: { number: true }
      });
      nextNumber = (lastDoc?.number ?? 0) + 1;
    }

    // Crear documento
    const doc = await this.prisma.documents.create({
      data: {
        document_type_id: valeDocType.id,
        number: nextNumber,
        party_id: vale.party_id,
        currency_code: vale.currency_code,
        total: vale.amount,
        status: 2, // CONFIRMED
        date: vale.date,
        descrip: `Vale #${vale.number}`.substring(0, 50),
        ref: vale.type,
        created_by: userId,
      },
    });

    this.logger.log(`Documento VALE #${nextNumber} creado para vale #${vale.number}`);

    // Crear entrada en current_accounts
    await this.createCurrentAccountEntry(vale, doc.id, userId);

    return doc;
  }

  // ══════════════════════════════════════════════════════════
  // CREAR CURRENT ACCOUNT ENTRY
  // ══════════════════════════════════════════════════════════

  private async createCurrentAccountEntry(vale: any, documentId: string, userId: string) {
    // Buscar o crear cuenta corriente
    let account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: vale.party_id,
          currency_code: vale.currency_code,
        },
      },
    });

    if (!account) {
      account = await this.prisma.current_accounts.create({
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
    // RETIRO, REEMBOLSO, PRESTAMO = socio le debe a la empresa → balance baja (débito)
    // SUELDO, ADELANTO, EXTRAS, APORTE = empresa le debe / socio pone → balance sube (crédito)
    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);
    const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

    await this.prisma.current_account_entries.create({
      data: {
        current_account_id: account.id,
        type: 'SUELDO',
        amount,
        currency_code: vale.currency_code,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: `Vale #${vale.number} - ${vale.description || vale.type}`,
        reference_type: 'document',
        reference_id: documentId,
        date: vale.date,
        created_by: userId,
      },
    });

    await this.prisma.current_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    this.logger.log(`Current account entry creada para vale #${vale.number}`);
  }

  // ══════════════════════════════════════════════════════════
  // REVERTIR DOCUMENTO VALE
  // ══════════════════════════════════════════════════════════

  private async reverseValeDocument(vale: any, userId: string) {
    // Buscar el documento VALE asociado al vale
    const doc = await this.prisma.documents.findFirst({
      where: {
        descrip: { contains: `Vale #${vale.number}` },
        party_id: vale.party_id,
        deleted_at: null,
      },
    });

    if (!doc) {
      this.logger.warn(`No se encontró documento VALE para revertir vale #${vale.number}`);
      return;
    }

    // Revertir current_account_entries
    const entry = await this.prisma.current_account_entries.findFirst({
      where: {
        reference_id: doc.id,
        reference_type: 'document',
        deleted_at: null,
      },
    });

    if (entry) {
      const account = await this.prisma.current_accounts.findUnique({
        where: { id: entry.current_account_id },
      });

      if (account) {
        const currentBalance = account.balance.toNumber();
        const amount = entry.amount.toNumber();
        // Revertir: si era crédito (RETIRO), ahora es débito y viceversa
        const isDebit = entry.balance_after > entry.balance_before;
        const balanceAfter = isDebit ? currentBalance + amount : currentBalance - amount;

        await this.prisma.current_account_entries.create({
          data: {
            current_account_id: account.id,
            type: 'CREDIT_NOTE',
            amount,
            currency_code: doc.currency_code,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Reversión Vale #${vale.number}`,
            reference_type: 'document_reversal',
            reference_id: doc.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.current_accounts.update({
          where: { id: account.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      }
    }

    // Soft-delete el documento
    await this.prisma.documents.update({
      where: { id: doc.id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    this.logger.log(`Documento VALE #${doc.number} revertido para vale #${vale.number}`);
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
