# Theme Registry – Open State Design System

Alle registrierten Themes und ihre Charakteristika.
Neue Themes werden in `themes/themes.ts` und `app/globals.css` registriert.

---

## civic-neutral (Standard)

**Zielgruppe:** Allgemeine Verwaltungsanwendungen, Sachbearbeitung
**Charakter:** Sachlich, professionell, vertrauenswürdig
**Empfohlene Density:** normal

| Eigenschaft | Wert |
|-------------|------|
| Primärfarbe | `#003F8C` (Bundesblau) |
| Oberfläche | `#FFFFFF` |
| Hintergrund | `#F7F8FA` |
| Rahmen | `#D1D9E6` |
| Text | `#1A202C` |
| Schriftgröße | 16px |
| Radius | 6px |

---

## citizen-warm

**Zielgruppe:** Bürgerportale, Self-Service-Anwendungen
**Charakter:** Bürgernah, freundlich, einladend
**Empfohlene Density:** normal

| Eigenschaft | Wert |
|-------------|------|
| Primärfarbe | `#1A4E8A` |
| Oberfläche | `#FEFCFA` (warm-weiß) |
| Hintergrund | `#FAF8F5` |
| Rahmen | `#D4CEC6` (warm-grau) |
| Text | `#1E1A17` |
| Schriftgröße | 16px |
| Radius | 8px (weicher) |

---

## office-dense

**Zielgruppe:** Fachkräfte, Power-User, informationsdichte Workflows
**Charakter:** Kompakt, effizient, professionell
**Empfohlene Density:** compact

| Eigenschaft | Wert |
|-------------|------|
| Primärfarbe | `#1B2A4A` (dunkelblau) |
| Oberfläche | `#FFFFFF` |
| Hintergrund | `#EFF2F5` |
| Rahmen | `#C0CAD6` |
| Text | `#0F1622` |
| Schriftgröße | 14px |
| Radius | 3px (scharf) |
| Card-Padding | 0.875rem |

---

## accessible-contrast

**Zielgruppe:** Nutzer mit Sehbeeinträchtigungen, Barrierefreiheitsanforderungen
**Charakter:** Maximale Lesbarkeit, hoher Kontrast
**Empfohlene Density:** accessible
**Besonderheiten:** `--shadow-sm: none` (Schatten als Kontrastverstärker entfernt), sichtbare Rahmen

| Eigenschaft | Wert |
|-------------|------|
| Primärfarbe | `#002E8F` |
| Oberfläche | `#FFFFFF` |
| Hintergrund | `#EDF0F5` |
| Rahmen | `#5A6575` (stark sichtbar) |
| Text | `#000000` |
| Schriftgröße | 17px |
| Radius | 4px |

---

## Neues Theme hinzufügen

1. `ThemeId` in `design-system/themes/themes.ts` um neuen Wert erweitern
2. Theme-Objekt in `themes`-Array eintragen
3. CSS-Block `[data-theme="neues-theme"]` in `app/globals.css` anlegen
4. Alle Pflicht-Tokens definieren (mindestens: `--color-primary`, `--color-primary-light`, `--color-surface`, `--color-surface-muted`, `--color-border`, `--color-text`, `--color-text-muted`)
5. Dieses Registry-Dokument aktualisieren
