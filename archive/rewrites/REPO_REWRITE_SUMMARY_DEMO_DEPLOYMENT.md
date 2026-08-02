# Zusammenfassung: Demo Deployment Vorbereitung

Session-Datum: 2026-03-09

## Neu erstellte Dateien

| Datei | Beschreibung |
|-------|-------------|
| `vercel.json` (Repo-Root) | Vercel-Konfiguration für Unterverzeichnis-Deployment: leitet Build auf `demo/` um, setzt Framework auf Next.js |
| `demo/components/BuildInfo.tsx` | Server-Komponente, zeigt Umgebung (env-Badge), Demo-Version, Git-Commit-SHA und "Demonstrator"-Hinweis im Footer |
| `demo/app/feedback/page.tsx` | Feedback-Seite mit Leitfragen, Screen-Auswahl und vorausgefülltem GitHub-Issue-Link |
| `demo/.env.example` | Dokumentiert lokale ENV-Variablen für Entwickler |
| `docs/DEMO_DEPLOYMENT_PLAYBOOK.md` | Vollständiges Deployment-Playbook: lokaler Start, Demo-Routen, Vercel-Setup, Branch-Modell, offene Punkte |

## Geänderte bestehende Dateien

| Datei | Art der Änderung |
|-------|----------------|
| `demo/next.config.mjs` | ENV-Variablen hinzugefügt: `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_COMMIT_SHA` (aus `VERCEL_GIT_COMMIT_SHA`), `NEXT_PUBLIC_DEMO_VERSION` |
| `demo/app/layout.tsx` | Globaler Footer ergänzt: BuildInfo-Komponente + Links zu Story Coverage, Feedback, GitHub |
| `demo/app/page.tsx` | Hero-Badge auf "Demonstrator · Arbeitsverwaltung · 7 Stories" aktualisiert; Feedback-Button hinzugefügt; lokaler Footer entfernt (jetzt global im Layout) |
| `demo/.gitignore` | `.env.local` und `.env*.local` ergänzt |
| `README.md` | Demo-Abschnitt aktualisiert: Build-Transparenz hervorgehoben, Links zu Deployment Playbook und Feedback-Route ergänzt |

## Vercel-Deployment-Bereitschaft

Die App liegt im Unterverzeichnis `demo/`. Vercel benötigt eine `vercel.json` im Repo-Root, da es andernfalls kein Next.js-Projekt erkennt.

`vercel.json` setzt:
- `buildCommand`: `cd demo && npm install && npm run build`
- `outputDirectory`: `demo/.next`
- `framework`: `nextjs`
- `installCommand`: `cd demo && npm install`

Keine Secrets erforderlich: Die Demo ist vollständig statisch (SSG) und läuft ohne Backend.

## Build-/Versionstransparenz

**Mechanismus:**
1. Vercel setzt beim Deployment automatisch `VERCEL_GIT_COMMIT_SHA`
2. `next.config.mjs` liest diese Variable und kürzt sie auf 7 Zeichen für `NEXT_PUBLIC_COMMIT_SHA`
3. `NEXT_PUBLIC_APP_ENV` kann in Vercel auf `demo` gesetzt werden (lokal: `local`)
4. Die `BuildInfo`-Komponente (`demo/components/BuildInfo.tsx`) liest diese Werte server-side (kein `use client` nötig) und rendert einen farbcodierten Badge im globalen Footer

**Visuelles Ergebnis im Footer:** `[demo] v0.1.0 · abc1234 · Demonstrator`

## Story-Coverage-Einbindung

Die `/stories`-Route (`demo/app/stories/`) liest aus `demo/data/storyRegistry.ts` und zeigt alle 7 User Stories mit Status, Implementierungsgrad (Kriterien erfüllt/gesamt) und Traceability-Links.

Der globale Footer enthält einen direkten Link zu `/stories`, sichtbar auf allen Seiten.

## Feedback-Kanal

Die `/feedback`-Route generiert server-side einen GitHub-Issue-Link:

```
https://github.com/d0npedro/open-state/issues/new
  ?title=[Demo-Feedback] v0.1.0 (abc1234)
  &body=**Demo-Version:** ... [Leitfragen vorausgefüllt]
  &labels=demo-feedback
```

- Kein Formular-Backend nötig: der Link öffnet das GitHub-Issue-Formular vorausgefüllt
- Demo-Version und Commit-SHA werden automatisch aus den ENV-Variablen eingebettet
- 5 Leitfragen strukturieren das Feedback
- Screen-Übersicht mit Links erlaubt kontextbezogenes Feedback

## Build-Status

Alle 12 statischen Routen werden erfolgreich gebaut. Keine TypeScript-Fehler, keine Lint-Fehler.

```
Route (app)                              Size     First Load JS
┌ ○ /                                    181 B            94 kB
├ ○ /fall                                153 B          87.2 kB
├ ○ /fall/bescheide                      155 B          87.2 kB
├ ○ /fall/dokumente                      155 B          87.2 kB
├ ○ /fall/rueckfragen                    155 B          87.2 kB
├ ○ /fall/termine                        155 B          87.2 kB
├ ○ /fall/verlauf                        155 B          87.2 kB
├ ○ /feedback                            181 B            94 kB
└ ○ /stories                             181 B            94 kB
```

## Offene Punkte für spätere echte Integration

- Echte eID-Authentifizierung (BSI TR-03130) – aktuell keine Authentifizierung
- Anbindung BA-Backend (ALLEGRO API) – aktuell Mockdaten aus `demo/data/mockFall.ts`
- Echter Datei-Upload (S3 oder Sovereign Cloud) – Upload-UI vorhanden, kein Backend
- Persistente Fallakte (PostgreSQL) – aktuell statische Mockdaten
- Push-Benachrichtigungen (Web Push API) – noch nicht implementiert
- DSFA (Art. 35 DSGVO) – vor realem Pilotbetrieb verpflichtend
- Barrierefreiheitsprüfung (WCAG 2.1 AA) – Design angelegt, kein Audit durchgeführt
- Mehrsprachigkeit (12 Sprachen im Blueprint vorgesehen) – Demo nur Deutsch
