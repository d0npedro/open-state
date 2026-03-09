# US-AV-007 – Historie nachvollziehen

**Story-ID:** US-AV-007
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich die vollständige Verlaufshistorie meines Falls einsehen können
damit ich jeden Schritt, jede Entscheidung, jede Kommunikation und jede Anforderung chronologisch nachvollziehen kann – ohne auf Erinnerungen angewiesen zu sein.

---

## Kontext

Ein Verwaltungsfall kann Wochen oder Monate dauern. In dieser Zeit gibt es zahlreiche Ereignisse: Fallanlage, Dokumentenanforderungen, Rückfragen, Terminzuweisungen, Statusänderungen, Bescheide. Heute gibt es für den Bürger keine Gesamtübersicht. Wer hat wann was getan? Was kam wann? Was wurde entschieden und warum? Ohne diese Übersicht ist das Vertrauen in die Verwaltung auf das Wohlwollen und die Erinnerung der Sachbearbeitung angewiesen. Eine vollständige, lückenlose, zugängliche Historie ist daher nicht nur komfortabel – sie ist das eigentliche Fundament der Nachvollziehbarkeit, die Open State verspricht.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Vollständiger Überblick über den eigenen Fall ohne Erinnerungsaufwand. Jeder Schritt ist dokumentiert und nachprüfbar. |
| **Verwaltungswert** | Weniger Rückfragen à „Was habt ihr wann gemacht?" weil der Bürger es selbst nachschauen kann. Erhöhte Rechenschaftspflicht der Sachbearbeitung durch sichtbares Audit-Log. |
| **Transparenzwert** | Staatliches Handeln ist für den Bürger vollständig nachvollziehbar: wer hat wann was entschieden, wer hat was angefordert, wann ist was eingegangen. |

---

## Akzeptanzkriterien

1. Die Timeline zeigt alle Ereignisse des Falls in chronologischer Reihenfolge (neueste zuerst oder älteste zuerst, umschaltbar), mit Datum und Uhrzeit je Ereignis.
2. Jedes Ereignis zeigt mindestens: Ereignistyp (z.B. „Dokument hochgeladen"), Zeitstempel, handelnde Stelle (Bürger / Sachbearbeitung / System) und – wo vorhanden – eine Begründung oder einen Inhalt.
3. Mindestens die folgenden zehn Ereignistypen sind in der Timeline unterscheidbar dargestellt: Fall angelegt, Dokument angefordert, Dokument eingereicht, Rückfrage gestellt, Rückfrage beantwortet, Termin zugeteilt, Status geändert, Bescheid erstellt, Bescheid zugestellt, Widerspruch eingereicht.
4. Die Timeline kann nach Ereignistyp gefiltert werden (z.B. nur Dokumente, nur Kommunikation, nur Entscheidungen).
5. Alle Ereignisse der Timeline können als PDF exportiert werden – der Export enthält Fallnummer, Zeitraum und alle angezeigten Ereignisdetails.
6. Im Leerzustand (kein Fall vorhanden oder Fall noch ohne Ereignisse) wird ein sachlicher Hinweistext angezeigt, der erklärt, wann und wie die Timeline befüllt wird.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Timeline-Ansicht (Normalzustand) | Fall hat Ereignisse, Timeline wird angezeigt | Chronologische Liste von Ereigniskarten mit Typ, Zeitstempel, Urheber, Inhalt |
| Filteransicht | Bürger filtert nach Ereignistyp | Filterpanel oberhalb der Timeline, nur gefilterte Ereignisse sichtbar, Filterreset-Option |
| Kein Fall / Keine Ereignisse | Bürger hat noch keinen Fall oder Fall ist gerade angelegt | Leerzustand mit Erklärungstext „Ihre Fallhistorie wird hier aufgebaut, sobald Ereignisse vorliegen." |
| Exportansicht | Bürger initiiert PDF-Export | Exportdialog mit Auswahl des Zeitraums und der Ereignistypen, Bestätigung, Download-Link |

---

## Nicht-Ziele

- Diese Story gibt dem Bürger keinen Einblick in interne Sachbearbeitungsvermerke, Prüfprotokolle oder systeminterne Logs, die keine fachliche Außenwirkung haben.
- Die Timeline ist kein Bearbeitungswerkzeug – der Bürger kann Ereignisse nur lesen, nicht bearbeiten oder löschen.
- Echtzeit-Synchronisation jedes internen Mikro-Schritts ist nicht das Ziel – nur fachlich relevante Ereignisse erscheinen.

---

## Offene fachliche Fragen

- Welche internen Ereignistypen sollen für den Bürger sichtbar sein und welche bleiben intern?
- Welche Datenschutzanforderungen gelten für den PDF-Export? Wie wird die Authentizität des Exports sichergestellt?
- Wie lange werden Historien-Einträge aufbewahrt – nach Abschluss des Falls, nach Ablauf der Aufbewahrungsfristen?

---

## Rechtliche / Policy-Offenheit

- Akteneinsichtsrecht des Bürgers (§ 29 VwVfG, § 25 SGB X): Was muss einsehbar sein? Was darf zurückgehalten werden?
- Datenschutzrechtliche Fragen beim PDF-Export: Authentifizierungsanforderungen, sichere Übertragung.
- Aufbewahrungspflichten und -fristen für Verwaltungsvorgänge: wie lange müssen Historieneinträge verfügbar bleiben?

---

## Relevante Screens / Komponenten

- `FallTimelineScreen`
- `TimelineEventCard`
- `TimelineFilterPanel`
- `TimelineExportFlow`
- `LeerzustandTimeline`

---

## Technische Anschlussstellen

- `GET /api/v1/cases/{id}/history` – vollständige Fallhistorie als chronologische Ereignisliste
- `GET /api/v1/cases/{id}/history?type={eventType}` – gefilterte Ereignisliste
- `POST /api/v1/cases/{id}/history/export` – Export-Request, gibt PDF-Download-Link zurück
- `AuditLogService` – Pflege und Abfrage des Audit-Logs
- `EventBus` – Einspeisung von Ereignissen aus allen beteiligten Services

---

## Verwandte Stories

- [US-AV-001] – Fall anlegen (Ereignis 1 in der Timeline)
- [US-AV-002] – Status einsehen (Timeline zeigt alle Statusübergänge)
- [US-AV-003] – Unterlagen nachreichen (Dokument-Ereignisse in der Timeline)
- [US-AV-004] – Rückfrage verstehen (Rückfrage-Ereignisse in der Timeline)
- [US-AV-005] – Termin einsehen und verstehen (Termin-Ereignisse in der Timeline)
- [US-AV-006] – Bescheid verstehen (Bescheid-Ereignisse in der Timeline)
