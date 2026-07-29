# CI-Watcher State

| Feld | Wert |
|------|------|
| last_checked | 2026-07-29T03:36:00Z |
| last_run_id | 30419763082 |
| last_status | failure → fixing |
| last_fix_sha | 40d961e |
| fix_attempts | 2 |

## Log

- 2026-07-29: Build Check `30418875933` success (SHA e910b2f). E2E `30418875918` failure — 5 tests.
- Ursache A: Playwright strict-mode + Button-Locator `/Jetzt beantworten/` vs aria-label.
- Fix attempt 1 (`40d961e`): e2e-Selektoren → 5→2 fails.
- E2E `30419763082` (40d961e) failure — 2 tests (171 passed).
- Ursache B: `page.goto()` remountet `DemoStateProvider` → Session-State verloren.
- Fix attempt 2: Client-Tab-Navigation in Fortschritt-/Ruhezustand-Tests (wie us-av-004).
)
