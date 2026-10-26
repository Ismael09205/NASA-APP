// app/(tabs)/asteroids.tsx
import { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl, TextInput, ScrollView, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Orbit, SearchX } from 'lucide-react-native';
import { useAsteroids } from '../../api/queries';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Asteroid } from '../../types/nasa';
import { AsteroidCard } from '../../components/AsteroidCard';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchBar } from '../../components/SearchBar';
import { Chip } from '../../components/Chip';
import { AppButton } from '../../components/AppButton';
import { NeoPreset, fmtDate, presetRange, validateRange, MAX_RANGE_DAYS } from '../../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../../constants/nasaTheme';

type Mode = NeoPreset | 'custom';
type Sort = 'distance' | 'speed' | 'diameter';

const asc = (a: number | null, b: number | null) => (a ?? Infinity) - (b ?? Infinity);
const desc = (a: number | null, b: number | null) => (b ?? -Infinity) - (a ?? -Infinity);

const SORTERS: Record<Sort, (a: Asteroid, b: Asteroid) => number> = {
  distance: (a, b) => asc(a.missKm, b.missKm),
  speed: (a, b) => desc(a.velocityKps, b.velocityKps),
  diameter: (a, b) => desc(a.diameterMaxM, b.diameterMaxM),
};

export default function AsteroidsScreen() {
  const isConnected = useNetworkStatus();
  const [mode, setMode] = useState<Mode>('today');
  const [range, setRange] = useState(() => presetRange('today'));
  const [customStart, setCustomStart] = useState(range.start);
  const [customEnd, setCustomEnd] = useState(range.end);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [onlyHazardous, setOnlyHazardous] = useState(false);
  const [sort, setSort] = useState<Sort>('distance');

  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } = useAsteroids(range.start, range.end);

  const selectPreset = (preset: NeoPreset) => {
    const r = presetRange(preset);
    setMode(preset);
    setRange(r);
    setCustomStart(r.start);
    setCustomEnd(r.end);
    setRangeError(null);
  };

  const applyCustom = () => {
    const error = validateRange(customStart.trim(), customEnd.trim());
    setRangeError(error);
    if (error) return;
    Keyboard.dismiss();
    setRange({ start: customStart.trim(), end: customEnd.trim() });
  };

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.items ?? [])
      .filter((a) => (!onlyHazardous || a.hazardous) && (!q || a.name.toLowerCase().includes(q)))
      .sort(SORTERS[sort]);
  }, [data, query, onlyHazardous, sort]);

  const total = data?.items.length ?? 0;
  const hasFilters = query.trim().length > 0 || onlyHazardous;
  const rangeLabel =
    range.start === range.end
      ? fmtDate(range.start)
      : `${fmtDate(range.start, 'D MMM')} – ${fmtDate(range.end, 'D MMM YYYY')}`;
  const updated = dataUpdatedAt ? fmtDate(new Date(dataUpdatedAt).toISOString(), 'D MMM, HH:mm') : null;

  const openDetail = (a: Asteroid) =>
    router.push({ pathname: '/asteroid/[id]', params: { id: a.id, date: a.approachDate } });

  const header = (
    <View style={styles.headerWrap}>
      <ScreenHeader icon={Orbit} title="Asteroides" subtitle="Objetos cercanos a la Tierra" />

      <View style={styles.pad}>
        <View style={styles.summary} accessible accessibilityLabel={`${total} asteroides, ${rangeLabel}`}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryValue}>{data ? total : '—'}</Text>
            <Text style={styles.summaryLabel}>Encontrados</Text>
          </View>
          <View style={[styles.summaryCol, styles.summaryMid]}>
            <Text style={styles.summaryValueSm}>{rangeLabel}</Text>
            <Text style={styles.summaryLabel}>Rango consultado</Text>
          </View>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryValueSm}>{updated ?? '—'}</Text>
            <Text style={styles.summaryLabel}>Última consulta</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Chip label="Hoy" selected={mode === 'today'} onPress={() => selectPreset('today')} />
          <Chip label="Próximos 7 días" selected={mode === 'week'} onPress={() => selectPreset('week')} />
          <Chip label="Personalizado" selected={mode === 'custom'} onPress={() => setMode('custom')} />
        </View>

        {mode === 'custom' && (
          <View style={styles.customBox}>
            <View style={styles.row}>
              <DateField label="Desde" value={customStart} onChangeText={setCustomStart} />
              <DateField label="Hasta" value={customEnd} onChangeText={setCustomEnd} />
            </View>
            <Text style={rangeError ? styles.errorText : styles.hint}>
              {rangeError ?? `Formato AAAA-MM-DD. Máximo ${MAX_RANGE_DAYS} días.`}
            </Text>
            <AppButton title="Consultar rango" onPress={applyCustom} />
          </View>
        )}

        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nombre" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          <Chip label="Solo PHA" selected={onlyHazardous} onPress={() => setOnlyHazardous((v) => !v)} />
          <Text style={styles.sortLabel}>Ordenar:</Text>
          <Chip label="Distancia" selected={sort === 'distance'} onPress={() => setSort('distance')} />
          <Chip label="Velocidad" selected={sort === 'speed'} onPress={() => setSort('speed')} />
          <Chip label="Diámetro" selected={sort === 'diameter'} onPress={() => setSort('diameter')} />
        </ScrollView>
        {onlyHazardous && (
          <Text style={styles.hint}>
            PHA = «potencialmente peligroso» según la clasificación de NASA. No implica riesgo de impacto.
          </Text>
        )}
      </View>
    </View>
  );

  const empty = (() => {
    if (isLoading) return <ActivityIndicator size="large" color={NasaColors.accentBlue} style={styles.state} />;
    if (isError)
      return (
        <ErrorState
          message={isConnected ? 'No se pudo conectar con la NASA.' : 'Sin conexión. Conéctate a internet para consultar asteroides.'}
          onRetry={refetch}
        />
      );
    if (hasFilters && total > 0)
      return (
        <EmptyState
          icon={SearchX}
          title="Sin resultados"
          message="Ningún asteroide coincide con los filtros."
          actionLabel="Limpiar filtros"
          onAction={() => {
            setQuery('');
            setOnlyHazardous(false);
          }}
        />
      );
    return <EmptyState icon={Orbit} title="Cielo despejado" message="NASA no reporta asteroides para este rango de fechas." />;
  })();

  return (
    <FlatList
      style={styles.container}
      data={isError ? [] : items}
      keyExtractor={(a) => a.uid}
      renderItem={({ item }) => <AsteroidCard item={item} onPress={openDetail} />}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={NasaColors.accentBlue}
          colors={[NasaColors.accentBlue]}
          progressBackgroundColor={NasaColors.surface}
        />
      }
    />
  );
}

function DateField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (t: string) => void }) {
  return (
    <View style={styles.dateField}>
      <Text style={styles.hint}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="AAAA-MM-DD"
        placeholderTextColor={NasaColors.textSecondary}
        selectionColor={NasaColors.accentBlue}
        style={styles.dateInput}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NasaColors.background },
  content: { paddingBottom: NasaSpacing.xl },
  headerWrap: { marginBottom: NasaSpacing.sm },
  pad: { paddingHorizontal: NasaSpacing.md, gap: NasaSpacing.sm + 4 },
  state: { padding: NasaSpacing.lg },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: NasaSpacing.sm, alignItems: 'center' },
  summary: {
    flexDirection: 'row',
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
    padding: NasaSpacing.md,
  },
  summaryCol: { flex: 1 },
  summaryMid: { flex: 1.4, paddingHorizontal: NasaSpacing.sm },
  summaryValue: { color: NasaColors.textPrimary, fontSize: 26, fontWeight: '700' },
  summaryValueSm: { color: NasaColors.textPrimary, fontSize: 14, fontWeight: '700', marginTop: 8 },
  summaryLabel: { color: NasaColors.textSecondary, fontSize: 11, marginTop: 2 },
  customBox: {
    gap: NasaSpacing.sm,
    padding: NasaSpacing.md,
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
  },
  dateField: { flex: 1, minWidth: 130, gap: 4 },
  dateInput: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: NasaRadius.control,
    borderWidth: 1,
    borderColor: NasaColors.border,
    backgroundColor: NasaColors.surfaceElevated,
    color: NasaColors.textPrimary,
    fontSize: 15,
  },
  hint: { color: NasaColors.textSecondary, fontSize: 12 },
  errorText: { color: NasaColors.nasaRed, fontSize: 12 },
  chipScroll: { gap: NasaSpacing.sm, alignItems: 'center', paddingRight: NasaSpacing.md },
  sortLabel: { color: NasaColors.textSecondary, fontSize: 12, marginLeft: NasaSpacing.sm },
});
