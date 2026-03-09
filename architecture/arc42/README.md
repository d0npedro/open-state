# arc42 – Architekturdokumentation Open State

---

## Zweck dieser Dokumentation

Diese arc42-Dokumentation beschreibt die Systemarchitektur von Open State in strukturierter Form. arc42 ist ein etabliertes, pragmatisches Architekturdokumentations-Template, das Architekturentscheidungen, Systemkontexte, Bausteine, Laufzeitverhalten und Querschnittskonzepte in zwölf klar getrennten Kapiteln abbildet.

Die Dokumentation richtet sich an:
- Entwicklerinnen und Entwickler, die am System arbeiten
- Fachverantwortliche, die nachvollziehen wollen, welche Architekturentscheidungen warum getroffen wurden
- Prüfinstanzen und Aufsichtsstellen, die das System bewerten
- Alle, die verstehen wollen, wie User Stories in technische Systemstrukturen übersetzt wurden

---

## Verhältnis zu architecture/05_Systemarchitektur.md

Diese arc42-Dokumentation und `architecture/05_Systemarchitektur.md` ergänzen sich und verweisen aufeinander:

- **arc42** führt die Architekturlogik: Warum wurde so entschieden? Was sind die Randbedingungen? Wie verhält sich das System zur Laufzeit? Welche Qualitätsziele gelten?
- **05_Systemarchitektur.md** liefert technische Detaildiagramme, Mermaid-Gesamtdiagramme, Tech-Stack-Tabellen und Implementierungsdetails, die hier referenziert werden.

Beide Dokumente zusammen ergeben eine vollständige Architekturdokumentation. Leser mit strategischem Interesse starten hier. Leser mit technisch-implementierungsorientiertem Interesse starten in `05_Systemarchitektur.md`.

---

## Grundprinzip: Stories beschreiben den Bedarf – arc42 beschreibt die Architekturantwort

Open State folgt dem Prinzip Story-driven Development: Jede Funktion im System führt auf eine dokumentierte User Story zurück. Keine Architekturentscheidung ist ohne fachliche Legitimation.

Diese arc42-Dokumentation schließt diese Schleife explizit: Jedes Kapitel enthält Story-Bezüge, die zeigen, welche User Stories welche Architekturentscheidungen ausgelöst oder bestätigt haben. Die Story-IDs folgen dem Format `US-[DOMÄNE]-[NNN]` und verweisen auf Dokumente unter `docs/stories/`.

---

## Navigation durch die 12 Kapitel

| Kapitel | Titel | Kurzinhalt |
|---------|-------|------------|
| [01](01_EINFUEHRUNG_UND_ZIELE.md) | Einführung und Ziele | Aufgabe, fachliche Ziele, Qualitätsziele, Stakeholder |
| [02](02_RANDBEDINGUNGEN.md) | Randbedingungen | Rechtliche, organisatorische, technische und methodische Constraints |
| [03](03_KONTEXTABGRENZUNG.md) | Kontextabgrenzung | Was liegt innerhalb, was außerhalb von Open State? Externe Systeme. |
| [04](04_LOESUNGSSTRATEGIE.md) | Lösungsstrategie | Zentrale Architekturentscheidungen und ihre Begründungen |
| [05](05_BAUSTEINSICHT.md) | Bausteinsicht | Strukturelle Komponenten, Verantwortlichkeiten, Abhängigkeiten |
| [06](06_LAUFZEITSICHT.md) | Laufzeitsicht | Konkrete Szenarien: Was passiert wann, in welcher Reihenfolge? |
| [07](07_VERTEILUNGSSICHT.md) | Verteilungssicht | Logische Schichten und Deployment-Konzept |
| [08](08_QUERSCHNITTSKONZEPTE.md) | Querschnittskonzepte | Transparenz, Auditierbarkeit, Barrierefreiheit, Fehlerkommunikation |
| [09](09_ARCHITEKTURENTSCHEIDUNGEN.md) | Architekturentscheidungen | ADRs: Was wurde warum entschieden? |
| [10](10_QUALITAETSANFORDERUNGEN.md) | Qualitätsanforderungen | Qualitätsbaum, Szenarien, Messbarkeit |
| [11](11_RISIKEN_UND_TECHNISCHE_SCHULDEN.md) | Risiken und technische Schulden | Ehrliche Bestandsaufnahme offener Punkte |
| [12](12_GLOSSAR.md) | Glossar | Definitionen aller zentralen Begriffe |

---

## Weiterführende Dokumentation

- Technische Detaildiagramme: [architecture/05_Systemarchitektur.md](../05_Systemarchitektur.md)
- Story-System und Traceability: [docs/stories/README.md](../../docs/stories/README.md)
- Traceability Matrix: [docs/stories/TRACEABILITY_MATRIX.md](../../docs/stories/TRACEABILITY_MATRIX.md)
- Verfahrensfairness Engine: [docs/engines/verfahrensfairness/README.md](../../docs/engines/verfahrensfairness/README.md)
- Leitbild: [docs/LEITBILD_STAAT_UND_VERTRAUEN.md](../../docs/LEITBILD_STAAT_UND_VERTRAUEN.md)

---

*Diese Dokumentation ist Teil des Open State-Projekts und unterliegt denselben Grundsätzen: keine kalendarischen Versprechen, keine Buzzwords, offene Punkte ehrlich markiert.*
