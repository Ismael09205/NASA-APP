import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { NasaColors, NasaRadius, NasaSpacing } from '../constants/nasaTheme';

type Props = { icon: LucideIcon; title: string; subtitle: string };

export function ScreenHeader({ icon: Icon, title, subtitle }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + NasaSpacing.md }]}>
      <View style={styles.iconBox}>
        <Icon size={22} color={NasaColors.textPrimary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: NasaSpacing.md,
    paddingBottom: NasaSpacing.md,
    gap: NasaSpacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: NasaRadius.control,
    backgroundColor: NasaColors.nasaBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1 },
  title: { color: NasaColors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: NasaColors.textSecondary, fontSize: 13, marginTop: 2 },
});
