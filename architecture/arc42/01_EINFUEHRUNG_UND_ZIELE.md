# arc42 – Kapitel 1: Einführung und Ziele

---

## 1.1 Aufgabenstellung

Open State ist ein staatlich betriebenes Digitalprojekt mit dem Ziel, Verwaltungsprozesse zu vereinfachen, transparent zu machen und für Bürgerinnen und Bürger nachvollziehbar zu gestalten. Es ist kein kommerzielles Produkt und kein Startup-Vorhaben. Es ist eine staatliche Infrastruktur – konzipiert mit denselben Anforderungen an Verlässlichkeit, Nachvollziehbarkeit und Würde, die für staatliches Handeln insgesamt gelten.

Die Aufgabe von Open State ist präzise formuliert: Bürgerinnen und Bürger sollen Behördenvorgänge digital initiieren, verfolgen, belegen und abschließen können – ohne Medienbruch, ohne Unklarheit darüber, was gerade passiert, und ohne dass ihr Mangel an juristischer oder bürokratischer Vorbildung zum Nachteil wird.

Open State ist in fachliche Domänen strukturiert: Arbeitsverwaltung, Unternehmensgründung, Sozialleistungen, Jugendhilfe, Wohnsitzmanagement, Rechtsstreit und Bußgeld. Jede Domäne bildet einen abgegrenzten Bereich staatlicher Aufgaben ab. Alle Domänen teilen dieselben Grundstrukturen: Fallakte, Statusmodell, Audit-Log, Erklärschicht.

Die Systemarchitektur – beschrieben in diesem arc42-Dokument – übersetzt diese fachliche Aufgabe in technische Strukturen, Entscheidungen und Qualitätsziele.

---

## 1.2 Fachliche Ziele

Die fachlichen Ziele von Open State sind aus den dokumentierten User Stories abgeleitet. Jede Funktion im System hat eine fachliche Legitimation in Form einer Story. Die wesentlichen fachlichen Ziele sind:

### Fallanlage mit sofortiger Eingangsbestätigung (US-AV-001)

Wer einen Fall anlegt – etwa nach Verlust der Beschäftigung – erhält sofort eine systemgenerierte Fallnummer und eine Eingangsbestätigung mit Zeitstempel und zuständiger Stelle. Das Ende des „Ist das angekommen?"-Problems ist ein konkretes fachliches Ziel, nicht eine Randnotiz.

Die gesetzliche Meldefrist (§ 141 SGB III: drei Tage nach Kenntnisnahme des Endes des Beschäftigungsverhältnisses) wird prominent und verständlich angezeigt. Pflichtfelder werden mit konkreten Fehlerhinweisen je Feld validiert. Die Fallanlage ist über eID authentifiziert.

### Statustransparenz ohne Nachfrage (US-AV-002)

Der Bürger sieht jederzeit, in welchem Zustand sein Fall ist – ohne bei der Behörde anrufen zu müssen. Schätzungen zufolge sind 40–60 % aller Kontakte zur Bundesagentur für Arbeit Statusanfragen. Open State macht diese Kontakte strukturell überflüssig: durch ein zustandsbasiertes, in Klarsprache erklärendes Statusmodell, das für jeden Fall zu jedem Zeitpunkt den aktuellen Zustand, den letzten Aktualisierungszeitpunkt und den nächsten erwartbaren Schritt anzeigt.

### Dokumenteneinreichung ohne Medienbruch (US-AV-003)

Unterlagen können direkt in der Anwendung hochgeladen werden. Der Upload-Zeitstempel und der Dokumentenstatus sind nachverfolgbar. Kein Fax, kein postalischer Umweg, kein erneutes Einreichen, weil das Dokument „nicht angekommen" ist.

### Verständliche Rückfragen mit Begründung (US-AV-004)

Rückfragen der Verwaltung erscheinen mit Begründung, Frist und Konsequenz. Der Bürger versteht, warum etwas gefragt wird, bis wann geantwortet werden muss und was passiert, wenn keine Antwort erfolgt.

### Bescheidtransparenz in zwei Sprachebenen (US-AV-006)

Bescheide werden in zwei klar getrennten Schichten dargestellt: die rechtlich verbindliche Fassung vollständig und unverändert, und eine Erklärungsschicht in Klarsprache. Die Erklärungsschicht enthält: was entschieden wurde, warum so entschieden wurde, was das im Alltag bedeutet, und was der Bürger tun kann, wenn er anderer Meinung ist. Die Widerspruchsfrist wird als konkretes Datum und als Countdown sichtbar. Der Zeitpunkt der Zustellung ist dokumentiert, weil er rechtlich relevant ist.

### Lückenlose Verfahrenshistorie (US-AV-007)

Jeder Schritt im Verfahren ist in einer unveränderlichen, zeitgestempelten Timeline dokumentiert. Bürger können jeden Schritt ihres Falls rekonstruieren – wer wann was getan hat. Das Audit-Log ist kryptografisch gesichert und für den Bürger einsehbar.

---

## 1.3 Qualitätsziele

Die folgende Tabelle nennt die wichtigsten Qualitätsziele von Open State, die Motivation dahinter und den Story-Bezug:

| Qualitätsziel | Motivation | Story-Bezug |
|---------------|------------|-------------|
| **Verständlichkeit** | Verwaltungssprache ist für die meisten Bürger unzugänglich. Bescheide, Rückfragen und Statusmeldungen müssen ohne juristische Vorbildung verständlich sein. | US-AV-006 (Bescheid), US-AV-004 (Rückfrage) |
| **Nachvollziehbarkeit** | Vertrauen entsteht durch nachweisbares Handeln. Jeder Schritt muss rekonstruierbar sein – für den Bürger, für Prüfinstanzen, für die Aufsicht. | US-AV-007 (Historie) |
| **Transparenz** | Jede Datenweitergabe, jede Zustandsänderung, jede Entscheidungsgrundlage muss dokumentiert und einsehbar sein. | US-AV-007, alle AV-Stories |
| **Konsistenz** | Gleiche Fälle werden gleich behandelt. Abweichungen sind begründet. Die Verfahrensfairness Engine macht Inkonsistenzen sichtbar. | Alle AV-Stories |
| **Barrierefreiheit** | Open State ist für alle Bürger – unabhängig von Bildungsstand, Region oder digitalem Vorwissen. WCAG 2.1 AA ist Mindeststandard. | Alle Stories |
| **Verlässlichkeit** | Fristen, Zustände und Benachrichtigungen müssen korrekt und zuverlässig sein. Eine falsche Fristanzeige hat rechtliche Konsequenzen. | US-AV-004, US-AV-005, US-AV-006 |
| **Auditierbarkeit** | Jede Aktion muss nachweisbar sein. Das Audit-Log ist kryptografisch gesichert, unveränderlich und vollständig. | US-AV-007 |
| **Änderbarkeit** | Neue Domänen sollen nach dem etablierten Muster aufgebaut werden können. Die Architektur ist domänenoffen konzipiert. | Architecture ADRs |

---

## 1.4 Stakeholder

Die folgende Tabelle nennt die wesentlichen Stakeholder von Open State, ihr Interesse am System und den Story-Bezug:

| Rolle | Interesse | Story-Bezug |
|-------|-----------|-------------|
| **Bürger (Antragsteller)** | Verständliche, zuverlässige, würdevolle digitale Verwaltung; sofortige Eingangsbestätigung; Statustransparenz; verständliche Bescheide | US-AV-001 bis US-AV-007 |
| **Sachbearbeitende** | Vollständige, strukturierte Fallakte; klare Dokumentationspflichten; Hinweise auf Inkonsistenzen durch Verfahrensfairness Engine; kein Mehraufwand durch System | Alle AV-Stories |
| **Bundesagentur für Arbeit / Jobcenter** | Korrekte Zuständigkeitsermittlung; gesetzeskonforme Prozesse (SGB III/II); reduzierte Statusanfragen; nachvollziehbare Verfahren | US-AV-001, US-AV-002 |
| **Aufsichtsstellen und Prüfinstanzen** | Vollständiges, unveränderliches Audit-Log; nachweisbare Einhaltung rechtlicher Anforderungen; DSGVO-Konformität | US-AV-007 |
| **Kommunen und föderale Stellen** | Modulare Anbindung; XÖV-Standards; klare Schnittstellendefinition; keine erzwungene Systemumstellung | Systemarchitektur gesamt |
| **Gesetzgeber / Politik** | Staatliche Unabhängigkeit; keine privaten Interessen; Transparenz über Systemfunktionen; OZG-Erfüllung | Randbedingungen |
| **Bürgerrechts- und Datenschutzorganisationen** | Zero-Knowledge-Architektur; DSGVO by Design; keine Werbefinanzierung; Audit-Transparenz | Querschnittskonzepte |
| **Entwicklerinnen und Entwickler** | Klare Architektur; Story-Traceability; nachvollziehbare ADRs; kein Feature ohne fachliche Legitimation | Alle Kapitel dieser Dokumentation |

---

*Verweis: [architecture/05_Systemarchitektur.md](../05_Systemarchitektur.md) – Technische Detaildiagramme und Gesamtarchitektur*
*Verweis: [docs/stories/README.md](../../docs/stories/README.md) – Story-System*
