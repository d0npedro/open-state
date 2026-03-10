# Open State Design System

Das Design System von Open State stellt visuelle Konsistenz sicher, ohne Fachlogik zu beeinflussen.
Alle Komponenten verwenden ausschließlich semantische CSS-Variablen (Design Tokens).
Themes und Density Modes werden über `data-theme` / `data-density` am `<html>`-Element gesteuert.

## Verzeichnisstruktur

```
design-system/
├── themes/
│   └── themes.ts          # ThemeId, DensityMode, Theme-Registry
└── provider/
    └── ThemeProvider.tsx  # React Context, localStorage-Persistenz
```

## Themes

| ID | Label | Zielgruppe |
|----|-------|-----------|
| `civic-neutral` | Civic Neutral | Standard – sachlich und professionell |
| `citizen-warm` | Citizen Warm | Bürgerorientiert – freundlich und einladend |
| `office-dense` | Office Dense | Fachkräfte – informationsdicht und kompakt |
| `accessible-contrast` | Barrierearm | Maximale Lesbarkeit, hoher Kontrast |

## Density Modes

| ID | Beschreibung |
|----|-------------|
| `normal` | Standardabstände (kein `data-density`-Attribut gesetzt) |
| `compact` | Engere Abstände, kleinere Schrift |
| `accessible` | Mehr Whitespace, größere Schrift |

## Verwendung

### Theme wechseln (React)

```tsx
import { useTheme } from '@/design-system/provider/ThemeProvider';

const { theme, density, setTheme, setDensity } = useTheme();
setTheme('citizen-warm');
setDensity('compact');
```

### Neue Komponente erstellen

Ausschließlich CSS-Variablen verwenden – keine hardcodierten Farben:

```tsx
// ✓ Richtig
<div style={{ color: 'var(--color-text)', background: 'var(--color-surface)' }}>

// ✗ Falsch
<div style={{ color: '#1A202C', background: '#FFFFFF' }}>
```

## Token-Referenz

Vollständige Token-Dokumentation: [`TOKEN_GUIDELINES.md`](./TOKEN_GUIDELINES.md)
Theme-Registry: [`THEME_REGISTRY.md`](./THEME_REGISTRY.md)
