// common/context/request-context.ts
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextData {
  schema?: string;
  companyId?: string;
  role?: string;
  userId?: string;
  ip?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextData>();
