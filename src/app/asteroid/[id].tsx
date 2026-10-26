import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ExternalLink } from 'lucide-react-native';
import { useAsteroidDetail, useCachedAsteroid } from '../../api/queries';
import { AppButton } from '../../components/AppButton';
import { ErrorState } from '../../components/ErrorState';
import { Chip } from '../../components/Chip';
import { SaveToLogButton } from '../../components/SaveToLogButton';
import { fmtAu, fmtDiameter, fmtKm, fmtSpeed } from '../../utils/format';
import { fmtDate } from '../../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../../constants/nasaTheme';

export default function AsteroidDetailScreen() {
  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();
  const cached = useCachedAsteroid(id, date);
  const { data: fetched, isLoading, isError, refetch } = useAsteroidDetail(id, date);
  const a = fetched ?? cached;

  if (!a) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Asteroide' }} />
        {isLoading ? (
          <ActivityIndicator size="large" color={NasaColors.accentBlue} />
        ) : (
          <ErrorState message={isError ? 'No se pudo cargar el asteroide.' : 'Asteroide no encontrado.'} onRetry={refetch} />
        )}
      </View>
    );
  }

  const full = a.approachDateFull;
  const rows: [string, string | null][] = [
    ['Distancia de aproximación', [fmtKm(a.missKm), fmtAu(a.missAu)].filter(Boolean).join(' · ') || null],
    ['Velocidad relativa', fmtSpeed(a.velocityKps)],
    ['Diámetro estimado', fmtDiameter(a.diameterMinM, a.diameterMaxM)],
    ['Fecha y hora de aproximación', full ?? fmtDate(a.approachDate)],
    ['Designación', a.designation],
    ['ID NASA', a.id],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Asteroide' }} />
      <Text style={styles.name} accessibilityRole="header">{a.name}</Text>
      <View style={styles.tags}>
        {a.hazardous ? (
          <Chip label="Potencialmente peligroso (PHA)" tone="warning" />
        ) : (
          <Chip label="No clasificado como PHA" tone="success" />
        )}
      </View>
      {a.hazardous && (
        <Text style={styles.note}>
          La clasificación PHA se basa en el tamaño del objeto y en lo cerca que puede pasar de la órbita terrestre. No es una
          predicción de impacto.
        </Text>
      )}

      <View style={styles.card}>
        {rows
          .filter(([, v]) => !!v)
          .map(([label, value], i, arr) => (
            <View key={label} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
      </View>

      {a.jplUrl && (
        <AppButton
          title="Ver en datos de NASA (JPL)"
          variant="secondary"
          icon={ExternalLink}
          onPress={() => WebBrowser.openBrowserAsync(a.jplUrl!)}
        />
      )}
      <SaveToLogButton
        source="asteroid"
        refId={a.uid}
        title={a.name}
        note={[
          a.missKm != null ? `Pasó a ${fmtKm(a.missKm)} de la Tierra` : null,
          a.velocityKps != null ? `a ${fmtSpeed(a.velocityKps)}` : null,
        ]
          .filter(Boolean)
          .join(' ')}
        category="Asteroide"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NasaColors.background },
  container: { flex: 1, backgroundColor: NasaColors.background },
  content: { padding: NasaSpacing.md, gap: NasaSpacing.md, paddingBottom: NasaSpacing.xl },
  name: { color: NasaColors.textPrimary, fontSize: 24, fontWeight: '700' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: NasaSpacing.sm },
  note: { color: NasaColors.textSecondary, fontSize: 13, lineHeight: 19 },
  card: {
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
    paddingHorizontal: NasaSpacing.md,
  },
  row: { paddingVertical: NasaSpacing.sm + 4, gap: 2 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: NasaColors.border },
  label: { color: NasaColors.textSecondary, fontSize: 12 },
  value: { color: NasaColors.textPrimary, fontSize: 16, fontWeight: '600' },
});
