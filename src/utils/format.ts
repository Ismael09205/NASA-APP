const nf = (n: number, digits = 0) =>
  n.toLocaleString('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: digits });

export function fmtKm(km: number | null): string | null {
  if (km == null) return null;
  return km >= 1e6 ? `${nf(km / 1e6, 1)} M km` : `${nf(km)} km`;
}

export function fmtAu(au: number | null): string | null {
  return au == null ? null : `${nf(au, 3)} UA`;
}

export function fmtSpeed(kps: number | null): string | null {
  return kps == null ? null : `${nf(kps, 1)} km/s`;
}

const fmtLen = (m: number) => (m >= 1000 ? `${nf(m / 1000, 2)} km` : `${nf(m)} m`);

export function fmtDiameter(minM: number | null, maxM: number | null): string | null {
  if (minM == null && maxM == null) return null;
  if (minM == null || maxM == null) return fmtLen((minM ?? maxM) as number);
  return `${fmtLen(minM)} – ${fmtLen(maxM)}`;
}
