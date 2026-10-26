import { View, Text, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { NasaColors, NasaSpacing } from '../constants/nasaTheme';
import { AppButton } from './AppButton';

type Props = {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon size={28} color={NasaColors.accentBlue} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && <AppButton title={actionLabel} onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: NasaSpacing.lg, alignItems: 'center', gap: NasaSpacing.sm },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: NasaColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: NasaSpacing.sm,
  },
  title: { color: NasaColors.textPrimary, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  message: { color: NasaColors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: NasaSpacing.sm },
});
