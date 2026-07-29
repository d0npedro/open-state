# CI-Watcher State

| Feld | Wert |
|------|------|
| last_checked | 2026-07-29T05:33:30Z |
| last_run_id | 30425290682 |
| last_status | success |
| last_fix_sha | 3d7c00f |
| fix_attempts | 0 |

## Log

- E2E `30421253347` + Build `30421253331` success (SHA 8a0def8).
- E2E `30421435975` success (SHA 0d263d1 docs status). fix_attempts=0.
- Build `30421700646` success (SHA b6162be). E2E `30421735161` success (SHA b1787b6 docs catch-up). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `3042188167` success (SHA 604f802 docs status). Build path-skip (docs-only). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30422052215` success (SHA b33135c docs status). Build latest `30421700646` success. Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30422478077` + `30422527073` failure (SHA merge/kita + 82fc490): timeline-antwort-block missing + hinweise-rq-cta after answer — root cause `page.goto` remounts DemoState/GruendungState. Fix `1e6fd23` (client tab nav). Attempt 1/2 for those runs.
- E2E `30422733707` + Build `30422733683` success (SHA 1e6fd23 fix). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30422965741` + Build `30422965752` success (SHA 7f6366d sessionNav + e2e-before-push). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30423201871` success (SHA b819f71 supervisor merge sync docs). Build latest `30423134890` success (SHA 102e6f4 merge/kita; HEAD docs-only path-skip). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30423336090` success (SHA f59bd33 docs status). Build latest `30423134890` success (code SHA 102e6f4; docs-only path-skip). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30423494011` success (SHA 5c373bc docs status). Build latest `30423134890` success (code SHA 102e6f4; docs-only path-skip). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30423733878` + Build `30423733874` success (SHA d6f94d4 fix e2e:av/ug scripts). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30423831646` + Build `30423831637` success (SHA 46b176a Merge loop/av; HEAD bb82357 docs). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30423943722` + `30424010720` + `30424108838` success (SHA bb82357 / 86ef35b / 1806d80 docs). Build `30424108844` success (HEAD 1806d80). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30424263416` + `30424255255` + `30424309782` success; Build `30424255251` success. Catch-up push `92194cd..e62b9f2` (feat kita residual + merge). Build `30424521330` + E2E `30424521334` success (SHA e62b9f2). Local ahead again with kita filter merge → further catch-up pending. fix_attempts=0.
- E2E `30424640618` success (SHA 9cac87a docs). Build `30424696025` + E2E `30424696077` success (SHA 6e05775 Merge loop/kita + Planungsraum-Filter). Catch-up push: origin/main..main = 0 (lint+build grün). HEAD docs/supervisor may still have in_progress runs next tick. fix_attempts=0.
- E2E `30424738127` + `30424814049` success (SHA 298f265 Kita Q-110 / 3518cd8 UG Q-111). Build `30424814036` success. Catch-up push `93012ef` (docs ci-watcher) after lint+build; origin/main..main = 0. fix_attempts=0.
- Build `30425008491` + E2E `30425008507` success (SHA a18556a Merge loop/kita). Catch-up: origin/main..main = 0.
- E2E `30425071047` + `30425090019` **failure** (SHA b787f34 / bbd4565): `next start` without production build — `Could not find a production build in the '.next' directory`. Root: isE2eCi (CI=true) → `next start`, GHA ran plain `test:e2e` without build. Fix attempt 1/2 → `3d7c00f`.
- Build `30425290659` + E2E `30425290682` **success** (SHA `3d7c00f` fix(ci): webServer `npm run build && next start`, workflow `test:e2e:ci`). Catch-up: origin/main..main = 0. fix_attempts=0. HEAD may have later docs-only commits (e.g. ddc9052) still in_progress next tick.
