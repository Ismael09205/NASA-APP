// src/api/queries.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi, nasaApi } from './client';
import { queryKeys } from './queryKeys';
import { LogEntry } from '../types/log';
import { ApodResponse, Asteroid, AsteroidFeed, NeoApiObject, NeoFeedResponse } from '../types/nasa';
import { translateToSpanish } from './translate';
import { normalizeFeed, normalizeNeo } from './neo';

export const useLogs = () => {
  return useQuery({
    queryKey: queryKeys.log.lists(),
    queryFn: async (): Promise<LogEntry[]> => {
      const { data } = await mockApi.get('/logs');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useAsteroids = (start: string, end: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.nasa.asteroids(start, end),
    queryFn: async (): Promise<AsteroidFeed> => {
      const { data } = await nasaApi.get<NeoFeedResponse>('/neo/rest/v1/feed', {
        params: { start_date: start, end_date: end },
      });
      return normalizeFeed(data, start, end);
    },
    enabled,
    staleTime: 1000 * 60 * 60 * 12, // 12 horas en caché
    retry: 3,
  });
};

/** Asteroide ya cargado en algún feed en caché (evita pantalla vacía en el detalle). */
export const useCachedAsteroid = (id: string, date?: string): Asteroid | undefined => {
  const qc = useQueryClient();
  return qc
    .getQueriesData<AsteroidFeed>({ queryKey: [...queryKeys.nasa.all, 'asteroids'] })
    .flatMap(([, feed]) => feed?.items ?? [])
    .find((a) => a.id === id && (!date || a.approachDate === date));
};

/** Detalle completo del asteroide vía /neo/{id}. */
export const useAsteroidDetail = (id: string, date?: string) => {
  return useQuery({
    queryKey: [...queryKeys.nasa.all, 'asteroid', id, date ?? ''],
    queryFn: async (): Promise<Asteroid> => {
      const { data } = await nasaApi.get<NeoApiObject>(`/neo/rest/v1/neo/${id}`);
      return normalizeNeo(data, date);
    },
    staleTime: 1000 * 60 * 60 * 12,
    retry: 2,
  });
};

export const useApod = () => {
  return useQuery({
    queryKey: queryKeys.nasa.apod(),
    queryFn: async (): Promise<ApodResponse> => {
      const { data } = await nasaApi.get('/planetary/apod', { params: { thumbs: true } });
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas en caché
    // La API de la NASA responde 500/timeout de forma intermitente
    retry: 4,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
};

export const useApodTranslation = (apod?: ApodResponse) => {
  return useQuery({
    queryKey: queryKeys.nasa.apodEs(apod?.date),
    queryFn: async (): Promise<{ title: string; explanation: string }> => {
      const [title, explanation] = await Promise.all([
        translateToSpanish(apod!.title),
        translateToSpanish(apod!.explanation),
      ]);
      return { title, explanation };
    },
    enabled: !!apod,
    staleTime: Infinity,
    retry: 2,
  });
};
