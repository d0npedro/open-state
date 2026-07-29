# Multi-Loop-Betrieb – Open State

Parallele Entwicklungs-Streams mit getrennten Worktrees und einem Supervisor, der geordnet nach `main` merget.

## Architektur

| Stream | Branch | Worktree | Erlaubte Pfade (nur diese) |
|--------|--------|----------|----------------------------|
| AV | `loop/av` | `D:\Projects\open-state-loop-av` | `demo/app/fall/**`, `demo/context/DemoStateContext.tsx`, `demo/lib/fairness/rules.ts`, `demo/data/mockFall.ts`, `demo/e2e/us-av-*.spec.ts`, `docs/loops/av-JOURNAL.md` |
| UG | `loop/ug` | `D:\Projects\open-state-loop-ug` | `demo/app/gruendung/**`, `demo/context/GruendungStateContext.tsx`, `demo/lib/fairness/gruendung-rules.ts`, `demo/data/mockGruendungsfall.ts`, `demo/types/gruendung.ts`, `demo/e2e/us-ug-*.spec.ts`, `docs/loops/ug-JOURNAL.md` |
| Kita | `loop/kita` | `D:\Projects\open-state-loop-kita` | `demo/app/kita/**`, `demo/components/kita/**`, `demo/data/mockKita*.ts`, `demo/types/kita*.ts`, `docs/loops/kita-JOURNAL.md` |
| Supervisor | `main` | `D:\Projects\openState` | Merges, Queue/BUILD_STATE, storyRegistry, **push origin main** |
| CI-Watcher | `main` | `D:\Projects\openState` | GitHub Actions Build (und ggf. E2E) nach Push beobachten, bei Fail **fixen + pushen** |

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
6. **Push (HARTE PFLICHT – ohne Push gilt der Supervisor-Lauf als fehlgeschlagen):**
   ```
   git status -sb   # muss main...origin/main ahead zeigen ODER equal
   git rev-list --count origin/main..main
   # wenn > 0:
   git push origin main
   git push origin loop/av loop/ug loop/kita   # kein force
   git rev-list --count origin/main..main     # MUSS 0 sein
   ```
   Nach Merge/Docs-Commit **immer** pushen, sobald lint+build grün.  
   „Merges erledigt, Push später“ ist **nicht** erlaubt.
7. Domain-Worktrees mit main synchronisieren (`merge main` in jedem Worktree, kein force).
8. Nach Push: optional Run-ID notieren; **CI-Watcher** übernimmt Überwachung und Auto-Fix.

## CI-Watcher (nach Push)

1. `git fetch origin` · wenn `origin/main..main` > 0 Commits und lokal lint+build grün:  
   **`git push origin main`** (Catch-up, falls Supervisor den Push verpasst hat — kein force)
2. `gh run list --workflow=build.yml --branch main --limit 5`
3. Optional: `gh run list --workflow=e2e.yml --branch main --limit 3`
4. **success** → Journal `docs/loops/ci-WATCHER.md` aktualisieren, Ende
5. **in_progress** → `gh run watch <id> --exit-status` (max. ~8 min) oder im nächsten Tick erneut prüfen
6. **failure** →
   - `gh run view <id> --log-failed`
   - `git pull --ff-only origin main`
   - lokal reproduzieren: `cd demo && npm ci` (bzw. lockfile fixen) && `npm run lint && npm run build`
   - Ursache beheben (Code, ESLint, package-lock, Workflow)
   - Commit: `fix(ci): …` · erneut lint+build grün
   - **`git push origin main`** (kein force)
   - bei gleichem Run/Commit max. **2 Fix-Versuche**; dann Blockade in Journal + DECISION_LOG
7. State in `docs/loops/ci-WATCHER.md`: last_run_id, last_status, last_fix_sha

## Intervalle

- Domain-Loops: 12 min (AV, UG, Kita parallel)
- Supervisor: 15 min — merget und pusht nach origin
- **CI-Watcher: 5 min** — Build im Blick, Auto-Fix bei Rot

## Betriebshinweise

- Domain-Streams committen nur auf `loop/*` und pushen **nicht** selbst.
- Supervisor pusht Feature-Merges; CI-Watcher pusht nur **CI-Fixes**.
- Nutzer-Freigabe: Dauerbetrieb mit Remote-Sync + CI-Auto-Fix.
- Bei Push-Fehler (Auth, non-ff): melden, nicht force-pushen.
- Bei wiederholten Merge-Konflikten: Intervall erhöhen oder einen Stream pausieren.
