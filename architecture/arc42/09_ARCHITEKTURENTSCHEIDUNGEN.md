# arc42 – Kapitel 9: Architekturentscheidungen (ADRs)

---

Architecture Decision Records (ADRs) dokumentieren wesentliche Architekturentscheidungen: den Kontext, in dem sie gefallen sind, die Entscheidung selbst, und die Konsequenzen daraus. Offene und überstimmte Alternativen werden genannt, damit zukünftige Entwicklerinnen und Entwickler die Entscheidungen nachvollziehen können.

---

## ADR-001: Story-driven Development als Leitprinzip

**Status:** Akzeptiert

**Kontext:**
Verwaltungssoftware tendiert strukturell zu Feature-getriebener Entwicklung ohne klaren Nutzerbezug. Das Ergebnis sind Systeme, die formal korrekte Prozesse abbilden, aber für die Menschen, die sie nutzen müssen, unbrauchbar oder unverständlich sind. Ohne explizite Anforderung, Funktionen fachlich zu legitimieren, entsteht Scope-Creep und ein wachsender Abstand zwischen Systemmöglichkeiten und tatsächlichem Bürgerbedarf.

**Entscheidung:**
Jede Funktion in Open State braucht eine dokumentierte User Story. Keine Implementierung ohne Story-ID. Jede Story definiert das Problem, die Rolle, den Nutzen und prüfbare Akzeptanzkriterien. Die Story-IDs sind maschinenlesbar (story_registry.json) und menschenlesbar (TRACEABILITY_MATRIX.md). Sie erscheinen in Code, Commits, API-Beschreibungen und UI-Komponenten.

**Konsequenzen:**
Mehr Dokumentationsaufwand vor der Implementierung. Dafür: klare Rückverfolgbarkeit jeder Funktion auf ihren fachlichen Ursprung, nachvollziehbare Prüfbarkeit für Aufsichtsstellen, Prävention von Funktionen ohne fachliche Grundlage. Neue Entwicklerinnen und Entwickler haben immer eine klare Antwort auf die Frage „Warum gibt es diese Funktion?".

---

## ADR-002: Fallakte als Grundmuster für alle Domänen

**Status:** Akzeptiert

**Kontext:**
Verwaltungsprozesse sind inhärent fallbasiert. In bestehenden Behördensystemen sind Fallinformationen häufig über mehrere Systeme und Kanäle verteilt – Ergebnis ist Informationsverlust und fehlende Nachvollziehbarkeit. Eine domänenspezifische Datenstruktur je Domäne würde zu inkonsistenten Transparenzstandards führen.

**Entscheidung:**
Einheitliches Fallakten-Muster für alle Domänen. Jede Domäne führt eine strukturierte Akte mit Fall-ID, Status, Dokumenten, Kommunikationshistorie und Audit-Log. Das Muster ist in der Arbeitsverwaltungs-Domäne vollständig spezifiziert und dient als Referenz für alle weiteren Domänen.

**Konsequenzen:**
Konsistente Transparenz- und Auditstandards über alle Domänen. Bürger, die mehrere Domänen nutzen, finden dasselbe Grundmuster vor. Technisch: föderale Anpassung je Domäne nötig (unterschiedliche Zuständigkeiten, Fristen, Rechtsgrundlagen). Domänenübergreifende Werkzeuge (Verfahrensfairness Engine, Audit-Log-Service) können auf alle Domänen angewandt werden.

---

## ADR-003: KI ausschließlich als Assistenz, nie als Entscheider

**Status:** Akzeptiert

**Kontext:**
Vollautomatisierte Verwaltungsakte sind nach § 35a VwVfG nur unter engen Voraussetzungen zulässig. Abseits der rechtlichen Grenze steht ein fundamentales Qualitätsprinzip: Verwaltungsentscheidungen betreffen Menschen in belastenden Situationen und müssen menschlicher Verantwortung unterliegen, anfechtbar sein und begründet werden. KI-Systeme können keine menschliche Urteilsbildung ersetzen, insbesondere nicht in komplexen Einzelfallentscheidungen.

**Entscheidung:**
Kein automatisierter Verwaltungsakt. Keine KI-Letztentscheidung. KI-Ausgaben sind Informationen, Hinweise und Empfehlungen – sie sind erklärbar, anfechtbar und von einem Menschen überprüfbar. Alle KI-Ausgaben werden im Audit-Log protokolliert. Die Verfahrensfairness Engine und CaseMatch folgen diesem Prinzip ohne Ausnahme.

**Konsequenzen:**
Geringeres Automatisierungspotenzial gegenüber theoretisch möglichen vollautomatisierten Entscheidungen. Dafür: Rechtssicherheit, politische Akzeptanz, Vertrauen der Bürgerinnen und Bürger, Anfechtbarkeit aller Entscheidungen. Sachbearbeitende bleiben verantwortliche Entscheider.

---

## ADR-004: Statusmodell als Pflicht für nachvollziehbare Verfahren

**Status:** Akzeptiert

**Kontext:**
Schätzungen zufolge sind 40–60 % aller Kontakte zur Bundesagentur für Arbeit Statusanfragen: „Was passiert gerade mit meinem Fall?" Diese strukturelle Ineffizienz entsteht, weil Bürger keinen Einblick in den Zustand ihres Vorgangs haben. Ein Verfahren ohne definierten, für den Bürger sichtbaren Zustand erzeugt zwingend Unsicherheit und damit Rückfragen.

**Entscheidung:**
Zustandsbasierte Verfahrensführung mit definierten Zuständen und Übergangsbedingungen in allen Domänen. Jeder Fall befindet sich zu jedem Zeitpunkt in einem eindeutigen Zustand. Jeder Übergang ist dokumentiert. Der aktuelle Zustand, der letzte Übergangszeitpunkt und der nächste erwartbare Schritt sind für den Bürger jederzeit sichtbar.

**Konsequenzen:**
Höhere Entwicklungskomplexität durch vollständige Zustandsmodellierung je Domäne. Dafür: massiv reduzierte Statusanfragen, klare Verantwortlichkeiten je Zustand, nachvollziehbare Verfahrensführung, Grundlage für aussagekräftige Audit-Logs.

---

## ADR-005: Keine Werbefinanzierung

**Status:** Akzeptiert

**Kontext:**
Staatliche Infrastruktur darf keine kommerziellen Interessen Dritter bedienen. Werbefinanzierte Systeme optimieren für Klicks, Verweildauer und Engagement – Metriken, die mit dem Ziel staatlicher Dienste (effizient, verständlich, abschließend) unvereinbar sind. Abhängigkeit von Werbeeinnahmen schafft strukturelle Interessenkonflikte.

**Entscheidung:**
Ausschließlich staatliche Finanzierung durch direkte Mittel und fiskalische Einsparungen. API-Lizenzierung für Kommunen und andere staatliche Stellen ist möglich. Keine Werbepartner. Keine kommerzielle Datennutzung. Keine Plattformlogik.

**Konsequenzen:**
Geringere externe Einnahmen. Dafür: vollständige Unabhängigkeit von kommerziellen Interessen, keine Optimierung für falsche Metriken, politische und bürgerliche Akzeptanz als staatliche Infrastruktur.

---

## ADR-006: Erklärschicht als Pflichtarchitektur

**Status:** Akzeptiert

**Kontext:**
Verwaltungsbescheide sind juristische Dokumente mit Pflichtbestandteilen (Begründung, Rechtsgrundlage, Rechtsbehelfsbelehrung nach §§ 35 ff. VwVfG, §§ 83 ff. SGB X). Diese Pflichten erzwingen eine Sprache, die für die meisten Bürger unzugänglich ist. Die Folgen sind gravierend: versäumte Widerspruchsfristen, verfallende Ansprüche, unnötige Widersprüche aufgrund von Missverständnissen.

**Entscheidung:**
Zwei-Schichten-Darstellung für alle Bescheide, Rückfragen und relevante Statusmeldungen. Die rechtlich verbindliche Fassung bleibt vollständig und unverändert erhalten. Darüber liegt eine Erklärungsschicht in Klarsprache (standardmäßig aktiv), die erklärt: was entschieden wurde, warum, was das im Alltag bedeutet, welche Handlungsoptionen bestehen. Die Erklärschicht darf die juristische Fassung ergänzen, nie ersetzen.

**Konsequenzen:**
Höherer Redaktionsaufwand für die Erstellung und Qualitätssicherung der Erklärungsschichten. Rechtliche Prüfpflicht: die Erklärungsschicht darf keine unzulässige Vereinfachung sein. Dafür: weniger versäumte Fristen, weniger unnötige Widersprüche, höheres Verständnis staatlicher Entscheidungen, Erfüllung des Transparenzanspruchs von Open State.

---

---

## ADR-007: Drei-Schichten-Modell für Kita-Berichtsschicht

**Status:** Akzeptiert

**Kontext:**
Kindertagesbetreuung erzeugt Daten auf Einrichtungsebene (Belegung, Anwesenheit, Personal). Jugendämter brauchen aggregierte Steuerungskennzahlen. Öffentlichkeit und Gremien brauchen transparente Versorgungsberichte. Ein direkter Durchgriff auf operative Rohdaten wäre datenschutzrechtlich und kindeswohlbezogen unzulässig; vollständig öffentliche Rohdaten würden Rückschlüsse auf Einzelpersonen und Einrichtungen ermöglichen. Gleichzeitig erzeugen manuelle Excel-Lagebilder Verzögerung und Intransparenz.

**Entscheidung:**
Strikte Trennung in drei Schichten mit expliziten Freigabeübergängen:

1. **Betriebsebene** – operative Daten in der Einrichtung (personenbezogen möglich, nicht öffentlich).
2. **Steuerungsebene** – aggregierte Planungsraum-/Kommunkennzahlen für Jugendamt-Planung (kein direkter Einrichtungs-Rohdatenzugriff ohne Freigabe).
3. **Öffentlichkeitsebene** – nur freigegebene Aggregate mit Methodik, Datenstand und dokumentierten Datenlücken.

Jeder Übergang erfordert eine aktive Freigabe und ist protokollierbar. Personenbezogene Kinder- und Elterndaten verlassen die Betriebsebene nicht. Öffentliche Berichte enthalten keine einrichtungsbezogene Qualitätsbewertung.

**Alternativen erwogen:**
- Jugendamt mit Direktzugriff auf alle Einrichtungsdaten (datenschutzrechtlich und organisationspolitisch problematisch)
- Vollständig öffentliche Rohdaten (Kindeswohl- und Identifizierungsrisiko)
- Nur jährliche PDF-Berichte ohne maschinenlesbare Kennzahlen (keine laufende Steuerungstransparenz)

**Konsequenzen:**
Höherer Aufwand für Freigabe-Workflows, Aggregationsregeln und Methodikdokumentation. Dafür: Kindeswohl und Datenschutz by Design, vertrauenswürdige öffentliche Transparenz, klare Verantwortung je Schicht. Demo: `/kita` (öffentlich), `/kita/lagebild` (Steuerung). Domänendoku und DEC-004 im Decision Log bestätigen die Entscheidung.

**Bezug:** DEC-004, US-KJ-004 (Meldung freigeben), US-KJ-005/006 (Lagebild/Engpass), US-KJ-009/010 (Transparenzbericht/Zeitreihe)

---

*Verweis: [04_LOESUNGSSTRATEGIE.md](04_LOESUNGSSTRATEGIE.md) – Narrative Begründungen*
*Verweis: [docs/stories/TRACEABILITY_MATRIX.md](../../docs/stories/TRACEABILITY_MATRIX.md)*
*Verweis: [docs/DECISION_LOG.md](../../docs/DECISION_LOG.md) – DEC-004*
