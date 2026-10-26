import { Pressable, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { NasaColors, NasaRadius, MinTouch } from '../constants/nasaTheme';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, onPress, variant = 'primary', disabled, loading, icon: Icon, style }: Props) {
  const isDisabled = disabled || loading;
  const color =
    variant === 'danger' ? NasaColors.nasaRed : variant === 'secondary' ? NasaColors.textPrimary : NasaColors.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={NasaColors.textPrimary} style={styles.icon} />
      ) : Icon ? (
        <Icon size={18} color={color} style={styles.icon} />
      ) : null}
      <Text style={[styles.text, { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MinTouch,
    paddingHorizontal: 16,
    borderRadius: NasaRadius.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  icon: { marginRight: 8 },
  text: { fontWeight: '600', fontSize: 15 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: NasaColors.nasaBlue },
  secondary: { backgroundColor: NasaColors.surfaceElevated, borderWidth: 1, borderColor: NasaColors.border },
  danger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: NasaColors.border },
});
