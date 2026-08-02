# Repo Summary: Vertical Slice Demo – Arbeitsverwaltung

Erstellungsdatum: 2026-03-09

## Übersicht

Dieser Commit fügt dem Repository eine vollständige, klickbare Next.js Demo-App unter `demo/` hinzu. Sie bildet alle 7 User Stories der Domäne Arbeitsverwaltung (US-AV-001 bis US-AV-007) als navigierbare Screens ab.

---

## Neue Dateien (Frontend)

| Pfad | Beschreibung |
|------|-------------|
| `demo/package.json` | Next.js 14 App – Abhängigkeiten und Scripts |
| `demo/tsconfig.json` | TypeScript-Konfiguration mit `@/*`-Pfad-Alias |
| `demo/next.config.mjs` | Minimale Next.js-Konfiguration |
| `demo/.gitignore` | Ignoriert `node_modules/`, `.next/`, `out/`, `build/` |
| `demo/types/index.ts` | Alle TypeScript-Typen: `Fall`, `Dokument`, `Rueckfrage`, `Termin`, `Bescheid`, `TimelineEreignis`, `StoryRegistryEntry` |
| `demo/data/mockFall.ts` | Fiktive Musterdaten: Fall AV-2024-0042 (ALG I Erstantrag, Status RUECKFRAGE_OFFEN), 4 Dokumente, 1 Rückfrage, 1 Termin, 1 Bescheid, 11 Timeline-Ereignisse |
| `demo/data/storyRegistry.ts` | TypeScript-Version der Story-Registry mit 7 Einträgen, Status DEMONSTRIERBAR, Routes und Coverage-Zahlen |
| `demo/app/layout.tsx` | Root-Layout mit Metadaten und globalem CSS-Import |
| `demo/app/globals.css` | Staatlich-würdevolles Design-System: CSS-Custom-Properties, Utility-Klassen (`.card`, `.badge`, `.btn`) |
| `demo/app/page.tsx` | Landing Page: Hero, Info-Kacheln, Demo-Hinweis |
| `demo/app/fall/layout.tsx` | Fall-Layout: Breadcrumb-Header + Tab-Navigation (6 Tabs) |
| `demo/app/fall/page.tsx` | Fallübersicht: Status-Stepper, Offene Aufgaben, Info-Kacheln |
| `demo/app/fall/dokumente/page.tsx` | Dokumentenliste mit Status, Begründung, Frist, Upload-Placeholder |
| `demo/app/fall/rueckfragen/page.tsx` | Rückfragenansicht: Was/Warum/Konsequenz/Frist-Struktur |
| `demo/app/fall/termine/page.tsx` | Terminansicht: Format, Ort, Vorbereitungshinweise |
| `demo/app/fall/bescheide/page.tsx` | Bescheidansicht: Zwei-Schichten-Darstellung + aufklappbare Rechtsfassung + Widerspruchsfrist |
| `demo/app/fall/verlauf/page.tsx` | Timeline aller Ereignisse (chronologisch umgekehrt) mit Akteur-Farbkodierung |
| `demo/app/stories/page.tsx` | Story Coverage: 7 Stories mit Coverage-Bar, Akzeptanzkriterien, Links |

## Geänderte bestehende Dateien

| Pfad | Änderung |
|------|---------|
| `README.md` | Neuer Abschnitt "Demo" mit Link zu `demo/` und Setup-Anleitung eingefügt |

## Neue Dokumentation

| Pfad | Beschreibung |
|------|-------------|
| `docs/DEMO_APP_SETUP.md` | Setup-Anleitung: Installation, Start, Routen-Tabelle, Hinweis zu Mock-Daten |

---

## 7 Stories im UI

| Story-ID | Titel | Route | UI-Umsetzung |
|----------|-------|-------|-------------|
| US-AV-001 | Fall anlegen | `/fall` | Fallnummer, Anlagedatum, Eingangsbestätigung, Status sichtbar beim Öffnen |
| US-AV-002 | Status einsehen | `/fall` | Status-Stepper mit 7 Phasen, Klartext-Statusbeschreibung, nächster Schritt prominent |
| US-AV-003 | Unterlagen nachreichen | `/fall/dokumente` | Dokumentenliste mit Status-Badge, Begründung, Frist, Upload-Placeholder für ausstehende Dokumente |
| US-AV-004 | Rückfrage verstehen | `/fall/rueckfragen` | Drei-Block-Struktur: Was wird gefragt / Warum / Was passiert bei Nichtbeantwortung; Frist mit Countdown |
| US-AV-005 | Termin einsehen und verstehen | `/fall/termine` | Termindetail mit Zweck, Format, Ort, Vorbereitungshinweisen als Liste |
| US-AV-006 | Bescheid verstehen | `/fall/bescheide` | Zwei-Schichten-Darstellung: verständliche Erklärung (Standard) + aufklappbare Rechtsfassung; Widerspruchsfrist + Button |
| US-AV-007 | Historie nachvollziehen | `/fall/verlauf` | Chronologische Timeline (neueste zuerst), Akteur-Farbkodierung (Bürger/Sachbearbeitung/System), Zeitstempel |

---

## Routen

| Route | Screen | Stories |
|-------|--------|---------|
| `/` | Landing Page | – |
| `/fall` | Fallübersicht + Status-Stepper | US-AV-001, US-AV-002 |
| `/fall/dokumente` | Dokumentenliste | US-AV-003 |
| `/fall/rueckfragen` | Rückfragen | US-AV-004 |
| `/fall/termine` | Termine | US-AV-005 |
| `/fall/bescheide` | Bescheidtransparenz | US-AV-006 |
| `/fall/verlauf` | Verlauf / Audit-Log | US-AV-007 |
| `/stories` | Story Coverage | alle |

---

## Story-Coverage: Technische Lösung

Die Story-Coverage-Ansicht (`/stories`) liest aus `demo/data/storyRegistry.ts` – einer TypeScript-Datei, die die maschinenlesbare Quelle `docs/stories/story_registry.json` widerspiegelt, jedoch um Frontend-spezifische Felder erweitert wurde:

- `route`: Direktlink zum Demo-Screen
- `implemented_criteria`: Anzahl tatsächlich demonstrierter Akzeptanzkriterien
- `status`: Auf `DEMONSTRIERBAR` gesetzt für alle 7 Stories

Jeder Story-Eintrag zeigt:
- ID, Titel, Problembeschreibung
- Screen, Transparenzfokus
- Akzeptanzkriterien-Zähler (implementiert / gesamt)
- Coverage-Bar (Prozentwert)
- Link zum Demo-Screen

---

## Mock-Datenmodell

Zentraler Datensatz: `demoFall` in `demo/data/mockFall.ts`

- **Fall**: AV-2024-0042, Typ: ALG I Erstantrag, Status: RUECKFRAGE_OFFEN
- **4 Dokumente**: Arbeitgeberbescheinigung (IN_PRUEFUNG), Personalausweis (AKZEPTIERT), 2x ANGEFORDERT
- **1 Rückfrage**: Fehlendes Datum in Arbeitgeberbescheinigung, offen, Frist 26.11.2024
- **1 Termin**: Erstgespräch 03.12.2024, bestätigt, mit Vorbereitungshinweisen
- **1 Bescheid**: Vorläufiger Leistungsbescheid ALG I, Widerspruchsfrist bis 16.12.2024
- **11 Timeline-Ereignisse**: Lückenlose Chronologie vom Eingang bis zur aktuellen Rückfrage

---

## Offene Punkte für echte Integration

| Bereich | Beschreibung |
|---------|-------------|
| API-Anbindung | Mock-Daten durch echte REST/GraphQL-Endpunkte ersetzen (z.B. Fallverwaltungs-Backend) |
| Authentifizierung | eID-Integration gemäß US-AV-001 Akzeptanzkriterium 6 |
| Echter Datei-Upload | Upload-Placeholder durch tatsächliche Upload-Logik (Formdata, S3 o.ä.) ersetzen |
| Rückfrage-Antwort | Button "Rückfrage beantworten" mit Formular und Bestätigung hinterlegen |
| Widerspruch | Button "Widerspruch einlegen" mit eigenem Prozessflow (eigene Story) |
| Production-Deploy | Vercel-Deployment mit `demo/` als Root-Verzeichnis; Preview-Deployments pro Branch |
| Active-State Navigation | Tab-Navigation mit `usePathname()` für aktiven Tab hervorheben |
| Barrierefreiheit | WCAG 2.1 AA: ARIA-Labels, Fokus-Management, Kontrast-Prüfung |
| Internationaliserung | Deutsche Ausgabe vorhanden; weitere Sprachen gemäß Kernprinzip 12 Sprachen |
| Echte story_registry.json-Synchronisation | Automatischer Abgleich zwischen `docs/stories/story_registry.json` und `demo/data/storyRegistry.ts` |
