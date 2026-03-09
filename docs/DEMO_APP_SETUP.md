# Demo App – Setup und Start

Die Demo-App liegt unter `demo/` im Repository.

## Voraussetzungen
- Node.js 18+ oder 20+
- npm oder yarn

## Installation und Start

```bash
cd demo
npm install
npm run dev
```

Die App ist dann unter http://localhost:3000 erreichbar.

## Build für Vercel

```bash
cd demo
npm run build
```

Vercel erkennt `demo/` als Next.js-App automatisch, wenn das Root-Verzeichnis auf `demo/` gesetzt ist.

## Routen

| Route | Inhalt | Stories |
|-------|--------|---------|
| `/` | Landing Page | – |
| `/fall` | Fallübersicht + Status | US-AV-001, US-AV-002 |
| `/fall/dokumente` | Dokumentennachreichung | US-AV-003 |
| `/fall/rueckfragen` | Rückfragen | US-AV-004 |
| `/fall/termine` | Termine | US-AV-005 |
| `/fall/bescheide` | Bescheidtransparenz | US-AV-006 |
| `/fall/verlauf` | Verlauf / Audit-Log | US-AV-007 |
| `/stories` | Story Coverage | alle |

## Mock-Daten

Alle Mock-Daten liegen in `demo/data/mockFall.ts` und `demo/data/storyRegistry.ts`.
Keine echten personenbezogenen Daten. Fiktive Musterdaten für Demonstrationszwecke.

## Story-Coverage

Die Story-Coverage-Ansicht unter `/stories` liest aus `demo/data/storyRegistry.ts`.
Die maschinenlesbare Quelle ist `docs/stories/story_registry.json`.
