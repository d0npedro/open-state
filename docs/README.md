# Open State – Wissens-Navigation (Map of Content)

Einstieg für Menschen und Agenten: **Wo finde ich was?**  
Root-README: Vision, Domänen, Demo-Start → [`../README.md`](../README.md)

---

## Nach Rolle

| Rolle | Zuerst lesen | Dann |
|-------|--------------|------|
| **Demo ausprobieren** | [`DEPLOYMENT_AND_DEMO_STRATEGY.md`](DEPLOYMENT_AND_DEMO_STRATEGY.md) · lokal `cd demo && npm run dev` | [`BUILD_STATE.md`](BUILD_STATE.md) (Routen) |
| **Domänen-Fach** | [`domains/`](domains/) je Domäne README | Stories unter [`stories/`](stories/) |
| **Architektur** | [`../architecture/arc42/README.md`](../architecture/arc42/README.md) | [`../architecture/05_Systemarchitektur.md`](../architecture/05_Systemarchitektur.md) (Diagramme) |
| **Agent / Iteration** | [`../AGENTS.md`](../AGENTS.md) · [`NEXT_STEPS_QUEUE.md`](NEXT_STEPS_QUEUE.md) · [`BUILD_STATE.md`](BUILD_STATE.md) · [`DECISION_LOG.md`](DECISION_LOG.md) | [`DELIVERY_SYSTEM.md`](DELIVERY_SYSTEM.md) |
| **Neue Session** | [`delivery/SESSION_HANDOFF.md`](delivery/SESSION_HANDOFF.md) | Queue Q-601+ |
| **Autonomer Dauer-Loop** | [`delivery/AUTONOMOUS_LOOP.md`](delivery/AUTONOMOUS_LOOP.md) · [`delivery/loop-state.md`](delivery/loop-state.md) | Workflow `autonomous-develop` · **kein** Skip-Link-Katalog-Spam |
| **Contributor** | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) · [`stories/README.md`](stories/README.md) | Issue-Templates, Story-Template |

---

## Demo (lauffähig)

| Was | Wo |
|-----|-----|
| Code | `demo/` (Next.js) |
| Ist-Stand Routen/Logik | [`BUILD_STATE.md`](BUILD_STATE.md) |
| Setup + Vercel + Branches | [`DEPLOYMENT_AND_DEMO_STRATEGY.md`](DEPLOYMENT_AND_DEMO_STRATEGY.md) (führend) |
| Fairness in der Demo | [`VERFAHRENSFAIRNESS_IN_DER_DEMO.md`](VERFAHRENSFAIRNESS_IN_DER_DEMO.md) |
| Story Coverage UI | Route `/stories` · Registry: `demo/data/storyRegistry.ts` |

---

## Domänen (Fachkonzept)

| Domäne | Pfad | Demo-Routen |
|--------|------|-------------|
| Arbeitsverwaltung | [`domains/arbeitsverwaltung/`](domains/arbeitsverwaltung/README.md) | `/fall/*` |
| Unternehmensgründung | [`domains/unternehmensgruendung/`](domains/unternehmensgruendung/README.md) | `/gruendung/*` |
| Kita-Betrieb & JA-Steuerung | [`domains/kita_betrieb_und_jugendamt_steuerung/`](domains/kita_betrieb_und_jugendamt_steuerung/README.md) | `/kita/*` |

Verwandt (noch nicht unter `domains/`):  
[`13_Jugendamt_Module.md`](13_Jugendamt_Module.md) · [`14_KiJuP_Integration.md`](14_KiJuP_Integration.md)

---

## Stories & Traceability

| Dokument | Zweck |
|----------|-------|
| [`stories/README.md`](stories/README.md) | Story-System, Status-Schema |
| [`stories/STORY_TEMPLATE.md`](stories/STORY_TEMPLATE.md) | Vorlage |
| `demo/data/storyRegistry.ts` | **Führende** Registry (Status, Route, AK) |
| [`stories/story_registry.json`](stories/story_registry.json) | Generierter Export (`npm run registry:export`) |
| [`stories/TRACEABILITY_MATRIX.md`](stories/TRACEABILITY_MATRIX.md) | Menschenlesbare Übersicht |
| [`stories/FRONTEND_TRACEABILITY_PRINCIPLES.md`](stories/FRONTEND_TRACEABILITY_PRINCIPLES.md) | Story-IDs in der UI |

---

## Engines & Querschnitt

| Thema | Pfad |
|-------|------|
| Verfahrensfairness | [`engines/verfahrensfairness/`](engines/verfahrensfairness/README.md) |
| Leitbild Staat/Vertrauen | [`LEITBILD_STAAT_UND_VERTRAUEN.md`](LEITBILD_STAAT_UND_VERTRAUEN.md) |
| API-Skizzen | [`api/`](api/) |
| ADRs (Docs) | [`adr/`](adr/) |

---

## Delivery / Agenten-Steuerung

| Datei | Zweck |
|-------|-------|
| [`../AGENTS.md`](../AGENTS.md) | Iterationspflicht + Anti-Growth-Kurzform (DEC-013) |
| [`DELIVERY_SYSTEM.md`](DELIVERY_SYSTEM.md) | 12-Schritte-Ablauf + Anti-Growth-Tabelle |
| [`NEXT_STEPS_QUEUE.md`](NEXT_STEPS_QUEUE.md) | Aktive Arbeitsliste |
| [`delivery/queue-archive/`](delivery/queue-archive/README.md) | DONE-Historie |
| [`BUILD_STATE.md`](BUILD_STATE.md) | Ist-Stand (kompakt) |
| [`DECISION_LOG.md`](DECISION_LOG.md) | Entscheidungen (u. a. DEC-013 Anti-Growth) |
| [`REPO_REFACTORING_PLAN.md`](REPO_REFACTORING_PLAN.md) | Refactoring-Plan + Policy §4 (Q-299–Q-307) |
| [`loops/MULTI_LOOP_BETRIEB.md`](loops/MULTI_LOOP_BETRIEB.md) | Parallele Domain-Loops |

---

## Nummerierte Module (01–15) – Aliase

Historische Modulnummern bleiben als Dateinamen (keine Mass-Renames).  
**Neue Docs** nicht als `16_…` anlegen — thematisch unter `domains/`, `engines/`, Delivery oder Top-Level-Ordnern.

| Nr | Thema | Pfad |
|----|-------|------|
| 01 | Master-Blueprint | [`01_Master_Blueprint.md`](01_Master_Blueprint.md) |
| 02 | Internationale Vergleichsstudie | [`02_Vergleich_Best_Practices.md`](02_Vergleich_Best_Practices.md) |
| 03 | Rechtliche Machbarkeit | [`../legal/03_Rechtliche_Machbarkeitsstudie.md`](../legal/03_Rechtliche_Machbarkeitsstudie.md) |
| 04 | Transparenz & Haftung | [`../transparency/04_Transparenz_Haftung.md`](../transparency/04_Transparenz_Haftung.md) |
| 05 | Systemarchitektur (Diagramme) | [`../architecture/05_Systemarchitektur.md`](../architecture/05_Systemarchitektur.md) |
| 06 | CaseMatch AI | [`../ai-models/06_CaseMatch_Engine.md`](../ai-models/06_CaseMatch_Engine.md) |
| 07 | UI/UX User-Flows | [`../app-design/07_UI_UX_User_Flows.md`](../app-design/07_UI_UX_User_Flows.md) |
| 08 | Prototyp-Prompts | [`../app-design/08_Prototyp_Prompts.md`](../app-design/08_Prototyp_Prompts.md) |
| 09 | Finanzierungsmodell | [`../roadmap/09_Monetarisierung_Finanzmodell.md`](../roadmap/09_Monetarisierung_Finanzmodell.md) |
| 10 | Pilot & Rollout | [`../roadmap/10_Pilot_Rollout.md`](../roadmap/10_Pilot_Rollout.md) |
| 11 | Entwickler-Handover | [`11_Entwickler_Handover.md`](11_Entwickler_Handover.md) |
| 12 | Politik-Pitch | [`12_Politik_Pitch.md`](12_Politik_Pitch.md) |
| 13 | Jugendamt-Modul | [`13_Jugendamt_Module.md`](13_Jugendamt_Module.md) |
| 14 | KiJuP-Integration | [`14_KiJuP_Integration.md`](14_KiJuP_Integration.md) |
| – | arc42 (primär Architektur) | [`../architecture/arc42/`](../architecture/arc42/README.md) |

---

## Repo-Top-Level (außerhalb von `docs/`)

| Ordner | Inhalt |
|--------|--------|
| `demo/` | Einzige lauffähige App |
| `architecture/` | arc42 + Systemarchitektur |
| `legal/`, `transparency/` | Recht / Haftung |
| `app-design/`, `ai-models/`, `roadmap/` | UI-Konzept, KI-Skizzen, Roadmap |
| `archive/` | Historie (Rewrites, Journals) — kein Pflichtlesen |

---

## Pflege

- Navigation hier ergänzen, wenn ein **neues** Top-Level-Dokument oder ein neuer Ordner entsteht (Anti-Growth / Q-307).
- Ist-Fakten zur Demo nur in [`BUILD_STATE.md`](BUILD_STATE.md); offene Arbeit nur in [`NEXT_STEPS_QUEUE.md`](NEXT_STEPS_QUEUE.md).
