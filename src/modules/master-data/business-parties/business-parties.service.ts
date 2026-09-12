import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';
import { validateDocumentNumber } from '@/common/validators/document.validator';

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

  // ✅ CREATE con relaciones + auto-creación de employee/partner
  async create(data: CreateBusinessPartyDto) {
    // Validar formato de documento
    validateDocumentNumber(data.document_type, data.tax_id);

    const laborData = this.pickLaborFields(data);
    const { locations, contacts, bank_accounts, position, department, hire_date, salary, currency_code, is_salesperson, default_commission_rate, commission_base, ...partyData } = data;

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
      const firstName = nameParts[0] || party.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      const employee = await this.prisma.employees.create({
        data: {
          party_id: party.id,
          first_name: firstName,
          last_name: lastName,
          document_type: 'CUIT',
          document_number: party.tax_id,
          currency_code: 'USD',
          is_active: true,
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
      const firstName = nameParts[0] || party.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      await this.prisma.partners.create({
        data: {
          party_id: party.id,
          first_name: firstName,
          last_name: lastName,
          document_type: 'CUIT',
          document_number: party.tax_id,
          is_active: true,
          created_by: party.created_by,
        },
      });
    }

    return party;
  }

  // ✅ FIND ALL
  async findAll(type?: string) {
    return this.prisma.business_parties.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { created_at: 'desc' },
      include: this.fullInclude(),
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

    return party;
  }

  // ✅ UPDATE (con sync de relaciones)
  async update(id: string, data: UpdateBusinessPartyDto) {
    await this.findOne(id);

    const laborData = this.pickLaborFields(data);
    const { locations, contacts, bank_accounts, position, department, hire_date, salary, currency_code, is_salesperson, default_commission_rate, commission_base, ...partyData } = data;

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
      const employeeData = this.buildEmployeeUpdate(laborData);
      if (Object.keys(employeeData).length > 0) {
        const employee = await this.prisma.employees.findFirst({
          where: { party_id: id, deleted_at: null },
          select: { id: true },
        });
        if (employee) {
          await this.prisma.employees.update({ where: { id: employee.id }, data: employeeData });
        }
      }
    }

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
