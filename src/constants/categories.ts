import { Eye, Camera, Orbit, PenLine, type LucideIcon } from 'lucide-react-native';

export const LOG_CATEGORIES = ['Observación', 'Fotografía', 'Asteroide', 'Reflexión'] as const;

const ICONS: Record<string, LucideIcon> = {
  Observación: Eye,
  Fotografía: Camera,
  Asteroide: Orbit,
  Reflexión: PenLine,
};

export const categoryIcon = (category?: string): LucideIcon => (category && ICONS[category]) || PenLine;
