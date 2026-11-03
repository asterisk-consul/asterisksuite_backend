import { BadGatewayException, BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const WSAA_URL = 'https://wsaa.homo.arca.gov.ar/ws/services/LoginCms';
const WSFE_URL = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx';
const SOAP_ENVELOPE = 'http://schemas.xmlsoap.org/soap/envelope/';
const WSAA_NAMESPACE = 'http://wsaa.view.sua.dvadac.desein.afip.gov';
const WSFE_NAMESPACE = 'http://ar.gov.afip.dif.FEV1/';

export type ArcaAccessTicket = { token: string; sign: string; expiresAt: Date };
export type ArcaPointOfSale = { number: number; emissionType: string };

@Injectable()
export class ArcaHomologationClient {
  async requestAccessTicket(certificatePem: string, privateKeyPem: string): Promise<ArcaAccessTicket> {
    const cms = await this.signLoginTicketRequest(certificatePem, privateKeyPem);
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="${SOAP_ENVELOPE}" xmlns:wsaa="${WSAA_NAMESPACE}">
        <soapenv:Header/><soapenv:Body><wsaa:loginCms><wsaa:in0>${cms}</wsaa:in0></wsaa:loginCms></soapenv:Body>
      </soapenv:Envelope>`;
    const response = await this.postSoap(WSAA_URL, envelope, 'urn:LoginCms');
    const encodedTicket = extractTag(response, 'loginCmsReturn');
    if (!encodedTicket) throw new BadGatewayException(this.extractArcaError(response, 'ARCA no devolvió el ticket de acceso.'));

    const ticketXml = decodeXml(encodedTicket);
    const token = extractTag(ticketXml, 'token');
    const sign = extractTag(ticketXml, 'sign');
    const expiresAtRaw = extractTag(ticketXml, 'expirationTime');
    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
    if (!token || !sign || !expiresAt || Number.isNaN(expiresAt.getTime())) {
      throw new BadGatewayException(this.extractArcaError(ticketXml, 'ARCA devolvió una respuesta de autenticación incompleta.'));
    }
    if (expiresAt.getTime() <= Date.now()) {
      throw new BadGatewayException('ARCA devolvió un ticket vencido. Revisá la fecha y hora del backend.');
    }
    return { token, sign, expiresAt };
  }

  async getPointOfSales(ticket: ArcaAccessTicket, issuerCuit: string): Promise<ArcaPointOfSale[]> {
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="${SOAP_ENVELOPE}" xmlns:ar="${WSFE_NAMESPACE}">
        <soapenv:Header/><soapenv:Body><ar:FEParamGetPtosVenta><ar:Auth>
          <ar:Token>${escapeXml(ticket.token)}</ar:Token>
          <ar:Sign>${escapeXml(ticket.sign)}</ar:Sign>
          <ar:Cuit>${issuerCuit}</ar:Cuit>
        </ar:Auth></ar:FEParamGetPtosVenta></soapenv:Body>
      </soapenv:Envelope>`;
    const response = await this.postSoap(
      WSFE_URL,
      envelope,
      `${WSFE_NAMESPACE}FEParamGetPtosVenta`,
    );
    const arcaError = this.extractArcaError(response);
    if (arcaError) throw new BadRequestException(arcaError);

    const resultBlocks = extractTagBlocks(response, 'PtoVenta');
    return resultBlocks
      .map((block) => ({
        number: Number(extractTag(block, 'Nro')),
        emissionType: extractTag(block, 'EmisionTipo') || 'WSFE',
      }))
      .filter((point) => Number.isInteger(point.number) && point.number > 0)
      .sort((left, right) => left.number - right.number);
  }

  private async signLoginTicketRequest(certificatePem: string, privateKeyPem: string) {
    const now = Date.now();
    const generationTime = new Date(now - 60_000).toISOString().replace(/\.\d{3}Z$/, 'Z');
    const expirationTime = new Date(now + 10 * 60_000).toISOString().replace(/\.\d{3}Z$/, 'Z');
    const uniqueId = Math.floor(now / 1000) >>> 0;
    const request = `<?xml version="1.0" encoding="UTF-8"?>
      <loginTicketRequest version="1.0"><header>
        <uniqueId>${uniqueId}</uniqueId><generationTime>${generationTime}</generationTime><expirationTime>${expirationTime}</expirationTime>
      </header><service>wsfe</service></loginTicketRequest>`;
    const directory = await mkdtemp(join(tmpdir(), 'asterisk-arca-'));
    const certificatePath = join(directory, 'certificate.pem');
    const privateKeyPath = join(directory, 'private.key');
    const requestPath = join(directory, 'login-ticket.xml');
    const signedPath = join(directory, 'login-ticket.cms');
    try {
      await Promise.all([
        writeFile(certificatePath, certificatePem, { mode: 0o600 }),
        writeFile(privateKeyPath, privateKeyPem, { mode: 0o600 }),
        writeFile(requestPath, request, { mode: 0o600 }),
      ]);
      const executable = process.env.OPENSSL_BIN?.trim() || 'openssl';
      try {
        await execFileAsync(executable, [
          'smime', '-sign', '-binary', '-nodetach', '-in', requestPath,
          '-signer', certificatePath, '-inkey', privateKeyPath,
          '-outform', 'DER', '-out', signedPath,
        ], { timeout: 10_000, maxBuffer: 64 * 1024 });
      } catch {
        throw new ServiceUnavailableException(
          'No se pudo firmar la solicitud de ARCA. Verificá que OpenSSL esté instalado y que OPENSSL_BIN apunte al ejecutable.',
        );
      }
      return (await readFile(signedPath)).toString('base64');
    } finally {
      await rm(directory, { recursive: true, force: true }).catch(() => undefined);
    }
  }

  private async postSoap(url: string, envelope: string, soapAction: string) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'text/xml; charset=utf-8',
          soapaction: `"${soapAction}"`,
        },
        body: envelope,
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new ServiceUnavailableException(
        'No se pudo conectar con ARCA en homologación. Revisá la conectividad y volvé a intentar.',
      );
    }
    const body = await response.text();
    if (!response.ok) {
      throw new BadGatewayException(
        this.extractArcaError(body, `ARCA respondió con HTTP ${response.status}.`),
      );
    }
    return body;
  }

  private extractArcaError(xml: string, fallback?: string) {
    const fault = extractTag(xml, 'faultstring');
    if (fault) return `ARCA: ${decodeXml(fault).slice(0, 500)}`;
    const message = extractTagBlocks(xml, 'Err')
      .map((block) => extractTag(block, 'Msg'))
      .find(Boolean);
    if (message) return `ARCA: ${decodeXml(message).slice(0, 500)}`;
    if (fallback) return fallback;
    return null;
  }
}

function extractTag(xml: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(new RegExp(`<(?:[\\w.-]+:)?${escaped}\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?${escaped}\\s*>`, 'i'));
  return match?.[1]?.trim() || null;
}

function extractTagBlocks(xml: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const expression = new RegExp(`<(?:[\\w.-]+:)?${escaped}\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?${escaped}\\s*>`, 'gi');
  return [...xml.matchAll(expression)].map((match) => match[1] || '');
}

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
