import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DocumentAssignmentController } from './document-assignment.controller';
import { requestContext } from '@/common/context/request-context';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('@/auth/jwt/jwt-auth.guard', () => ({ JwtAuthGuard: class {} }));
jest.mock('@/access-control/guards/permissions.guard', () => ({ PermissionsGuard: class {} }));

describe('Document assignment', () => {
  const user = { id: 'user-2', name: 'María' };
  let documents: { findFirst: jest.Mock; update: jest.Mock };
  let members: { findFirst: jest.Mock; findMany: jest.Mock };
  let controller: DocumentAssignmentController;
  const authUser = { id: 'user-1' } as any;
  const request = { companyUserRole: 'USER' } as any;
  const documentAccess = { assertAnyDocument: jest.fn().mockResolvedValue(undefined), allowedCategories: jest.fn() };
  const run = (callback: () => Promise<unknown>) => requestContext.run({ companyId: 'company-1', schema: 'company_db', userId: 'user-1' }, callback);

  beforeEach(() => {
    documents = { findFirst: jest.fn().mockResolvedValue({ id: 'doc-1' }), update: jest.fn().mockResolvedValue({}) };
    members = { findFirst: jest.fn().mockResolvedValue({ user }), findMany: jest.fn() };
    controller = new DocumentAssignmentController({
      getDefaultClient: () => ({ company_users: members }),
      getClientForCurrentContext: () => ({ documents }),
    } as any, documentAccess as any);
  });

  it('changes only the assignee and validates tenant membership and active account', async () => {
    await expect(run(() => controller.assign('doc-1', { user_id: user.id }, authUser, request))).resolves.toEqual(user);
    expect(members.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: {
      company_id: 'company-1', user_id: user.id, user: { active: true, deleted_at: null },
    } }));
    expect(documents.update).toHaveBeenCalledWith({ where: { id: 'doc-1', deleted_at: null }, data: { assigned_to: user.id } });
  });

  it('rejects users outside the company or inactive accounts without modifying documents', async () => {
    members.findFirst.mockResolvedValue(null);
    await expect(run(() => controller.assign('doc-1', { user_id: user.id }, authUser, request))).rejects.toBeInstanceOf(BadRequestException);
    expect(documents.update).not.toHaveBeenCalled();
  });

  it('rejects missing or deleted documents', async () => {
    documents.findFirst.mockResolvedValue(null);
    await expect(run(() => controller.assign('doc-1', { user_id: user.id }, authUser, request))).rejects.toBeInstanceOf(NotFoundException);
    expect(documents.findFirst).toHaveBeenCalledWith({ where: { id: 'doc-1', deleted_at: null }, select: { id: true } });
    expect(documents.update).not.toHaveBeenCalled();
  });

  it('rejects requests without a tenant context', async () => {
    await expect(controller.assign('doc-1', { user_id: user.id }, authUser, request)).rejects.toBeInstanceOf(ForbiddenException);
    expect(members.findFirst).not.toHaveBeenCalled();
  });
});
