// src/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

const GC_TIME = 1000 * 60 * 60 * 48; 

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: GC_TIME,
      retry: 2,
    },
  },
});