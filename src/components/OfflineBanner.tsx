import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { NasaColors } from '../constants/nasaTheme';

export function OfflineBanner() {
  const isConnected = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (isConnected) return null;

  return (
    <View style={[styles.banner, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.text}>Sin conexión - Guardando localmente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: NasaColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: NasaColors.warning,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  text: { color: NasaColors.warning, fontWeight: '600', fontSize: 12 },
});
