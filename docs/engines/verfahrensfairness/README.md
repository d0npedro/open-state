# Verfahrensfairness Engine – Überblick

**Open State – Querschnittskomponente für strukturelle Verfahrensqualität**

---

## Was ist die Verfahrensfairness Engine?

Die Verfahrensfairness Engine ist eine domänenübergreifende Systemkomponente, die Verwaltungsvorgänge auf strukturelle Qualitätsmerkmale prüft. Sie analysiert, vergleicht, erklärt und markiert – sie entscheidet nicht.

Die Engine beobachtet, ob Verfahren konsistent behandelt werden, ob Begründungen vorhanden sind, ob Fristen plausibel sind, ob Dokumentationsketten vollständig sind und ob ähnliche Sachverhalte zu ähnlichen Ergebnissen führen. Diese Informationen werden sowohl der Sachbearbeitung als auch den Bürgerinnen und Bürgern zugänglich gemacht – in verständlicher Sprache, mit nachvollziehbarer Grundlage.

Die Engine ist kein Werkzeug zur Herbeiführung von Ergebnissen. Sie ist ein Werkzeug zur Erhöhung von Nachvollziehbarkeit.

---

## Warum kein "Gerechtigkeits-KI"-Begriff

Der Begriff "Gerechtigkeits-KI" wird in diesem Projekt bewusst nicht verwendet. Er wäre irreführend – aus mehreren Gründen:

**Gerechtigkeit ist keine berechenbare Größe.** Gerechtigkeit im Einzelfall erfordert menschliche Urteilskraft, rechtliche Wertung, Abwägung und Verantwortung. Eine technische Komponente kann diese Leistung nicht erbringen und sollte nicht so bezeichnet werden, als ob sie es könnte.

**Der Begriff erzeugt falsche Erwartungen.** Wer eine "Gerechtigkeitsmaschine" erwartet, erwartet Ergebnisse – Urteile, Entscheidungen, Korrekturen. Die Verfahrensfairness Engine liefert keine Urteile. Sie liefert strukturierte Informationen über Verfahrensmerkmale.

**Der Begriff verschleiert Verantwortung.** Wenn eine Maschine als "gerecht" oder "ungerecht" gilt, entsteht die Suggestion, dass menschliche Entscheider von ihrer Verantwortung entlastet werden. Das Gegenteil ist das Ziel: Die Engine macht menschliche Verantwortung sichtbarer, nicht kleiner.

**Kurzformel:**

> Die Engine entscheidet nicht. Sie prüft, erklärt, vergleicht, markiert Risiken und macht Verfahren nachvollziehbarer.

---

## Rolle im Gesamtsystem

Die Verfahrensfairness Engine ist eine Querschnittskomponente. Sie ist nicht einer einzelnen Domäne zugeordnet, sondern wird von allen Domänen genutzt.

Jede Domäne – Arbeitsverwaltung, Sozialleistungen, Rechtsstreit und Bußgeld, Jugendhilfe, Unternehmensgründung – hat eigene Verfahren, Fristen, Zuständigkeiten und Dokumentationsanforderungen. Die Verfahrensfairness Engine stellt domänenübergreifend sicher, dass dieselben Grundprinzipien gelten:

- Begründungen müssen vorhanden sein.
- Fristen müssen plausibel und konsistent sein.
- Dokumentationsketten müssen vollständig sein.
- Ähnliche Fälle sollen ähnlich behandelt werden.
- Bürgerinnen und Bürger sollen Verfahren verstehen können.
- Sachbearbeitende sollen Hinweise auf mögliche Inkonsistenzen erhalten.

Die CaseMatch Engine ist ein spezialisiertes Analyse-Modul, das unterhalb der Verfahrensfairness Engine angesiedelt ist und deren Grundprinzipien auf den Bereich Rechtsstreit und Bußgeld anwendet.

Die Verfahrensfairness Engine ist keine Instanz über der Sachbearbeitung. Sie ist ein Hilfsmittel für die Sachbearbeitung und eine Informationsquelle für Bürgerinnen und Bürger.

---

## Architektonische Einordnung

Die Engine ist als Querschnittsschicht zwischen dem Process Orchestrator und den einzelnen Domänenadaptern angesiedelt. Sie empfängt strukturierte Ereignisse aus Verfahren, wertet diese gegen Prüfmuster aus und gibt Markierungen und Erklärungen zurück – ohne in den Verfahrensablauf einzugreifen.

Alle Ausgaben der Engine sind:
- erklärbar (nachvollziehbare Begründung jeder Markierung)
- anfechtbar (Sachbearbeitende und Bürger können Markierungen kommentieren oder anfechten)
- auditierbar (alle Engine-Ausgaben werden im Audit-Log gespeichert)
- ohne automatische Wirkung (keine Engine-Ausgabe führt zu einer automatischen Maßnahme)

---

## Dokumentenübersicht

| Dokument | Inhalt |
|----------|--------|
| [01_GRUNDSAETZE_UND_ABGRENZUNG.md](01_GRUNDSAETZE_UND_ABGRENZUNG.md) | Warum keine Gerechtigkeitsmaschine, Ziele, Abgrenzung |
| [02_FUNKTIONSWEISE.md](02_FUNKTIONSWEISE.md) | Funktionen, Prüfmuster, Einsatzdomänen |
| [03_SIGNALE_RISIKEN_HINWEISE.md](03_SIGNALE_RISIKEN_HINWEISE.md) | Typisierte Fairness- und Qualitätssignale |
| [04_TRANSPARENZ_UND_AUDITIERBARKEIT.md](04_TRANSPARENZ_UND_AUDITIERBARKEIT.md) | Audit-Trails, Bias-Audits, Kontrollmechanismen |
| [05_EINSATZFELDER.md](05_EINSATZFELDER.md) | Konkrete Beispiele je Domäne |
| [06_RECHTLICHE_UND_ETHISCHE_GRENZEN.md](06_RECHTLICHE_UND_ETHISCHE_GRENZEN.md) | Rechtsgrenzen, Datenschutz, ethische Grenzen |

---

*Diese Engine ist ein Bestandteil des Open State-Projekts und unterliegt denselben Prinzipien: keine automatisierten Letztentscheidungen, vollständige Erklärbarkeit, menschliche Verantwortung.*
