/**
 * Theme-Registry – Open State Design System
 *
 * Themes steuern ausschließlich die visuelle Darstellung.
 * Sie haben keinen Einfluss auf Fachlogik, Zugriffsrechte oder Prozesse.
 *
 * Neue Themes werden hier registriert. Der ThemeProvider liest diese Liste.
 */

export type ThemeId =
  | 'civic-neutral'
  | 'citizen-warm'
  | 'office-dense'
  | 'accessible-contrast';

export type DensityMode = 'normal' | 'compact' | 'accessible';

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  description: string;
  /** Empfohlener Density-Modus für dieses Theme – Nutzer kann abweichen */
  defaultDensity: DensityMode;
}

export interface DensityDefinition {
  id: DensityMode;
  label: string;
  description: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: 'civic-neutral',
    label: 'Civic Neutral',
    description: 'Sachlich, professionell, vertrauenswürdig',
    defaultDensity: 'normal',
  },
  {
    id: 'citizen-warm',
    label: 'Citizen Warm',
    description: 'Bürgernah, freundlich, einladend',
    defaultDensity: 'normal',
  },
  {
    id: 'office-dense',
    label: 'Office Dense',
    description: 'Kompakt und informationsdicht für Fachkräfte',
    defaultDensity: 'compact',
  },
  {
    id: 'accessible-contrast',
    label: 'Barrierearm',
    description: 'Maximale Lesbarkeit und hoher Kontrast',
    defaultDensity: 'accessible',
  },
];

export const densityModes: DensityDefinition[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Standardabstände und -schriftgröße',
  },
  {
    id: 'compact',
    label: 'Kompakt',
    description: 'Engere Abstände für mehr Inhalt auf einer Seite',
  },
  {
    id: 'accessible',
    label: 'Großschrift',
    description: 'Größere Schrift und mehr Whitespace',
  },
];

export const DEFAULT_THEME: ThemeId = 'civic-neutral';
export const DEFAULT_DENSITY: DensityMode = 'normal';

export const STORAGE_KEY_THEME = 'os-theme';
export const STORAGE_KEY_DENSITY = 'os-density';
