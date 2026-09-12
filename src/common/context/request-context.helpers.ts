import { requestContext } from './request-context';

export function getCurrentCompanyId() {
  return requestContext.getStore()?.companyId;
}

export function getCurrentRole() {
  return requestContext.getStore()?.role;
}

export function getCurrentSchema() {
  return requestContext.getStore()?.schema;
}
