'use client';

/**
 * ThemeProvider – Open State Design System
 *
 * Setzt `data-theme` und `data-density` auf dem <html>-Element.
 * Liest die gespeicherte Auswahl aus localStorage.
 * Stellt ThemeContext für alle Client-Komponenten bereit.
 *
 * Hat keinen Einfluss auf Fachlogik, Routen oder Daten.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  ThemeId,
  DensityMode,
  DEFAULT_THEME,
  DEFAULT_DENSITY,
  STORAGE_KEY_THEME,
  STORAGE_KEY_DENSITY,
  themes,
} from '@/design-system/themes/themes';

interface ThemeContextValue {
  theme: ThemeId;
  density: DensityMode;
  setTheme: (t: ThemeId) => void;
  setDensity: (d: DensityMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  density: DEFAULT_DENSITY,
  setTheme: () => {},
  setDensity: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [density, setDensityState] = useState<DensityMode>(DEFAULT_DENSITY);

  // Gespeicherte Werte beim Mount laden
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId | null;
      const savedDensity = localStorage.getItem(STORAGE_KEY_DENSITY) as DensityMode | null;
      const validThemeIds = themes.map(t => t.id);

      if (savedTheme && validThemeIds.includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      if (savedDensity && ['normal', 'compact', 'accessible'].includes(savedDensity)) {
        setDensityState(savedDensity);
      }
    } catch {
      // localStorage nicht verfügbar (z. B. SSR, Private Browsing) – kein Fehler
    }
  }, []);

  // Theme auf <html> setzen und persistieren
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme]);

  // Density auf <html> setzen und persistieren
  useEffect(() => {
    if (density === 'normal') {
      document.documentElement.removeAttribute('data-density');
    } else {
      document.documentElement.setAttribute('data-density', density);
    }
    try {
      localStorage.setItem(STORAGE_KEY_DENSITY, density);
    } catch {}
  }, [density]);

  const setTheme = useCallback((t: ThemeId) => setThemeState(t), []);
  const setDensity = useCallback((d: DensityMode) => setDensityState(d), []);

  return (
    <ThemeContext.Provider value={{ theme, density, setTheme, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
