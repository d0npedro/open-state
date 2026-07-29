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

1. `git fetch origin` und Status prüfen
2. Merge der Reihe nach: `loop/av` → `loop/ug` → `loop/kita`
3. Nach allen Merges (oder wenn bereits alles gemerged): `cd demo && npm run lint && npm run build`
4. Queue/BUILD_STATE aus Journals aktualisieren; storyRegistry bei neuen Routen
5. Docs-Commit falls nötig: `docs: supervisor merge sync`
6. **Push (Pflicht, Dauerbetrieb):**  
   `git push origin main`  
   nur nach grünem lint+build und sauberem main.  
   Domain-Branches optional: `git push origin loop/av loop/ug loop/kita` (kein force).
7. Domain-Worktrees mit main synchronisieren (`merge main` in jedem Worktree, kein force).

## Intervalle

- Domain-Loops: 12 min (AV, UG, Kita parallel)
- Supervisor: 15 min — **merget und pusht regelmäßig nach origin**

## Betriebshinweise

- Domain-Streams committen nur auf `loop/*` und pushen **nicht** selbst.
- Supervisor ist die einzige Stelle für `git push origin main` im Dauerbetrieb.
- Nutzer-Freigabe für Dauer-Push: ausdrückliche Anweisung „Sorge dafür dass regelmäßig gepusht wird“ / Dauerbetrieb mit Remote-Sync.
- Bei Push-Fehler (Auth, non-ff): melden, nicht force-pushen.
- Bei wiederholten Merge-Konflikten: Intervall erhöhen oder einen Stream pausieren.
