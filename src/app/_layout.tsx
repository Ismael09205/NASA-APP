if (__DEV__) {
  require("../../ReactotronConfig");
}
// app/_layout.tsx
import { useEffect } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Importaciones locales
import { queryClient } from '../api/queryClient';
import { queryKeys } from '../api/queryKeys';
import type { LogEntry } from '../types/log';
import '../api/mutations'; 
import { NasaColors } from '../constants/nasaTheme';
import { logTimestamp } from '../utils/logTimestamp';

// Esperar el estado inicial de red evita enviar mutaciones antes de saber si hay conexión.
onlineManager.setOnline(false);

onlineManager.setEventListener((setOnline) => {
  let active = true;
  let receivedNetworkEvent = false;
  const updateOnlineState = (state: Network.NetworkState) => {
    const isOnline = state.isConnected === true && state.isInternetReachable !== false;
    setOnline(isOnline);
    if (__DEV__) {
      console.info(`[${logTimestamp()}] [Red] Estado inicial/cambiado: ${isOnline ? 'con conexión' : 'sin conexión'}.`);
    }
  };
  const subscription = Network.addNetworkStateListener((state) => {
    receivedNetworkEvent = true;
    updateOnlineState(state);
  });

  void Network.getNetworkStateAsync()
    .then((state) => {
      if (active && !receivedNetworkEvent) updateOnlineState(state);
    })
    .catch((error: unknown) => {
      if (!active || receivedNetworkEvent) return;
      console.error(
        `[${logTimestamp()}] [Red] No se pudo consultar el estado de red; se permitirá el intento de conexión.`,
        error,
      );
      setOnline(true);
    });

  return () => {
    active = false;
    subscription.remove();
  };
});

// 2. Crear Persister para AsyncStorage
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

// 3. Tiempos definidos para caché (Requisito 3)
const MAX_AGE = 1000 * 60 * 60 * 24; // 24 horas máximo en AsyncStorage

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
      if (event.type !== 'updated') return;
      if (event.action.type === 'pause') {
        if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Mutación pendiente; se enviará al recuperar la conexión.`);
      } else if (event.action.type === 'continue') {
        if (__DEV__) console.info(`[${logTimestamp()}] [Bitácora] Reanudando envío de mutación pendiente.`);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: MAX_AGE, 
      }}
      onSuccess={() => {
        if (__DEV__) {
          const cachedLogs = queryClient.getQueryData<LogEntry[]>(queryKeys.log.lists());
          const pausedAdds = queryClient
            .getMutationCache()
            .findAll({ mutationKey: ['addLog'], status: 'pending' })
            .filter((mutation) => mutation.state.isPaused).length;
          console.info(
            `[${logTimestamp()}] [Bitácora] Caché restaurada: ${
              cachedLogs ? `${cachedLogs.length} entradas de bitácora` : 'sin lista de bitácora guardada'
            }; ${pausedAdds} creaciones pendientes pausadas.`,
          );
          console.info(`[${logTimestamp()}] [Bitácora] Reanudando mutaciones pendientes.`);
        }
        return queryClient.resumePausedMutations();
      }}
    >
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: NasaColors.background },
          headerShadowVisible: false,
          headerTintColor: NasaColors.textPrimary,
          headerTitleStyle: { color: NasaColors.textPrimary, fontWeight: '700' },
          headerBackTitle: 'Atrás',
          contentStyle: { backgroundColor: NasaColors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PersistQueryClientProvider>
  );
}
