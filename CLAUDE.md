# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Open State** is a German government digital transformation blueprint — a concept-phase project demonstrating how all administrative procedures could be handled through a single, citizen-respecting platform. The repository combines extensive architecture documentation with a working Next.js demo.

**Current phase:** Concept & Architecture (Phase 0). All data is mocked; no real backend or government integrations exist yet.

## Development Commands

All commands run from the `demo/` subdirectory:

```bash
cd demo
npm install        # Install dependencies
npm run dev        # Local dev server → http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint (Next.js defaults)
```

E2E tests: Playwright under `demo/e2e/` (`npm run test:e2e`). CI: `.github/workflows/e2e.yml` and `.github/workflows/build.yml`.

## Repository Structure

```
openState/
├── demo/              # Next.js 14 app — the only runnable code
├── docs/              # Domain specs, strategy, story system
│   └── stories/       # User story templates and registry
├── architecture/      # Arc42 formal architecture (12 chapters)
└── OpenState_Prompts_CLI_v4.txt  # CLI prompt library
```

## Demo App Architecture (`demo/`)

**Framework:** Next.js 14 (App Router), React 18, TypeScript 5 strict mode, plain CSS with design tokens.

**Deployment:** Vercel from `demo/` subdirectory. Build config in `demo/vercel.json`. Environment branch model: `demo` → production, `feature/*` → preview, `main` → no auto-deploy.

**Path alias:** `@/*` maps to the `demo/` root.

### Demo Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (all demo domains) |
| `/fall` … `/fall/*` | Arbeitsverwaltung vertical slice |
| `/fall/hinweise` | Fairness / Verfahrenslage (US-AV-008) |
| `/gruendung` … `/gruendung/*` | Unternehmensgründung |
| `/kita`, `/kita/lagebild` | Kita Transparenz + JA-Steuerung |
| `/stories` | Story coverage dashboard |
| `/feedback` | Feedback → GitHub issues |

### Key Files

- `demo/data/mockFall.ts` — ALG I mock case (source of truth for AV)
- `demo/data/mockGruendungsfall.ts` — Gründungsakte mock
- `demo/data/mockKitaLagebild.ts` — Kita Kennzahlen mock
- `demo/data/storyRegistry.ts` — Story IDs → screens / acceptance criteria
- `demo/types/index.ts`, `gruendung.ts`, `kita.ts`, `fairness.ts` — domain models
- `demo/lib/fairness/rules.ts` — rule-based fairness signals (no ML)
- `demo/context/DemoStateContext.tsx` / `GruendungStateContext.tsx` — interactive demo state
- `demo/app/globals.css` — design tokens and utility classes
- `demo/components/BuildInfo.tsx` — footer env/version/commit SHA

### Design System & Themes

Visual-only layer — **never** changes domain logic, status calculations, or access rules (DEC-010).

| Piece | Path | Role |
|-------|------|------|
| CSS tokens | `demo/app/globals.css` | Colors, density, radius, shadows via CSS variables |
| Theme registry | `demo/design-system/themes/themes.ts` | Theme IDs, labels, recommended density |
| ThemeProvider | `demo/design-system/provider/ThemeProvider.tsx` | React context, `localStorage` (`os-theme`, `os-density`) |
| ThemeSwitcher | `demo/components/ThemeSwitcher.tsx` | Footer UI to switch theme/density |
| Anti-flash | `demo/app/layout.tsx` | Inline script applies stored theme before paint |
| Docs | `demo/design-system/README.md` | Design system notes |

**Themes:** `civic-neutral` (default), `citizen-warm`, `office-dense`, `accessible-contrast`  
**Density:** normal / compact (and accessible where applicable)  
**Mechanism:** `[data-theme]` and `[data-density]` on `<html>`

Base tokens (defaults under civic-neutral):
- `--color-primary` — government blue
- `--color-success` / `--color-warning` / `--color-danger` — status colors
- `--radius`, `--shadow` — decoration

Utility classes: `.card`, `.badge`, `.btn`, `.btn-primary`, `.btn-secondary`, status chips

### Environment Variables

Set via `.env.local` or Vercel UI:
```
NEXT_PUBLIC_APP_ENV=local          # local | demo | preview | production
NEXT_PUBLIC_COMMIT_SHA=dev         # 7-char git hash (auto-set by Vercel as VERCEL_GIT_COMMIT_SHA)
NEXT_PUBLIC_DEMO_VERSION=0.1.0
```

## Story-Driven Development

Every UI feature must trace back to a documented User Story. Story IDs follow the pattern `US-[DOMAIN]-[NNN]` (e.g., `US-AV-001`). Domain codes: `AV` = Arbeitsverwaltung, `UG` = Unternehmensgrundung.

Story lifecycle: `ENTWURF → BEREIT → IN_ENTWICKLUNG → DEMONSTRIERBAR → ABGESCHLOSSEN`

- Story templates: `docs/stories/STORY_TEMPLATE.md`
- Story registry: `docs/stories/story_registry.json`
- Traceability principles: `docs/stories/FRONTEND_TRACEABILITY_PRINCIPLES.md`
- Domain stories: `docs/stories/arbeitsverwaltung/`

When adding UI, annotate components with story IDs and register them in `demo/data/storyRegistry.ts`.

## Transparency-First Design Pattern

Every administrative action shown to citizens must include these fields in the data model and UI:

| Field | German label | Purpose |
|-------|-------------|---------|
| `begründung` | Begründung | Why this action is needed |
| `konsequenz` | Konsequenz | What happens if not completed |
| `frist` | Frist | Deadline |
| `rechtsgrundlage` | Rechtsgrundlage | Legal basis (§ SGB reference) |

Both a legal-language version (`rechtlicheFassung`) and a plain-language explanation (`erklärung`) should be present for decisions.

## Non-Negotiable Principles (from project vision)

- AI is assistant only — never the decision-maker
- Zero-Knowledge architecture for citizen data
- GDPR by Design & Default
- WCAG 2.1 AA accessibility minimum
- All core components Open Source

## Architecture Documentation

For deep architectural context:
- `architecture/arc42/` — Formal 12-chapter arc42 documentation
- `docs/01_Master_Blueprint.md` — Vision and module overview
- `docs/11_Entwickler_Handover.md` — Complete developer guide including future full-stack design (microservices, government adapters, data layer)
- `docs/engines/verfahrensfairness/` — Cross-domain procedural fairness engine design
