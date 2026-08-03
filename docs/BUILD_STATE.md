# BUILD_STATE.md – Aktueller Projektstand

Zuletzt aktualisiert: nach Q-622 Kita Meldelücke Ruhezustand/Methodik

Dieser Stand beschreibt, was **tatsächlich existiert und funktioniert** — nicht die Feature-Historie.
Geplante Schritte → `docs/NEXT_STEPS_QUEUE.md`.  
**Neue Session:** `docs/delivery/SESSION_HANDOFF.md`.  
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
| Letzte bekannte Prüfung | lint + build + **`test:e2e:ci` 378 passed** (chromium) + GitHub Actions grün |
| Prüf-Bezug (Code) | `a5a9a3e` (Push nach Q-542; spätere Commits bis Q-602 docs/chore-only) |
| E2E-Baseline | zuletzt voll **378** (`a5a9a3e`); Q-612: `stories-zur-demo` **+4** Tests (AV/UG/KJ + Hash) lokal grün — nächster Full-CI-Lauf erwartet **382** |
| E2E-Skripte | Domains: `test:e2e:av` · `test:e2e:ug` · `test:e2e:kita`; `stories-zur-demo.spec.ts` (Q-411/Q-530/Q-612: alle routes + Stichproben); Theme/BuildInfo/Skip-Link/Session-Reset |
| Daten | durchgängig Mock; kein Backend, keine Behörden-Anbindung |

---

## Demo-Routen

Eine Zeile pro Route: Zweck + Story-Bezug. Feinschliff-Details stehen im Code.

### Allgemein

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/` | Landing: Domänen-Karten + Sekundärlinks (AV/UG Hinweise, Kita Lagebild intern) | – | ✓ |
| `/stories` | 24 Stories, alle mit `route`; CTA „Zur Demo“; Tiefenlinks KJ-006 Engpass / KJ-010 Zeitreihe; E2E AV+UG+KJ-Stichproben | – | ✓ |
| `/feedback` | Feedback → GitHub Issues | – | ✓ |

### Arbeitsverwaltung (`/fall/*`)

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/fall` | Fallübersicht: Status, Fairness-Kurzblock, Fristen, Session-Quittungen (Upload/RQ/Termin), CTAs | US-AV-001–007 | ✓ |
| `/fall/dokumente` | Unterlagen + Frist-Countdown + Upload-Quittung + Verlauf-Tiefenlink | US-AV-003, 007 | ✓ |
| `/fall/rueckfragen` | Offene Fragen + Antwort-Dialog + Quittung + Verlauf-Tiefenlink | US-AV-004 | ✓ |
| `/fall/termine` | Termine; session-lokale Bestätigung; Nav-Badge nur bei Handlungsbedarf | US-AV-005, 007 | ✓ |
| `/fall/bescheide` | Bescheide + Fairness + Widerspruchsfrist; Session-Widerspruch (Quittung, Verlauf `#ere-E-DEMO-WID-…`, Reset) | US-AV-006, 007 | ✓ |
| `/fall/verlauf` | Timeline; Session-Badges; Anker `#ere-…` | US-AV-007 | ✓ |
| `/fall/hinweise` | Fairness-Vollansicht; Signale live nach Session; CTAs inkl. Countdown-Chips | US-AV-006, 008 | ✓ |

### Unternehmensgründung (`/gruendung/*`)

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/gruendung` | Übersicht: nächster Schritt, Fairness-Kurz-CTAs, Session-Quittungen; **Ruhezustand-Banner** (Q-621) mit BG- bzw. Steuernummer-CTA | US-UG-001–006 | ✓ |
| `/gruendung/dokumente` | Unterlagen + Upload session-lokal + Quittung/Verlauf | US-UG-003 | ✓ |
| `/gruendung/rueckfragen` | Rückfragen + Antwort + Verlauf-Tiefenlink | US-UG-004 | ✓ |
| `/gruendung/behoerden` | Behördenkarten; VS-Status live nach RQ; BG-Demo-Markierung | US-UG-002 | ✓ |
| `/gruendung/verlauf` | Verlauf mit Stelle- + Typ-Filter; Session-Badges; Anker | US-UG-005 | ✓ |
| `/gruendung/hinweise` | Fairness UG; CTAs RQ/Unterlagen/BG/…; UNTERLAGE-CTA `data-next-dok-id` + nächste Bezeichnung live | US-UG-003, 006 | ✓ |

### Kita / Jugendamt (`/kita/*`)

| Route | Inhalt (Ist) | Stories | Status |
|-------|--------------|---------|--------|
| `/kita` | Öffentlicher Transparenzbericht: Filter, Zeitreihe, Regionenvergleich, CSV/Druck, Open-Data-Hinweis | US-KJ-009, 010 | ✓ |
| `/kita/lagebild` | JA-Steuerung: Meldeeingang (Lücken-Methodik, Session-Hinweis Q-622), Engpass, Zeitreihe, CSV/Druck | US-KJ-005, 006, 010 | ✓ |
| `/kita/bedarfsplanung` | Bedarfsplanungsentwurf § 80 SGB VIII; Meldebasis; Freigabe-Demo | US-KJ-007 | ✓ |
| `/kita/vorlage` | Politische Gremienvorlage; JA-Freigabe; CSV/Druck | US-KJ-008 | ✓ |
| `/kita/einrichtung` | Belegungsstand aggregiert (keine Kinddaten); Prozesskette | US-KJ-002 | ✓ |
| `/kita/tagesstand` | Tagesstand erfassen/freigeben (Aggregate, session-lokal) | US-KJ-001 | ✓ |
| `/kita/monatsbericht` | Monatsbericht + Vorschau laufender Monat; Export | US-KJ-003 | ✓ |
| `/kita/meldung` | Monatsmeldung freigeben; Session → Meldeeingang; **Ruhezustand + Methodik nach Freigabe** (Q-622) | US-KJ-004 | ✓ |

---

## Implementierte Logik (Kernmodule)

Keine Q-xxx-Chronik. Pfade = Einstieg für Code-Lesen.

| Bereich | Einstieg | Ist-Fähigkeit |
|---------|----------|---------------|
| AV Mock-Fall | `demo/data/mockFall.ts` | ALG-I-Fall: Status, Unterlagen, RQ, Termine, Bescheid, Timeline |
| UG Mock-Fall | `demo/data/mockGruendungsfall.ts` | Gründungsakte: Behörden, VS, Unterlagen, RQ, Verlauf |
| Kita Mock | `demo/data/mockKitaLagebild.ts`, `mockKitaMeldeeingang.ts`, … | Planungsräume, Kennzahlen, Meldeeingang, Zeitreihe |
| Story-Registry | `demo/data/storyRegistry.ts` | 24 Stories · 16 ABGESCHLOSSEN · 8 DEMONSTRIERBAR (offene AK); Export `registry:export` |
| Fairness AV | `demo/lib/fairness/rules.ts`, `types/fairness.ts` | 5 Signal-Typen; ISO-Fristen vs. `FIKTIVES_HEUTE`; Verlauf-Tiefenlinks |
| Fairness UG | `demo/lib/fairness/gruendung-rules.ts` | 6 Signal-Typen; CTA `fairnessSignalZiel` + Verlauf; session-sensitive Texte |
| Fairness UI | `demo/components/fairness/FairnessPanel.tsx` | Panel/Summary; Domänen-Seiten mit eigenen CTA-Karten |
| Fairness-Doku Demo | `docs/VERFAHRENSFAIRNESS_IN_DER_DEMO.md` | Ist: AV+UG Signale, CTAs, Session (Q-611); Konzept → engines/ |
| AV Session | `demo/context/DemoStateContext.tsx` | RQ, Upload, Termin, **Widerspruch** (Q-620), Reset, Timeline-Events |
| UG Session | `demo/context/GruendungStateContext.tsx` | RQ/Upload/BG/Reset; VS-Übergänge; Verlauf |
| Session-UI | `demo/components/DemoSessionBar.tsx` | AV/UG/Kita „Demo zurücksetzen“ (Kita: Meldefreigabe localStorage, Q-412) |
| Kita UI-Bausteine | `demo/components/kita/*` | Meldeeingang, Explorer, Zeitreihe, Vergleich, Druck/CSV, Engpass, … |
| CSV-Lizenz (Demo) | `demo/lib/kita/kitaCsvLizenz.ts` | Meta-Hinweis vorläufig CC-BY-ähnlich |
| BuildInfo | `demo/components/BuildInfo.tsx` | Env / Version / Commit-SHA im Footer; a11y `role=group` + aria-label (Q-510) |

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
| AV | US-AV-001–008 | ✓ 8 | 6 ABGESCHLOSSEN · 2 DEMONSTRIERBAR (001 eID, 003 Format) |
| UG | US-UG-001–006 | ✓ 6 | 5 ABGESCHLOSSEN · 1 DEMONSTRIERBAR (003 Format) |
| KJ | US-KJ-001–010 | ✓ 10 | 5 ABGESCHLOSSEN · 5 DEMONSTRIERBAR (005–008, 010) |

Vorlagen/Prinzipien: `docs/stories/STORY_TEMPLATE.md`, `FRONTEND_TRACEABILITY_PRINCIPLES.md`.  
Traceability-Matrix: Stub → SSOT `demo/data/storyRegistry.ts` / Export `story_registry.json` / UI `/stories` (Q-432).

---

## Dokumentation (Ist)

### Domänen

| Domäne | Pfad | Status |
|--------|------|--------|
| Arbeitsverwaltung | `docs/domains/arbeitsverwaltung/` | ✓ README-Schablone + Fachkonzept + Stories |
| Unternehmensgründung | `docs/domains/unternehmensgruendung/` | ✓ README-Schablone + Fachkonzept + Stories |
| Kita / JA-Steuerung | `docs/domains/kita_betrieb_und_jugendamt_steuerung/` | ✓ README-Schablone + Related 13/14/ADR (ohne Duplikat) + Fachkonzept + Stories |

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
| `docs/NEXT_STEPS_QUEUE.md` | Aktive Arbeitsliste | ✓ schlank (OFFEN + Tail; Historie archiviert) |
| `docs/delivery/SESSION_HANDOFF.md` | Einstieg nächste Session | ✓ (Q-600) |
| `docs/delivery/AUTONOMOUS_LOOP.md` | Autonomer Loop (Rotation, Katalog, Prompt) | ✓ Katalog gehärtet |
| `docs/delivery/loop-state.md` | next_domain / idle-Zähler | ✓ |
| `.grok/workflows/autonomous-develop.rhai` | Ein-Fire-Workflow | ✓ (Q-400) |
| `docs/delivery/queue-archive/` | DONE-Historie | ✓ Q-001–Q-300 · Q-400–Q-542 |
| `docs/BUILD_STATE.md` | Dieser Ist-Stand | ✓ E2E-Baseline 378 / `a5a9a3e` (Q-602) |
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
| Kein echtes Backend / keine Behörden-Adapter | Demo-only | bewusst Phase 0 |
| Open-Data-Lizenz Kita final (BL) | Demo nutzt vorläufigen Hinweis | fachlich offen, nicht blockierend |
| DSFA / produktive Datenschutz-Nachweise | Konzeptphase | bewusst offen |
| Story-Status vs. Demo-Realität (DEMONSTRIERBAR vs. ABGESCHLOSSEN) | Traceability ehrlich halten | Q-610 |

---

## Pflege-Regel (Anti-Growth)

Pro Iteration an dieser Datei **höchstens**:

1. Kopfzeile „Zuletzt aktualisiert“
2. Betroffene Route- oder Logik-Zeile **kurz** anpassen (kein Feature-Roman)
3. Echte neue Lücke ergänzen bzw. erledigte Lücke **entfernen** (nicht ~~durchstreichen~~)

Kein „Q-xxx erledigt“-Anhang. Changelog = `git log`.
