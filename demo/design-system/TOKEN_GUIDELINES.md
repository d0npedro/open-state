# Token Guidelines – Open State Design System

## Prinzip

Alle Komponenten verwenden ausschließlich semantische CSS-Variablen.
Hardcodierte Farb- oder Größenwerte sind nicht erlaubt.
Themes überschreiben Token-Werte – Komponenten bleiben unverändert.

## Token-Kategorien

### Farben

| Token | Verwendung |
|-------|-----------|
| `--color-primary` | Hauptfarbe: Buttons, Links, aktive Elemente |
| `--color-primary-light` | Heller Primärton: Ausgewählte Listeneinträge, Hintergründe |
| `--color-secondary` | Sekundärfarbe: unterstützende Elemente |
| `--color-success` | Positiver Status, Bestätigungen |
| `--color-success-light` | Hintergrund für Erfolgsmeldungen |
| `--color-warning` | Hinweise, Fristen, ausstehende Aktionen |
| `--color-warning-light` | Hintergrund für Warnungen |
| `--color-danger` | Fehler, kritische Zustände |
| `--color-danger-light` | Hintergrund für Fehlermeldungen |
| `--color-neutral` | Sekundärtext, neutrale Elemente |
| `--color-neutral-light` | Sehr heller Neutralton |
| `--color-border` | Alle Rahmenlinien |
| `--color-text` | Haupttextfarbe |
| `--color-text-muted` | Gedämpfter Text: Labels, Metadaten |
| `--color-white` | Weiß (kann im Theme leicht abweichen, z. B. Warm-Tint) |

### Oberflächen

| Token | Verwendung |
|-------|-----------|
| `--color-surface` | Kartenoberfläche, Hauptinhaltsbereiche |
| `--color-surface-muted` | Seitenhintergrund, abgedämpfte Bereiche |
| `--color-surface-raised` | Erhöhte Elemente (Dropdowns, Popovers) |

### Fokus & Interaktion

| Token | Verwendung |
|-------|-----------|
| `--color-focus-ring` | Box-Shadow beim Fokus (halbtransparent) |
| `--color-focus-outline` | Outline-Farbe beim Fokus |

### Typografie

| Token | Verwendung |
|-------|-----------|
| `--font-sans` | Standard-Schriftfamilie |
| `--font-size-base` | Basis-Schriftgröße (16px, 14px, 17px je Theme) |
| `--font-size-sm` | Kleine Schrift (Labels, Metadaten) |
| `--font-size-xs` | Sehr kleine Schrift (Badges, Hinweistexte) |
| `--line-height-base` | Standardzeilenhöhe |

### Geometrie

| Token | Verwendung |
|-------|-----------|
| `--radius` | Standard-Abrundung |
| `--radius-sm` | Kleine Abrundung (Chips, Badges) |
| `--radius-lg` | Große Abrundung (Karten, Modals) |

### Schatten

| Token | Verwendung |
|-------|-----------|
| `--shadow-sm` | Subtile Elevation (Karten) |
| `--shadow` | Mittlere Elevation (Dropdowns) |
| `--shadow-focus` | Fokus-Indikator |

### Abstände (Density-sensitiv)

| Token | Verwendung |
|-------|-----------|
| `--card-padding` | Innenabstand von Karten |
| `--space-xs` | 0.25rem Basisabstand |
| `--space-sm` | 0.5rem |
| `--space-md` | 1rem |
| `--space-lg` | 1.5rem |
| `--space-xl` | 2rem |

## Density-Overrides

Die Tokens `--card-padding`, `--font-size-base`, `--font-size-sm`, `--space-md`, `--space-lg`
werden von `[data-density="compact"]` und `[data-density="accessible"]` überschrieben.
Alle anderen Tokens bleiben theme-kontrolliert.
