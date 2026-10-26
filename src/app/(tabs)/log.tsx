// app/(tabs)/log.tsx
import { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SectionList, RefreshControl, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Book, BookOpen, Compass, Layers, NotebookPen, Plus, SearchX } from 'lucide-react-native';
import dayjs from 'dayjs';
import { useLogs } from '../../api/queries';
import { LogEntry } from '../../types/log';
import { LogEntryCard } from '../../components/LogEntryCard';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatCard } from '../../components/StatCard';
import { SearchBar } from '../../components/SearchBar';
import { Chip } from '../../components/Chip';
import { AppButton } from '../../components/AppButton';
import { fmtDate } from '../../utils/dates';
import { NasaColors, NasaSpacing } from '../../constants/nasaTheme';

const time = (e: LogEntry) => (e.createdAt ? dayjs(e.createdAt).valueOf() : 0);

export default function LogScreen() {
  const { data: logs, isLoading, isError, refetch, isRefetching } = useLogs();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [newestFirst, setNewestFirst] = useState(true);

  const all = useMemo(() => logs ?? [], [logs]);
  const categories = useMemo(() => [...new Set(all.map((e) => e.category).filter((c): c is string => !!c))], [all]);
  const discoveries = all.filter((e) => e.source === 'apod' || e.source === 'asteroid').length;
  const hasFilters = query.trim().length > 0 || category !== null;

  const featured = useMemo(
    () => (hasFilters ? undefined : [...all].sort((a, b) => time(b) - time(a))[0]),
    [all, hasFilters],
  );

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all
      .filter((e) => e.id !== featured?.id)
      .filter((e) => (!category || e.category === category) && (!q || e.title.toLowerCase().includes(q)))
      .sort((a, b) => (newestFirst ? time(b) - time(a) : time(a) - time(b)));

    const groups = new Map<string, LogEntry[]>();
    for (const e of filtered) {
      const key = e.createdAt ? dayjs(e.createdAt).format('YYYY-MM-DD') : 'none';
      groups.set(key, [...(groups.get(key) ?? []), e]);
    }
    return [...groups.entries()].map(([key, data]) => ({
      title: key === 'none' ? 'Sin fecha' : (fmtDate(key, 'dddd D [de] MMMM YYYY') ?? key),
      data,
    }));
  }, [all, featured, query, category, newestFirst]);

  const openEntry = (e: LogEntry) => router.push({ pathname: '/entry/[id]', params: { id: e.id } });
  const create = () => router.push('/entry/form');

  const header = (
    <View style={styles.headerWrap}>
      <ScreenHeader icon={Book} title="Mi bitácora" subtitle="Tu diario personal de exploración del universo" />
      <View style={styles.pad}>
        <AppButton title="Nueva entrada" icon={Plus} onPress={create} />

        {!isLoading && !isError && (
          <View style={styles.stats}>
            <StatCard icon={NotebookPen} value={String(all.length)} label="Entradas" />
            <StatCard icon={Compass} value={String(discoveries)} label="Descubrimientos guardados" />
            <StatCard icon={Layers} value={String(categories.length)} label="Categorías exploradas" />
          </View>
        )}

        {featured && (
          <View style={styles.featuredWrap}>
            <Text style={styles.sectionTitle}>Entrada destacada</Text>
            <LogEntryCard item={featured} onPress={openEntry} featured />
          </View>
        )}

        {all.length > 0 && (
          <>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por título" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              <Chip label="Todas" selected={category === null} onPress={() => setCategory(null)} />
              {categories.map((c) => (
                <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(category === c ? null : c)} />
              ))}
              <Chip
                label={newestFirst ? 'Más recientes' : 'Más antiguas'}
                onPress={() => setNewestFirst((v) => !v)}
              />
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );

  const empty = (() => {
    if (isLoading && !isRefetching) return <ActivityIndicator size="large" color={NasaColors.accentBlue} style={styles.state} />;
    if (isError) return <ErrorState message="Error al cargar la bitácora" onRetry={refetch} />;
    if (all.length === 0)
      return (
        <EmptyState
          icon={BookOpen}
          title="Tu bitácora está vacía"
          message="Registra tu primer descubrimiento: una observación, una foto del día o un asteroide."
          actionLabel="Crear primera entrada"
          onAction={create}
        />
      );
    if (hasFilters)
      return (
        <EmptyState
          icon={SearchX}
          title="Sin resultados"
          message="Ninguna entrada coincide con la búsqueda."
          actionLabel="Limpiar filtros"
          onAction={() => {
            setQuery('');
            setCategory(null);
          }}
        />
      );
    return null;
  })();

  return (
    <SectionList
      style={styles.container}
      sections={isError ? [] : sections}
      keyExtractor={(e) => e.id}
      renderItem={({ item }) => <LogEntryCard item={item} onPress={openEntry} />}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <View style={styles.dot} />
          <Text style={styles.sectionLabel}>{section.title}</Text>
        </View>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      stickySectionHeadersEnabled={false}
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
      // Las secciones y tarjetas comparten el margen lateral
      ListFooterComponent={<View style={{ height: NasaSpacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NasaColors.background },
  content: { paddingBottom: NasaSpacing.xl, paddingHorizontal: NasaSpacing.md },
  headerWrap: { marginHorizontal: -NasaSpacing.md, marginBottom: NasaSpacing.sm },
  pad: { paddingHorizontal: NasaSpacing.md, gap: NasaSpacing.sm + 4 },
  state: { padding: NasaSpacing.lg },
  stats: { flexDirection: 'row', gap: NasaSpacing.sm },
  featuredWrap: { gap: NasaSpacing.sm },
  sectionTitle: { color: NasaColors.textPrimary, fontSize: 17, fontWeight: '700' },
  chips: { gap: NasaSpacing.sm, paddingRight: NasaSpacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: NasaSpacing.sm, paddingVertical: NasaSpacing.sm, marginTop: NasaSpacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: NasaColors.accentBlue },
  sectionLabel: { color: NasaColors.textSecondary, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
});
