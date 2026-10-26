import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { NasaColors, NasaRadius } from '../constants/nasaTheme';

type Props = { value: string; onChangeText: (t: string) => void; placeholder: string };

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <Search size={18} color={NasaColors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={NasaColors.textSecondary}
        selectionColor={NasaColors.accentBlue}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={12} accessibilityLabel="Borrar búsqueda">
          <X size={18} color={NasaColors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: NasaRadius.control,
    borderWidth: 1,
    borderColor: NasaColors.border,
    backgroundColor: NasaColors.surface,
  },
  input: { flex: 1, color: NasaColors.textPrimary, fontSize: 15, paddingVertical: 10 },
});
