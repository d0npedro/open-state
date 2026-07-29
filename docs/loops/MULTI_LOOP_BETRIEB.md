# Multi-Loop-Betrieb – Open State

Parallele Entwicklungs-Streams mit getrennten Worktrees und einem Supervisor, der geordnet nach `main` merget.

## Architektur

| Stream | Branch | Worktree | Erlaubte Pfade (nur diese) |
|--------|--------|----------|----------------------------|
| AV | `loop/av` | `D:\Projects\open-state-loop-av` | `demo/app/fall/**`, `demo/context/DemoStateContext.tsx`, `demo/lib/fairness/rules.ts`, `demo/data/mockFall.ts`, `demo/e2e/us-av-*.spec.ts`, `docs/loops/av-JOURNAL.md` |
| UG | `loop/ug` | `D:\Projects\open-state-loop-ug` | `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`, `demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`, `demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md` |
| Kita | `loop/kita` | `D:\Projects\open-state-loop-kita` | `demo/app/kita/**`, `demo/components/kita/**`, `demo/data/mockKita*.ts`, `demo/types/kita*.ts`, `docs/loops/kita-JOURNAL.md` |
| Supervisor | `main` | `D:\Projects\openState` | Merges, `docs/NEXT_STEPS_QUEUE.md`, `docs/BUILD_STATE.md`, `demo/data/storyRegistry.ts`, ggf. Konfliktlösung |

## Verbote für Domain-Streams

- Kein Edit an `docs/NEXT_STEPS_QUEUE.md`, `docs/BUILD_STATE.md`, `demo/data/storyRegistry.ts`
- Kein Edit an Root-Layout, `package.json`, Themes, CI, anderen Domänen
- Kein `git push`, kein force, kein worktree anderer Streams
- Kein Commit auf `main`

## Supervisor

1. `git fetch` (lokal: Branches sind im selben Repo)
2. Rebase/Merge der Reihe nach: `loop/av` → `loop/ug` → `loop/kita`
3. Nach jedem Merge: `cd demo && npm run lint && npm run build`
4. Queue/BUILD_STATE aus Journals aktualisieren
5. storyRegistry nur wenn neue Routen/Stories in Journals dokumentiert
6. Kein Push (Standard)

## Intervalle

- Domain-Loops: 12 min (AV, UG, Kita parallel, fire immediately)
- Supervisor: 15 min (erster Lauf nach 15 min, dann periodisch)

## Betriebshinweise

- Alter Einzel-Loop auf `main` wurde gestoppt (vermeidet Race Conditions).
- Domain-Streams committen nur auf `loop/*`; Supervisor merget nach `main`.
- Push bleibt manuell („pushe“).
- Bei wiederholten Merge-Konflikten: Intervall erhöhen oder einen Stream pausieren.
