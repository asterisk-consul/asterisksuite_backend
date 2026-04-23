// common/context/request-context.ts
import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage<{
  userId?: string;
  ip?: string;
}>();
