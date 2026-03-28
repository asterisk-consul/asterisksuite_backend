// utils/refreshMutex.ts
const refreshMutex = new Map<string, Promise<string>>()

export function getRefreshMutex() {
  return refreshMutex
}
