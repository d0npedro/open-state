# Repo Summary: Theme-Architektur & Design System

Einführung eines vollständigen, austauschbaren Theme-Systems für die Open State Demo.
Visuelle Darstellung wird vollständig über semantische CSS-Tokens und `data-*`-Attribute gesteuert.
Keine Komponente enthält noch hardcodierte Farb- oder Größenwerte.

---

## Neu erstellte Dateien

| Datei | Zweck |
|-------|-------|
| `demo/design-system/themes/themes.ts` | ThemeId/DensityMode-Typen, Theme-Registry, Konstanten |
| `demo/design-system/provider/ThemeProvider.tsx` | React Context, localStorage-Persistenz, data-Attribut-Steuerung |
| `demo/components/ThemeSwitcher.tsx` | Sichtbarer Umschalter im Footer (dezent, sachlich) |
| `demo/design-system/README.md` | Einstiegsdokumentation |
| `demo/design-system/TOKEN_GUIDELINES.md` | Vollständige Token-Referenz |
| `demo/design-system/THEME_REGISTRY.md` | Pro-Theme-Dokumentation, Anleitung für neue Themes |

## Geänderte Dateien

| Datei | Änderung |
|-------|---------|
| `demo/app/globals.css` | Vollständig überarbeitet: 4 Theme-Blöcke, 2 Density-Blöcke, semantische Tokens |
| `demo/app/layout.tsx` | ThemeProvider-Wrapping, suppressHydrationWarning, Anti-Flash-Script, ThemeSwitcher in Footer |

---

## Architektur-Überblick

```
themes.ts                          → Typdefinitionen + Registry-Daten
globals.css                        → CSS-Implementierung aller Themes via [data-theme]
ThemeProvider.tsx                  → React Context + localStorage-Sync
ThemeSwitcher.tsx                  → UI für Theme- und Density-Auswahl
layout.tsx                         → Einbindung Provider + Anti-Flash-Script
```

### Anti-Flash-Mechanismus

Ein synchrones `<script>`-Tag in `<head>` liest localStorage vor dem ersten Render und setzt
`data-theme`/`data-density` direkt auf `<html>`. Dadurch kein sichtbares Aufflackern beim
Seitenaufruf. `suppressHydrationWarning` verhindert React-Hydration-Konflikte.

---

## Die 4 Themes

| ID | Zielgruppe | Besonderheiten |
|----|-----------|----------------|
| `civic-neutral` | Sachbearbeitung (Standard) | #003F8C, 16px, Radius 6px |
| `citizen-warm` | Bürgerportale | Warm-Tints, Radius 8px |
| `office-dense` | Power-User | 14px, Radius 3px, kompakte Abstände |
| `accessible-contrast` | Barrierefreiheit | Schwarz/Weiß, 17px, sichtbare Rahmen, keine Schatten |

## Die 3 Density Modes

| ID | Änderungen |
|----|-----------|
| `normal` | Kein Attribut – Basis-Tokens gelten |
| `compact` | Kleinere Schrift (14px), engere Abstände |
| `accessible` | Größere Schrift (18px), mehr Whitespace |

---

## Invarianten

- Kein Einfluss auf Fachlogik, Routen, Daten oder Zugriffsrechte
- Alle Änderungen sind rein visuell und vollständig rückgängig machbar
- Theme-Auswahl wird in localStorage persistiert (`os-theme`, `os-density`)
- Bestehende Komponenten mussten nicht geändert werden – sie nutzen bereits `var(--color-*)`
