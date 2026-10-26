// src/api/mutations.ts
import { queryClient } from './queryClient'; 
import { queryKeys } from './queryKeys';
import { mockApi } from './client';

// Definición estricta de tipos
export type NewLogData = {
  title: string;
  note: string;
};

export type EditLogData = NewLogData & {
  id: string;
};

// 1. Mutación de Creación
queryClient.setMutationDefaults(['addLog'], {
  mutationFn: async (newLog: NewLogData) => {
    const { data } = await mockApi.post('/logs', newLog);
    return data;
  },
  onSuccess: () => {
    // Invalida la lista para forzar recarga tras crear
    queryClient.invalidateQueries({ queryKey: queryKeys.log.lists() });
  },
});

// 2. Mutación de Edición (Requisito 2)
queryClient.setMutationDefaults(['editLog'], {
  mutationFn: async ({ id, ...updatedLog }: EditLogData) => {
    const { data } = await mockApi.put(`/logs/${id}`, updatedLog);
    return data;
  },
  onSuccess: (_data: any, variables: EditLogData) => {
    // Invalida la lista general
    queryClient.invalidateQueries({ queryKey: queryKeys.log.lists() });
    // Invalida el detalle específico por si se consulta directamente
    queryClient.invalidateQueries({ queryKey: queryKeys.log.detail(variables.id) });
  },
});

// 3. Mutación de Eliminación (Bonus UX)
queryClient.setMutationDefaults(['deleteLog'], {
  mutationFn: async (id: string) => {
    await mockApi.delete(`/logs/${id}`);
  },
  onSuccess: () => {
    // Invalida la lista para forzar recarga tras eliminar
    queryClient.invalidateQueries({ queryKey: queryKeys.log.lists() });
  },
});