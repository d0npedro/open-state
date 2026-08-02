# Repo-Refactoring-Plan – Open State

**Status:** Analyse + Umsetzung Kernpfad DONE (Q-299–Q-307). Anti-Growth dauerhaft DEC-013. Optional später: CI soft-checks, Domain-README-Schablonen.  
**Datum:** 2026-08-02  
**Anlass:** Organisches Wachstum (133 Markdown-Dateien, ~Q-224 Queue-Schritte, Multi-Loop-Journals) hat den mentalen und navigierbaren Overhead für Menschen und Agenten unnötig erhöht.  
**Ziel:** Kein weiterer Feature-Zuwachs in dieser Phase — strukturelle Klärung, damit Weiterentwicklung günstiger und klarer wird.

**Leitplanken (verbindlich):**
- Inhaltliche Substanz bleibt erhalten (archivieren statt vernichten)
- Historie darf in `archive/` wandern, nicht gelöscht werden
- Demo und ausgearbeitete Domänen bleiben zentrale Werte
- Kein Big-Bang-Rewrite der Demo-App in dieser Phase

---

## 1. Diagnose – die 5 größten strukturellen Probleme

### P1 – Delivery-State ist zum Changelog mutiert

| Datei | Größe (ca.) | Problem |
|-------|-------------|---------|
| `docs/BUILD_STATE.md` | ~47 KB / ~390 Zeilen | Routen- und Logik-Tabellen enthalten ganze Feature-Historien pro Zelle; „Bekannte Lücken“ listet fast nur durchgestrichene Erledigungen |
| `docs/NEXT_STEPS_QUEUE.md` | ~46 KB / ~430+ Zeilen | **~183 DONE, 1 OFFEN**; Queue ist primär Archiv, nicht Arbeitsliste |
| Domain-Journals | ~156 KB gesamt | `kita-JOURNAL.md` allein ~88 KB / 1000+ Zeilen; Iterationseinträge wiederholen sich |

**Wirkung:** Agenten und Menschen lesen dutzende KB, bevor der *aktuelle* Stand klar ist. Jede Iteration schreibt dieselben Fakten an 2–4 Stellen (Queue, BUILD_STATE, Journal, ggf. Abgeschlossene Iterationen).

### P2 – Historische Rewrite-Artefakte blockieren die Root-Navigation

Im Repo-Root liegen **11+ REPO_REWRITE_SUMMARY_*.md** plus `REPO_CONSOLIDATION_SUMMARY.md` (~70 KB). Sie sind Momentaufnahmen abgeschlossener Umschreibungen, keine aktuellen Einstiege. Sie konkurrieren optisch mit `README.md`, `AGENTS.md`, `CLAUDE.md`.

### P3 – Doppelte / überlappende Informationsquellen

| Thema | Mehrfachstellen | Risiko |
|-------|-----------------|--------|
| Story-Registry | `demo/data/storyRegistry.ts` **und** `docs/stories/story_registry.json` | Drift; Docs fordern Sync beider |
| Deployment | `DEPLOYMENT_AND_DEMO_STRATEGY.md`, `DEMO_DEPLOYMENT_PLAYBOOK.md`, `DEMO_APP_SETUP.md` | Welche Datei ist führend? |
| Architektur | `architecture/arc42/*` **und** `architecture/05_Systemarchitektur.md` | Bewusst ergänzend, aber ohne klare „Start hier“-Regel in der Root-Navigation |
| Jugendhilfe / Kita | `docs/13_Jugendamt_Module.md`, `docs/14_KiJuP_Integration.md`, Domäne `kita_…`, `app-design/11_Kita_…` | Überlappende Einstiege |
| Agenten-Anweisungen | `AGENTS.md`, `CLAUDE.md`, `DELIVERY_SYSTEM.md`, `MULTI_LOOP_BETRIEB.md` | Vier Einstiege mit Teilüberschneidung |

### P4 – Unklare Hierarchie der Wissensschicht

Zwei parallele Ordnungssysteme existieren nebeneinander:

1. **Nummerierte Module 01–15** verstreut über `docs/`, `legal/`, `transparency/`, `architecture/`, `ai-models/`, `app-design/`, `roadmap/`
2. **Domänen- / Engine-Struktur** unter `docs/domains/`, `docs/engines/`, `docs/stories/`

Root hat viele Top-Level-Ordner ohne `docs/`-Dach. Neue Leser (und Agenten) brauchen zuerst eine mentale Karte der *Ordnerpolitik*, bevor sie Inhalte verstehen.

### P5 – Wachstumsmuster ohne Deckel

- Jede Micro-Iteration (Countdown-Chip, CTA-Parität, print-only Meta) erzeugt Queue-Zeile + BUILD_STATE-Zeile + Journal-Eintrag
- Keine harte Regel: „Wann endet Feinschliff? Wann ist eine Domäne DEMO-stabil?“
- Journals wachsen monolitisch, ohne Rotation/Archiv-Schwelle
- Rewrite-Summaries entstanden pro Großschritt und blieben im Root

**Wachstumsrisiko:** Neue Domäne × gleiches Muster = weitere Queue-Hunderte, Journals, BUILD_STATE-Zellen — ohne dass der Einstieg besser wird.

---

## 2. Ziel-Architektur (Soll-Zustand)

### 2.1 Prinzipien

1. **Aktuell vs. Historie strikt trennen** — alles, was nur „war einmal“, liegt unter `archive/` oder in kompakten Index-Dateien
2. **Eine führende Quelle pro Faktenart** (Single Source of Truth)
3. **Domänen kapseln** — Fachkonzept, Stories und Demo-Bezug pro Domäne navigierbar
4. **Querschnitt getrennt** — Vision, Legal, Architektur, Delivery, Engines
5. **Demo bleibt lauffähig und zentral** — aber steuert nicht die gesamte Doku-Hierarchie
6. **Agenten-Pfad ≤ 3 Dateien** für einen Standard-Lauf: Queue (aktiv) → BUILD_STATE (kurz) → DECISION_LOG (nur relevante DEC)

### 2.2 Vorgeschlagene Zielstruktur

```
open-state/
├── README.md                 # Einstieg: Vision, Domänen-Links, Demo, 1× Navigation
├── AGENTS.md                 # Agenten-Betrieb (kurz, verweist auf delivery/)
├── CLAUDE.md                 # Technisches Entwickler-Handover (Demo-fokussiert)
├── CONTRIBUTING.md
├── LICENSE (falls vorhanden)
│
├── demo/                     # Einzige lauffähige Anwendung (unverändert im Kern)
│   ├── app/                  # Routen pro Domäne: fall | gruendung | kita
│   ├── data/                 # Mocks + storyRegistry.ts (führende Registry)
│   ├── lib/                  # Domain-Logik (fairness, …)
│   ├── e2e/
│   └── design-system/
│
├── docs/
│   ├── README.md             # Wissens-Navigation (Map of Content)
│   │
│   ├── vision/               # Querschnitt: Warum / Leitbild
│   │   ├── master-blueprint.md          # ← 01_Master_Blueprint
│   │   ├── leitbild-staat-und-vertrauen.md
│   │   ├── vergleich-best-practices.md  # ← 02_…
│   │   └── politik-pitch.md             # ← 12_… (Stakeholder, nicht Delivery)
│   │
│   ├── legal/                # optional: legal/ top-level belassen ODER hierher
│   │   └── rechtliche-machbarkeit.md
│   │
│   ├── architecture/         # optional: architecture/ top-level belassen
│   │   ├── README.md         # Start: arc42 primär, 05 als Diagramm-Anhang
│   │   ├── arc42/
│   │   └── systemarchitektur.md
│   │
│   ├── domains/              # Fachdomänen (bestehend, erweitern)
│   │   ├── arbeitsverwaltung/
│   │   ├── unternehmensgruendung/
│   │   └── kita_betrieb_und_jugendamt_steuerung/
│   │       └── related/      # Verweise/Integrationen (KiJuP, Jugendamt-Module)
│   │
│   ├── engines/
│   │   └── verfahrensfairness/
│   │
│   ├── stories/              # Story-System (bestehend)
│   │   ├── README.md
│   │   ├── story_registry.json   # generiert ODER Abgleich-Skript aus .ts
│   │   └── <domain>/
│   │
│   ├── delivery/             # Agenten- & Iterationssteuerung (schlank)
│   │   ├── DELIVERY_SYSTEM.md
│   │   ├── NEXT_STEPS_QUEUE.md      # nur OFFEN / IN_ARBEIT / BLOCKIERT (+ kurzer DONE-Tail)
│   │   ├── BUILD_STATE.md           # Ist-Stand, max. Zielgröße (siehe Regeln)
│   │   ├── DECISION_LOG.md
│   │   └── queue-archive/           # DONE-Blöcke nach Meilenstein
│   │
│   ├── ops/                  # Deployment, Setup (eine führende Datei + Anhänge)
│   │   ├── DEMO_AND_DEPLOYMENT.md   # führend
│   │   └── …
│   │
│   ├── api/                  # Verträge (bestehend)
│   └── adr/                  # Architektur-Entscheidungen (bestehend)
│
├── architecture/             # Phase 1: belassen; Phase 2: optional unter docs/
├── legal/
├── transparency/
├── app-design/               # UI-Konzept; langfristig docs/design/ oder archive der veralteten Teile
├── ai-models/
├── roadmap/
│
└── archive/                  # Nur Historie — kein Pflichtlesen
    ├── rewrites/             # alle REPO_REWRITE_SUMMARY_*.md
    ├── consolidation/
    └── journals/             # rotierte Loop-Journals
        ├── kita-2026-Q2.md
        └── …
```

**Hinweis zur Umsetzungsrealität:** Top-Level-Ordner (`architecture/`, `legal/`, …) müssen nicht in Phase 1 physisch unter `docs/` wandern. Wichtiger ist zuerst: Root säubern, Delivery entlasten, Navigation klären. Physische Zusammenführung ist Phase 2 und darf Links/CI nicht brechen.

### 2.3 Single Source of Truth (Soll)

| Faktenart | Führende Quelle | Abgeleitete / verbotene Duplikate |
|-----------|-----------------|-----------------------------------|
| Demo-Routen & implementierte Logik | `BUILD_STATE.md` (kompakt) + Code | Keine Feature-Romane in Queue/Journals |
| Offene Arbeit | `NEXT_STEPS_QUEUE.md` (nur aktiv) | DONE → `queue-archive/` |
| Architektur-Entscheidungen | `DECISION_LOG.md` + arc42/09 | Keine parallelen ADR-Inseln ohne Verweis |
| Story-Metadaten (Status, Screens) | `demo/data/storyRegistry.ts` | `story_registry.json` generieren oder abschaffen |
| Fachkonzept Domäne | `docs/domains/<d>/` | App-Design-Docs verweisen, nicht kopieren |
| Deployment | eine Datei unter `docs/ops/` | Playbook/Setup zusammenführen oder klar hierarchisieren |
| Iterationsprotokoll Multi-Loop | Journal mit Rotation | Kein Parallel-Changelog in BUILD_STATE |

---

## 3. Priorisierter Refactoring-Plan

### Phase 0 – Sofortmaßnahmen (geringes Risiko, hoher Nutzen)

**Ziel:** Root und Delivery entlasten, ohne Link-Ökosystem zu zerstören.

| # | Maßnahme | Betroffene Pfade | Nutzen | Risiko / nicht löschen |
|---|----------|------------------|--------|------------------------|
| 0.1 | `archive/rewrites/` anlegen; alle `REPO_REWRITE_SUMMARY*.md` + `REPO_CONSOLIDATION_SUMMARY.md` dorthin verschieben; Root-README um einen Satz „Historische Umschreibungen → archive/“ ergänzen | Root `REPO_*.md` → `archive/rewrites/` | Root: 19 → ~7 MD-Dateien; klarer Einstieg | **DONE Q-300** — nur verschieben, nicht löschen; relative Links in Summaries egal (Historie) |
| 0.2 | `NEXT_STEPS_QUEUE.md` spalten: aktive Queue (OFFEN/IN_ARBEIT/BLOCKIERT + max. letzte ~10 DONE) vs. `docs/delivery/queue-archive/DONE_Q001-Q300.md` | `docs/NEXT_STEPS_QUEUE.md`, neu `docs/delivery/queue-archive/` | Agenten lesen Minuten statt Scrollen | **DONE Q-301** — Historie mit Commit-Hashes in Archiv |
| 0.3 | `BUILD_STATE.md` härten: Routen-Tabelle auf **1 Zeile pro Route** (Status + Story-IDs + 1 Satz); Logik-Tabelle ohne Q-xxx-Chronik; „Bekannte Lücken“ nur echte Offenpunkte; Changelog-Abschnitte → Archive oder streichen | `docs/BUILD_STATE.md` | Ist-Stand in <5 Min lesbar | **DONE Q-302** — ~49 KB → ~10 KB; Pflege-Regel im Dokument |
| 0.4 | Journal-Rotation: pro Domain-Journal nur die letzten N Iterationen (z. B. 15) im aktiven File; Rest nach `archive/journals/` | `docs/loops/*-JOURNAL.md` | Multi-Loop bleibt nutzbar ohne 88-KB-Datei | **DONE Q-303** — Kita 64→15 (+49 Archiv), UG 42→15 (+27 Archiv), AV 14 unter Schwelle; `archive/journals/README.md` |
| 0.5 | Doppel-Deployment: führende Datei festlegen (`DEPLOYMENT_AND_DEMO_STRATEGY.md` oder neu `ops/DEMO_AND_DEPLOYMENT.md`); die anderen zwei auf Stub mit Verweis reduzieren | 3 Deploy-Docs | Eine Wahrheit | **DONE Q-304** — `DEPLOYMENT_AND_DEMO_STRATEGY.md` führend; Setup + Playbook Stubs; README verweist führend |

**Erwarteter Nutzen Phase 0:** Einstieg und „Entwickle weiter“-Loop spürbar schneller; null Feature-Risiko; git history behält alles.

---

### Phase 1 – Strukturelle Bereinigung

**Ziel:** Wissensschichten ordnen, Duplikate auflösen, Domänen-Kanten klären.

| # | Maßnahme | Betroffene Pfade | Nutzen | Risiko / nicht löschen |
|---|----------|------------------|--------|------------------------|
| 1.1 | Story-Registry: **eine Quelle** — `storyRegistry.ts` führend; `story_registry.json` per Script generieren *oder* Docs so umschreiben, dass JSON entfällt | `demo/data/storyRegistry.ts`, `docs/stories/story_registry.json`, DEMO_*-Docs | Kein Sync-Drift | **DONE Q-305** — `npm run registry:export`; Docs/CONTRIBUTING/CLAUDE auf SSOT |
| 1.2 | Jugendamt/KiJuP an Kita-Domäne andocken: `docs/13_*`, `docs/14_*` nach `docs/domains/kita_…/related/` oder klare Cross-Links + README-Hierarchie | `docs/13_*`, `docs/14_*`, Kita-Domain-README | Ein Domänen-Einstieg | Dateien verschieben mit Redirect-Hinweis in Stub |
| 1.3 | `app-design/11_Kita_…` gegen Domain-Docs abgleichen: veraltetes markieren oder auf Domain verweisen | `app-design/11_*`, Domain | Weniger Konzept-Duplikat | UI-Flow-Details behalten wenn einzigartig |
| 1.4 | Architektur-Startregel in `architecture/README.md` (neu): arc42 = primär, `05_` = Diagramme/Stack | `architecture/` | Weniger „wo fange ich an?“ | Beide Inhalte behalten |
| 1.5 | `docs/11_Entwickler_Handover.md` (27 KB) entkoppeln: Demo-Teile → CLAUDE.md / DEMO-Docs; Zukunfts-Backend bleibt als „Ausblick“; Doppelungen streichen | Handover, CLAUDE.md | Ein technischer Einstieg | Keine Stilllegung der Zukunftsarchitektur |
| 1.6 | `OpenState_Prompts_CLI_v4.txt` bewerten: aktiv nutzen → `docs/delivery/` oder `tools/`; sonst `archive/` | Root-TXT | Root-Rauschen | Nicht löschen ohne Prüfung |

**Erwarteter Nutzen Phase 1:** Domänen und Querschnitt sind ohne Root-Archäologie findbar; weniger Doppelpflege.

---

### Phase 2 – Informationsarchitektur & Navigation

**Ziel:** Jeder Einstiegstyp hat genau einen empfohlenen Pfad.

| # | Maßnahme | Betroffene Pfade | Nutzen | Risiko |
|---|----------|------------------|--------|--------|
| 2.1 | `docs/README.md` als Map of Content (Rollen: Bürger-Demo, Domänen-Fach, Architektur, Agent, Contributor) | neu `docs/README.md`, `README.md` | Navigations-Hub | **DONE Q-306** |
| 2.2 | README Root straffen: Vision + Domänen-Tabelle + Demo + Verweis docs/README + Delivery (5 Steuerdateien) — Modul-01–15-Tabelle in docs/README auslagern | `README.md` | 10-KB-Root lesbarer | **DONE Q-306** — Module 01–15 in docs/README |
| 2.3 | Einheitliche Domain-README-Schablone: Problem, Demo-Routen, Stories, API, offene Grenzen, verwandte Docs | `docs/domains/*/README.md` | Neue Domäne andocken = Vorlage kopieren | Inhalt pro Domäne anpassen |
| 2.4 | Nummerierung 01–15: **nicht umbenennen in Phase 2 erzwingen** (Link-Breaks). Stattdessen stabile Aliase in docs/README. Optional später `vision/`-Rename in eigenem Commit | nummerierte MD | Navigation ohne Mass-Rename-Risiko | Rename nur mit Link-Check-Skript |
| 2.5 | Traceability: `TRACEABILITY_MATRIX.md` vs. `/stories` UI — Matrix schlank halten oder aus Registry generieren | `docs/stories/*` | Weniger manuelle Matrix-Pflege | |

**Erwarteter Nutzen Phase 2:** „Wo finde ich X?“ ist in ≤2 Klicks beantwortbar.

---

### Phase 3 – Delivery-System verschlanken / härten

**Ziel:** Der Loop bleibt mächtig, aber schreib- und lese-arm.

| # | Maßnahme | Betroffene Pfade | Nutzen | Risiko |
|---|----------|------------------|--------|--------|
| 3.1 | `AGENTS.md` / `DELIVERY_SYSTEM.md`: Pflichtlektüre auf **aktive Queue + kurzes BUILD_STATE + DECISION_LOG** begrenzen; Journals nur bei Multi-Loop | AGENTS, DELIVERY_SYSTEM | Weniger Token/Zeit pro Iteration | **DONE Q-307** |
| 3.2 | BUILD_STATE-Update-Regel: pro Iteration max. (a) Kopfzeile „zuletzt“, (b) betroffene Route/Logik-Zelle kürzen/aktualisieren, (c) echte neue Lücke — **kein** „Q-xxx erledigt“-Anhang | BUILD_STATE, DELIVERY_SYSTEM | Verhindert erneutes Aufblähen | **DONE Q-307** (DELIVERY Schritt 9) |
| 3.3 | Queue-Regel: Micro-Paritäten bündeln („UG/AV Countdown-Parität Serie“) statt 20 Einzelschritte à 15 Min, **oder** Feinschliff-Budget pro Domäne | NEXT_STEPS_QUEUE, DEC-NEU | Verhindert Q-400-Syndrom | **DONE Q-307** (DELIVERY + DEC-013) |
| 3.4 | Journal-Format: max. 8–12 Zeilen pro Iteration; Felder Was/Dateien/Story/Build/Nächster Hinweis — keine Nacherzählung der gesamten Feature-Liste | `docs/loops/*` | Journal bleibt Signal, nicht Roman | **DONE Q-303/Q-307** (Rotation + MULTI_LOOP) |
| 3.5 | Optional: `docs/delivery/` physisch bündeln (Move BUILD_STATE, QUEUE, …) + Stub am alten Pfad | docs/* | Klarer Delivery-Ordner | offen (optional) |
| 3.6 | Definition of Done „Domäne DEMO-stabil“: Kriterien in DECISION_LOG (Routen, Stories DEMONSTRIERBAR, E2E-Smoke, Fairness-Kern) — danach nur noch Bugs/echte Lücken | DECISION_LOG | Stoppt Endlos-Feinschliff | **DONE Q-307** (DEC-013) |

**Erwarteter Nutzen Phase 3:** Delivery skaliert mit Domänenanzahl, nicht mit Micro-CTA-Anzahl.

---

### Phase 4 – Regeln gegen erneutes historisches Wachstum

**Ziel:** Institutionalisierte Anti-Growth-Policy (siehe Abschnitt 4). Verankerung in:

- `AGENTS.md` (kurz, verbindlich)
- `docs/DELIVERY_SYSTEM.md` (Details)
- `CONTRIBUTING.md` (Contributor-Sicht)
- `DECISION_LOG.md` (DEC: Repo-Wachstumsregeln)

| # | Maßnahme | Nutzen |
|---|----------|--------|
| 4.1 | Anti-Growth-Regeln committen und in Agenten-Pflichtlektüre aufnehmen | **DONE Q-307** — AGENTS + DELIVERY + DEC-013 + CONTRIBUTING |
| 4.2 | CI oder Pre-Commit-Hinweis (optional, soft): Warnung wenn BUILD_STATE > N KB oder Queue > M OFFEN+DONE gemischt | offen (optional) |
| 4.3 | Quartals-Review „Docs Health“ als fester Queue-Typ CHORE | offen (optional) |

---

## 4. Anti-Growth-Policy (Regeln für die Zukunft)

Kurz, verbindlich, ohne Auslegungsspielraum:

### A. Historie

1. **Keine neuen `REPO_REWRITE_SUMMARY_*.md` im Root.** Zusammenfassung einer Umstrukturierung → `archive/rewrites/YYYY-MM-thema.md` oder ein Eintrag im DECISION_LOG.
2. **Journals rotieren.** Aktives Journal ≤ ~200 Zeilen oder ≤ 15 Iterationen. Älteres → `archive/journals/<domain>-<periode>.md`. Index-Datei listet Perioden.
3. **DONE-Queue archivieren.** In der aktiven Queue höchstens die letzten ~10 DONE-Einträge. Rest → `queue-archive/`. Mindestens nach jedem Meilenstein (z. B. Domäne stabil, Phase-Abschluss).

### B. State-Dateien

4. **BUILD_STATE beschreibt Ist, nicht Verlauf.** Keine fortlaufende „Q-xxx erledigt“-Liste. Maximale Richtgröße: ~15–20 KB oder klar gegliederte Kurzform. Detailhistorie = git log.
5. **Queue ist Arbeitsliste, kein Changelog.** Status-Werte ernst nehmen; abgeschlossene Prioritätsblöcke auslagern.
6. **DECISION_LOG nur für echte Entscheidungen** (Trade-offs, Alternativen). Keine Feature-Notizen.

### C. Neue Dokumente

7. **Neues Top-Level-Dokument/Ordner nur mit Begründung in DECISION_LOG** und Eintrag in `docs/README.md` (Navigation). Default: unter bestehendem Ordner ablegen.
8. **Eine führende Quelle pro Thema.** Zweite Datei nur als Stub („→ siehe X“) oder generiertes Artefakt.
9. **Nummerierte Module (01–15) nicht erweitern.** Neue Querschnittsdocs nach Thema benennen (`docs/vision/…`, `docs/ops/…`), nicht `16_Neues_Thema.md` im Root von docs.

### D. Domänen & Demo

10. **Neue Domäne = festes Paket:** `docs/domains/<id>/` + `docs/stories/<id>/` + optional Demo-Slice unter `demo/app/<route>/` + Eintrag Domain-README-Schablone. Kein dritter Konzept-Ordner ohne Verweis.
11. **Story-Registry:** nur `demo/data/storyRegistry.ts` manuell pflegen (JSON generiert oder entfernt).
12. **Feinschliff-Budget:** Nach Erreichen „DEMO-stabil“ (DEC) keine weiteren Paritäts-Mikroschritte ohne explizite Queue-Priorität „Produktlücke“ oder Bug.

### E. Agenten-Schreiben

13. **Pro Iteration maximal die nötigen Steuerdateien anfassen** — typisch: Queue-Status + 1× BUILD_STATE-Zelle + Commit. Journal nur im Multi-Loop.
14. **Keine Rewrite-Summaries als Abschlussritual** einer Iteration.
15. **Analyse-only-Läufe** enden als *ein* Dokument unter `docs/` (wie dieser Plan) — nicht als Root-Summary-Sammlung.

---

## 5. Empfehlung zur Umsetzung

### Big Bang vs. inkrementell

**Strikt inkrementell.** Begründung:

- Viele relative Links (README, Domains, arc42, Agenten-Pfade)
- Delivery-Loop läuft produktiv (Q-22x); ein Total-Move bricht Agenten-Pflichtlektüre
- Demo und CI (`demo/`, Workflows) sollen unberührt bleiben, solange nur Docs wandern
- Jede Phase liefert allein messbaren Nutzen (Root sauber / Queue lesbar / Navigation klar)

### Sicherste Reihenfolge

```
Phase 0.1 archive rewrites     ← null Logikrisiko, sofort spürbar
Phase 0.2 Queue split          ← Agenten-Loop gewinnt am meisten
Phase 0.3 BUILD_STATE harden   ← parallel zu 0.2 möglich nach 0.2
Phase 0.4 Journal rotation
Phase 0.5 Deploy-Docs merge
Phase 1.* Duplikate / Domänen-Kanten
Phase 2.* Navigation / docs/README
Phase 3.* Delivery-Regeln + DEC Anti-Growth
Phase 4.* Policy verankern + optional Soft-Checks
```

**Nicht zuerst:** Mass-Rename aller `01_`–`15_`-Dateien, physisches Verschieben von `architecture/` unter `docs/`, Demo-Ordner-Umbau.

### Delivery-Loop während des Refactorings

| Situation | Vorgehen |
|-----------|----------|
| Normal „Entwickle weiter“ | Obersten **strukturellen** OFFEN-Schritt aus Refactoring-Priorität nehmen, solange Phase 0–3 in der Queue steht |
| Parallel Feature-Wunsch | Bewusst: Feature-Queue pausieren oder nur Bugs; sonst wächst BUILD_STATE weiter während des Aufräumens |
| Multi-Loop | Domain-Loops **keine** Queue/BUILD_STATE-Edits (bestehende Regel); Supervisor übernimmt Archive-Schritte als CHORE |
| Nach Phase 0.2 | Agenten lesen schlanke Queue — `DELIVERY_SYSTEM.md` einmal anpassen (Pfad queue-archive) |
| Links | Nach Moves: Stub am alten Pfad mit einer Überschrift + Link (30 Tage oder dauerhaft) |

### Queue-Vorschlag (konkrete IDs)

| ID | Schritt | Typ | Aufwand | Status-Vorschlag |
|----|---------|-----|---------|------------------|
| Q-300 | Phase 0.1: REPO_* nach `archive/rewrites/`, README-Hinweis | DOCS | S | nächster OFFEN nach Feature-Abschluss |
| Q-301 | Phase 0.2: Queue split + queue-archive | DOCS | M | |
| Q-302 | Phase 0.3: BUILD_STATE auf Ist-Stand härten | DOCS | M | |
| Q-303 | Phase 0.4: Journal-Rotation Kita/UG/AV | DOCS | S | |
| Q-304 | Phase 0.5: Deploy-Docs auf eine Führungsdatei | DOCS | S | |
| Q-305 | Phase 1.1: Story-Registry Single Source | CHORE | M | |
| Q-306 | Phase 2.1–2.2: docs/README + Root-README straffen | DOCS | M | |
| Q-307 | Phase 3 + 4: Anti-Growth in AGENTS/DELIVERY/DEC | DOCS | S | |

*(IDs ab 300 gewählt, um Feature-Q-22x nicht zu überschreiben.)*

---

## 6. Sofort umsetzbare nächste 3 Schritte

1. **`archive/rewrites/` anlegen und alle Root-`REPO_*.md` dorthin verschieben**  
   README um einen Satz ergänzen. Kein Inhalt verloren, Root sofort klarer.

2. **Aktive Queue extrahieren**  
   `NEXT_STEPS_QUEUE.md` auf OFFEN/IN_ARBEIT/BLOCKIERT + kurze Prioritätslogik reduzieren; DONE-Blöcke nach `docs/delivery/queue-archive/DONE_Q001-Q224.md` (Name anpassen). Einen Refactoring-Block Q-300+ als Priorität 0 setzen.

3. **BUILD_STATE auf „Ist-Stand“-Vorlage zurückschneiden**  
   Pro Route eine kurze Zeile; Logik-Tabelle ohne Q-Historie; nur echte offene Lücken (z. B. DSFA). Git bleibt das Changelog.

---

## 7. Kurzfassung der Diagnose (für README/Executive)

| # | Problem | Symptom | Hebel |
|---|---------|---------|-------|
| 1 | Delivery = Changelog | Queue 183 DONE / 1 OFFEN; BUILD_STATE 47 KB | Split + Härten |
| 2 | Root-Historie | 11 Rewrite-Summaries im Root | `archive/rewrites/` |
| 3 | Doppelquellen | storyRegistry.ts + JSON; 3 Deploy-Docs | Single Source |
| 4 | Zwei Ordnungssysteme | Module 01–15 vs. domains/engines | docs/README Map |
| 5 | Unbegrenzter Feinschliff | Micro-Q + Journal-Romane | Anti-Growth + DEMO-stabil |

---

## 8. Was bewusst nicht Teil dieses Plans ist

- Kein Feature-Abbau in der Demo
- Kein Neuschreiben der Domänenkonzepte
- Kein Backend-Einführen
- Kein Löschen von arc42, Legal, Stories
- Kein erzwungenes Umbenennen aller nummerierten Module in Phase 0/1

---

*Dieses Dokument ist die verbindliche Analyse- und Planungsgrundlage für das strukturelle Refactoring. Umsetzung erfolgt schrittweise über die Queue (Q-300+), nicht als unkontrollierter Big Bang.*
