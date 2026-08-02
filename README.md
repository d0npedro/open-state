# Open State – Staatliche Verwaltung. Transparent. Zuverlässig. Digital.

**Konzept- und Architekturprojekt** für eine bürgernahe, nachvollziehbare digitale Verwaltungsinfrastruktur — mit klickbarer Demo (Mock-Daten, Phase 0).

![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Konzept%20%26%20Architektur-informational)

---

## Vision

Der Staat trägt Verantwortung — für jeden Bürger, unabhängig von Bildungsstand, Region oder digitalem Vorwissen.

Open State macht diese Verantwortung sichtbar: klare Prozesse, nachvollziehbare Entscheidungen, sichere Daten, Dienste, die zu den Menschen kommen.

> **„Effizienz ist kein Selbstzweck. Sie ist Ausdruck von Respekt gegenüber jedem Bürger und verantwortungsvoller Umgang mit Steuergeld."**

Open State ist kein Startup-Produkt. Es ist ein transparentes Betriebs- und Vertrauensmodell für einen handlungsfähigen, gerechten und digital kompetenten Staat.

**Kernprinzipien:** Datensouveränität · KI nur als Assistenz · Open Source Kern · WCAG 2.1 AA · DSGVO by Design · keine Werbefinanzierung

---

## Kerndomänen (mit Demo)

| Domäne | Demo | Fachkonzept |
|--------|------|-------------|
| **Arbeitsverwaltung** | `/fall/*` | [docs/domains/arbeitsverwaltung/](docs/domains/arbeitsverwaltung/README.md) |
| **Unternehmensgründung** | `/gruendung/*` | [docs/domains/unternehmensgruendung/](docs/domains/unternehmensgruendung/README.md) |
| **Kita-Betrieb & Jugendamt** | `/kita/*` | [docs/domains/kita_betrieb_und_jugendamt_steuerung/](docs/domains/kita_betrieb_und_jugendamt_steuerung/README.md) |
| **Verfahrensfairness** (Querschnitt) | Signale in AV/UG | [docs/engines/verfahrensfairness/](docs/engines/verfahrensfairness/README.md) |

Weitere geplante Domänen (ohne Demo): Wohnsitz, Steuern, Rechtsstreit, Sozialleistungen — siehe [Master-Blueprint](docs/01_Master_Blueprint.md).

---

## Demo starten

```bash
cd demo && npm install && npm run dev
# → http://localhost:3000
```

| Ressource | Link |
|-----------|------|
| Deployment, Branches, Vercel | [docs/DEPLOYMENT_AND_DEMO_STRATEGY.md](docs/DEPLOYMENT_AND_DEMO_STRATEGY.md) |
| Aktueller Demo-Stand (Routen) | [docs/BUILD_STATE.md](docs/BUILD_STATE.md) |
| Stories / Coverage | [docs/stories/README.md](docs/stories/README.md) · Route `/stories` |

---

## Dokumentation finden

**Map of Content (vollständig):** → **[docs/README.md](docs/README.md)**

Kurz:

| Bedarf | Einstieg |
|--------|----------|
| Architektur (arc42) | [architecture/arc42/](architecture/arc42/README.md) |
| Stories & Traceability | [docs/stories/](docs/stories/README.md) |
| Recht / Transparenz | [legal/](legal/) · [transparency/](transparency/) |
| Mitwirken | [CONTRIBUTING.md](CONTRIBUTING.md) |

Nummerierte Module 01–15 und alle Querschnittspfade: in der [Map of Content](docs/README.md).

---

## Delivery (Weiterentwicklung im Repo)

| Datei | Zweck |
|-------|-------|
| [AGENTS.md](AGENTS.md) | Verbindlicher Iterationsablauf |
| [docs/NEXT_STEPS_QUEUE.md](docs/NEXT_STEPS_QUEUE.md) | Offene Schritte |
| [docs/BUILD_STATE.md](docs/BUILD_STATE.md) | Ist-Stand |
| [docs/DECISION_LOG.md](docs/DECISION_LOG.md) | Entscheidungen |
| [docs/DELIVERY_SYSTEM.md](docs/DELIVERY_SYSTEM.md) | 12-Schritte-Detail |

Befehl: **„Entwickle weiter"** → ein Queue-Schritt, Commit, kein Push (Push nur auf ausdrückliche Anweisung).

Strukturelles Aufräumen (DEC-011): [docs/REPO_REFACTORING_PLAN.md](docs/REPO_REFACTORING_PLAN.md) · Historie: [archive/](archive/)

---

## Mitmachen

- Issues & Pull Requests willkommen  
- Fach / Recht / UX: Label `feedback` · Technik: Label `dev`  
- Demo-Feedback im laufenden Demonstrator: `/feedback`

---

**„Der Staat soll für den Bürger da sein – verlässlich, fair, transparent."**
