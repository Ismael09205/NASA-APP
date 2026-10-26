import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LogEntry } from '../types/log';
import { Chip } from './Chip';
import { categoryIcon } from '../constants/categories';
import { fmtDate } from '../utils/dates';
import { NasaColors, NasaRadius, NasaSpacing } from '../constants/nasaTheme';

type Props = {
  item: LogEntry;
  onPress: (e: LogEntry) => void;
  featured?: boolean;
  pendingStatus?: 'paused' | 'sending';
};

function LogEntryCardBase({ item, onPress, featured, pendingStatus }: Props) {
  const date = fmtDate(item.createdAt) ?? 'Sin fecha';
  const excerpt = item.note?.trim();
  const pendingLabel = pendingStatus === 'paused' ? 'Pendiente de envío' : 'Enviando al servidor';

  return (
    <Pressable
      onPress={pendingStatus ? undefined : () => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        featured && styles.featured,
        pendingStatus && styles.pending,
        pressed && !pendingStatus && styles.pressed,
      ]}
      accessibilityRole={pendingStatus ? 'text' : 'button'}
      accessibilityLabel={`${item.title}. ${date}.${pendingStatus ? ` ${pendingLabel}.` : ' Abrir entrada.'}`}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={featured ? styles.imageFeatured : styles.imageThumb}
          contentFit="cover"
          cachePolicy="disk"
          transition={300}
        />
      ) : null}
      <View style={styles.body}>
        <View style={styles.meta}>
          {item.category ? <Chip label={item.category} icon={categoryIcon(item.category)} /> : <View />}
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={featured ? styles.titleFeatured : styles.title} numberOfLines={2}>{item.title}</Text>
        {excerpt ? <Text style={styles.excerpt} numberOfLines={featured ? 3 : 2}>{excerpt}</Text> : null}
        {pendingStatus && (
          <Text style={[styles.pendingLabel, pendingStatus === 'sending' && styles.sendingLabel]}>
            {pendingLabel}
          </Text>
        )}
        {featured && <Text style={styles.open}>Abrir entrada completa</Text>}
      </View>
    </Pressable>
  );
}

export const LogEntryCard = memo(LogEntryCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: NasaColors.surface,
    borderRadius: NasaRadius.card,
    borderWidth: 1,
    borderColor: NasaColors.border,
    overflow: 'hidden',
    marginBottom: NasaSpacing.sm,
  },
  featured: { borderColor: NasaColors.accentBlue },
  pending: { borderColor: NasaColors.warning },
  pressed: { opacity: 0.85 },
  imageFeatured: { width: '100%', aspectRatio: 16 / 10, backgroundColor: NasaColors.surfaceElevated },
  imageThumb: { width: '100%', height: 120, backgroundColor: NasaColors.surfaceElevated },
  body: { padding: NasaSpacing.md, gap: NasaSpacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: NasaSpacing.sm },
  date: { color: NasaColors.textSecondary, fontSize: 12 },
  title: { color: NasaColors.textPrimary, fontSize: 16, fontWeight: '700' },
  titleFeatured: { color: NasaColors.textPrimary, fontSize: 20, fontWeight: '700' },
  excerpt: { color: NasaColors.textSecondary, fontSize: 14, lineHeight: 20 },
  open: { color: NasaColors.accentBlue, fontSize: 14, fontWeight: '600' },
  pendingLabel: { color: NasaColors.warning, fontSize: 13, fontWeight: '700' },
  sendingLabel: { color: NasaColors.accentBlue },
});
