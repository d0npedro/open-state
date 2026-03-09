# US-AV-002 – Status einsehen

**Story-ID:** US-AV-002
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich den aktuellen Status meines Falls jederzeit in der App einsehen können
damit ich nicht anrufen muss und verstehe, was als Nächstes passiert und was ich möglicherweise selbst tun muss.

---

## Kontext

Schätzungsweise 40 bis 60 Prozent aller eingehenden Telefonkontakte bei der Bundesagentur für Arbeit sind Statusanfragen. Bürger wissen nicht, ob ihr Antrag bearbeitet wird, ob er vollständig ist, ob er feststeckt. Das ist kein Informationsbedarf, der durch mehr Personal lösbar ist – es ist ein strukturelles Transparenzdefizit. Der Bürger hat einen laufenden Vorgang, er hat ein berechtigtes Interesse an dessen Stand, und er bekommt heute keine verlässliche Antwort ohne aktiven Aufwand. Diese Story löst genau dieses Problem: Der Status ist jederzeit, verständlich und ohne Kontaktaufwand einsehbar.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Keine Warteschleife mehr. Jederzeit wissen, was passiert. Weniger Angst vor dem Unbekannten in einer schwierigen Lebenssituation. |
| **Verwaltungswert** | Deutliche Entlastung der Telefonhotlines und Servicecenter durch Reduktion von Statusanfragen. Sachbearbeitung kann sich auf fachliche Arbeit konzentrieren. |
| **Transparenzwert** | Bearbeitungsstatus und letzter Aktualisierungszeitpunkt sind für den Bürger nachvollziehbar. Kein „wir können Ihnen dazu nichts sagen" mehr. |

---

## Akzeptanzkriterien

1. Der aktuelle Status des Falls wird in Klartext angezeigt – nicht als interne Kürzel oder Verwaltungsbegriffe, sondern in vollständigen, verständlichen Sätzen (z.B. „Ihr Antrag wird geprüft. Die zuständige Sachbearbeiterin hat Ihren Fall erhalten.").
2. Der Zeitpunkt der letzten Statusaktualisierung ist sichtbar (Datum und Uhrzeit), damit der Bürger einschätzen kann, wie aktuell die Information ist.
3. Der nächste erwartete Schritt im Prozess ist erklärt: Was passiert als Nächstes? Wer ist tätig? Muss der Bürger etwas tun?
4. Offene To-dos für den Bürger – also ausstehende Dokumente, unbeantwortete Rückfragen oder nicht bestätigte Termine – werden als separate, hervorgehobene Liste angezeigt.
5. Jeder angezeigte Status enthält eine kurze Erklärung, was dieser Status konkret bedeutet (einblendbar per Tooltip oder Direktanzeige).
6. Im Zustand „Handlungsbedarf" wird ein direkter, beschrifteter Link zur konkreten Handlungsmöglichkeit angezeigt (z.B. direkter Sprung zur Dokumentenansicht oder Rückfragen-Ansicht), nicht nur ein allgemeiner Hinweis.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Normalzustand | Fall läuft, aktueller Status vorhanden | Statustext in Klarsprache, letzter Aktualisierungszeitpunkt, nächster Schritt |
| Ausstehend / Wartet | Fall angelegt, aber noch keine Sachbearbeitung begonnen | Statustext „Ihre Meldung ist eingegangen. Bearbeitung noch nicht begonnen.", Erklärung des Warteablaufs |
| Handlungsbedarf | Bürger muss etwas tun (Dokument fehlt, Rückfrage offen) | Hervorgehobene To-do-Liste mit direkten Links zur Handlung, visuelle Unterscheidung vom Normalzustand |
| Entscheidung vorbereitet | Sachbearbeitung hat Entscheidung vorbereitet, Bescheid steht aus | Statustext mit Erklärung, kein Handlungsbedarf für den Bürger, Wartehinweis |
| Abgeschlossen | Fall abgeschlossen (positiv oder negativ entschieden) | Klare Abschlussanzeige, Verweis auf Bescheid, Hinweis auf Widerspruchsmöglichkeit falls zutreffend |

---

## Nicht-Ziele

- Diese Story löst nicht die Echtzeit-Synchronisation jedes internen Bearbeitungsschritts – nur fachlich relevante Statüsänderungen werden angezeigt.
- Diese Story gibt dem Bürger keinen Einblick in interne Notizen, Prüfprotokolle oder nicht abgeschlossene Sachbearbeitungsschritte.
- Die Anzeige von Statushistorie ist Gegenstand von US-AV-007, nicht dieser Story.

---

## Offene fachliche Fragen

- Welche internen Statusübergänge in den Fachverfahren der BA/Jobcenter sollen für den Bürger sichtbar werden und welche nicht?
- Gibt es rechtliche Anforderungen an den Inhalt von Statusinformationen (Verwaltungsverfahrensrecht)?
- Wie werden Statusaktualisierungen aus dem Backend des Fachverfahrens in Echtzeit oder nahezu in Echtzeit an Open State übertragen?

---

## Rechtliche / Policy-Offenheit

- Das Auskunftsrecht des Bürgers nach § 25 VwVfG und Akteneinsichtsrecht – was ist darin abgedeckt, was geht darüber hinaus?
- Interne Prüfvermerke und vorläufige Entscheidungsempfehlungen: müssen diese sichtbar sein oder dürfen sie verborgen bleiben?

---

## Relevante Screens / Komponenten

- `FallstatusScreen`
- `StatusTextCard` (Klartext-Statusanzeige)
- `NächsterSchrittHinweis`
- `TodoListBürger` (offene Handlungsbedarfe)
- `StatusErklärungTooltip`

---

## Technische Anschlussstellen

- `GET /api/v1/cases/{id}/status` – aktueller Status und Metadaten
- `GET /api/v1/cases/{id}/todos` – offene Handlungsbedarfe des Bürgers
- `CaseStatusService` – Statuszustandsmaschine
- `FachverfahrensAdapter` – Synchronisation mit BA/Jobcenter-Backendsystemen

---

## Verwandte Stories

- [US-AV-001] – Fall anlegen (Voraussetzung)
- [US-AV-003] – Unterlagen nachreichen (wird sichtbar, wenn Handlungsbedarf vorhanden)
- [US-AV-004] – Rückfrage verstehen (wird sichtbar als offenes To-do)
- [US-AV-007] – Historie nachvollziehen (zeigt alle Statusübergänge im Zeitverlauf)
