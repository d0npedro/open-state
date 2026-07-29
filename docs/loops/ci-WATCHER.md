# CI-Watcher State

| Feld | Wert |
|------|------|
| last_checked | 2026-07-29T04:03:00Z |
| last_run_id | 30421009131 |
| last_status | failure → fixing |
| last_fix_sha | afac036 |
| fix_attempts | 1 |

## Log

- E2E `30420651428` success (SHA c8b6508).
- Domain merges: Build green; E2E `30421009131` failure — 2 tests (185 passed).
- Ursache: strict mode — `Unterlagen` / `Unterlagen hochladen` jetzt 2× (Tab/Kachel + Fristen-CTA + Action-Banner).
- Fix attempt 1: navigation tab-nav-item; action-banner scope in us-av-001-002.
