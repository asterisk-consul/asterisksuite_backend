import { All, Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { requestContext } from '@/common/context/request-context';
import { ConfigService } from '@nestjs/config';
import { McpOAuthProvider } from './mcp-oauth.provider';
import { McpToolsService } from './mcp-tools.service';

@Controller('mcp')
export class McpController {
  constructor(
    private readonly oauth: McpOAuthProvider,
    private readonly tools: McpToolsService,
    private readonly config: ConfigService,
  ) {}

  @All()
  async handle(@Req() req: Request, @Res() res: Response) {
    if (this.config.get<string>('MCP_ENABLED') !== 'true') {
      return res.status(404).json({ message: 'El servidor MCP no está habilitado.' });
    }
    const authorization = req.headers.authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return this.unauthorized(res);

    let authInfo;
    try {
      authInfo = await this.oauth.verifyAccessToken(token);
    } catch {
      return this.unauthorized(res);
    }
    if (!authInfo.scopes.some((scope) => ['erp:read', 'intake:files.read', 'purchases:drafts.write'].includes(scope))) {
      return res.status(403).json({ message: 'El token no tiene alcances compatibles con el servidor MCP.' });
    }

    const identity = authInfo.extra as unknown as {
      userId: string; companyId: string; companyRole: string; grantId: string;
      clientId: string; scopes: string[]; tenantDb: string;
    };
    (req as Request & { auth?: typeof authInfo }).auth = authInfo;
    return requestContext.run({
      schema: identity.tenantDb,
      companyId: identity.companyId,
      role: identity.companyRole,
      userId: identity.userId,
      ip: req.ip,
    }, async () => {
      const server = await this.tools.createServer(identity);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      try {
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
      } finally {
        await server.close();
      }
    });
  }

  @Get('authorization/request')
  @UseGuards(JwtAuthGuard)
  async getAuthorizationRequest(@Query('request_id') requestId: string, @CurrentUser() user: AuthUser) {
    if (!requestId) throw new UnauthorizedException('Falta el identificador de autorización');
    await this.ensureMcpEnabled();
    return { ...(await this.oauth.getAuthorizationRequest(requestId)), userName: user.name };
  }

  @Post('authorization/request/:requestId/approve')
  @UseGuards(JwtAuthGuard)
  async approveAuthorization(
    @Param('requestId') requestId: string,
    @Body('company_id') companyId: string,
    @CurrentUser() user: AuthUser,
    @Res() res: Response,
  ) {
    if (!companyId) throw new UnauthorizedException('Seleccioná la empresa para esta conexión');
    await this.ensureMcpEnabled();
    const result = await this.oauth.approveAuthorization(requestId, user.id, companyId);
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ redirect_url: result.redirectUrl, company_id: result.companyId, company_role: result.companyRole });
  }

  @Post('authorization/request/:requestId/deny')
  @UseGuards(JwtAuthGuard)
  async denyAuthorization(@Param('requestId') requestId: string, @Res() res: Response) {
    await this.ensureMcpEnabled();
    const result = await this.oauth.denyAuthorization(requestId);
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ redirect_url: result.redirectUrl });
  }

  @Get('connections')
  @UseGuards(JwtAuthGuard)
  async getConnections(@CurrentUser() user: AuthUser) {
    await this.ensureMcpEnabled();
    return this.oauth.getUserConnections(user.id);
  }

  @Delete('connections/:grantId')
  @UseGuards(JwtAuthGuard)
  async revokeConnection(@Param('grantId') grantId: string, @CurrentUser() user: AuthUser) {
    await this.ensureMcpEnabled();
    return { revoked: await this.oauth.revokeUserConnection(user.id, grantId) };
  }

  private async ensureMcpEnabled() {
    if (this.config.get<string>('MCP_ENABLED') !== 'true') {
      throw new UnauthorizedException('El servidor MCP no está habilitado.');
    }
  }

  private unauthorized(res: Response) {
    const resourceUrl = new URL(this.config.getOrThrow<string>('MCP_PUBLIC_URL'));
    const metadataUrl = getOAuthProtectedResourceMetadataUrl(resourceUrl);
    res.setHeader('WWW-Authenticate', `Bearer resource_metadata="${metadataUrl}", scope="erp:read intake:files.read purchases:drafts.write"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(401).json({ message: 'Se requiere un token OAuth válido para el servidor MCP.' });
  }
}
