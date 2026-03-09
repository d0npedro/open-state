# arc42 – Kapitel 4: Lösungsstrategie

---

Die Lösungsstrategie beschreibt die zentralen Architekturentscheidungen und erklärt, warum diese Entscheidungen getroffen wurden. Jede Entscheidung hat eine fachliche Begründung – keine ist technologischer Selbstzweck.

---

## 4.1 Warum domänenorientierte Architektur?

Verwaltungsaufgaben sind inhärent heterogen. Arbeitsverwaltung, Unternehmensgründung, Jugendhilfe, Wohnsitzmanagement, Sozialleistungen und Rechtsstreit folgen unterschiedlichen Gesetzen, unterschiedlichen Behördenstrukturen und unterschiedlichen Prozesslogiken. Eine monolithische Architektur, die alle diese Aufgaben in einem einzigen System zusammenführt, würde die Komplexität verbergen statt reduzieren.

Open State strukturiert sich deshalb in fachliche Bounded Contexts – abgegrenzte Domänen, die jeweils eine zusammenhängende Fachlichkeit vollständig abdecken. Jede Domäne hat eigene Domänenmodule, eigene Adapter zu den zuständigen Behörden und eigene Story-Sammlung. Gleichzeitig teilen alle Domänen dieselben Grundstrukturen: Fallakte, Statusmodell, Audit-Log, Erklärschicht, Verfahrensfairness Engine.

Das ermöglicht Konsistenz in den Grundprinzipien bei gleichzeitiger fachlicher Eigenständigkeit jeder Domäne.

---

## 4.2 Warum Story-driven Development?

Verwaltungssoftware neigt zu einem strukturellen Problem: Sie wird für Prozesse gebaut, nicht für Menschen. Das Ergebnis sind Systeme, die formal korrekt funktionieren, aber für die Bürger, die sie nutzen müssen, unbrauchbar oder unverständlich sind.

Story-driven Development kehrt diese Priorität um: Zuerst wird das Problem des Bürgers dokumentiert (User Story), dann werden Akzeptanzkriterien definiert, die zeigen wann das Problem gelöst ist, dann wird die Implementierung geplant.

Jede Funktion in Open State führt auf eine Story-ID zurück. Kein Feature ohne fachliche Legitimation. Das verhindert technologischen Aktivismus, reduziert Scope-Creep und schafft eine direkte Verbindung zwischen dem, was gebaut wird, und dem, wofür es gebraucht wird.

Die Story-IDs sind maschinenlesbar in der `story_registry.json` und menschenlesbar in der `TRACEABILITY_MATRIX.md` dokumentiert.

---

## 4.3 Warum die Fallakte als Grundmuster?

Verwaltungsprozesse sind inhärent fallbasiert. Jede Interaktion zwischen einem Bürger und der Verwaltung gehört zu einem Fall – und dieser Fall hat eine Geschichte, einen aktuellen Zustand, offene Punkte und beteiligte Parteien.

Die Fallakte macht diese Struktur explizit. Sie vereint alle relevanten Daten, Dokumente, Kommunikation und Ereignisse eines Vorgangs in einer strukturierten, auditfähigen Einheit. Kein Informationsverlust. Kein Parallelprozess außerhalb der Akte. Volle Auditierbarkeit jeder Änderung.

Die Fallakte ist das zentrale Transparenz-Instrument von Open State. Der Bürger sieht seine Akte. Die Sachbearbeitung sieht ihre rollenspezifische Sicht auf die Akte. Prüfinstanzen sehen das vollständige Audit-Log.

---

## 4.4 Warum ein Statusmodell?

Wenn ein Bürger nicht weiß, in welchem Zustand sein Fall ist, entsteht Unsicherheit – und Unsicherheit erzeugt Rückfragen. Schätzungen zufolge sind 40–60 % aller Kontakte zur Bundesagentur für Arbeit Statusanfragen. Das ist eine strukturelle Ineffizienz, die durch ein klares Statusmodell behebbar ist.

Das Statusmodell von Open State ist zustandsbasiert: Jeder Fall befindet sich zu jedem Zeitpunkt in einem definierten Zustand. Jeder Zustandsübergang ist mit Bedingungen verknüpft und wird im Audit-Log protokolliert. Der aktuelle Zustand, der Zeitpunkt des letzten Übergangs und der nächste erwartbare Schritt sind für den Bürger jederzeit sichtbar.

Dieses Muster gilt für alle Domänen. Ein Verfahren ohne definierten Zustand ist in Open State nicht vorgesehen.

---

## 4.5 Warum eine Erklärschicht?

Verwaltungsbescheide sind juristische Dokumente. Sie müssen bestimmte Pflichtbestandteile enthalten – Rechtsgrundlage, Begründung, Rechtsbehelfsbelehrung – und diese Pflichten erzwingen eine Sprache, die für die meisten Bürger unzugänglich ist.

Die Erklärschicht löst diesen Konflikt: Die rechtlich verbindliche Fassung bleibt vollständig und unverändert erhalten. Darüber liegt eine Erklärungsschicht in Alltagssprache, die standardmäßig aktiviert ist. Der Bürger versteht, was entschieden wurde, warum, was das im Alltag bedeutet und welche Handlungsoptionen er hat.

Die Erklärschicht ist Pflichtarchitektur in Open State: Sie gilt nicht nur für Bescheide, sondern auch für Rückfragen, Fristen und Statuszustände. Die Erklärschicht darf die juristische Fassung ergänzen, nie ersetzen.

---

## 4.6 Warum ein unveränderliches Audit-Log?

Vertrauen entsteht durch nachweisbares, konsistentes Handeln. Ein Audit-Log, das gelöscht oder verändert werden kann, ist keine Grundlage für Vertrauen – nicht für den Bürger, nicht für Prüfinstanzen, nicht für Aufsichtsstellen.

Das Audit-Log von Open State ist kryptografisch gesichert und unveränderlich. Jede Zustandsänderung, jeder Datenzugriff, jede Entscheidung wird mit Zeitstempel, Akteur und Ereignistyp protokolliert. Der Bürger kann sein eigenes Audit-Log einsehen und exportieren.

Das Audit-Log ist nicht nur Transparenzinstrument – es ist auch Schutz: für den Bürger gegen willkürliche Verwaltungshandlungen, für die Verwaltung gegen ungerechtfertigte Anschuldigungen.

---

## 4.7 Warum KI nur als Assistenz?

§ 35a VwVfG erlaubt vollautomatisierte Verwaltungsakte nur unter engen Voraussetzungen. Abseits dieser rechtlichen Grenze steht ein fundamentales Qualitätsprinzip: Verwaltungsentscheidungen betreffen Menschen in oft belastenden Situationen – Jobverlust, Leistungsanträge, Widerspruchsverfahren. Diese Entscheidungen müssen menschlicher Verantwortung unterliegen, anfechtbar sein und begründet werden.

KI in Open State ist deshalb ausschließlich Assistenz: Die Verfahrensfairness Engine prüft Konsistenz und markiert Risiken. Das CaseMatch-Modul vergleicht ähnliche Fälle. Die Erklärschicht kann KI-gestützt vorbereitet werden. In allen Fällen gilt: Die KI-Ausgabe ist eine Information, keine Entscheidung. Sie ist erklärbar, anfechtbar und von einem Menschen überprüfbar.

Diese Entscheidung kostet Automatisierungspotenzial – aber sie schafft Rechtssicherheit, Vertrauen und Würde.

---

*Verweis: [09_ARCHITEKTURENTSCHEIDUNGEN.md](09_ARCHITEKTURENTSCHEIDUNGEN.md) – ADRs zu allen wesentlichen Entscheidungen*
*Verweis: [docs/engines/verfahrensfairness/README.md](../../docs/engines/verfahrensfairness/README.md)*
*Verweis: [docs/domains/arbeitsverwaltung/04_FALLAKTE_UND_STATUSMODELL.md](../../docs/domains/arbeitsverwaltung/04_FALLAKTE_UND_STATUSMODELL.md)*
