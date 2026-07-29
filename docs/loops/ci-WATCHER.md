# CI-Watcher State

| Feld | Wert |
|------|------|
| last_checked | 2026-07-29T04:34:00Z |
| last_run_id | 30422478077 |
| last_status | failure |
| last_fix_sha | 37d6855 |
| fix_attempts | 1 |

## Log

- E2E `30421253347` + Build `30421253331` success (SHA 8a0def8).
- E2E `30421435975` success (SHA 0d263d1 docs status). fix_attempts=0.
- Build `30421700646` success (SHA b6162be). E2E `30421735161` success (SHA b1787b6 docs catch-up). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `3042188167` success (SHA 604f802 docs status). Build path-skip (docs-only). Catch-up push: origin/main..main = 0. fix_attempts=0.
- E2E `30422052215` success (SHA b33135c docs status). Build latest `30421700646` success. Catch-up push: origin/main..main = 0. fix_attempts=0.
- Catch-up push: cf681b0..37d6855 (10 commits, lint+build green). Build `30422478034` success. E2E `30422478077` **failure** (2 tests): `timeline-antwort-block` / `hinweise-rq-cta-RQ-01` — root cause page.goto() drops Demo/UG layout state. fix_attempts=1 (E2E client-nav).
