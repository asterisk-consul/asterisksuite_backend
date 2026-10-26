import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';

export interface OpenWaGroup {
  id: string;
  name: string;
}

export interface OpenWaSendResult {
  messageId?: string;
  timestamp?: number;
}

@Injectable()
export class OpenWaClient {
  getStatus() {
    const baseUrl = process.env.OPENWA_BASE_URL?.trim();
    const apiKey = process.env.OPENWA_API_KEY?.trim();
    const sessionId = process.env.OPENWA_SESSION_ID?.trim();
    const gatewayEnabled = process.env.WHATSAPP_REPORTS_ENABLED?.toLowerCase() === 'true';

    return {
      gatewayEnabled,
      configured: Boolean(baseUrl && apiKey && sessionId),
      apiKeyConfigured: Boolean(apiKey),
      sessionConfigured: Boolean(sessionId),
    };
  }

  assertReady() {
    const status = this.getStatus();
    if (!status.gatewayEnabled) {
      throw new ServiceUnavailableException('La integración de reportes por WhatsApp está desactivada en el backend.');
    }
    if (!status.configured) {
      throw new ServiceUnavailableException('Falta configurar OPENWA_BASE_URL, OPENWA_API_KEY u OPENWA_SESSION_ID en el backend.');
    }
  }

  async listGroups(): Promise<OpenWaGroup[]> {
    this.assertReady();
    const sessionId = encodeURIComponent(process.env.OPENWA_SESSION_ID!.trim());
    const result = await this.request<unknown>(
      `sessions/${sessionId}/groups?limit=500&offset=0`,
      'GET',
    );
    if (!Array.isArray(result)) {
      throw new BadGatewayException('OpenWA devolvió un formato inesperado al consultar los grupos.');
    }
    return result
      .filter((group: any) => typeof group?.id === 'string' && group.id.endsWith('@g.us'))
      .map((group: any) => ({ id: group.id, name: typeof group.name === 'string' ? group.name : group.id }));
  }

  async sendTestText(chatId: string, text: string, idempotencyKey: string) {
    this.assertReady();
    const sessionId = encodeURIComponent(process.env.OPENWA_SESSION_ID!.trim());
    return this.request<OpenWaSendResult>(
      `sessions/${sessionId}/messages/send-text`,
      'POST',
      { chatId, text },
      idempotencyKey,
      30_000,
    );
  }

  async sendDocument(
    chatId: string,
    filename: string,
    caption: string,
    pdf: Buffer,
    idempotencyKey: string,
  ) {
    this.assertReady();
    const gatewayLimitBytes = 50 * 1024 * 1024;
    const configuredLimit = Number(process.env.OPENWA_MAX_REPORT_PDF_BYTES ?? 15 * 1024 * 1024);
    const maxBytes = Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.min(configuredLimit, gatewayLimitBytes)
      : 15 * 1024 * 1024;
    if (pdf.length > maxBytes) {
      throw new ServiceUnavailableException(
        `El PDF supera el límite configurado para WhatsApp (${Math.round(maxBytes / 1024 / 1024)} MiB).`,
      );
    }

    const sessionId = encodeURIComponent(process.env.OPENWA_SESSION_ID!.trim());
    return this.request<OpenWaSendResult>(
      `sessions/${sessionId}/messages/send-document`,
      'POST',
      {
        chatId,
        base64: pdf.toString('base64'),
        mimetype: 'application/pdf',
        filename,
        caption,
      },
      idempotencyKey,
      120_000,
    );
  }

  private async request<T>(
    path: string,
    method: 'GET' | 'POST',
    body?: unknown,
    idempotencyKey?: string,
    timeoutMs = 15_000,
  ): Promise<T> {
    const baseUrl = this.normalizedBaseUrl();
    const url = `${baseUrl}/api/${path}`;
    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: {
          'X-API-Key': process.env.OPENWA_API_KEY!.trim(),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey.slice(0, 255) } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      throw new ServiceUnavailableException('No se pudo conectar con el servidor OpenWA.');
    }

    const payload = await response.text().catch(() => '');
    if (!response.ok) {
      const upstreamMessage = this.extractUpstreamErrorMessage(payload);
      const message = upstreamMessage
        ? `OpenWA respondió con HTTP ${response.status}. Detalle: ${upstreamMessage}`
        : `OpenWA respondió con HTTP ${response.status}. Revisá el estado de la sesión y los permisos de la API key.`;
      throw new BadGatewayException(message);
    }
    if (response.status === 204) return undefined as T;

    if (!payload) return undefined as T;
    try {
      return JSON.parse(payload) as T;
    } catch {
      throw new BadGatewayException('OpenWA devolvió una respuesta que no es JSON.');
    }
  }

  private extractUpstreamErrorMessage(payload: string): string | undefined {
    let parsed: unknown;
    try {
      parsed = JSON.parse(payload);
    } catch {
      return undefined;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;

    const body = parsed as Record<string, unknown>;
    const rawMessage = body.message ?? body.detail;
    let message = typeof rawMessage === 'string'
      ? rawMessage
      : Array.isArray(rawMessage)
        ? rawMessage.filter((item): item is string => typeof item === 'string').join('; ')
        : undefined;

    if (!message && typeof body.error === 'string' && !/^(bad request|bad gateway)$/i.test(body.error)) {
      message = body.error;
    }
    if (!message) return undefined;

    message = message
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    for (const secret of [process.env.OPENWA_API_KEY, process.env.OPENWA_SESSION_ID]) {
      if (secret?.trim()) message = message.split(secret.trim()).join('[redactado]');
    }

    return message.slice(0, 400) || undefined;
  }

  private normalizedBaseUrl() {
    const configured = process.env.OPENWA_BASE_URL?.trim();
    if (!configured) throw new ServiceUnavailableException('OPENWA_BASE_URL no está configurada en el backend.');
    let parsed: URL;
    try {
      parsed = new URL(configured);
    } catch {
      throw new ServiceUnavailableException('OPENWA_BASE_URL debe ser una URL HTTP o HTTPS válida.');
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new ServiceUnavailableException('OPENWA_BASE_URL debe usar HTTP o HTTPS.');
    }
    const pathname = parsed.pathname.replace(/\/+$/, '').replace(/\/api$/i, '');
    return `${parsed.origin}${pathname}`.replace(/\/+$/, '');
  }
}
