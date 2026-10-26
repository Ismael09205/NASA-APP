import { Pressable, Text, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { NasaColors } from '../constants/nasaTheme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  /** Chip informativo, no interactivo */
  tone?: 'default' | 'warning' | 'success';
};

export function Chip({ label, selected, onPress, icon: Icon, tone = 'default' }: Props) {
  const toneColor =
    tone === 'warning' ? NasaColors.warning : tone === 'success' ? NasaColors.success : undefined;
  const color = toneColor ?? (selected ? NasaColors.textPrimary : NasaColors.textSecondary);
  const content = (
    <>
      {Icon && <Icon size={14} color={color} style={styles.icon} />}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </>
  );
  const style = [
    styles.chip,
    selected && styles.selected,
    toneColor ? { borderColor: toneColor } : null,
  ];

  if (!onPress) return <Pressable disabled style={style}>{content}</Pressable>;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={style}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: NasaColors.border,
    backgroundColor: NasaColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selected: { backgroundColor: NasaColors.nasaBlue, borderColor: NasaColors.accentBlue },
  icon: { marginRight: 6 },
  text: { fontSize: 13, fontWeight: '600' },
});
