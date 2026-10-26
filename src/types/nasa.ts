// types/nasa.ts
export interface ApodResponse {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
  copyright?: string;
  thumbnail_url?: string;
}

/** Respuesta cruda de NeoWs (campos usados) */
export interface NeoApiObject {
  id: string;
  name: string;
  designation?: string;
  nasa_jpl_url?: string;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: {
    meters?: { estimated_diameter_min?: number; estimated_diameter_max?: number };
  };
  close_approach_data?: {
    close_approach_date?: string;
    close_approach_date_full?: string;
    relative_velocity?: { kilometers_per_second?: string };
    miss_distance?: { kilometers?: string; astronomical?: string };
  }[];
}

export interface NeoFeedResponse {
  element_count?: number;
  near_earth_objects?: Record<string, NeoApiObject[]>;
}

/** Modelo normalizado para la UI */
export interface Asteroid {
  uid: string; // id + fecha de aproximación
  id: string;
  name: string;
  designation: string | null;
  hazardous: boolean;
  diameterMinM: number | null;
  diameterMaxM: number | null;
  approachDate: string; // YYYY-MM-DD
  approachDateFull: string | null; // "2026-Oct-26 04:00"
  velocityKps: number | null;
  missKm: number | null;
  missAu: number | null;
  jplUrl: string | null;
}

export interface AsteroidFeed {
  items: Asteroid[];
  startDate: string;
  endDate: string;
}
