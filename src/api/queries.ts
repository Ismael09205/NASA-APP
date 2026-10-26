// src/api/queries.ts
import { useQuery } from '@tanstack/react-query';
import { mockApi } from './client';
import { queryKeys } from './queryKeys';
import { LogEntry } from '../types/log';
import dayjs from 'dayjs'
import { nasaApi } from './client';
import { Asteroid } from '../types/nasa';
import { ApodResponse } from '../types/nasa';

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

export const useAsteroids = () => {
  const today = dayjs().format('YYYY-MM-DD');

  return useQuery({
    queryKey: queryKeys.nasa.asteroids(today),
    queryFn: async (): Promise<Asteroid[]> => {
      const { data } = await nasaApi.get('/neo/rest/v1/feed', {
        params: { start_date: today, end_date: today },
      });
      // La API devuelve un objeto complejo, extraemos solo el array de hoy
      return data.near_earth_objects[today] || [];
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 horas en caché
  });
};

export const useApod = () => {
  return useQuery({
    queryKey: queryKeys.nasa.apod(),
    queryFn: async (): Promise<ApodResponse> => {
      const { data } = await nasaApi.get('/planetary/apod');
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas en caché
  });
};
