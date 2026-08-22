import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';
import { parseLocalDateTime } from '@/common/utils/dates';

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
        date: parseLocalDateTime(dto.date),
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
    user_id?: string;
  }) {
    const where: any = { deleted_at: null };

    if (params?.party_id) where.party_id = params.party_id;
    if (params?.party_type) where.party_type = params.party_type;
    if (params?.status) where.status = params.status;
    if (params?.type) where.type = params.type;
    if (params?.user_id) where.created_by = params.user_id;

    const vales = await this.prisma.hr_vales.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
        commission_details: {
          include: {
            document: {
              select: { id: true, number: true, date: true },
            },
          },
        },
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
        commission_details: {
          include: {
            document: {
              select: { id: true, number: true, date: true },
            },
          },
        },
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
    // Buscar o crear cuenta corriente (una por party, sin currency_code)
    let account = await this.prisma.current_accounts.findUnique({
      where: { party_id: vale.party_id },
    });

    if (!account) {
      account = await this.prisma.current_accounts.create({
        data: {
          party_id: vale.party_id,
          party_type: vale.party_type,
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
        type: isDebit ? 'COLLECTION' : 'PAYMENT',
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

  // ══════════════════════════════════════════════════════════
  // REPORTE DE COMISIONES
  // ══════════════════════════════════════════════════════════

  async getCommissionsReport(month: string, sellerId?: string) {
    // month format: "YYYY-MM"
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Find OV documents with commission, not settled, and with associated invoice
    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: sellerId ? sellerId : { not: null },
        commission_rate: { not: null },
        commission_settled_at: null,
        document: {
          date: { gte: startDate, lte: endDate },
          deleted_at: null,
          child_documents: {
            some: {
              deleted_at: null,
              status: { in: [1, 2] },
              document_types: { category: 'INVOICE' },
            },
          },
        },
      },
      include: {
        seller: {
          select: { id: true, first_name: true, last_name: true, party_id: true },
        },
        document: {
          select: { id: true, number: true, subtotal: true, date: true, currency_code: true },
        },
      },
      orderBy: { document: { date: 'asc' } },
    });

    // Group by seller
    const sellerMap = new Map<string, {
      seller_id: string;
      seller_name: string;
      party_id: string | null;
      total_ventas: number;
      total_comisiones: number;
      cantidad_ov: number;
      items: {
        document_id: string;
        ov_number: number;
        subtotal: number;
        commission_rate: number;
        commission_amount: number;
        date: Date;
      }[];
    }>();

    for (const ov of ordenes) {
      const key = ov.seller_id!;
      if (!sellerMap.has(key)) {
        const seller = ov.seller!;
        sellerMap.set(key, {
          seller_id: key,
          seller_name: `${seller.first_name} ${seller.last_name}`,
          party_id: seller.party_id,
          total_ventas: 0,
          total_comisiones: 0,
          cantidad_ov: 0,
          items: [],
        });
      }

      const entry = sellerMap.get(key)!;
      const subtotal = Number(ov.document.subtotal);
      const rate = Number(ov.commission_rate);
      const amount = subtotal * rate / 100;

      entry.total_ventas += subtotal;
      entry.total_comisiones += amount;
      entry.cantidad_ov += 1;
      entry.items.push({
        document_id: ov.document_id,
        ov_number: ov.document.number,
        subtotal,
        commission_rate: rate,
        commission_amount: amount,
        date: ov.document.date,
      });
    }

    return {
      month,
      sellers: Array.from(sellerMap.values()),
      total_ventas: Array.from(sellerMap.values()).reduce((s, v) => s + v.total_ventas, 0),
      total_comisiones: Array.from(sellerMap.values()).reduce((s, v) => s + v.total_comisiones, 0),
      cantidad_ov: Array.from(sellerMap.values()).reduce((s, v) => s + v.cantidad_ov, 0),
    };
  }

  // ══════════════════════════════════════════════════════════
  // GENERAR VALE EXTRAS POR COMISIONES
  // ══════════════════════════════════════════════════════════

  async generateCommissionVale(sellerId: string, month: string, userId: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Find unsettled OV for this seller in this month with associated invoice
    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: sellerId,
        commission_rate: { not: null },
        commission_settled_at: null,
        document: {
          date: { gte: startDate, lte: endDate },
          deleted_at: null,
          child_documents: {
            some: {
              deleted_at: null,
              status: { in: [1, 2] },
              document_types: { category: 'INVOICE' },
            },
          },
        },
      },
      include: {
        seller: {
          select: { id: true, first_name: true, last_name: true, party_id: true },
        },
        document: {
          select: { id: true, number: true, subtotal: true, date: true, currency_code: true },
        },
      },
    });

    if (!ordenes.length) {
      throw new BadRequestException('No hay comisiones pendientes para este vendedor en este mes');
    }

    const seller = ordenes[0].seller!;
    const partyId = seller.party_id;

    if (!partyId) {
      throw new BadRequestException('El vendedor no tiene una party asociada');
    }

    // Calculate total
    let totalCommission = 0;
    for (const ov of ordenes) {
      const subtotal = Number(ov.document.subtotal);
      const rate = Number(ov.commission_rate);
      totalCommission += subtotal * rate / 100;
    }

    // Create vale
    const lastVale = await this.prisma.hr_vales.findFirst({
      where: { party_id: partyId },
      orderBy: { number: 'desc' },
    });
    const valeNumber = (lastVale?.number ?? 0) + 1;

    const [yearStr, monthStr] = month.split('-');
    const valeDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);

    const vale = await this.prisma.hr_vales.create({
      data: {
        number: valeNumber,
        party_id: partyId,
        party_type: 'EMPLOYEE',
        type: 'EXTRAS',
        amount: totalCommission,
        currency_code: ordenes[0].document.currency_code ?? 'ARS',
        date: valeDate,
        description: `Comisiones ${month} - ${seller.first_name} ${seller.last_name}`,
        status: 'DRAFT',
        created_by: userId,
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });

    // Create commission detail lines
    for (const ov of ordenes) {
      const subtotal = Number(ov.document.subtotal);
      const rate = Number(ov.commission_rate);
      const amount = subtotal * rate / 100;

      await this.prisma.hr_vale_commission_details.create({
        data: {
          hr_vale_id: vale.id,
          document_id: ov.document_id,
          seller_id: sellerId,
          subtotal,
          commission_rate: rate,
          commission_amount: amount,
          date: ov.document.date,
        },
      });

      // Mark OV as settled
      await this.prisma.orden_venta_documents.update({
        where: { document_id: ov.document_id },
        data: {
          commission_settled_at: new Date(),
          commission_vale_id: vale.id,
        },
      });
    }

    this.logger.log(`Vale EXTRAS #${valeNumber} generado para ${seller.first_name} ${seller.last_name} - Total: ${totalCommission}`);

    return vale;
  }
}
