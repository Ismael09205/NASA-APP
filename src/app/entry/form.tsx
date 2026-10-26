import { useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onlineManager, useMutation } from '@tanstack/react-query';
import { useLogs } from '../../api/queries';
import { EditLogData, NewLogData } from '../../api/mutations';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { LogSource } from '../../types/log';
import { AppButton } from '../../components/AppButton';
import { Chip } from '../../components/Chip';
import { ErrorState } from '../../components/ErrorState';
import { LOG_CATEGORIES, categoryIcon } from '../../constants/categories';
import { fmtDate } from '../../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../../constants/nasaTheme';

const schema = z.object({
  title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres'),
  note: z.string().trim().min(10, 'La nota debe tener al menos 10 caracteres'),
  category: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

type Params = {
  id?: string;
  title?: string;
  note?: string;
  category?: string;
  source?: LogSource;
  refId?: string;
  imageUrl?: string;
};

export default function EntryFormScreen() {
  const p = useLocalSearchParams<Params>();
  const isEdit = !!p.id;
  const isConnected = useNetworkStatus();
  const { data: logs, isLoading, isError, refetch } = useLogs();
  const existing = isEdit ? logs?.find((l) => l.id === p.id) : undefined;

  const { mutate: addLog, isPending: adding } = useMutation<any, Error, NewLogData>({ mutationKey: ['addLog'] });
  const { mutate: editLog, isPending: editing } = useMutation<any, Error, EditLogData>({ mutationKey: ['editLog'] });
  const busy = adding || editing;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: p.title ?? '',
      note: p.note ?? '',
      category: p.category ?? LOG_CATEGORIES[0],
    },
  });

  const loaded = useRef(!isEdit);
  useEffect(() => {
    if (existing && !loaded.current) {
      loaded.current = true;
      reset({ title: existing.title, note: existing.note, category: existing.category ?? LOG_CATEGORIES[0] });
    }
  }, [existing, reset]);

  if (isEdit && !existing) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Editar entrada' }} />
        {isLoading ? (
          <ActivityIndicator size="large" color={NasaColors.accentBlue} />
        ) : (
          <ErrorState message={isError ? 'No se pudo cargar la entrada.' : 'Entrada no encontrada.'} onRetry={refetch} />
        )}
      </View>
    );
  }

  const imageUrl = existing?.imageUrl ?? p.imageUrl;
  const dateLabel = fmtDate(existing?.createdAt ?? new Date().toISOString(), 'D MMMM YYYY');
  let didNavigateBack = false;

  const onSubmit = (v: FormValues) => {
    const goBackOnce = () => {
      if (didNavigateBack) return;
      didNavigateBack = true;
      router.back();
    };
    const offline = !isConnected || !onlineManager.isOnline();

    if (isEdit && existing) {
      editLog(
        { id: existing.id, ...v, imageUrl: existing.imageUrl, source: existing.source, refId: existing.refId, createdAt: existing.createdAt },
        { onSuccess: goBackOnce },
      );
    } else {
      addLog(
        {
          ...v,
          imageUrl: p.imageUrl,
          source: p.source ?? 'manual',
          refId: p.refId,
          createdAt: new Date().toISOString(),
        },
        { onSuccess: goBackOnce },
      );
    }
    if (offline) {
      Alert.alert('Sin conexión', 'La entrada se guardará automáticamente cuando recuperes la conexión.');
      goBackOnce();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: isEdit ? 'Editar entrada' : 'Nueva entrada' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" cachePolicy="disk" /> : null}
        <Text style={styles.date}>{dateLabel}</Text>

        <Text style={styles.label}>Categoría</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <View style={styles.chips}>
              {LOG_CATEGORIES.map((c) => (
                <Chip key={c} label={c} icon={categoryIcon(c)} selected={value === c} onPress={() => onChange(c)} />
              ))}
            </View>
          )}
        />

        <Text style={styles.label}>Título</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Título (ej. Júpiter)"
              placeholderTextColor={NasaColors.textSecondary}
              selectionColor={NasaColors.accentBlue}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              accessibilityLabel="Título"
            />
          )}
        />
        {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

        <Text style={styles.label}>Reflexión personal</Text>
        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Notas de la observación..."
              placeholderTextColor={NasaColors.textSecondary}
              selectionColor={NasaColors.accentBlue}
              onChangeText={onChange}
              value={value}
              multiline
              style={[styles.input, styles.textArea]}
              accessibilityLabel="Reflexión personal"
            />
          )}
        />
        {errors.note && <Text style={styles.error}>{errors.note.message}</Text>}

        <AppButton
          title={busy ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar entrada'}
          onPress={handleSubmit(onSubmit)}
          loading={busy}
        />
        <AppButton title="Cancelar" variant="secondary" onPress={() => router.back()} disabled={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: NasaColors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NasaColors.background },
  container: { flex: 1 },
  content: { padding: NasaSpacing.md, gap: NasaSpacing.sm, paddingBottom: NasaSpacing.xl },
  image: { width: '100%', aspectRatio: 16 / 10, borderRadius: NasaRadius.card, backgroundColor: NasaColors.surface },
  date: { color: NasaColors.textSecondary, fontSize: 13 },
  label: { color: NasaColors.textPrimary, fontSize: 14, fontWeight: '600', marginTop: NasaSpacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: NasaSpacing.sm },
  input: {
    borderWidth: 1,
    borderColor: NasaColors.border,
    backgroundColor: NasaColors.surface,
    color: NasaColors.textPrimary,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: NasaRadius.control,
    fontSize: 15,
  },
  textArea: { minHeight: 140, textAlignVertical: 'top' },
  error: { color: NasaColors.nasaRed, fontSize: 13 },
});
