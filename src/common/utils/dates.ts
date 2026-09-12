/**
 * Utilidad centralizada de fechas para todo el backend.
 * Trabaja en hora ARGENTINA (UTC-3) siempre.
 */

const ARGENTINA_TZ_OFFSET = -3; // UTC-3

/**
 * Obtiene la hora actual en Argentina (UTC-3)
 */
function getArgentinaNow(): Date {
  const now = new Date();
  // Obtener componentes en UTC
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  // Aplicar offset de Argentina (UTC-3)
  const argHours = utcHours + ARGENTINA_TZ_OFFSET;

  // Crear fecha con los valores ajustados
  const argDate = new Date(now);
  argDate.setUTCHours(argHours, utcMinutes, utcSeconds);

  return argDate;
}

/**
 * Parsea dateStr y retorna Date en hora Argentina.
 * Si no hay hora, usa la hora actual de Argentina.
 */
export function parseLocalDateTime(dateStr?: string): Date {
  if (!dateStr) return getArgentinaNow();

  const [datePart, timePart] = dateStr.split('T');
  const [y, m, d] = datePart.split('-').map(Number);

  if (!timePart || timePart.startsWith('00:00')) {
    // No hay hora o es medianoche → usar hora actual Argentina
    const argNow = getArgentinaNow();
    return new Date(Date.UTC(y, m - 1, d, argNow.getUTCHours(), argNow.getUTCMinutes(), argNow.getUTCSeconds()));
  }

  // Parsear hora específica
  const [h, min, sec] = timePart.replace('Z', '').split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min, sec || 0));
}

/**
 * Fecha actual Argentina en formato YYYY-MM-DD
 */
export function today(): string {
  const now = getArgentinaNow();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Fecha y hora actual Argentina en ISO (YYYY-MM-DDTHH:MM:SS)
 */
export function nowISO(): string {
  const now = getArgentinaNow();
  const dateStr = today();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  return `${dateStr}T${hours}:${minutes}:${seconds}`;
}

/**
 * Formatea fecha para UI: dd/mm/yyyy
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseLocalDateTime(date) : date;
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea fecha y hora para UI: dd/mm/yyyy HH:mm
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseLocalDateTime(date) : date;
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
