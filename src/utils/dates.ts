import dayjs from 'dayjs';
import 'dayjs/locale/es';

export const API_DATE = 'YYYY-MM-DD';
export const MAX_RANGE_DAYS = 7; // límite del endpoint feed de NeoWs

export type NeoPreset = 'today' | 'week';

export function presetRange(preset: NeoPreset): { start: string; end: string } {
  const today = dayjs();
  return {
    start: today.format(API_DATE),
    end: today.add(preset === 'week' ? MAX_RANGE_DAYS - 1 : 0, 'day').format(API_DATE),
  };
}

export function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && dayjs(s).format(API_DATE) === s;
}

/** Devuelve un mensaje de error o null si el rango es válido. */
export function validateRange(start: string, end: string): string | null {
  if (!isValidDate(start) || !isValidDate(end)) return 'Usa el formato AAAA-MM-DD.';
  const diff = dayjs(end).diff(dayjs(start), 'day');
  if (diff < 0) return 'La fecha final debe ser posterior a la inicial.';
  if (diff >= MAX_RANGE_DAYS) return `El rango máximo es de ${MAX_RANGE_DAYS} días.`;
  return null;
}

export function fmtDate(value?: string | null, pattern = 'D MMM YYYY'): string | null {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d.locale('es').format(pattern) : null;
}
