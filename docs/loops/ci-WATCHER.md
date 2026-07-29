# CI-Watcher State

| Feld | Wert |
|------|------|
| last_checked | 2026-07-29T03:39:00Z |
| last_run_id | 30420007018 |
| last_status | success |
| last_fix_sha | 5891957 |
| fix_attempts | 0 |

## Log

- 2026-07-29: Build Check `30418875933` success (SHA e910b2f). E2E `30418875918` failure — 5 tests.
- Ursache A: Playwright strict-mode + Button-Locator `/Jetzt beantworten/` vs aria-label.
- Fix attempt 1 (`40d961e`): e2e-Selektoren → 5→2 fails.
- E2E `30419763082` (40d961e) failure — 2 tests (171 passed).
- Ursache B: `page.goto()` remountet `DemoStateProvider` → Session-State verloren.
- Fix attempt 2 (`5891957`): Client-Tab-Navigation in Fortschritt-/Ruhezustand-Tests.
- **2026-07-29 E2E `30420007018` + Build `30420007033` success** (SHA 5891957). fix_attempts reset.
