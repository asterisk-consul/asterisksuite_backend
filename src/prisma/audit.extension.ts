import { requestContext } from '@/common/context/request-context';
import { AuditAction } from '../generated/prisma/client';

function isRestore(oldData: any, newData: any): boolean {
  return oldData?.deleted_at != null && newData?.deleted_at == null;
}

function isSoftDeleteChange(newData: any): boolean {
  return newData?.deleted_at != null;
}

function resolveAction(
  operation: string,
  oldData?: any,
  newData?: any,
): AuditAction {
  if (operation === 'delete') return AuditAction.DELETE;
  if (oldData && newData && isRestore(oldData, newData))
    return AuditAction.RESTORE;
  if (isSoftDeleteChange(newData)) return AuditAction.DELETE;
  if (operation === 'create') return AuditAction.CREATE;
  return AuditAction.UPDATE;
}

// ✅ writeAuditLog: callback that writes to the correct audit_logs table
//   - Public context:  (data) => rawClient.audit_logs_public.create({ data }) → public.audit_logs
//   - Tenant context:  (data) => rawClient.audit_logs.create({ data }) → tenant.audit_logs
export function withAudit(writeAuditLog: (data: any) => Promise<any>) {
  return (client: any) =>
    client.$extends({
      name: 'audit',
      query: {
        $allModels: {
          async create({ model, args, query }: any) {
            if (model === 'audit_logs' || model === 'audit_logs_public')
              return query(args);

            const ctx = requestContext.getStore();
            const result = await query(args);

            const recordId = result?.id?.toString();
            if (!recordId) return result;

            try {
              await writeAuditLog({
                table_name: model,
                record_id: recordId,
                new_data: result,
                action: 'CREATE',
                changed_by: ctx?.userId ?? null,
                ip_address: ctx?.ip ?? null,
              });
            } catch (e) {
              console.error('Audit log failed (create):', e);
            }

            return result;
          },

          async update({ model, args, query }: any) {
            if (model === 'audit_logs' || model === 'audit_logs_public')
              return query(args);

            const ctx = requestContext.getStore();
            let old: any = null;

            try {
              if (args?.where) {
                old = await client[model].findUnique({ where: args.where });
              }
            } catch (e) {}

            const result = await query(args);
            const recordId =
              result?.id?.toString() ?? JSON.stringify(args.where);
            const action = resolveAction('update', old, result);

            try {
              await writeAuditLog({
                table_name: model,
                record_id: recordId,
                old_data: old,
                new_data: result,
                action,
                changed_by: ctx?.userId ?? null,
                ip_address: ctx?.ip ?? null,
              });
            } catch (e) {
              console.error('Audit log failed (update):', e);
            }

            return result;
          },

          async delete({ model, args, query }: any) {
            if (model === 'audit_logs' || model === 'audit_logs_public')
              return query(args);

            const ctx = requestContext.getStore();
            let old: any = null;

            try {
              if (args?.where) {
                old = await client[model].findUnique({ where: args.where });
              }
            } catch (e) {}

            const result = await query(args);
            const recordId = old?.id?.toString() ?? JSON.stringify(args.where);

            try {
              await writeAuditLog({
                table_name: model,
                record_id: recordId,
                old_data: old,
                new_data: result ?? null,
                action: 'DELETE',
                changed_by: ctx?.userId ?? null,
                ip_address: ctx?.ip ?? null,
              });
            } catch (e) {
              console.error('Audit log failed (delete):', e);
            }

            return result;
          },
        },
      },
    });
}
