import dayjs from 'dayjs';
import { Asteroid, AsteroidFeed, NeoApiObject, NeoFeedResponse } from '../types/nasa';

const num = (v: unknown): number | null => {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : null;
};

/** Normaliza un objeto NeoWs. `date` selecciona la aproximación a mostrar. */
export function normalizeNeo(o: NeoApiObject, date?: string): Asteroid {
  const list = o.close_approach_data ?? [];
  const today = dayjs().format('YYYY-MM-DD');
  // Sin fecha explícita: próxima aproximación, o la más reciente si ya pasaron todas
  const ca =
    (date && list.find((c) => c.close_approach_date === date)) ||
    list.find((c) => (c.close_approach_date ?? '') >= today) ||
    list[list.length - 1];
  const approachDate = ca?.close_approach_date ?? date ?? '';
  return {
    uid: `${o.id}_${approachDate}`,
    id: o.id,
    name: o.name,
    designation: o.designation ?? null,
    hazardous: !!o.is_potentially_hazardous_asteroid,
    diameterMinM: num(o.estimated_diameter?.meters?.estimated_diameter_min),
    diameterMaxM: num(o.estimated_diameter?.meters?.estimated_diameter_max),
    approachDate,
    approachDateFull: ca?.close_approach_date_full ?? null,
    velocityKps: num(ca?.relative_velocity?.kilometers_per_second),
    missKm: num(ca?.miss_distance?.kilometers),
    missAu: num(ca?.miss_distance?.astronomical),
    jplUrl: o.nasa_jpl_url ?? null,
  };
}

/** Convierte la respuesta de NeoWs en una lista plana y tipada, sin inventar valores. */
export function normalizeFeed(raw: NeoFeedResponse | undefined, startDate: string, endDate: string): AsteroidFeed {
  const byDate = raw?.near_earth_objects ?? {};
  const items = Object.entries(byDate).flatMap(([date, list]) => (list ?? []).map((o) => normalizeNeo(o, date)));
  return { items, startDate, endDate };
}
