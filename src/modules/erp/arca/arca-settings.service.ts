import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createPrivateKey, randomBytes, sign, verify, X509Certificate } from 'node:crypto';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { ArcaHomologationClient, type ArcaAccessTicket } from './arca-homologation.client';
import { decryptArcaSecret, encryptArcaSecret } from './arca-credentials-crypto';

const CUIT_PATTERN = /^\d{11}$/;
const MAX_CREDENTIAL_FILE_BYTES = 64 * 1024;

@Injectable()
export class ArcaSettingsService {
  private readonly companiesUnderTest = new Set<string>();

  constructor(
    private readonly db: PrismaService,
    private readonly homologation: ArcaHomologationClient,
  ) {}

  async getSettings(userId: string) {
    const companyId = await this.requireCompanyAdmin(userId);
    const settings = await this.db.getDefaultClient().company_arca_settings.findUnique({
      where: { company_id: companyId },
    });
    return this.toPublicSettings(settings);
  }

  async saveCredentials(userId: string, issuerCuitRaw: string, certificateFile?: Express.Multer.File, privateKeyFile?: Express.Multer.File) {
    const companyId = await this.requireCompanyAdmin(userId);
    const issuerCuit = issuerCuitRaw?.replace(/\D/g, '') || '';
    if (!CUIT_PATTERN.test(issuerCuit)) throw new BadRequestException('Ingresá el CUIT emisor de 11 dígitos, sin guiones.');
    if (!certificateFile || !privateKeyFile) {
      throw new BadRequestException('Adjuntá el certificado de homologación y su clave privada PEM.');
    }
    if (certificateFile.size > MAX_CREDENTIAL_FILE_BYTES || privateKeyFile.size > MAX_CREDENTIAL_FILE_BYTES) {
      throw new BadRequestException('Cada archivo debe pesar menos de 64 KB.');
    }

    const certificatePem = certificateFile.buffer.toString('utf8');
    const privateKeyPem = privateKeyFile.buffer.toString('utf8');
    let certificate: X509Certificate;
    let privateKey;
    try {
      certificate = new X509Certificate(certificatePem);
      privateKey = createPrivateKey(privateKeyPem);
    } catch {
      throw new BadRequestException('Los archivos no tienen un certificado X.509 PEM y una clave privada PEM válidos.');
    }

    const challenge = randomBytes(32);
    const signature = sign('sha256', challenge, privateKey);
    if (!verify('sha256', challenge, certificate.publicKey, signature)) {
      throw new BadRequestException('La clave privada no corresponde al certificado seleccionado.');
    }
    const certificateValidTo = new Date(certificate.validTo);
    if (Number.isNaN(certificateValidTo.getTime()) || certificateValidTo.getTime() <= Date.now()) {
      throw new BadRequestException('El certificado está vencido o no tiene una fecha de vencimiento válida.');
    }

    const encrypted = encryptArcaSecret(JSON.stringify({ certificatePem, privateKeyPem }));
    const saved = await this.db.getDefaultClient().company_arca_settings.upsert({
      where: { company_id: companyId },
      create: {
        company_id: companyId,
        issuer_cuit: issuerCuit,
        environment: 'HOMOLOGATION',
        credentials_ciphertext: encrypted.ciphertext,
        credentials_iv: encrypted.iv,
        credentials_auth_tag: encrypted.authTag,
        certificate_subject: certificate.subject,
        certificate_serial: certificate.serialNumber,
        certificate_valid_to: certificateValidTo,
        configured_by: userId,
      },
      update: {
        issuer_cuit: issuerCuit,
        credentials_ciphertext: encrypted.ciphertext,
        credentials_iv: encrypted.iv,
        credentials_auth_tag: encrypted.authTag,
        access_ticket_ciphertext: null,
        access_ticket_iv: null,
        access_ticket_auth_tag: null,
        access_ticket_expires_at: null,
        certificate_subject: certificate.subject,
        certificate_serial: certificate.serialNumber,
        certificate_valid_to: certificateValidTo,
        point_of_sale: null,
        available_point_sales: null,
        last_test_status: 'NOT_TESTED',
        last_test_message: null,
        last_tested_at: null,
        configured_by: userId,
      },
    });
    return this.toPublicSettings(saved);
  }

  async testConnection(userId: string) {
    const companyId = await this.requireCompanyAdmin(userId);
    if (this.companiesUnderTest.has(companyId)) {
      throw new ConflictException('Ya hay una prueba de conexión con ARCA en curso para esta empresa.');
    }
    this.companiesUnderTest.add(companyId);
    const client = this.db.getDefaultClient();

    try {
      const settings = await client.company_arca_settings.findUnique({ where: { company_id: companyId } });
      if (!settings) throw new NotFoundException('Guardá primero el CUIT y los archivos del certificado de homologación.');

      const credentials = JSON.parse(decryptArcaSecret({
        ciphertext: settings.credentials_ciphertext,
        iv: settings.credentials_iv,
        authTag: settings.credentials_auth_tag,
      })) as { certificatePem: string; privateKeyPem: string };
      const ticket = await this.getOrRequestTicket(settings, credentials);
      const points = await this.homologation.getPointOfSales(ticket, settings.issuer_cuit);
      const statusMessage = points.length
        ? `Conexión aprobada. ARCA informó ${points.length} punto(s) de venta.`
        : 'La autenticación funcionó, pero ARCA no informó puntos de venta para WSFE.';
      const updated = await client.company_arca_settings.update({
        where: { company_id: companyId },
        data: {
          available_point_sales: points as any,
          last_test_status: 'READY',
          last_test_message: statusMessage,
          last_tested_at: new Date(),
        },
      });
      return { ...this.toPublicSettings(updated), points_of_sale: points };
    } catch (error) {
      const settings = await client.company_arca_settings.findUnique({ where: { company_id: companyId } });
      if (settings) {
        const message = error instanceof Error ? error.message : 'No se pudo completar la prueba de conexión con ARCA.';
        await client.company_arca_settings.update({
          where: { company_id: companyId },
          data: {
            last_test_status: 'ERROR',
            last_test_message: message.slice(0, 500),
            last_tested_at: new Date(),
          },
        });
      }
      throw error;
    } finally {
      this.companiesUnderTest.delete(companyId);
    }
  }

  async simulateConnection(userId: string) {
    await this.requireCompanyAdmin(userId);
    if (!this.isSimulationEnabled()) {
      throw new ForbiddenException('La simulación de ARCA solo está habilitada fuera de producción y con ARCA_HOMOLOGATION_MOCK_ENABLED=true.');
    }

    const testedAt = new Date();
    return {
      configured: false,
      issuer_cuit: null,
      environment: 'HOMOLOGATION' as const,
      point_of_sale: null,
      certificate_subject: null,
      certificate_serial: null,
      certificate_valid_to: null,
      points_of_sale: [
        { number: 1, emissionType: 'WSFE' },
        { number: 3, emissionType: 'WSFE' },
      ],
      last_test_status: 'READY' as const,
      last_test_message: 'Simulación local completada. No se usaron credenciales ni se contactó con ARCA; estos puntos de venta son ficticios.',
      last_tested_at: testedAt,
      simulation_enabled: true,
      simulated: true,
    };
  }

  async selectPointOfSale(userId: string, pointOfSale: number | null) {
    const companyId = await this.requireCompanyAdmin(userId);
    if (pointOfSale !== null && (!Number.isInteger(pointOfSale) || pointOfSale < 1 || pointOfSale > 99999)) {
      throw new BadRequestException('El punto de venta debe ser un número entre 1 y 99999.');
    }
    const settings = await this.db.getDefaultClient().company_arca_settings.findUnique({ where: { company_id: companyId } });
    if (!settings || settings.last_test_status !== 'READY') {
      throw new BadRequestException('Probá la conexión con ARCA antes de elegir un punto de venta.');
    }
    const points = Array.isArray(settings.available_point_sales)
      ? settings.available_point_sales as Array<{ number?: number }>
      : [];
    if (pointOfSale !== null && !points.some((point) => point.number === pointOfSale)) {
      throw new BadRequestException('Elegí un punto de venta devuelto por ARCA en la última prueba.');
    }
    const updated = await this.db.getDefaultClient().company_arca_settings.update({
      where: { company_id: companyId },
      data: { point_of_sale: pointOfSale, configured_by: userId },
    });
    return this.toPublicSettings(updated);
  }

  private async getOrRequestTicket(settings: any, credentials: { certificatePem: string; privateKeyPem: string }): Promise<ArcaAccessTicket> {
    if (
      settings.access_ticket_ciphertext && settings.access_ticket_iv && settings.access_ticket_auth_tag
      && settings.access_ticket_expires_at && settings.access_ticket_expires_at.getTime() > Date.now() + 60_000
    ) {
      const raw = decryptArcaSecret({
        ciphertext: settings.access_ticket_ciphertext,
        iv: settings.access_ticket_iv,
        authTag: settings.access_ticket_auth_tag,
      });
      const ticket = JSON.parse(raw) as { token: string; sign: string };
      return { ...ticket, expiresAt: settings.access_ticket_expires_at };
    }

    const ticket = await this.homologation.requestAccessTicket(credentials.certificatePem, credentials.privateKeyPem);
    const encrypted = encryptArcaSecret(JSON.stringify({ token: ticket.token, sign: ticket.sign }));
    await this.db.getDefaultClient().company_arca_settings.update({
      where: { company_id: settings.company_id },
      data: {
        access_ticket_ciphertext: encrypted.ciphertext,
        access_ticket_iv: encrypted.iv,
        access_ticket_auth_tag: encrypted.authTag,
        access_ticket_expires_at: ticket.expiresAt,
      },
    });
    return ticket;
  }

  private async requireCompanyAdmin(userId: string) {
    const companyId = getCurrentCompanyId();
    if (!companyId) throw new BadRequestException('No se pudo determinar la empresa actual.');
    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
      select: { role: true, company: { select: { deleted_at: true } } },
    });
    if (!membership || membership.company.deleted_at) throw new ForbiddenException('No tenés acceso a esta empresa.');
    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Solo OWNER o ADMIN pueden configurar la conexión con ARCA.');
    }
    return companyId;
  }

  private toPublicSettings(settings: any) {
    const points = Array.isArray(settings?.available_point_sales)
      ? settings.available_point_sales as Array<{ number: number; emissionType: string }>
      : [];
    return {
      configured: Boolean(settings?.credentials_ciphertext),
      issuer_cuit: settings?.issuer_cuit ?? null,
      environment: 'HOMOLOGATION' as const,
      point_of_sale: settings?.point_of_sale ?? null,
      certificate_subject: settings?.certificate_subject ?? null,
      certificate_serial: settings?.certificate_serial ?? null,
      certificate_valid_to: settings?.certificate_valid_to ?? null,
      points_of_sale: points,
      last_test_status: settings?.last_test_status ?? 'NOT_TESTED',
      last_test_message: settings?.last_test_message ?? null,
      last_tested_at: settings?.last_tested_at ?? null,
      simulation_enabled: this.isSimulationEnabled(),
    };
  }

  private isSimulationEnabled() {
    return process.env.NODE_ENV !== 'production'
      && process.env.ARCA_HOMOLOGATION_MOCK_ENABLED?.trim().toLowerCase() === 'true';
  }
}
