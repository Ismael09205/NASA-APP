import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, Orbit } from 'lucide-react-native';
import { Asteroid } from '../types/nasa';
import { Chip } from './Chip';
import { fmtAu, fmtDiameter, fmtKm, fmtSpeed } from '../utils/format';
import { fmtDate } from '../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../constants/nasaTheme';

type Props = { item: Asteroid; onPress: (a: Asteroid) => void };

function AsteroidCardBase({ item, onPress }: Props) {
  const miss = fmtKm(item.missKm);
  const au = fmtAu(item.missAu);
  const speed = fmtSpeed(item.velocityKps);
  const diameter = fmtDiameter(item.diameterMinM, item.diameterMaxM);
  const date = fmtDate(item.approachDate);

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}. Ver detalle`}
    >
      <View style={styles.top}>
        <View style={styles.iconBox}>
          <Orbit size={18} color={NasaColors.accentBlue} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {date && <Text style={styles.date}>Aproximación: {date}</Text>}
        </View>
        <ChevronRight size={18} color={NasaColors.textSecondary} />
      </View>

      <View style={styles.metrics}>
        <Metric label="Distancia" value={miss} sub={au} />
        <Metric label="Velocidad" value={speed} />
      </View>

      <View style={styles.footer}>
        {diameter && <Text style={styles.secondary}>Diámetro: {diameter}</Text>}
        {item.hazardous && <Chip label="Clasificado como PHA por NASA" tone="warning" />}
      </View>
    </Pressable>
  );
}

function Metric({ label, value, sub }: { label: string; value: string | null; sub?: string | null }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1}>{value ?? 'Sin dato'}</Text>
      {sub && <Text style={styles.metricSub}>{sub}</Text>}
    </View>
  );
}

export const AsteroidCard = memo(AsteroidCardBase);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: NasaSpacing.md,
    marginBottom: NasaSpacing.sm,
    padding: NasaSpacing.md,
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
    gap: NasaSpacing.sm + 4,
  },
  pressed: { opacity: 0.85 },
  top: { flexDirection: 'row', alignItems: 'center', gap: NasaSpacing.sm + 4 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: NasaRadius.control,
    backgroundColor: NasaColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1 },
  name: { color: NasaColors.textPrimary, fontSize: 16, fontWeight: '700' },
  date: { color: NasaColors.textSecondary, fontSize: 12, marginTop: 2 },
  metrics: { flexDirection: 'row', gap: NasaSpacing.sm },
  metric: {
    flex: 1,
    backgroundColor: NasaColors.surfaceElevated,
    borderRadius: NasaRadius.control,
    padding: NasaSpacing.sm + 4,
  },
  metricLabel: { color: NasaColors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { color: NasaColors.textPrimary, fontSize: 17, fontWeight: '700', marginTop: 2 },
  metricSub: { color: NasaColors.textSecondary, fontSize: 12 },
  footer: { gap: NasaSpacing.sm, alignItems: 'flex-start' },
  secondary: { color: NasaColors.textSecondary, fontSize: 13 },
});
