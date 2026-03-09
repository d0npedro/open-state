# arc42 – Kapitel 10: Qualitätsanforderungen

---

## 10.1 Qualitätsbaum

Die Qualitätsziele von Open State gliedern sich in drei übergeordnete Kategorien:

```
Qualität (Open State)
├── Vertrauenswürdigkeit
│   ├── Transparenz (Audit-Log, Datenweitergabe-Protokoll)
│   ├── Nachvollziehbarkeit (Timeline, Verfahrenshistorie)
│   └── Auditierbarkeit (kryptografisch gesichert, vollständig)
├── Zugänglichkeit
│   ├── Verständlichkeit (Erklärschicht, Einfache Sprache)
│   ├── Barrierefreiheit (WCAG 2.1 AA, 12 Sprachen)
│   └── Fehlerkommunikation (keine technischen Texte, Handlungsoptionen)
└── Verlässlichkeit
    ├── Konsistenz (Verfahrensfairness Engine, gleiche Regeln)
    ├── Korrektheit (Fristen, Zuständigkeiten)
    └── Änderbarkeit (neue Domänen nach Muster aufbaubar)
```

---

## 10.2 Qualitätsszenarien

| Qualitätsziel | Szenario | Messbar durch | Story-Bezug |
|---------------|----------|---------------|-------------|
| **Verständlichkeit** | Ein Bürger ohne juristische Vorbildung öffnet einen Ablehnungsbescheid und versteht innerhalb von zwei Minuten: was entschieden wurde, warum, und welche Möglichkeiten er hat. | Nutzertest: Verständnisquote > 80 % bei Testgruppe ohne Fachkenntnis | US-AV-006 |
| **Nachvollziehbarkeit** | Ein Bürger kann sechs Monate nach Fallanlage lückenlos rekonstruieren, welche Schritte in welcher Reihenfolge von wem vorgenommen wurden. | Timeline ist vollständig: kein Schritt fehlt, alle Zeitstempel korrekt | US-AV-007 |
| **Konsistenz** | Zwei Bürger mit identischen Sachverhalten erhalten dieselbe Behandlung. Abweichungen sind explizit begründet und im Audit-Log dokumentiert. | Verfahrensfairness Engine: Inkonsistenz-Signale werden ausgelöst und protokolliert | Alle AV-Stories |
| **Transparenz (Datenweitergabe)** | Ein Bürger fragt, welche seiner Daten an welche Behörde weitergegeben wurden. Die Antwort ist vollständig und sofort in der App verfügbar. | Datenweitergabe-Protokoll lückenlos, für Bürger in verständlicher Form einsehbar | US-AV-007, Datenschutz |
| **Barrierefreiheit** | Eine blinde Nutzerin verwendet ausschließlich einen Screenreader und kann einen Fall anlegen, Dokumente einreichen und einen Bescheid einsehen, ohne auf barrierefreie Alternativen verwiesen zu werden. | WCAG 2.1 AA Konformitätsprüfung bestanden; Nutzertest mit assistiver Technologie | Alle Stories |
| **Verlässlichkeit (Fristen)** | Die angezeigte Widerspruchsfrist entspricht dem rechtlich korrekten Datum basierend auf dem dokumentierten Zustellungszeitpunkt. | Fristenberechnung korrekt und nachvollziehbar dokumentiert; keine Fehler in Grenzfällen (Feiertage, Wochenenden) | US-AV-006 |
| **Verlässlichkeit (Eingangsbestätigung)** | Nach einer Fallanlage erhält der Bürger innerhalb von 30 Sekunden eine Eingangsbestätigung mit Fallnummer – oder eine klare Fehlermeldung mit Handlungsoption. | Systemtest: Antwortzeit Fallanlage < 30 Sekunden unter normaler Last; Fallnummer korrekt generiert | US-AV-001 |
| **Änderbarkeit** | Eine neue Domäne (z.B. Wohnsitzmanagement) kann nach dem etablierten Muster der Arbeitsverwaltungs-Domäne aufgebaut werden, ohne bestehende Domänen zu beeinflussen. | Architektur-Review: neue Domäne ohne Cross-Domain-Änderungen integrierbar | Architecture ADRs |
| **Auditierbarkeit** | Jede Aktion in einem Verfahren kann technisch nachgewiesen werden – auch bei einem Rechtsstreit über den Verfahrensverlauf. | Audit-Log vollständig, kryptografisch signiert, kein Eintrag fehlt, keine Eintrag nachträglich veränderbar | US-AV-007 |
| **Fehlerkommunikation** | Bei einem technischen Fehler während der Dokumenteneinreichung sieht der Bürger eine verständliche Fehlermeldung mit konkreter Handlungsoption – kein technischer Fehlertext. | Qualitätsprüfung: alle Fehlermeldungen in Bürger-UI enthalten keine technischen Details; alle enthalten Handlungsoptionen | US-AV-003 |

---

## 10.3 Qualitätssicherungsansätze

**Akzeptanzkriterien als technische Abnahme**

Jede Story in Open State enthält nummerierte Akzeptanzkriterien. Eine Story gilt erst als DEMONSTRIERBAR, wenn alle Kriterien in der Demo prüfbar erfüllt sind. Das ist keine optionale Dokumentation – es ist die technische Abnahme.

**Verfahrensfairness Engine als laufende Konsistenzprüfung**

Die Verfahrensfairness Engine prüft kontinuierlich strukturelle Qualitätsmerkmale aller Verfahren. Inkonsistenzen, fehlende Begründungen und Fristprobleme werden als Signale ausgegeben und im Audit-Log protokolliert.

**Audit-Log als Qualitätsinstrument**

Das vollständige, kryptografisch gesicherte Audit-Log ist nicht nur ein Transparenz-, sondern auch ein Qualitätsinstrument: Es zeigt, ob das System das tut, was es tun soll – lückenlos und nachweisbar.

**Barrierefreiheits-Testing**

WCAG 2.1 AA-Prüfung als Pflicht vor jeder Story-Abnahme. Ergänzt durch manuelle Tests mit assistiven Technologien.

---

*Verweis: [08_QUERSCHNITTSKONZEPTE.md](08_QUERSCHNITTSKONZEPTE.md) – Konzeptionelle Grundlagen der Qualitätsziele*
*Verweis: [docs/stories/README.md](../../docs/stories/README.md) – Story-Status-Schema*
