// app/_layout.tsx
import { useEffect } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { Slot } from 'expo-router';

// Importaciones locales
import { queryClient } from '../api/queryClient';
import '../api/mutations'; 

// 1. Configurar Online Manager para mutaciones offline con expo-network
onlineManager.setEventListener((setOnline) => {
  return Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  }).remove;
});

// 2. Crear Persister para AsyncStorage
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

// 3. Tiempos definidos para caché (Requisito 3)
const MAX_AGE = 1000 * 60 * 60 * 24; // 24 horas máximo en AsyncStorage

export default function RootLayout() {
  useEffect(() => {
    // 4. Retomar mutaciones en pausa al montar el Provider (Recuperar conexión)
    queryClient.resumePausedMutations();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: MAX_AGE, 
      }}
    >
      {/* Slot inyecta el (tabs)/_layout.tsx como renderizado principal */}
      <Slot />
    </PersistQueryClientProvider>
  );
}