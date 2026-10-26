export const queryKeys = {
  nasa: {
    all: ['nasa'] as const,
    apod: () => [...queryKeys.nasa.all, 'apod'] as const,
    asteroids: (date: string) => [...queryKeys.nasa.all, 'asteroids', date] as const,
  },
  log: {
    all: ['log'] as const,
    lists: () => [...queryKeys.log.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.log.all, 'detail', id] as const,
  },
};