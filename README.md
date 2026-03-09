# Open State – Staatliche Verwaltung. Transparent. Zuverlässig. Digital.

**Automatisierung und Vereinfachung des deutschen Verwaltungsapparats**
Eine einzige, staatlich betriebene App für alle Behördenvorgänge – 95 % davon vollautomatisch, in unter 3 Minuten.

![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Konzept%20%26%20Architektur-informational)

---

## Vision

Der Staat trägt Verantwortung. Für jeden Bürger – unabhängig von Bildungsstand, Region oder digitalem Vorwissen.

Open State macht diese Verantwortung sichtbar: durch klare Prozesse, nachvollziehbare Entscheidungen, sichere Daten und staatliche Dienste, die zu den Menschen kommen – nicht umgekehrt.

Wohnsitz anmelden, Gewerbe starten, Rechtsstreit per KI-Analyse klären, Sozialleistungen beantragen – alles per Smartphone, ohne Warteschlange, ohne Medienbruch, ohne Formular-Chaos.

---

## Leitbild

> **„Effizienz ist kein Selbstzweck. Sie ist Ausdruck von Respekt gegenüber jedem Bürger und verantwortungsvoller Umgang mit Steuergeld."**

Open State ist kein Startup-Produkt, das den Staat „disrupten" will.
Es ist ein transparentes Betriebs- und Vertrauensmodell für einen handlungsfähigen, gerechten, nachvollziehbaren und digital kompetenten Staat.

Open State ist **pro Leistung, pro Gründung, pro Verantwortung.** Wer wirtschaftlich aktiv ist, Verantwortung übernimmt oder gründet, soll vom Staat unterstützt werden – durch klare Prozesse, verlässliche Fristen und eine Verwaltung, die koordiniert statt bremst. Deutschland soll als Standort wieder verständlich, planbar und handlungsfähig wirken – nicht durch Slogans, sondern durch tatsächlich funktionierende staatliche Infrastruktur.

---

## Kerndomänen

Open State ist in fachliche Domänen strukturiert. Jede Domäne deckt einen zusammenhängenden Bereich staatlicher Aufgaben ab.

| Domäne | Beschreibung | Link |
|--------|-------------|------|
| **Arbeitsverwaltung** | Arbeitslosmeldung, Leistungsantrag, Fallakte, Bescheidtransparenz, Vermittlung | [docs/domains/arbeitsverwaltung/](docs/domains/arbeitsverwaltung/README.md) |
| **Wohnsitzmanagement** | An-, Um-, Abmeldung, Automatische Behördeninformation | (Modul 1.2 im Blueprint) |
| **Steuern** | AutoFill-Steuererklärung via ELSTER | (Modul 1.3 im Blueprint) |
| **Rechtsstreit & Bußgeld** | CaseMatch-Analyse, Widerspruchsverwaltung | (Modul 2.2 im Blueprint) |
| **Sozialleistungen** | Bürgergeld, Wohngeld, Elterngeld, BAföG | (Modul 2.3 im Blueprint) |
| **Jugendhilfe** | HzE, Unterhaltsvorschuss, KiJuP-Integration | [docs/13_Jugendamt_Module.md](docs/13_Jugendamt_Module.md) |
| **Unternehmensgründung** | Gewerbeanmeldung, Gründungsakte, Statusverfolgung, koordinierte Behördenkommunikation | [docs/domains/unternehmensgruendung/](docs/domains/unternehmensgruendung/README.md) |
| **Verfahrensfairness Engine** | Domänenübergreifende Querschnittskomponente: Konsistenzprüfung, Begründungsqualität, Erklärbarkeit | [docs/engines/verfahrensfairness/](docs/engines/verfahrensfairness/README.md) |

---

## Projektdokumentation

| Modul | Dokument | Link |
|-------|---------|------|
| 01 | Master-Blueprint (Vision, Architektur, Kernmodule) | [docs/01_Master_Blueprint.md](docs/01_Master_Blueprint.md) |
| 02 | Internationale Vergleichsstudie (Estland, Singapur, Dänemark) | [docs/02_Vergleich_Best_Practices.md](docs/02_Vergleich_Best_Practices.md) |
| 03 | Rechtliche Machbarkeitsstudie & Gesetzgebungsvorschläge | [legal/03_Rechtliche_Machbarkeitsstudie.md](legal/03_Rechtliche_Machbarkeitsstudie.md) |
| 04 | Transparenz- & Haftungskonzept | [transparency/04_Transparenz_Haftung.md](transparency/04_Transparenz_Haftung.md) |
| 05 | Systemarchitektur (Mermaid-Diagramme) | [architecture/05_Systemarchitektur.md](architecture/05_Systemarchitektur.md) |
| 06 | CaseMatch AI – Prompt-Engineering & RAG-Pipeline | [ai-models/06_CaseMatch_Engine.md](ai-models/06_CaseMatch_Engine.md) |
| 07 | UI/UX & vollständige User-Flows | [app-design/07_UI_UX_User_Flows.md](app-design/07_UI_UX_User_Flows.md) |
| 08 | Prototyp-Prompts & Figma-Struktur | [app-design/08_Prototyp_Prompts.md](app-design/08_Prototyp_Prompts.md) |
| 09 | Finanzierungs- & Effizienzmodell | [roadmap/09_Monetarisierung_Finanzmodell.md](roadmap/09_Monetarisierung_Finanzmodell.md) |
| 10 | Pilot- & Rollout-Strategie | [roadmap/10_Pilot_Rollout.md](roadmap/10_Pilot_Rollout.md) |
| 11 | Entwickler-Handover (technische Gesamtdokumentation) | [docs/11_Entwickler_Handover.md](docs/11_Entwickler_Handover.md) |
| 12 | Öffentlichkeits- & Politik-Pitch | [docs/12_Politik_Pitch.md](docs/12_Politik_Pitch.md) |
| 13 | Jugendamt-Modul (HzE, Beratung, Unterhaltsvorschuss) | [docs/13_Jugendamt_Module.md](docs/13_Jugendamt_Module.md) |
| 14 | KiJuP-Integration (Referenzquelle & lokale Fachverfahren) | [docs/14_KiJuP_Integration.md](docs/14_KiJuP_Integration.md) |
| D1 | **Domäne: Arbeitsverwaltung** (vollständige Domänendokumentation) | [docs/domains/arbeitsverwaltung/](docs/domains/arbeitsverwaltung/README.md) |
| D2 | **Domäne: Unternehmensgründung** (vollständige Domänendokumentation) | [docs/domains/unternehmensgruendung/](docs/domains/unternehmensgruendung/README.md) |
| E1 | **Verfahrensfairness Engine** (Konzept, Funktionsweise, Signale, Transparenz) | [docs/engines/verfahrensfairness/](docs/engines/verfahrensfairness/README.md) |
| L | Leitbild: Staat und Vertrauen | [docs/LEITBILD_STAAT_UND_VERTRAUEN.md](docs/LEITBILD_STAAT_UND_VERTRAUEN.md) |

---

## Kernprinzipien (nicht verhandelbar)

- **Datensouveränität beim Bürger** – Zero-Knowledge-Architektur, vollständiges Audit-Log
- **KI nur als Assistenz, nie als Entscheider** – jede Empfehlung ist erklärbar und anfechtbar
- **Open Source für alle Kernkomponenten** – keine verdeckten Algorithmen
- **Barrierefreiheit als Mindeststandard** – WCAG 2.1 AA, Einfache Sprache, 12 Sprachen
- **DSGVO by Design & by Default** – keine nachträgliche Compliance
- **Keine Werbefinanzierung** – staatliche Infrastruktur finanziert sich durch fiskalische Einsparungen

---

## Architekturdokumentation

Open State folgt der arc42-Architekturvorlage als strukturierte Dokumentation. Die arc42-Dokumentation übersetzt die User Stories und Domänenanforderungen in eine nachvollziehbare Systemarchitektur.

→ [Architekturdokumentation (arc42)](architecture/arc42/README.md)

---

## Entwicklungsansatz

Open State wird anhand nachvollziehbarer User Stories entwickelt. Jede sichtbare Funktion führt auf ein konkretes Problem und definierte Akzeptanzkriterien zurück.

→ [Story-System und Traceability](docs/stories/README.md)

---

## Demo & Deployment

Eine laufende Demo wird über den `demo`-Branch bereitgestellt. Feature-Branches erhalten automatische Preview-Deployments. `main` bleibt stabiler Referenzstand ohne unkontrollierte Production-Deploys.

→ [Deployment- und Demo-Strategie](docs/DEPLOYMENT_AND_DEMO_STRATEGY.md)

---

## Demo

Eine klickbare Demo zeigt den ersten Vertical Slice der Domäne Arbeitsverwaltung: Fallübersicht, Status, Dokumente, Rückfragen, Termine, Bescheidtransparenz und Verlauf.

Jede Funktion ist auf eine User Story zurückführbar. Die Story Coverage ist direkt im Demonstrator einsehbar.

→ [Demo starten (lokal)](demo/) · [Setup-Anleitung](docs/DEMO_APP_SETUP.md)

---

## Mitmachen / Beitragen

- Issues & Pull Requests willkommen
- Fachliche Einschätzungen, Rechtshinweise, UX-Feedback: Issue öffnen mit Label `feedback`
- Technische Beiträge: Label `dev`

---

**„Der Staat soll für den Bürger da sein – verlässlich, fair, transparent."**
