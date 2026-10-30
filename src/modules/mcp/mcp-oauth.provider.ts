import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { createHash, randomBytes } from 'node:crypto';
import type { OAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import type { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type {
  OAuthClientInformationFull,
  OAuthTokenRevocationRequest,
  OAuthTokens,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import {
  AccessDeniedError,
  InvalidClientError,
  InvalidGrantError,
  InvalidScopeError,
} from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { PrismaService } from '@/prisma/prisma.service';

export const MCP_SCOPES = ['erp:read', 'intake:files.read', 'purchases:drafts.write'] as const;
export type McpScope = (typeof MCP_SCOPES)[number];

export interface McpIdentity {
  userId: string;
  companyId: string;
  companyRole: string;
  grantId: string;
  clientId: string;
  scopes: string[];
  tenantDb: string;
}

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_DAYS = 30;
const AUTHORIZATION_CODE_SECONDS = 5 * 60;
const PENDING_AUTHORIZATION_SECONDS = 10 * 60;

@Injectable()
export class McpOAuthProvider implements OAuthServerProvider, OAuthRegisteredClientsStore {
  private get prisma() {
    return this.db.getDefaultClient();
  }

  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  get clientsStore(): OAuthRegisteredClientsStore {
    return this;
  }

  private get issuerUrl() {
    return new URL(this.config.getOrThrow<string>('MCP_AUTH_ISSUER_URL'));
  }

  get resourceUrl() {
    return new URL(this.config.getOrThrow<string>('MCP_PUBLIC_URL'));
  }

  private get accessTokenSecret() {
    return this.config.getOrThrow<string>('MCP_ACCESS_TOKEN_SECRET');
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private newSecret(bytes = 48) {
    return randomBytes(bytes).toString('base64url');
  }

  private normalizeUrl(value?: URL) {
    if (!value) return undefined;
    const url = new URL(value.href);
    url.hash = '';
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url.href;
  }

  private ensureResource(resource?: URL) {
    const expected = this.normalizeUrl(this.resourceUrl);
    const received = this.normalizeUrl(resource);
    if (received && received !== expected) throw new InvalidGrantError('El recurso solicitado no corresponde a Asterisk Suite');
    return this.resourceUrl;
  }

  async getClient(clientId: string): Promise<OAuthClientInformationFull | undefined> {
    const row = await this.prisma.mcp_oauth_clients.findUnique({ where: { client_id: clientId } });
    return row?.client_info as OAuthClientInformationFull | undefined;
  }

  async registerClient(clientInfo: OAuthClientInformationFull): Promise<OAuthClientInformationFull> {
    if (clientInfo.token_endpoint_auth_method && clientInfo.token_endpoint_auth_method !== 'none') {
      throw new InvalidClientError('Asterisk Suite solo admite clientes OAuth públicos con PKCE');
    }
    if (!clientInfo.redirect_uris.length || clientInfo.redirect_uris.length > 20
      || clientInfo.redirect_uris.some((uri) => uri.length > 2048)
      || Buffer.byteLength(JSON.stringify(clientInfo), 'utf8') > 32 * 1024) {
      throw new InvalidClientError('Los metadatos del cliente OAuth superan los límites admitidos');
    }

    const sanitized: OAuthClientInformationFull = {
      ...clientInfo,
      client_name: (clientInfo.client_name || 'Cliente de IA').slice(0, 120),
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
    };
    const registeredClients = await this.prisma.mcp_oauth_clients.count();
    if (registeredClients >= 5000) {
      throw new InvalidClientError('Se alcanzó el límite de clientes OAuth registrados');
    }
    await this.prisma.mcp_oauth_clients.create({
      data: { client_id: sanitized.client_id, client_info: sanitized as object },
    });
    return sanitized;
  }

  async authorize(client: OAuthClientInformationFull, params: {
    state?: string;
    scopes?: string[];
    codeChallenge: string;
    redirectUri: string;
    resource?: URL;
  }, res: Response): Promise<void> {
    const storedClient = await this.getClient(client.client_id);
    if (!storedClient || !storedClient.redirect_uris.some((uri) => this.redirectUriMatches(uri, params.redirectUri))) {
      throw new InvalidClientError('El cliente MCP no está registrado o la URL de retorno no coincide');
    }

    const requestedScopes = [...new Set(params.scopes?.length ? params.scopes : ['erp:read'])];
    if (requestedScopes.some((scope) => !(MCP_SCOPES as readonly string[]).includes(scope))) {
      throw new InvalidScopeError('La conexión solicitó permisos MCP no admitidos');
    }
    if (params.resource && this.normalizeUrl(params.resource) !== this.normalizeUrl(this.resourceUrl)) {
      throw new InvalidGrantError('El recurso solicitado no corresponde a Asterisk Suite');
    }
    if (params.redirectUri.length > 2048 || params.codeChallenge.length > 128
      || (params.state?.length ?? 0) > 1024) {
      throw new InvalidClientError('La solicitud OAuth supera los límites admitidos');
    }

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.mcp_oauth_pending_authorizations.deleteMany({ where: { expires_at: { lt: now } } }),
      this.prisma.mcp_oauth_codes.deleteMany({ where: { expires_at: { lt: now } } }),
      this.prisma.mcp_oauth_refresh_tokens.deleteMany({ where: { expires_at: { lt: now } } }),
    ]);

    const pending = await this.prisma.mcp_oauth_pending_authorizations.create({
      data: {
        client_id: client.client_id,
        redirect_uri: params.redirectUri,
        requested_state: params.state,
        code_challenge: params.codeChallenge,
        requested_scopes: requestedScopes,
        resource: this.normalizeUrl(params.resource ?? this.resourceUrl),
        expires_at: new Date(Date.now() + PENDING_AUTHORIZATION_SECONDS * 1000),
      },
      select: { id: true },
    });

    const appUrl = new URL(this.config.getOrThrow<string>('MCP_APP_AUTHORIZE_URL'));
    appUrl.searchParams.set('request_id', pending.id);
    res.redirect(302, appUrl.toString());
  }

  private redirectUriMatches(registered: string, requested: string) {
    if (registered === requested) return true;
    try {
      const expected = new URL(registered);
      const actual = new URL(requested);
      const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
      return loopback.has(expected.hostname)
        && expected.protocol === actual.protocol
        && expected.hostname === actual.hostname
        && expected.pathname === actual.pathname
        && expected.search === actual.search;
    } catch {
      return false;
    }
  }

  async getAuthorizationRequest(requestId: string) {
    const pending = await this.prisma.mcp_oauth_pending_authorizations.findFirst({
      where: { id: requestId, consumed_at: null, expires_at: { gt: new Date() } },
      select: { id: true, client_id: true, requested_scopes: true, expires_at: true },
    });
    if (!pending) throw new AccessDeniedError('La solicitud de conexión venció o ya fue utilizada');
    const client = await this.getClient(pending.client_id);
    return {
      id: pending.id,
      clientName: client?.client_name || 'Cliente de IA',
      scopes: pending.requested_scopes,
      expiresAt: pending.expires_at,
    };
  }

  async approveAuthorization(requestId: string, userId: string, companyId: string) {
    const now = new Date();
    const pending = await this.prisma.mcp_oauth_pending_authorizations.findFirst({
      where: { id: requestId, consumed_at: null, expires_at: { gt: now } },
    });
    if (!pending) throw new AccessDeniedError('La solicitud de conexión venció o ya fue utilizada');

    const [user, company, membership, client] = await Promise.all([
      this.prisma.users.findFirst({ where: { id: userId, active: true, deleted_at: null }, select: { id: true } }),
      this.prisma.companies.findFirst({ where: { id: companyId, deleted_at: null }, select: { id: true } }),
      this.prisma.company_users.findUnique({ where: { company_id_user_id: { company_id: companyId, user_id: userId } } }),
      this.getClient(pending.client_id),
    ]);
    if (!user || !company || !membership) throw new AccessDeniedError('No tienes acceso a esa empresa');
    if (!client) throw new InvalidClientError('El cliente MCP ya no está registrado');

    const scopes = [...new Set((pending.requested_scopes as string[]).map(String))];
    if (!scopes.length || scopes.some((scope) => !(MCP_SCOPES as readonly string[]).includes(scope))) {
      throw new InvalidScopeError('La solicitud incluye permisos MCP no admitidos');
    }

    const activeGrants = await this.prisma.mcp_oauth_grants.count({
      where: { user_id: userId, company_id: companyId, revoked_at: null },
    });
    if (activeGrants >= 20) throw new AccessDeniedError('La empresa ya tiene 20 conexiones de IA activas para este usuario');

    const code = this.newSecret(32);
    const grant = await this.prisma.$transaction(async (tx) => {
      const consumed = await tx.mcp_oauth_pending_authorizations.updateMany({
        where: { id: pending.id, consumed_at: null, expires_at: { gt: now } },
        data: { consumed_at: now },
      });
      if (consumed.count !== 1) throw new AccessDeniedError('La solicitud ya fue utilizada');

      const createdGrant = await tx.mcp_oauth_grants.create({
        data: { client_id: pending.client_id, user_id: userId, company_id: companyId, scopes },
      });
      await tx.mcp_oauth_codes.create({
        data: {
          code_hash: this.hash(code),
          grant_id: createdGrant.id,
          client_id: pending.client_id,
          redirect_uri: pending.redirect_uri,
          code_challenge: pending.code_challenge,
          scopes,
          resource: pending.resource,
          expires_at: new Date(Date.now() + AUTHORIZATION_CODE_SECONDS * 1000),
        },
      });
      return createdGrant;
    });

    const callback = new URL(pending.redirect_uri);
    callback.searchParams.set('code', code);
    if (pending.requested_state) callback.searchParams.set('state', pending.requested_state);
    return { redirectUrl: callback.toString(), companyId, companyRole: membership.role };
  }

  async denyAuthorization(requestId: string) {
    const now = new Date();
    const pending = await this.prisma.mcp_oauth_pending_authorizations.findFirst({
      where: { id: requestId, consumed_at: null, expires_at: { gt: now } },
    });
    if (!pending) throw new AccessDeniedError('La solicitud de conexión venció o ya fue utilizada');
    const consumed = await this.prisma.mcp_oauth_pending_authorizations.updateMany({
      where: { id: pending.id, consumed_at: null }, data: { consumed_at: now },
    });
    if (consumed.count !== 1) throw new AccessDeniedError('La solicitud ya fue utilizada');
    const callback = new URL(pending.redirect_uri);
    callback.searchParams.set('error', 'access_denied');
    callback.searchParams.set('error_description', 'El usuario rechazó la conexión con Asterisk Suite');
    if (pending.requested_state) callback.searchParams.set('state', pending.requested_state);
    return { redirectUrl: callback.toString() };
  }

  async challengeForAuthorizationCode(client: OAuthClientInformationFull, authorizationCode: string) {
    const row = await this.prisma.mcp_oauth_codes.findFirst({
      where: { code_hash: this.hash(authorizationCode), client_id: client.client_id, consumed_at: null, expires_at: { gt: new Date() } },
      select: { code_challenge: true },
    });
    if (!row) throw new InvalidGrantError('El código de autorización venció o no existe');
    return row.code_challenge;
  }

  async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    redirectUri?: string,
    resource?: URL,
  ): Promise<OAuthTokens> {
    const codeHash = this.hash(authorizationCode);
    const row = await this.prisma.mcp_oauth_codes.findFirst({
      where: { code_hash: codeHash, client_id: client.client_id, consumed_at: null, expires_at: { gt: new Date() } },
    });
    if (!row || (redirectUri && redirectUri !== row.redirect_uri)) throw new InvalidGrantError('El código de autorización no es válido');
    this.ensureResource(resource ?? (row.resource ? new URL(row.resource) : undefined));

    const consumed = await this.prisma.mcp_oauth_codes.updateMany({
      where: { code_hash: codeHash, consumed_at: null, expires_at: { gt: new Date() } },
      data: { consumed_at: new Date() },
    });
    if (consumed.count !== 1) throw new InvalidGrantError('El código de autorización ya fue utilizado');

    const grant = await this.getActiveGrant(row.grant_id, client.client_id);
    return this.issueTokens(grant, row.scopes, this.resourceUrl);
  }

  async exchangeRefreshToken(client: OAuthClientInformationFull, refreshToken: string, scopes?: string[], resource?: URL): Promise<OAuthTokens> {
    this.ensureResource(resource);
    const tokenHash = this.hash(refreshToken);
    const token = await this.prisma.mcp_oauth_refresh_tokens.findFirst({
      where: { token_hash: tokenHash, revoked_at: null, expires_at: { gt: new Date() } },
    });
    if (!token) throw new InvalidGrantError('El refresh token venció o fue revocado');
    const grant = await this.getActiveGrant(token.grant_id, client.client_id);
    const grantedScopes = scopes?.length ? scopes : token.scopes;
    if (grantedScopes.some((scope) => !token.scopes.includes(scope) || !grant.scopes.includes(scope))) {
      throw new InvalidScopeError('No se puede ampliar el alcance de una conexión existente');
    }
    const revoked = await this.prisma.mcp_oauth_refresh_tokens.updateMany({
      where: { id: token.id, revoked_at: null, expires_at: { gt: new Date() } },
      data: { revoked_at: new Date() },
    });
    if (revoked.count !== 1) throw new InvalidGrantError('El refresh token ya fue utilizado');
    return this.issueTokens(grant, grantedScopes, this.resourceUrl);
  }

  private async issueTokens(grant: { id: string; client_id: string; user_id: string; company_id: string }, scopes: string[], resource: URL): Promise<OAuthTokens> {
    const company = await this.prisma.companies.findFirst({
      where: { id: grant.company_id, deleted_at: null },
      select: { schema_name: true, subdomain: true },
    });
    if (!company?.subdomain) throw new InvalidGrantError('La empresa ya no está disponible');
    const refreshToken = this.newSecret();
    await this.prisma.mcp_oauth_refresh_tokens.create({
      data: {
        grant_id: grant.id,
        token_hash: this.hash(refreshToken),
        scopes,
        expires_at: new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000),
      },
    });
    const accessToken = await this.jwt.signAsync({
      sub: grant.user_id,
      typ: 'mcp_access',
      companyId: grant.company_id,
      tenantDb: company.schema_name || `${company.subdomain}_db`,
      grantId: grant.id,
      clientId: grant.client_id,
      scope: scopes.join(' '),
      aud: this.normalizeUrl(resource),
      iss: this.issuerUrl.href,
    }, {
      secret: this.accessTokenSecret,
      expiresIn: ACCESS_TOKEN_SECONDS,
      audience: this.normalizeUrl(resource),
      issuer: this.issuerUrl.href,
    });
    return {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: ACCESS_TOKEN_SECONDS,
      refresh_token: refreshToken,
      scope: scopes.join(' '),
    };
  }

  private async getActiveGrant(grantId: string, clientId: string) {
    const grant = await this.prisma.mcp_oauth_grants.findFirst({
      where: { id: grantId, client_id: clientId, revoked_at: null },
      select: { id: true, client_id: true, user_id: true, company_id: true, scopes: true },
    });
    if (!grant) throw new InvalidGrantError('La autorización fue revocada');
    const membership = await this.prisma.company_users.findUnique({
      where: { company_id_user_id: { company_id: grant.company_id, user_id: grant.user_id } },
      select: { role: true },
    });
    const user = await this.prisma.users.findFirst({ where: { id: grant.user_id, active: true, deleted_at: null }, select: { id: true } });
    if (!membership || !user) throw new InvalidGrantError('El usuario ya no tiene acceso a la empresa');
    return grant;
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    let payload: Record<string, any>;
    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: this.accessTokenSecret,
        audience: this.normalizeUrl(this.resourceUrl),
        issuer: this.issuerUrl.href,
      });
    } catch {
      throw new InvalidGrantError('El token de acceso no es válido o venció');
    }
    if (payload.typ !== 'mcp_access' || !payload.sub || !payload.companyId || !payload.grantId || !payload.clientId) {
      throw new InvalidGrantError('El token no corresponde a una conexión MCP');
    }
    const grant = await this.getActiveGrant(payload.grantId, payload.clientId);
    if (grant.user_id !== payload.sub || grant.company_id !== payload.companyId) throw new InvalidGrantError('La autorización no coincide con el usuario o la empresa');
    const scopes = String(payload.scope ?? '').split(' ').filter(Boolean);
    if (scopes.some((scope) => !grant.scopes.includes(scope))) throw new InvalidGrantError('El token contiene permisos que ya no están autorizados');
    const company = await this.prisma.companies.findFirst({
      where: { id: grant.company_id, deleted_at: null },
      select: { schema_name: true, subdomain: true },
    });
    const membership = await this.prisma.company_users.findUnique({
      where: { company_id_user_id: { company_id: grant.company_id, user_id: grant.user_id } },
      select: { role: true },
    });
    if (!company?.subdomain || !membership) throw new InvalidGrantError('El usuario ya no tiene acceso a esa empresa');
    const resource = payload.aud ? new URL(Array.isArray(payload.aud) ? payload.aud[0] : payload.aud) : this.resourceUrl;
    return {
      token,
      clientId: payload.clientId,
      scopes,
      expiresAt: payload.exp,
      resource,
      extra: {
        userId: grant.user_id,
        companyId: grant.company_id,
        companyRole: membership.role,
        grantId: grant.id,
        clientId: grant.client_id,
        scopes,
        tenantDb: company.schema_name || `${company.subdomain}_db`,
        tenantSubdomain: company.subdomain,
      },
    };
  }

  async revokeToken(client: OAuthClientInformationFull, request: OAuthTokenRevocationRequest): Promise<void> {
    const now = new Date();
    const hashed = this.hash(request.token);
    const refresh = await this.prisma.mcp_oauth_refresh_tokens.findFirst({
      where: { token_hash: hashed, revoked_at: null }, select: { id: true, grant_id: true },
    });
    let grantId = refresh?.grant_id;
    if (refresh) await this.prisma.mcp_oauth_refresh_tokens.update({ where: { id: refresh.id }, data: { revoked_at: now } });
    if (!grantId) {
      try {
        const payload = await this.jwt.verifyAsync(request.token, { secret: this.accessTokenSecret, ignoreExpiration: true });
        if (payload.typ === 'mcp_access' && payload.clientId === client.client_id) grantId = payload.grantId;
      } catch {
        return;
      }
    }
    if (grantId) await this.prisma.mcp_oauth_grants.updateMany({ where: { id: grantId, client_id: client.client_id, revoked_at: null }, data: { revoked_at: now } });
  }

  async getUserConnections(userId: string) {
    const grants = await this.prisma.mcp_oauth_grants.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 100,
      select: { id: true, client_id: true, company_id: true, scopes: true, revoked_at: true, created_at: true },
    });
    const companyIds = [...new Set(grants.map((grant) => grant.company_id))];
    const companies = await this.prisma.companies.findMany({ where: { id: { in: companyIds } }, select: { id: true, name: true, subdomain: true } });
    const clientIds = [...new Set(grants.map((grant) => grant.client_id))];
    const clients = await this.prisma.mcp_oauth_clients.findMany({ where: { client_id: { in: clientIds } }, select: { client_id: true, client_info: true } });
    const companyById = new Map(companies.map((company) => [company.id, company]));
    const clientById = new Map<string, Record<string, unknown>>(
      clients.map((client) => [client.client_id, client.client_info as Record<string, unknown>]),
    );
    return grants.map((grant) => ({
      id: grant.id,
      clientName: String(clientById.get(grant.client_id)?.client_name || 'Cliente de IA'),
      company: companyById.get(grant.company_id) ?? null,
      scopes: grant.scopes,
      createdAt: grant.created_at,
      revokedAt: grant.revoked_at,
    }));
  }

  async revokeUserConnection(userId: string, grantId: string) {
    const grant = await this.prisma.mcp_oauth_grants.findFirst({ where: { id: grantId, user_id: userId, revoked_at: null }, select: { id: true } });
    if (!grant) return false;
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.mcp_oauth_grants.update({ where: { id: grant.id }, data: { revoked_at: now } }),
      this.prisma.mcp_oauth_refresh_tokens.updateMany({ where: { grant_id: grant.id, revoked_at: null }, data: { revoked_at: now } }),
    ]);
    return true;
  }
}
