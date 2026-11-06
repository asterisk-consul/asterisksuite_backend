import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';
import { validateDocumentNumber } from '@/common/validators/document.validator';
import { assertPartyIdentityIsUnique } from './party-identity.util';

// Campos laborales del DTO que pertenecen al empleados vinculado, no al party
const LABOR_FIELDS = [
  'position',
  'department',
  'hire_date',
  'salary',
  'currency_code',
  'is_salesperson',
  'default_commission_rate',
  'commission_base',
] as const;

@Injectable()
export class BusinessPartiesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private validateSharePercentage(value?: string | null) {
    if (value == null || value === '') return;
    const percentage = Number(value);
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      throw new BadRequestException('El porcentaje de participación debe estar entre 0% y 100%');
    }
  }

  // ✅ CREATE con relaciones + auto-creación de employee/partner
  async create(data: CreateBusinessPartyDto) {
    // Validar formato de documento
    validateDocumentNumber(data.document_type, data.tax_id);
    await assertPartyIdentityIsUnique(this.prisma, [data.tax_id]);

    const laborData = this.pickLaborFields(data);
    const {
      locations, contacts, bank_accounts, first_name, last_name,
      position, department, hire_date, salary, currency_code, is_salesperson,
      default_commission_rate, commission_base, customer_enabled,
      partner_kind, share_percentage, capital_contributed,
      ...partyData
    } = data;

    if (data.type === 'PARTNER' && (partner_kind ?? 'PARTNER') === 'PARTNER') {
      this.validateSharePercentage(share_percentage);
    }

    const party = await this.prisma.business_parties.create({
      data: {
        ...partyData,

        party_locations: locations
          ? {
              create: locations.map((l) => ({
                location_id: l.location_id,
                label: l.label,
              })),
            }
          : undefined,

        party_contacts: contacts
          ? {
              create: contacts.map((c) => ({
                first_name: c.first_name,
                last_name: c.last_name,
                role: c.role,
                phone: c.phone,
                email: c.email,
              })),
            }
          : undefined,

        party_bank_accounts: bank_accounts
          ? {
              create: bank_accounts.map((b) => ({
                cbu: b.cbu,
                alias: b.alias,
                bank_name: b.bank_name,
                account_type: b.account_type,
                currency: b.currency,
                description: b.description,
                holder_name: b.holder_name,
                is_default: b.is_default ?? false,
              })),
            }
          : undefined,
      },

      include: this.fullInclude(),
    });

    // Auto-crear employee o partner si el tipo lo indica
    if (party.type === 'EMPLOYEE') {
      const nameParts = party.name.split(' ');
      const firstName = first_name || nameParts[0] || party.name;
      const lastName = last_name || nameParts.slice(1).join(' ') || '';

      const employee = await this.prisma.employees.create({
        data: {
          party_id: party.id,
          first_name: firstName,
          last_name: lastName,
          document_type: party.document_type ?? undefined,
          document_number: party.tax_id,
          currency_code: 'USD',
          is_active: party.active,
          created_by: party.created_by,
        },
      });

      // Aplicar datos laborales provistos en el payload (si vienen)
      const employeeData = this.buildEmployeeUpdate(laborData);
      if (Object.keys(employeeData).length > 0) {
        await this.prisma.employees.update({ where: { id: employee.id }, data: employeeData });
      }
    }

    if (party.type === 'PARTNER') {
      const nameParts = party.name.split(' ');
      const firstName = first_name || nameParts[0] || party.name;
      const lastName = last_name || nameParts.slice(1).join(' ') || '';

      const partnerKind = partner_kind ?? 'PARTNER';
      const isPartnerSalesperson = partnerKind === 'PARTNER' && (is_salesperson ?? false);

      await this.prisma.partners.create({
        data: {
          party_id: party.id,
          first_name: firstName,
          last_name: lastName,
          partner_kind: partnerKind,
          document_type: party.document_type ?? undefined,
          document_number: party.tax_id,
          share_percentage: partnerKind === 'PARTNER' && share_percentage != null && share_percentage !== '' ? String(share_percentage) : null,
          capital_contributed: partnerKind === 'PARTNER' && capital_contributed != null && capital_contributed !== '' ? String(capital_contributed) : null,
          is_salesperson: isPartnerSalesperson,
          default_commission_rate: isPartnerSalesperson && default_commission_rate != null ? String(default_commission_rate) : null,
          commission_base: commission_base ?? 'INVOICED',
          is_active: party.active,
          created_by: party.created_by,
        },
      });
    }

    await this.prisma.business_party_roles.upsert({
      where: { party_id_role: { party_id: party.id, role: party.type } },
      create: { party_id: party.id, role: party.type, active: party.active, created_by: party.created_by },
      update: { active: party.active, updated_by: party.updated_by },
    });
    if (party.type === 'EMPLOYEE' && customer_enabled) {
      await this.prisma.business_party_roles.upsert({
        where: { party_id_role: { party_id: party.id, role: 'CUSTOMER' } },
        create: { party_id: party.id, role: 'CUSTOMER', active: party.active, created_by: party.created_by },
        update: { active: party.active, updated_by: party.updated_by },
      });
    }

    return this.findOne(party.id);
  }

  // ✅ FIND ALL
  async findAll(type?: string) {
    const where: any = { deleted_at: null };

    if (type) {
      where.OR = [
        { type: type as any },
        { roles: { some: { role: type as any, active: true } } },
      ];
    }

    return this.prisma.business_parties.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: this.fullInclude(),
    });
  }

  async search(query: string, types: string[] = [], requestedLimit = 30) {
    const term = query.trim();
    const limit = Math.min(Math.max(requestedLimit, 1), 100);
    const typeFilter = types.length
      ? {
          OR: [
            { type: { in: types as any } },
            { roles: { some: { role: { in: types as any }, active: true } } },
          ],
        }
      : undefined;

    return this.prisma.business_parties.findMany({
      where: {
        active: true,
        AND: [
          ...(typeFilter ? [typeFilter] : []),
          ...(term
            ? [{
                OR: [
                  { name: { contains: term, mode: 'insensitive' as const } },
                  { business_names: { contains: term, mode: 'insensitive' as const } },
                  { tax_id: { contains: term, mode: 'insensitive' as const } },
                  { email: { contains: term, mode: 'insensitive' as const } },
                ],
              }]
            : []),
        ],
      },
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        type: true,
        name: true,
        business_names: true,
        tax_id: true,
        email: true,
        vat_condition: true,
        exemption_rate: true,
        active: true,
        roles: { select: { id: true, role: true, active: true } },
      },
    });
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const party = await this.prisma.business_parties.findUnique({
      where: { id },
      include: this.fullInclude(),
    });

    if (!party) throw new NotFoundException('Business party not found');

    // El empleado vinculado (solo para type EMPLOYEE) + su usuario de acceso (cross-DB)
    if (party.type === 'EMPLOYEE') {
      const employee = await this.prisma.employees.findFirst({
        where: { party_id: id, deleted_at: null },
        select: {
          id: true,
          user_id: true,
          first_name: true,
          last_name: true,
          position: true,
          department: true,
          hire_date: true,
          salary: true,
          currency_code: true,
          is_salesperson: true,
          default_commission_rate: true,
          commission_base: true,
          is_active: true,
        },
      });
      if (employee?.user_id) {
        (employee as any).user = await this.db
          .getDefaultClient()
          .users.findUnique({
            where: { id: employee.user_id },
            select: { id: true, name: true, email: true, active: true },
          });
      }
      (party as any).employee = employee ?? null;
    }

    if (party.type === 'PARTNER') {
      const partner = await this.prisma.partners.findFirst({
        where: { party_id: id, deleted_at: null },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          partner_kind: true,
          share_percentage: true,
          capital_contributed: true,
          is_salesperson: true,
          default_commission_rate: true,
          commission_base: true,
          is_active: true,
        },
      });
      (party as any).partner = partner ?? null;
    }

    return party;
  }

  // ✅ UPDATE (con sync de relaciones)
  async update(id: string, data: UpdateBusinessPartyDto) {
    const current = await this.findOne(id);
    if (data.tax_id !== undefined && data.tax_id !== current.tax_id) {
      await assertPartyIdentityIsUnique(this.prisma, [data.tax_id], { partyId: id });
    }
    validateDocumentNumber(data.document_type ?? current.document_type ?? undefined, data.tax_id ?? current.tax_id ?? undefined);

    const laborData = this.pickLaborFields(data);
    const {
      locations, contacts, bank_accounts, first_name, last_name,
      position, department, hire_date, salary, currency_code, is_salesperson,
      default_commission_rate, commission_base, customer_enabled,
      partner_kind, share_percentage, capital_contributed,
      ...partyData
    } = data;

    const updated = await this.prisma.business_parties.update({
      where: { id },
      data: {
        ...partyData,

        // 🔥 LOCATIONS sync
        party_locations: locations
          ? {
              deleteMany: {},
              create: locations.map((l) => ({
                location_id: l.location_id,
                label: l.label,
              })),
            }
          : undefined,

        // 🔥 CONTACTS sync
        party_contacts: contacts
          ? {
              deleteMany: {},
              create: contacts.map((c) => ({
                first_name: c.first_name,
                last_name: c.last_name,
                role: c.role,
                phone: c.phone,
                email: c.email,
              })),
            }
          : undefined,

        // 🔥 BANK ACCOUNTS sync
        party_bank_accounts: bank_accounts
          ? {
              deleteMany: {},
              create: bank_accounts.map((b) => ({
                cbu: b.cbu,
                alias: b.alias,
                bank_name: b.bank_name,
                account_type: b.account_type,
                currency: b.currency,
                description: b.description,
                holder_name: b.holder_name,
                is_default: b.is_default ?? false,
              })),
            }
          : undefined,
      },

      include: this.fullInclude(),
    });

    // 🔥 EMPLOYEE sync: persistir datos laborales en el empleado vinculado
    if (updated.type === 'EMPLOYEE') {
      if (data.tax_id !== undefined || data.document_type !== undefined) {
        await this.prisma.employees.updateMany({
          where: { party_id: id, deleted_at: null },
          data: {
            ...(data.tax_id !== undefined ? { document_number: data.tax_id } : {}),
            ...(data.document_type !== undefined ? { document_type: data.document_type } : {}),
          },
        });
      }
      const employeeData = this.buildEmployeeUpdate(laborData);
      if (first_name !== undefined) employeeData.first_name = first_name;
      if (last_name !== undefined) employeeData.last_name = last_name;
      if (Object.keys(employeeData).length > 0) {
        const employee = await this.prisma.employees.findFirst({
          where: { party_id: id, deleted_at: null },
          select: { id: true },
        });
        if (employee) {
          await this.prisma.employees.update({ where: { id: employee.id }, data: employeeData });
        }
      }

      if (data.name !== undefined && first_name === undefined && last_name === undefined) {
        const employee = await this.prisma.employees.findFirst({
          where: { party_id: id, deleted_at: null },
          select: { id: true },
        });
        if (employee) {
          const nameParts = updated.name.split(' ');
          await this.prisma.employees.update({
            where: { id: employee.id },
            data: { first_name: nameParts[0] ?? updated.name, last_name: nameParts.slice(1).join(' ') },
          });
        }
      }

      if (customer_enabled !== undefined) {
        await this.prisma.business_party_roles.upsert({
          where: { party_id_role: { party_id: id, role: 'CUSTOMER' } },
          create: { party_id: id, role: 'CUSTOMER', active: customer_enabled && updated.active },
          update: { active: customer_enabled && updated.active },
        });
      }
    }

    if (updated.type === 'PARTNER' && (data.tax_id !== undefined || data.document_type !== undefined)) {
      await this.prisma.partners.updateMany({
        where: { party_id: id, deleted_at: null },
        data: {
          ...(data.tax_id !== undefined ? { document_number: data.tax_id } : {}),
          ...(data.document_type !== undefined ? { document_type: data.document_type } : {}),
        },
      });
    }

    if (updated.type === 'PARTNER') {
      const currentPartner = await this.prisma.partners.findFirst({
        where: { party_id: id, deleted_at: null },
      });
      const nextPartnerKind = partner_kind ?? currentPartner?.partner_kind ?? 'PARTNER';
      if (nextPartnerKind === 'PARTNER') this.validateSharePercentage(share_percentage);

      const nameParts = updated.name.split(' ');
      const partnerData: Record<string, any> = {
        first_name: first_name ?? currentPartner?.first_name ?? nameParts[0] ?? updated.name,
        last_name: last_name ?? currentPartner?.last_name ?? nameParts.slice(1).join(' '),
        is_active: updated.active,
        ...(data.document_type !== undefined ? { document_type: data.document_type } : {}),
        ...(data.tax_id !== undefined ? { document_number: data.tax_id } : {}),
      };

      if (partner_kind !== undefined || !currentPartner) partnerData.partner_kind = nextPartnerKind;
      if (nextPartnerKind === 'INVESTOR') {
        Object.assign(partnerData, {
          partner_kind: 'INVESTOR',
          share_percentage: null,
          capital_contributed: null,
          is_salesperson: false,
          default_commission_rate: null,
        });
      } else {
        if (share_percentage !== undefined) partnerData.share_percentage = share_percentage == null || share_percentage === '' ? null : String(share_percentage);
        if (capital_contributed !== undefined) partnerData.capital_contributed = capital_contributed == null || capital_contributed === '' ? null : String(capital_contributed);
        if (is_salesperson !== undefined) partnerData.is_salesperson = is_salesperson;
        if (default_commission_rate !== undefined && (is_salesperson ?? currentPartner?.is_salesperson)) {
          partnerData.default_commission_rate = default_commission_rate == null ? null : String(default_commission_rate);
        }
        if (commission_base !== undefined) partnerData.commission_base = commission_base;
      }

      if (currentPartner) {
        await this.prisma.partners.update({ where: { id: currentPartner.id }, data: partnerData });
      } else {
        await this.prisma.partners.create({
          data: {
            ...partnerData,
            party_id: id,
            document_type: data.document_type ?? updated.document_type,
            document_number: data.tax_id ?? updated.tax_id,
            share_percentage: partnerData.share_percentage ?? null,
            capital_contributed: partnerData.capital_contributed ?? null,
            is_salesperson: partnerData.is_salesperson ?? false,
            default_commission_rate: partnerData.default_commission_rate ?? null,
            commission_base: partnerData.commission_base ?? 'INVOICED',
            created_by: updated.created_by,
          },
        });
      }
    }

    await this.prisma.business_party_roles.upsert({
      where: { party_id_role: { party_id: id, role: updated.type } },
      create: { party_id: id, role: updated.type, active: updated.active },
      update: { active: updated.active },
    });

    // Devolver findOne para incluir employee + user
    return this.findOne(id);
  }

  // ✅ SOFT DELETE
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.business_parties.update({
      where: { id },
      data: { active: false },
    });
  }

  // 🔥 INCLUDE CENTRALIZADO (clave para frontend)
  private fullInclude() {
    return {
      party_locations: {
        include: {
          locations: true,
        },
      },
      party_contacts: true,
      party_bank_accounts: true,
      roles: true,
    };
  }

  // Extrae los campos laborales presentes en el payload (pueden faltar)
  private pickLaborFields(data: Record<string, any>): Partial<Record<(typeof LABOR_FIELDS)[number], any>> {
    const picked: any = {};
    for (const field of LABOR_FIELDS) {
      if (data[field] !== undefined) {
        picked[field] = data[field];
      }
    }
    return picked;
  }

  // Convierte campos laborales del DTO en data para prisma.employees.update
  private buildEmployeeUpdate(laborData: Record<string, any>) {
    const data: Record<string, any> = {};
    if (laborData.position !== undefined) data.position = laborData.position;
    if (laborData.department !== undefined) data.department = laborData.department;
    if (laborData.hire_date !== undefined) {
      data.hire_date = laborData.hire_date ? new Date(laborData.hire_date) : null;
    }
    if (laborData.salary !== undefined) {
      data.salary = laborData.salary === '' || laborData.salary === null ? null : String(laborData.salary);
    }
    if (laborData.currency_code !== undefined) data.currency_code = laborData.currency_code;
    if (laborData.is_salesperson !== undefined) data.is_salesperson = laborData.is_salesperson;
    if (laborData.default_commission_rate !== undefined) {
      data.default_commission_rate =
        laborData.default_commission_rate === null ? null : String(laborData.default_commission_rate);
    }
    if (laborData.commission_base !== undefined) data.commission_base = laborData.commission_base;
    return data;
  }
}
