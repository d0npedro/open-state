# CI-Watcher State

| Feld | Wert |
|------|------|
| last_checked | 2026-07-29T04:44:30Z |
| last_run_id | 30422965741 |
| last_status | success |
| last_fix_sha | 7f6366d |
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
