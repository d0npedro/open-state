# Demo Deployment Playbook

## Lokaler Start

```bash
cd demo
npm install
npm run dev
# → http://localhost:3000
```

## Demo-Routen

| Route | Inhalt | Stories |
|-------|--------|---------|
| `/` | Landing Page | – |
| `/fall` | Fallübersicht + Status | US-AV-001, US-AV-002 |
| `/fall/dokumente` | Dokumente | US-AV-003 |
| `/fall/rueckfragen` | Rückfragen | US-AV-004 |
| `/fall/termine` | Termine | US-AV-005 |
| `/fall/bescheide` | Bescheidtransparenz | US-AV-006 |
| `/fall/verlauf` | Verlauf / Audit-Log | US-AV-007 |
| `/stories` | Story Coverage | alle |
| `/feedback` | Feedback-Kanal | – |

## Vercel-Deployment

### Vercel-Projekt einrichten

1. Neues Vercel-Projekt aus dem GitHub-Repository erstellen
2. Root-Verzeichnis auf `demo` setzen (oder vercel.json im Repo-Root nutzt `buildCommand: cd demo && npm run build`)
3. Framework: Next.js (wird automatisch erkannt)
4. Keine Secrets erforderlich (Demo läuft ohne Backend)

### Environment Variables in Vercel

| Variable | Wert | Beschreibung |
|----------|------|-------------|
| `NEXT_PUBLIC_APP_ENV` | `demo` | Umgebungskennung im UI |
| `NEXT_PUBLIC_DEMO_VERSION` | `0.1.0` | Angezeigte Demo-Version |
| `VERCEL_GIT_COMMIT_SHA` | (automatisch) | Wird von Vercel gesetzt, next.config.mjs kürzt auf 7 Zeichen |

### Branch-Modell

| Branch | Vercel-Target | Zweck |
|--------|--------------|-------|
| `demo` | Production (öffentliche Demo) | Freigegebener Demo-Stand |
| `feature/*` | Preview (temporäre URL) | Entwicklungs-Preview |
| `main` | kein automatisches Deployment | Stabiler Referenzstand |

Deployment auf `demo`-Branch erfolgt nach bewusster Entscheidung, nicht automatisch von `main`.

## Build-/Versionstransparenz

Die `BuildInfo`-Komponente (`demo/components/BuildInfo.tsx`) zeigt im Footer:
- Umgebung (local / demo / preview / production)
- Demo-Version
- Git Commit SHA (7 Zeichen)
- "Demonstrator"-Hinweis

Daten kommen aus `next.config.mjs` via `process.env.VERCEL_GIT_COMMIT_SHA` (Vercel) oder lokalen ENV-Variablen.

## Story-Coverage

Die `/stories`-Route liest aus `demo/data/storyRegistry.ts`.
Aktualisierung: neue Stories in `storyRegistry.ts` eintragen und `implemented_criteria` / `status` pflegen.

Die maschinenlesbare Quelle ist `docs/stories/story_registry.json` – bei Änderungen beide Dateien synchron halten.

## Feedback-Kanal

Die `/feedback`-Route öffnet einen vorausgefüllten GitHub-Issue-Link mit:
- Demo-Version und Commit-SHA
- Leitfragen
- Screen-Auswahl

Feedback-Issues erhalten automatisch das Label `demo-feedback`.

## Offene Punkte für spätere Integration

- Echte eID-Authentifizierung (BSI TR-03130)
- Anbindung BA-Backend (ALLEGRO API)
- Echter Datei-Upload (S3 oder Sovereign Cloud)
- Persistente Fallakte (PostgreSQL)
- Push-Benachrichtigungen (Web Push API)
- DSFA (Art. 35 DSGVO) vor Pilotbetrieb verpflichtend
