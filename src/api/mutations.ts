// src/api/mutations.ts
import { onlineManager } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import * as Network from 'expo-network';
import { queryClient } from './queryClient'; 
import { queryKeys } from './queryKeys';
import { mockApi } from './client';
import { LogSource } from '../types/log';
import { logTimestamp } from '../utils/logTimestamp';

class OfflineMutationError extends Error {
  constructor() {
    super('La solicitud quedó pendiente hasta recuperar la conexión.');
    this.name = 'OfflineMutationError';
  }
}

async function rethrowNetworkError(error: unknown): Promise<never> {
  if (!isAxiosError(error) || error.response) throw error;

  let state: Network.NetworkState;
  try {
    state = await Network.getNetworkStateAsync();
  } catch (networkError) {
    if (__DEV__) {
      console.error(`[${logTimestamp()}] [Red] No se pudo verificar la conexión tras el error de API.`, networkError);
    }
    throw error;
  }

  if (state.isConnected !== true || state.isInternetReachable === false) {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Sin internet; la mutación se pausará para reintentar.`);
    onlineManager.setOnline(false);
    throw new OfflineMutationError();
  }

  throw error;
}

const retryWhenOffline = (_failureCount: number, error: Error) => error instanceof OfflineMutationError;

// Definición estricta de tipos
export type NewLogData = {
  title: string;
  note: string;
  category?: string;
  imageUrl?: string;
  source?: LogSource;
  refId?: string;
  createdAt?: string;
};

export type EditLogData = NewLogData & {
  id: string;
};

// 1. Mutación de Creación
queryClient.setMutationDefaults(['addLog'], {
  mutationFn: async (newLog: NewLogData) => {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Enviando creación de entrada a la API.`);
    try {
      const { data } = await mockApi.post('/logs', newLog);
      return data;
    } catch (error) {
      return rethrowNetworkError(error);
    }
  },
  retry: retryWhenOffline,
  retryDelay: 1000,
  onSuccess: () => {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Entrada creada en el servidor.`);
    // Invalida la lista para forzar recarga tras crear
    return queryClient.invalidateQueries({ queryKey: queryKeys.log.lists() });
  },
  onError: (error: Error) => {
    if (__DEV__) console.error(`[${logTimestamp()}] [Bitácora] No se pudo crear la entrada.`, error);
  },
});

// 2. Mutación de Edición (Requisito 2)
queryClient.setMutationDefaults(['editLog'], {
  mutationFn: async ({ id, ...updatedLog }: EditLogData) => {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Enviando edición de entrada a la API.`);
    try {
      const { data } = await mockApi.put(`/logs/${id}`, updatedLog);
      return data;
    } catch (error) {
      return rethrowNetworkError(error);
    }
  },
  retry: retryWhenOffline,
  retryDelay: 1000,
  onSuccess: (_data: any, variables: EditLogData) => {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Entrada actualizada en el servidor.`);
    // Invalida la lista general
    queryClient.invalidateQueries({ queryKey: queryKeys.log.lists() });
    // Invalida el detalle específico por si se consulta directamente
    queryClient.invalidateQueries({ queryKey: queryKeys.log.detail(variables.id) });
  },
  onError: (error: Error) => {
    if (__DEV__) console.error(`[${logTimestamp()}] [Bitácora] No se pudo actualizar la entrada.`, error);
  },
});

// 3. Mutación de Eliminación (Bonus UX)
queryClient.setMutationDefaults(['deleteLog'], {
  mutationFn: async (id: string) => {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Enviando eliminación de entrada a la API.`);
    try {
      await mockApi.delete(`/logs/${id}`);
    } catch (error) {
      return rethrowNetworkError(error);
    }
  },
  retry: retryWhenOffline,
  retryDelay: 1000,
  onSuccess: () => {
    if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Entrada eliminada en el servidor.`);
    // Invalida la lista para forzar recarga tras eliminar
    queryClient.invalidateQueries({ queryKey: queryKeys.log.lists() });
  },
  onError: (error: Error) => {
    if (__DEV__) console.error(`[${logTimestamp()}] [Bitácora] No se pudo eliminar la entrada.`, error);
  },
});