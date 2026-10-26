import { View, Text, StyleSheet } from 'react-native';
import { NasaColors, NasaSpacing } from '../constants/nasaTheme';
import { AppButton } from './AppButton';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
      <AppButton title="Reintentar" variant="secondary" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: NasaSpacing.lg, alignItems: 'center', gap: NasaSpacing.md },
  text: { color: NasaColors.textPrimary, fontSize: 15, textAlign: 'center' },
});
