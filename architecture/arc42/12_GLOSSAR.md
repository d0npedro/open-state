# arc42 – Kapitel 12: Glossar

---

Dieses Glossar definiert die zentralen Begriffe, die in der arc42-Dokumentation und im gesamten Open State-Projekt verwendet werden. Präzise Begriffe verhindern Missverständnisse zwischen Fachdomäne, Architektur und Implementierung.

---

## Akzeptanzkriterium

Ein Akzeptanzkriterium ist eine konkrete, prüfbare Bedingung, die erfüllt sein muss, damit eine User Story als abgeschlossen gilt. Akzeptanzkriterien sind nummeriert, eindeutig formuliert und aus der Perspektive des Nutzers geschrieben. Eine Story ist erst dann DEMONSTRIERBAR, wenn alle ihre Akzeptanzkriterien in der Demo nachweislich erfüllt sind. Akzeptanzkriterien sind die verbindliche technische Abnahme in Open State – keine optionale Dokumentation.

---

## Assistenzsystem

Ein Assistenzsystem ist eine technische Komponente, die Bürger oder Sachbearbeitende mit Informationen, Analysen oder Empfehlungen unterstützt, ohne selbst Entscheidungen zu treffen. In Open State sind Assistenzsysteme – insbesondere die Verfahrensfairness Engine und das CaseMatch-Modul – so ausgelegt, dass alle ihre Ausgaben erklärbar, anfechtbar und ohne automatische Wirkung auf Verwaltungsentscheidungen sind. Ein Assistenzsystem ersetzt keine menschliche Urteilsbildung.

---

## Audit-Log

Das Audit-Log ist ein unveränderliches, kryptografisch gesichertes Protokoll aller Ereignisse in einem Verwaltungsvorgang. Jeder Eintrag enthält: Ereignistyp (typisiert), Zeitstempel, Akteur, Zustand vor und nach dem Ereignis, Fallakten-Referenz. Das Audit-Log ist append-only – Einträge können weder geändert noch gelöscht werden. Es ist die technische Grundlage für Transparenz, Nachvollziehbarkeit und Auditierbarkeit in Open State. Bürger können ihr eigenes Audit-Log als PDF oder JSON exportieren.

---

## Behörden-Adapter-Layer

Der Behörden-Adapter-Layer ist die Integrationsschicht zwischen Open State und den Bestandssystemen externer Behörden. Er transformiert Daten zwischen dem internen Open State-Format und den XÖV-Standards der angebundenen Systeme (XMeld, XSozial, XGewerbeanmeldung, XKfz, EGVP). Jede angebundene Behörde hat einen eigenen Adapter. Der Layer ist so konzipiert, dass ein Ausfall eines Adapters die übrigen Adapter nicht beeinträchtigt.

---

## Bescheidtransparenz

Bescheidtransparenz bezeichnet das Prinzip, dass staatliche Entscheidungen (Bescheide) für die betroffenen Bürger vollständig verständlich sein müssen – nicht nur rechtlich formal korrekt. In Open State wird Bescheidtransparenz durch das Zwei-Schichten-Modell der Erklärschicht operationalisiert: Die rechtlich verbindliche Fassung ist vollständig und unverändert zugänglich; die Erklärungsschicht macht Inhalt, Begründung, Konsequenzen und Handlungsoptionen in Alltagssprache verständlich.

---

## Domäne (im Kontext Open State)

Eine Domäne ist ein abgegrenzter Bereich staatlicher Aufgaben, der inhaltlich zusammenhängt und fachlich eigenständig ist. Open State ist in Domänen strukturiert: Arbeitsverwaltung, Unternehmensgründung, Sozialleistungen, Jugendhilfe, Wohnsitzmanagement, Rechtsstreit und Bußgeld. Jede Domäne hat eigene Verfahrensregeln, eigene Rechtsgrundlagen, eigene Behördenanbindungen und eine eigene Story-Sammlung. Alle Domänen teilen dieselben Grundstrukturen (Fallakte, Statusmodell, Audit-Log, Erklärschicht).

---

## Domänenmodul

Ein Domänenmodul ist die technische Implementierung einer Domäne in Open State. Es enthält die fachliche Logik der Domäne: Zuständigkeitsermittlung, domänenspezifische Zustandsmodellierung, Pflichtfelder, Fristenberechnung und Behördenanbindungs-Koordination. Domänenmodule sind voneinander unabhängig – keine direkte Abhängigkeit zwischen Domänen. Querschnittsfunktionen (Audit-Log, Verfahrensfairness Engine) stehen allen Domänenmodulen über gemeinsame Dienste zur Verfügung.

---

## Erklärschicht

Die Erklärschicht ist eine Architekturkomponente, die Verwaltungssprache auf Alltagssprache abbildet. Sie erzeugt für jeden Bescheid, jede Rückfrage und relevante Statusmeldung eine zweite Darstellungsebene in verständlicher Sprache. Die Erklärschicht enthält typisierte Erklärungsblöcke: was entschieden oder gefragt wird, warum, was das im Alltag bedeutet und welche Handlungsoptionen bestehen. Die Erklärschicht darf die juristische Fassung ergänzen, aber nie ersetzen.

---

## Fallakte

Die Fallakte ist die zentrale Datenstruktur für jeden Verwaltungsvorgang in Open State. Sie vereint alle relevanten Informationen eines Falls in einer strukturierten, auditfähigen Einheit: Fall-ID, Vorgangstyp, aktueller Status, Dokumentenliste, Kommunikationshistorie, Fristen, Bearbeitungshistorie und Audit-Log-Verweis. Die Fallakte ist rollensensitiv: Bürger und Sachbearbeitung sehen jeweils die für ihre Rolle bestimmten Informationen. Personenbezogene Klardaten liegen nicht in der Fallakte selbst, sondern im Zero-Knowledge-Datentresor – die Fallakte hält nur einen Verweis.

---

## Medienbruch

Ein Medienbruch bezeichnet den Wechsel zwischen unterschiedlichen Kommunikations- oder Bearbeitungsmedien innerhalb eines Verwaltungsprozesses – z.B. wenn ein digital begonnener Antrag postalisch weitergeleitet werden muss, oder wenn Dokumente eingescannt und per Fax übermittelt werden. Medienbrüche erhöhen Bearbeitungszeit, erzeugen Fehler und senken die Nachvollziehbarkeit. Open State hat das Ziel, alle Verwaltungsprozesse ohne Medienbruch abbildbar zu machen.

---

## Once-Only-Prinzip

Das Once-Only-Prinzip besagt, dass Bürger ihre Daten dem Staat nur einmal mitteilen müssen. Bestehende Daten bei einer Behörde sollen – mit Einwilligung des Bürgers – an andere Stellen weitergeleitet werden, statt erneut abgefragt zu werden. In Open State ermöglicht der Zero-Knowledge-Datentresor die sichere Verwaltung dieser Daten. Jede Datenweitergabe wird protokolliert und ist für den Bürger einsehbar.

---

## Statusmodell

Das Statusmodell ist eine Zustandsmaschine, die für jeden Verwaltungsvorgang in Open State definierten Zustände und erlaubte Übergänge zwischen diesen Zuständen festlegt. Jeder Fall befindet sich zu jedem Zeitpunkt in genau einem Zustand. Übergänge sind mit Bedingungen, auslösenden Akteuren und Protokollierungsanforderungen verknüpft. Das Statusmodell ist das technische Fundament für Statustransparenz: Der aktuelle Zustand, der letzte Übergangszeitpunkt und der nächste erwartbare Schritt sind für den Bürger jederzeit sichtbar.

---

## Story-ID

Eine Story-ID ist ein eindeutiger Bezeichner für eine User Story im Format `US-[DOMÄNE]-[NNN]` (Beispiel: `US-AV-001`). Story-IDs erscheinen in Story-Dateien, der TRACEABILITY_MATRIX, der story_registry.json, Code-Kommentaren, Commit-Messages, API-Beschreibungen und UI-Komponenten. Sie sind das zentrale Traceability-Instrument in Open State: Sie verbinden fachliche Anforderungen mit technischen Implementierungen.

---

## Story-Traceability

Story-Traceability ist das Prinzip, dass jede implementierte Funktion auf eine dokumentierte User Story zurückführbar ist. In Open State ist Traceability technisch verankert: Die story_registry.json ist maschinenlesbar, die TRACEABILITY_MATRIX ist menschenlesbar. Story-IDs erscheinen in Code, Commits und API-Beschreibungen. Eine Funktion ohne Story-ID gilt als unvollständig dokumentiert.

---

## User Story

Eine User Story ist eine kurze, aus der Nutzerperspektive formulierte Beschreibung einer gewünschten Funktion. Das Format ist: „Als [Rolle] möchte ich [Funktion], damit [Nutzen]." In Open State enthält jede User Story zusätzlich: Kontext (warum existiert das Problem?), Nutzen (für Bürger, Verwaltung und Transparenz), nummerierte Akzeptanzkriterien, UI-Zustände, Nicht-Ziele, offene fachliche Fragen und technische Anschlussstellen.

---

## Verfahrensfairness Engine

Die Verfahrensfairness Engine ist eine domänenübergreifende Querschnittskomponente in Open State. Sie prüft Verwaltungsvorgänge auf strukturelle Qualitätsmerkmale: Konsistenz ähnlicher Fälle, Vollständigkeit von Begründungen, Plausibilität von Fristen, Vollständigkeit von Dokumentationsketten. Sie analysiert, vergleicht, erklärt und markiert – sie entscheidet nicht. Alle Ausgaben der Engine sind erklärbar, anfechtbar, auditierbar und ohne automatische Wirkung auf Verwaltungsentscheidungen. Der Begriff „Gerechtigkeitsmaschine" wird für diese Komponente bewusst nicht verwendet.

---

## Verfahrensstillstand

Ein Verfahrensstillstand bezeichnet einen Zustand, in dem ein Verwaltungsvorgang nicht weiterbearbeitet wird, ohne dass der Bürger informiert wird oder einen Grund kennt. Verfahrensstillstände entstehen häufig durch fehlende Dokumentation, ungeklärte Zuständigkeiten oder nicht beantwortete Rückfragen. In Open State ist jeder Stillstand im Statusmodell als expliziter Zustand (`BLOCKIERT`) abgebildet – mit dokumentiertem Blockierungsgrund und sichtbarer Information für den Bürger.

---

## Zero-Knowledge-Architektur

Zero-Knowledge-Architektur bezeichnet ein Designprinzip, bei dem ein System-Betreiber keinen Klartext-Zugang zu den verschlüsselten Daten der Nutzer hat. In Open State gilt dieses Prinzip für den Bürger-Datentresor: Die Plattform speichert Daten ausschließlich in verschlüsselter Form. Der kryptografische Schlüssel liegt beim Bürger. Ohne Mitwirkung des Bürgers kann niemand – auch kein Open-State-Administrator – die Datentresor-Inhalte lesen.

---

## Zustandsübergang

Ein Zustandsübergang ist der Wechsel eines Verwaltungsvorgangs von einem definierten Zustand in einen anderen innerhalb des Statusmodells. Jeder Übergang hat Vorbedingungen (welche Daten müssen vorliegen?), einen auslösenden Akteur (Bürger, Sachbearbeitung, System, Behörden-Adapter) und eine Protokollierungsanforderung (Audit-Event). Zustandsübergänge sind das primäre Transparenz-Ereignis in Open State: Sie zeigen dem Bürger, dass sein Verfahren voranschreitet.

---

*Verweis: [01_EINFUEHRUNG_UND_ZIELE.md](01_EINFUEHRUNG_UND_ZIELE.md) – Qualitätsziele und Stakeholder*
*Verweis: [docs/stories/README.md](../../docs/stories/README.md) – Story-System vollständig erklärt*
*Verweis: [docs/engines/verfahrensfairness/README.md](../../docs/engines/verfahrensfairness/README.md) – Verfahrensfairness Engine*
