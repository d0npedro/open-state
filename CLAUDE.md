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

No test framework is configured yet.

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

### Demo Routes (Arbeitsverwaltung vertical slice)

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/fall` | Case overview & status |
| `/fall/dokumente` | Document requests |
| `/fall/rueckfragen` | Clarification questions |
| `/fall/termine` | Appointments |
| `/fall/bescheide` | Administrative decisions |
| `/fall/verlauf` | Full audit log / timeline |
| `/stories` | Story coverage dashboard |
| `/feedback` | Feedback → GitHub issues |

### Key Files

- `demo/data/mockFall.ts` — Single source of truth for all mock case data (realistic ALG I employment benefit case with proper § SGB III references)
- `demo/data/storyRegistry.ts` — Maps user story IDs to screens and acceptance criteria
- `demo/types/index.ts` — TypeScript types for all domain models (`Fall`, `Dokument`, `Rueckfrage`, `Termin`, `Bescheid`, `TimelineEreignis`)
- `demo/app/globals.css` — Design system tokens (CSS variables) and utility classes
- `demo/components/BuildInfo.tsx` — Footer showing env/version/commit SHA

### Design System

CSS variables (defined in `globals.css`):
- `--color-primary: #003F8C` — Government blue
- `--color-success/warning/danger` — Status colors
- `--radius: 6px`, `--shadow` — Consistent decoration

Utility classes: `.card`, `.badge`, `.btn`, `.btn-primary`, `.btn-secondary`

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
