// app/(tabs)/apod.tsx
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, RefreshControl, Share, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Heart, Share2, Orbit, Book, PlayCircle, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { useApod, useApodTranslation } from '../../api/queries';
import { useApodFavorites } from '../../hooks/useApodFavorites';
import { ErrorState } from '../../components/ErrorState';
import { AppButton } from '../../components/AppButton';
import { Chip } from '../../components/Chip';
import { SaveToLogButton } from '../../components/SaveToLogButton';
import { fmtDate } from '../../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../../constants/nasaTheme';

export default function ApodScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApod();
  const { data: es, isLoading: isTranslating } = useApodTranslation(data);
  const favorites = useApodFavorites();

  if (isLoading && !isRefetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={NasaColors.accentBlue} />
        <Text style={styles.loadingText}>Conectando con la NASA...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <ErrorState message="Error al cargar el descubrimiento de hoy." onRetry={refetch} />
      </View>
    );
  }

  const title = es?.title ?? data.title;
  const explanation = es?.explanation ?? data.explanation;
  const isImage = data.media_type === 'image';
  const imageUri = isImage ? (data.hdurl ?? data.url) : data.thumbnail_url;
  const isFav = favorites.isFavorite(data.date);

  const onShare = async () => {
    try {
      await Share.share({ message: `${data.title} — NASA APOD (${data.date})\n${data.hdurl ?? data.url}` });
    } catch {
      /* el usuario canceló o la plataforma no pudo compartir */
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={NasaColors.accentBlue}
          colors={[NasaColors.accentBlue]}
          progressBackgroundColor={NasaColors.surface}
        />
      }
    >
      <View style={styles.hero}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.heroImage}
            contentFit="cover"
            transition={500}
            priority="high"
            cachePolicy="disk"
            accessibilityLabel={data.title}
          />
        ) : (
          <View style={[styles.heroImage, styles.mediaFallback]} />
        )}
        {!isImage && (
          <Pressable
            style={styles.playOverlay}
            onPress={() => WebBrowser.openBrowserAsync(data.url)}
            accessibilityRole="button"
            accessibilityLabel="Abrir contenido multimedia"
          >
            <PlayCircle size={56} color={NasaColors.textPrimary} />
          </Pressable>
        )}
        <View style={styles.heroTags}>
          <Chip label="NASA APOD" />
          <Chip label={fmtDate(data.date) ?? data.date} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        {es && es.title !== data.title && <Text style={styles.original}>Original: {data.title}</Text>}
        {!isImage && (
          <Text style={styles.mediaNote}>Hoy NASA publicó contenido de tipo «{data.media_type}».</Text>
        )}
        {data.copyright && <Text style={styles.original}>© {data.copyright.trim()}</Text>}

        <Text style={styles.explanation} numberOfLines={3}>{explanation}</Text>
        {isTranslating && <Text style={styles.translating}>Traduciendo al español...</Text>}
        <Pressable
          onPress={() => router.push('/apod-detail')}
          style={styles.readMore}
          accessibilityRole="button"
          accessibilityLabel="Leer explicación completa"
        >
          <Text style={styles.readMoreText}>Leer explicación completa</Text>
          <ChevronRight size={16} color={NasaColors.accentBlue} />
        </Pressable>

        <View style={styles.actions}>
          <AppButton
            title={isFav ? 'Quitar favorito' : 'Favorito'}
            variant={isFav ? 'primary' : 'secondary'}
            icon={Heart}
            onPress={() => favorites.toggle(data.date)}
            style={styles.flex}
          />
          <AppButton title="Compartir" variant="secondary" icon={Share2} onPress={onShare} style={styles.flex} />
        </View>
        <SaveToLogButton
          source="apod"
          refId={data.date}
          title={title}
          note=""
          category="Fotografía"
          imageUrl={imageUri}
        />

        <Text style={styles.sectionTitle}>Explora más</Text>
        <View style={styles.exploreRow}>
          <ExploreCard icon={Orbit} label="Asteroides" hint="Objetos cercanos" onPress={() => router.navigate('/asteroids')} />
          <ExploreCard icon={Book} label="Mi bitácora" hint="Tu diario" onPress={() => router.navigate('/log')} />
        </View>
      </View>
    </ScrollView>
  );
}

function ExploreCard({ icon: Icon, label, hint, onPress }: { icon: LucideIcon; label: string; hint: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.exploreCard, pressed && { opacity: 0.8 }]}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${hint}`}
    >
      <Icon size={22} color={NasaColors.accentBlue} />
      <Text style={styles.exploreLabel}>{label}</Text>
      <Text style={styles.exploreHint}>{hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: NasaColors.background },
  loadingText: { marginTop: 10, color: NasaColors.textSecondary },
  container: { flex: 1, backgroundColor: NasaColors.background },
  content: { paddingBottom: NasaSpacing.xl },
  hero: { width: '100%', aspectRatio: 1, backgroundColor: NasaColors.surface },
  heroImage: { width: '100%', height: '100%' },
  mediaFallback: { backgroundColor: NasaColors.surfaceElevated },
  playOverlay: { ...(StyleSheet.absoluteFill as object), alignItems: 'center', justifyContent: 'center' },
  heroTags: { position: 'absolute', left: NasaSpacing.md, top: NasaSpacing.md, flexDirection: 'row', gap: NasaSpacing.sm },
  body: { padding: NasaSpacing.md, gap: NasaSpacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: NasaColors.textPrimary },
  original: { fontSize: 12, color: NasaColors.textSecondary },
  mediaNote: { fontSize: 13, color: NasaColors.warning },
  explanation: { fontSize: 15, lineHeight: 22, color: NasaColors.textSecondary, marginTop: NasaSpacing.xs },
  translating: { fontSize: 12, color: NasaColors.accentBlue },
  readMore: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 4 },
  readMoreText: { color: NasaColors.accentBlue, fontSize: 15, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: NasaSpacing.sm },
  flex: { flex: 1 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: NasaColors.textPrimary, marginTop: NasaSpacing.md },
  exploreRow: { flexDirection: 'row', gap: NasaSpacing.sm },
  exploreCard: {
    flex: 1,
    minHeight: 96,
    padding: NasaSpacing.md,
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
    gap: 2,
  },
  exploreLabel: { color: NasaColors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: NasaSpacing.sm },
  exploreHint: { color: NasaColors.textSecondary, fontSize: 12 },
});
