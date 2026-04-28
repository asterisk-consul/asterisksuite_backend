import { requestContext } from '@/common/context/request-context';

function isRestore(oldData: any, newData: any): boolean {
  return oldData?.deleted_at != null && newData?.deleted_at == null;
}

function isSoftDeleteChange(newData: any): boolean {
  return newData?.deleted_at != null;
}

function resolveAction(operation: string, oldData?: any, newData?: any) {
  if (operation === 'delete') return 'DELETE';
  if (oldData && newData && isRestore(oldData, newData)) return 'RESTORE';
  if (isSoftDeleteChange(newData)) return 'DELETE';
  if (operation === 'create') return 'CREATE';
  return 'UPDATE';
}

export const withAudit = (client: any) =>
  client.$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          if (model === 'audit_logs') return query(args);

          const ctx = requestContext.getStore();
          const result = await query(args);

          const recordId = result?.id?.toString();
          if (!recordId) return result;

          await client.audit_logs.create({
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
          let old: any = null;

          try {
            if (args?.where) {
              old = await client[model].findUnique({ where: args.where });
            }
          } catch (e) {}

          const result = await query(args);
          const recordId = result?.id?.toString() ?? JSON.stringify(args.where);
          const action = resolveAction('update', old, result);

          await client.audit_logs.create({
            data: {
              table_name: model,
              record_id: recordId,
              old_data: old,
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
          let old: any = null;

          try {
            if (args?.where) {
              old = await client[model].findUnique({ where: args.where });
            }
          } catch (e) {}

          const result = await query(args);
          const recordId = old?.id?.toString() ?? JSON.stringify(args.where);

          await client.audit_logs.create({
            data: {
              table_name: model,
              record_id: recordId,
              old_data: old,
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
