import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'apod:favorites';

/** Favoritos de APOD persistidos localmente (lista de fechas). */
export function useApodFavorites() {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setDates(JSON.parse(raw)))
      .catch(() => {});
  }, []);

  const toggle = useCallback((date: string) => {
    setDates((prev) => {
      const next = prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { isFavorite: (date: string) => dates.includes(date), toggle, count: dates.length };
}
