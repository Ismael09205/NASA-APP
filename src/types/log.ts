// src/types/log.ts
export type LogSource = 'manual' | 'apod' | 'asteroid';

export interface LogEntry {
  id: string;
  title: string;
  note: string;
  createdAt?: string; // Las entradas antiguas de MockAPI no tienen fecha
  category?: string;
  imageUrl?: string;
  source?: LogSource;
  refId?: string; // fecha APOD o uid del asteroide
}
