import { View, Text, StyleSheet, Platform } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function OfflineBanner() {
  const isConnected = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Sin conexión - Guardando localmente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { 
    backgroundColor: '#ff4444', 
    padding: 8, 
    paddingTop: Platform.OS === 'ios' ? 40 : 8, // Ajuste para el notch en iOS si es necesario
    alignItems: 'center',
    zIndex: 10
  },
  text: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});