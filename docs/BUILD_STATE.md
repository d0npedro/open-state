# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Q-400 Autonomer Multi-Domain-Loop (`docs/delivery/AUTONOMOUS_LOOP.md`)

Dieser Stand beschreibt, was **tatsächlich existiert und funktioniert** — nicht die Feature-Historie.
Geplante Schritte → `docs/NEXT_STEPS_QUEUE.md`.  
Autonomer Loop → `docs/delivery/AUTONOMOUS_LOOP.md` + `loop-state.md`.  
Strukturelles Aufräumen → `docs/REPO_REFACTORING_PLAN.md`.  
Detailhistorie → `git log` / `docs/delivery/queue-archive/`.

---

## Laufende Demo

| Eigenschaft | Wert |
|-------------|------|
| Framework | Next.js 14.2.5, React 18, TypeScript 5 strict |
| Build-Status | ✓ 27 statische Seiten |
| Deployment | Vercel, aus `demo/` |
| Lokaler Start | `cd demo && npm install && npm run dev` |
| Letzte bekannte Prüfung | lint+build 27 Seiten; `test:e2e:ci` 270 passed (Stand vor Prio-0-Refactoring) |
| Daten | durchgängig Mock; kein Backend, keine Behörden-Anbindung |

---

## Demo-Routen

Eine Zeile pro Route: Zweck + Story-Bezug. Feinschliff-Details stehen im Code.

### Allgemein

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/` | Landing: alle Demo-Domänen | – | ✓ |
| `/stories` | Story-Coverage-Dashboard (AV/UG/KJ) | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |

### Arbeitsverwaltung (`/fall/*`)

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/fall` | Fallübersicht: Status, Fairness-Kurzblock, Fristen, Session-Quittungen (Upload/RQ/Termin), CTAs | US-AV-001–007 | ✓ |
| `/fall/dokumente` | Unterlagen + Frist-Countdown + Upload-Quittung + Verlauf-Tiefenlink | US-AV-003, 007 | ✓ |
| `/fall/rueckfragen` | Offene Fragen + Antwort-Dialog + Quittung + Verlauf-Tiefenlink | US-AV-004 | ✓ |
| `/fall/termine` | Termine; session-lokale Bestätigung; Nav-Badge nur bei Handlungsbedarf | US-AV-005, 007 | ✓ |
| `/fall/bescheide` | Bescheide + Fairness + Widerspruchsfrist-Countdown + Anker | US-AV-006, 007 | ✓ |
| `/fall/verlauf` | Timeline; Session-Badges; Anker `#ere-…` | US-AV-007 | ✓ |
| `/fall/hinweise` | Fairness-Vollansicht; Signale live nach Session; CTAs inkl. Countdown-Chips | US-AV-006, 008 | ✓ |

### Unternehmensgründung (`/gruendung/*`)

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/gruendung` | Übersicht: nächster Schritt, Fairness-Kurz-CTAs, Fristen, Session-Quittungen | US-UG-001–006 | ✓ |
| `/gruendung/dokumente` | Unterlagen + Upload session-lokal + Quittung/Verlauf | US-UG-003 | ✓ |
| `/gruendung/rueckfragen` | Rückfragen + Antwort + Verlauf-Tiefenlink | US-UG-004 | ✓ |
| `/gruendung/behoerden` | Behördenkarten; VS-Status live nach RQ; BG-Demo-Markierung | US-UG-002 | ✓ |
| `/gruendung/verlauf` | Verlauf mit Stelle- + Typ-Filter; Session-Badges; Anker | US-UG-005 | ✓ |
| `/gruendung/hinweise` | Fairness UG; CTAs RQ/Unterlagen/BG/…; UNTERLAGE-CTA `data-next-dok-id` + nächste Bezeichnung live | US-UG-003, 006 | ✓ |

### Kita / Jugendamt (`/kita/*`)

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/kita` | Öffentlicher Transparenzbericht: Filter, Zeitreihe, Regionenvergleich, CSV/Druck, Open-Data-Hinweis | US-KJ-009, 010 | ✓ |
| `/kita/lagebild` | JA-Steuerung: Meldeeingang, Engpass, Handlungsfelder, Zeitreihe, Vergleich, CSV/Druck | US-KJ-005, 006, 010 | ✓ |
| `/kita/bedarfsplanung` | Bedarfsplanungsentwurf § 80 SGB VIII; Meldebasis; Freigabe-Demo | US-KJ-007 | ✓ |
| `/kita/vorlage` | Politische Gremienvorlage; JA-Freigabe; CSV/Druck | US-KJ-008 | ✓ |
| `/kita/einrichtung` | Belegungsstand aggregiert (keine Kinddaten); Prozesskette | US-KJ-002 | ✓ |
| `/kita/tagesstand` | Tagesstand erfassen/freigeben (Aggregate, session-lokal) | US-KJ-001 | ✓ |
| `/kita/monatsbericht` | Monatsbericht + Vorschau laufender Monat; Export | US-KJ-003 | ✓ |
| `/kita/meldung` | Monatsmeldung prüfen/korrigieren/freigeben; Session → Meldeeingang | US-KJ-004 | ✓ |

---

## Implementierte Logik (Kernmodule)

Keine Q-xxx-Chronik. Pfade = Einstieg für Code-Lesen.

| Bereich | Einstieg | Ist-Fähigkeit |
|---------|----------|---------------|
| AV Mock-Fall | `demo/data/mockFall.ts` | ALG-I-Fall: Status, Unterlagen, RQ, Termine, Bescheid, Timeline |
| UG Mock-Fall | `demo/data/mockGruendungsfall.ts` | Gründungsakte: Behörden, VS, Unterlagen, RQ, Verlauf |
| Kita Mock | `demo/data/mockKitaLagebild.ts`, `mockKitaMeldeeingang.ts`, … | Planungsräume, Kennzahlen, Meldeeingang, Zeitreihe |
| Story-Registry | `demo/data/storyRegistry.ts` | AV + UG + KJ → Screens/Status; JSON via `npm run registry:export` (Q-305) |
| Fairness AV | `demo/lib/fairness/rules.ts`, `types/fairness.ts` | Regelbasiert (kein ML); Fristen als ISO + Delta zu fiktivem Heute; Verlauf-Tiefenlinks |
| Fairness UG | `demo/lib/fairness/gruendung-rules.ts` | Signale + CTA-Routing (`fairnessSignalZiel`, `naechsterSchrittZiel`, …) |
| Fairness UI | `demo/components/fairness/FairnessPanel.tsx` | Darstellung Signale/CTAs |
| AV Session | `demo/context/DemoStateContext.tsx` | RQ beantworten, Upload, Termin bestätigen, Reset, Timeline-Events |
| UG Session | `demo/context/GruendungStateContext.tsx` | RQ/Upload/BG/Reset; VS-Übergänge; Verlauf |
| Session-UI | `demo/components/DemoSessionBar.tsx` | „Demo zurücksetzen“ nach Interaktion |
| Kita UI-Bausteine | `demo/components/kita/*` | Meldeeingang, Explorer, Zeitreihe, Vergleich, Druck/CSV, Engpass, … |
| CSV-Lizenz (Demo) | `demo/lib/kita/kitaCsvLizenz.ts` | Meta-Hinweis vorläufig CC-BY-ähnlich |
| BuildInfo | `demo/components/BuildInfo.tsx` | Env / Version / Commit-SHA im Footer |

**Demo-Interaktionsmuster (alle Domänen mit State):** Aktion → lokaler State → Fairness/Badges/Quittungen live → optional Verlauf-Ereignis mit Anker. Kein Server.

---

## Design System

Visuell only — **keine** Auswirkung auf Fachlogik, Status oder Zugriffsregeln (DEC-010).

| Stück | Pfad |
|-------|------|
| Tokens / Themes | `demo/app/globals.css` (`[data-theme]`, `[data-density]`) |
| Registry | `demo/design-system/themes/themes.ts` |
| Provider | `demo/design-system/provider/ThemeProvider.tsx` (`localStorage`: `os-theme`, `os-density`) |
| Switcher | `demo/components/ThemeSwitcher.tsx` |
| Anti-Flash | Inline-Script in `demo/app/layout.tsx` |
| Doku | `demo/design-system/README.md` |

**Themes:** `civic-neutral` (Default), `citizen-warm`, `office-dense`, `accessible-contrast`  
**Density:** normal / compact (accessible wo vorgesehen)

---

## Story-System

| Domäne | Docs | Registry | Demo-Status |
|--------|------|----------|-------------|
| AV | US-AV-001–008 | ✓ 8 | DEMONSTRIERBAR |
| UG | US-UG-001–006 | ✓ 6 | DEMONSTRIERBAR |
| KJ | US-KJ-001–010 | ✓ 10 | DEMONSTRIERBAR (Routen vorhanden) |

Vorlagen/Prinzipien: `docs/stories/STORY_TEMPLATE.md`, `FRONTEND_TRACEABILITY_PRINCIPLES.md`.

---

## Dokumentation (Ist)

### Domänen

| Domäne | Pfad | Status |
|--------|------|--------|
| Arbeitsverwaltung | `docs/domains/arbeitsverwaltung/` | ✓ Fachkonzept + Stories |
| Unternehmensgründung | `docs/domains/unternehmensgruendung/` | ✓ Fachkonzept + Stories |
| Kita / JA-Steuerung | `docs/domains/kita_betrieb_und_jugendamt_steuerung/` | ✓ Fachkonzept + Stories |

### Querschnitt

| Thema | Pfad | Status |
|-------|------|--------|
| Verfahrensfairness | `docs/engines/verfahrensfairness/` | ✓ |
| arc42 | `architecture/arc42/` | ✓ 12 Kapitel |
| Systemarchitektur | `architecture/05_Systemarchitektur.md` | ✓ |
| Master-Blueprint | `docs/01_Master_Blueprint.md` | ✓ |
| API-Skizzen | `docs/api/` | ✓ AV + Kita YAML / Aggregationsvertrag |

### Delivery / Agenten

| Datei | Rolle | Status |
|-------|-------|--------|
| `AGENTS.md` | Iterationsablauf | ✓ |
| `docs/DELIVERY_SYSTEM.md` | 12-Schritte-Detail | ✓ (queue-archive verlinkt) |
| `docs/NEXT_STEPS_QUEUE.md` | Aktive Arbeitsliste | ✓ Multi-Domain Q-401+ OFFEN |
| `docs/delivery/AUTONOMOUS_LOOP.md` | Autonomer 12m-Loop (Rotation, Katalog, Prompt) | ✓ (Q-400) |
| `docs/delivery/loop-state.md` | next_domain / idle-Zähler | ✓ (Q-400) |
| `.grok/workflows/autonomous-develop.rhai` | Ein-Fire-Workflow | ✓ (Q-400) |
| `docs/delivery/queue-archive/` | DONE-Historie | ✓ Q-001–Q-300 |
| `docs/BUILD_STATE.md` | Dieser Ist-Stand | ✓ gehärtet (Q-302) |
| `docs/DECISION_LOG.md` | Architektur-/Prozess-DEC | ✓ DEC-013 Anti-Growth |
| `docs/REPO_REFACTORING_PLAN.md` | Phasen 0–4 + Anti-Growth | ✓ Kern Q-299–Q-307 |
| `docs/README.md` | Map of Content / Wissens-Navigation | ✓ (Q-306) |
| Anti-Growth | `AGENTS.md` · `DELIVERY_SYSTEM` · DEC-013 · CONTRIBUTING | ✓ (Q-307) |
| `docs/DEPLOYMENT_AND_DEMO_STRATEGY.md` | Demo-Setup + Vercel + Branches | ✓ führend (Q-304) |
| `archive/rewrites/` | Historische Root-Summaries | ✓ (Q-300) |
| `archive/journals/` | Rotierte Domain-Journals (≤15 aktiv) | ✓ (Q-303) |

---

## Bekannte Lücken (nur echt offen)

Keine durchgestrichenen Erledigungen. Abgeschlossenes steht in git / queue-archive.

| Lücke | Auswirkung | Queue |
|-------|------------|-------|
| Keine Kita-E2E-Specs (nur AV/UG/Landing) | CI deckt Kita-Routen nicht ab | Q-401, Q-402, Q-422 |
| Kein echtes Backend / keine Behörden-Adapter | Demo-only | bewusst Phase 0 |
| Open-Data-Lizenz Kita final (BL) | Demo nutzt vorläufigen Hinweis | fachlich offen, nicht blockierend |
| DSFA / produktive Datenschutz-Nachweise | Konzeptphase | bewusst offen |

---

## Pflege-Regel (Anti-Growth)

Pro Iteration an dieser Datei **höchstens**:

1. Kopfzeile „Zuletzt aktualisiert“
2. Betroffene Route- oder Logik-Zeile **kurz** anpassen (kein Feature-Roman)
3. Echte neue Lücke ergänzen bzw. erledigte Lücke **entfernen** (nicht ~~durchstreichen~~)

Kein „Q-xxx erledigt“-Anhang. Changelog = `git log`.
