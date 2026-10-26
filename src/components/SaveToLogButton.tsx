import { router } from 'expo-router';
import { BookPlus, BookOpen } from 'lucide-react-native';
import { useLogs } from '../api/queries';
import { LogSource } from '../types/log';
import { AppButton } from './AppButton';

type Props = {
  source: Exclude<LogSource, 'manual'>;
  refId: string;
  title: string;
  note: string;
  category: string;
  imageUrl?: string;
};

/** Guarda un descubrimiento en la bitácora reutilizando sus datos; si ya existe, abre la entrada. */
export function SaveToLogButton({ source, refId, title, note, category, imageUrl }: Props) {
  const { data: logs } = useLogs();
  const existing = logs?.find((l) => l.source === source && l.refId === refId);

  if (existing) {
    return (
      <AppButton
        title="Ver en bitácora"
        variant="secondary"
        icon={BookOpen}
        onPress={() => router.push({ pathname: '/entry/[id]', params: { id: existing.id } })}
      />
    );
  }

  return (
    <AppButton
      title="Guardar en bitácora"
      icon={BookPlus}
      onPress={() =>
        router.push({
          pathname: '/entry/form',
          params: { title, note, category, source, refId, ...(imageUrl ? { imageUrl } : {}) },
        })
      }
    />
  );
}
