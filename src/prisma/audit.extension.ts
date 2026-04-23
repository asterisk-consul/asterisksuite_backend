import { PrismaClient } from '@/generated/prisma/client';
import { requestContext } from '@/common/context/request-context';

function isSoftDelete(data: unknown): boolean {
  return !!(data as any)?.deleted_at;
}

/**
 * 🔥 Detecta RESTORE real:
 * old tenía deleted_at (no null)
 * new lo dejó en null
 */
function isRestore(oldData: any, newData: any): boolean {
  return oldData?.deleted_at != null && newData?.deleted_at == null;
}

/**
 * 🔥 Detecta soft delete real
 */
function isSoftDeleteChange(newData: any): boolean {
  return newData?.deleted_at != null;
}

function resolveAction(
  args: any,
  operation: string,
  oldData?: any,
  newData?: any,
) {
  if (operation === 'delete') return 'DELETE';

  if (oldData && newData && isRestore(oldData, newData)) {
    return 'RESTORE';
  }

  if (isSoftDeleteChange(newData)) return 'DELETE';

  if (operation === 'create') return 'CREATE';

  return 'UPDATE';
}

export function withAudit(prisma: PrismaClient) {
  return prisma.$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          if (model === 'audit_logs') return query(args);

          const result = await query(args);
          const ctx = requestContext.getStore();

          const recordId = result?.id?.toString();

          if (!recordId) {
            throw new Error(`Audit error: missing id on model ${model}`);
          }

          await prisma.audit_logs.create({
            data: {
              table_name: model,
              record_id: recordId,
              new_data: result,
              action: 'CREATE',
              changed_by: ctx?.userId,
              ip_address: ctx?.ip,
            },
          });

          return result;
        },

        async update({ model, args, query }) {
          if (model === 'audit_logs') return query(args);

          const ctx = requestContext.getStore();

          // 🔥 estado ANTES del cambio
          const old = await (prisma as any)[model].findUnique({
            where: args.where,
          });

          const result = await query(args);

          const recordId = result?.id?.toString() ?? JSON.stringify(args.where);

          // 🔥 acción REAL basada en diff
          const action = resolveAction(args, 'update', old, result);

          await prisma.audit_logs.create({
            data: {
              table_name: model,
              record_id: recordId,
              old_data: old ?? null,
              new_data: result,
              action,
              changed_by: ctx?.userId,
              ip_address: ctx?.ip,
            },
          });

          return result;
        },

        async delete({ model, args, query }) {
          if (model === 'audit_logs') return query(args);

          const ctx = requestContext.getStore();

          const old = await (prisma as any)[model].findUnique({
            where: args.where,
          });

          const result = await query(args);

          const recordId = old?.id?.toString() ?? JSON.stringify(args.where);

          await prisma.audit_logs.create({
            data: {
              table_name: model,
              record_id: recordId,
              old_data: old ?? null,
              new_data: result ?? null,
              action: 'DELETE',
              changed_by: ctx?.userId,
              ip_address: ctx?.ip,
            },
          });

          return result;
        },
      },
    },
  });
}
