export const queryKeys = {
  nasa: {
    all: ['nasa'] as const,
    apod: () => [...queryKeys.nasa.all, 'apod'] as const,
    asteroids: (start: string, end: string) => [...queryKeys.nasa.all, 'asteroids', start, end] as const,
    apodEs: (date?: string) => [...queryKeys.nasa.all, 'apod', 'es', date] as const,
  },
  log: {
    all: ['log'] as const,
    lists: () => [...queryKeys.log.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.log.all, 'detail', id] as const,
  },
};