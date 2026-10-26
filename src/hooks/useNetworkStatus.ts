import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const subscription = Network.addNetworkStateListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => subscription.remove();
  }, []);

  return isConnected;
}