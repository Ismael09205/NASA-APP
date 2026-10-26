import { View, Text, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { NasaColors, NasaRadius, NasaSpacing } from '../constants/nasaTheme';

type Props = { icon: LucideIcon; value: string; label: string };

export function StatCard({ icon: Icon, value, label }: Props) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label}: ${value}`}>
      <Icon size={16} color={NasaColors.accentBlue} />
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
    padding: NasaSpacing.md - 4,
    gap: 2,
  },
  value: { color: NasaColors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: NasaSpacing.xs },
  label: { color: NasaColors.textSecondary, fontSize: 12 },
});
