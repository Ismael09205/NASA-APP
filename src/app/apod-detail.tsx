import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useApod, useApodTranslation } from '../api/queries';
import { AppButton } from '../components/AppButton';
import { ErrorState } from '../components/ErrorState';
import { Chip } from '../components/Chip';
import { fmtDate } from '../utils/dates';
import { NasaColors, NasaSpacing } from '../constants/nasaTheme';

export default function ApodDetailScreen() {
  const { data, isLoading, isError, refetch } = useApod();
  const { data: es, isLoading: isTranslating } = useApodTranslation(data);
  const [showOriginal, setShowOriginal] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={NasaColors.accentBlue} />
      </View>
    );
  }
  if (isError || !data) {
    return (
      <View style={styles.center}>
        <ErrorState message="No se pudo cargar la explicación." onRetry={refetch} />
      </View>
    );
  }

  const useOriginal = showOriginal || !es;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Explicación' }} />
      <View style={styles.tags}>
        <Chip label="NASA APOD" />
        <Chip label={fmtDate(data.date) ?? data.date} />
        <Chip label={useOriginal ? 'English' : 'Español'} tone="success" />
      </View>
      <Text style={styles.title}>{useOriginal ? data.title : es!.title}</Text>
      <Text style={styles.body}>{useOriginal ? data.explanation : es!.explanation}</Text>
      {isTranslating && <Text style={styles.hint}>Traduciendo al español...</Text>}
      {es && (
        <AppButton
          title={showOriginal ? 'Ver traducción' : 'Ver texto original de NASA (EN)'}
          variant="secondary"
          onPress={() => setShowOriginal((v) => !v)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NasaColors.background },
  container: { flex: 1, backgroundColor: NasaColors.background },
  content: { padding: NasaSpacing.md, gap: NasaSpacing.md, paddingBottom: NasaSpacing.xl },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: NasaSpacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: NasaColors.textPrimary },
  body: { fontSize: 16, lineHeight: 25, color: NasaColors.textPrimary },
  hint: { fontSize: 12, color: NasaColors.accentBlue },
});
