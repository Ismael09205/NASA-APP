import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Trash2, Telescope, Orbit } from 'lucide-react-native';
import { useLogs } from '../../api/queries';
import { AppButton } from '../../components/AppButton';
import { Chip } from '../../components/Chip';
import { ErrorState } from '../../components/ErrorState';
import { categoryIcon } from '../../constants/categories';
import { fmtDate } from '../../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../../constants/nasaTheme';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: logs, isLoading, isError, refetch } = useLogs();
  const entry = logs?.find((l) => l.id === id);
  const { mutate: deleteLog, isPending: deleting } = useMutation<any, Error, string>({ mutationKey: ['deleteLog'] });

  if (!entry) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Entrada' }} />
        {isLoading ? (
          <ActivityIndicator size="large" color={NasaColors.accentBlue} />
        ) : (
          <ErrorState message={isError ? 'No se pudo cargar la entrada.' : 'Entrada no encontrada.'} onRetry={refetch} />
        )}
      </View>
    );
  }

  const confirmDelete = () =>
    Alert.alert('Eliminar entrada', '¿Seguro que quieres eliminar esta entrada de tu bitácora?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteLog(entry.id, { onSuccess: () => router.back() }) },
    ]);

  const openSource = () => {
    if (entry.source === 'apod') router.navigate('/apod');
    else if (entry.source === 'asteroid' && entry.refId) {
      const [astId, date] = entry.refId.split('_');
      router.push({ pathname: '/asteroid/[id]', params: { id: astId, ...(date ? { date } : {}) } });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Entrada' }} />
      {entry.imageUrl ? <Image source={{ uri: entry.imageUrl }} style={styles.image} contentFit="cover" cachePolicy="disk" /> : null}
      <View style={styles.tags}>
        {entry.category ? <Chip label={entry.category} icon={categoryIcon(entry.category)} /> : null}
        <Chip label={fmtDate(entry.createdAt, 'D MMMM YYYY') ?? 'Sin fecha'} />
      </View>
      <Text style={styles.title} accessibilityRole="header">{entry.title}</Text>
      {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}

      {entry.source && entry.source !== 'manual' && (
        <AppButton
          title={entry.source === 'apod' ? 'Ver descubrimiento del día' : 'Ver asteroide'}
          variant="secondary"
          icon={entry.source === 'apod' ? Telescope : Orbit}
          onPress={openSource}
        />
      )}
      <View style={styles.actions}>
        <AppButton
          title="Editar"
          icon={Pencil}
          style={styles.flex}
          disabled={deleting}
          onPress={() => router.push({ pathname: '/entry/form', params: { id: entry.id } })}
        />
        <AppButton title="Eliminar" variant="danger" icon={Trash2} style={styles.flex} loading={deleting} onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NasaColors.background },
  container: { flex: 1, backgroundColor: NasaColors.background },
  content: { padding: NasaSpacing.md, gap: NasaSpacing.md, paddingBottom: NasaSpacing.xl },
  image: { width: '100%', aspectRatio: 16 / 10, borderRadius: NasaRadius.card, backgroundColor: NasaColors.surface },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: NasaSpacing.sm },
  title: { color: NasaColors.textPrimary, fontSize: 24, fontWeight: '700' },
  note: { color: NasaColors.textPrimary, fontSize: 16, lineHeight: 25 },
  actions: { flexDirection: 'row', gap: NasaSpacing.sm },
  flex: { flex: 1 },
});
