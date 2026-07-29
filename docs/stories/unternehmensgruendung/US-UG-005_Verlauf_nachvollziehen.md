# US-UG-005 – Verfahrensverlauf nachvollziehen

**Story-ID:** US-UG-005
**Domäne:** Unternehmensgründung
**Status:** ENTWURF
**Primäre Rolle:** Gründerin / Gründer

---

## User Story

Als Gründerin oder Gründer
möchte ich den vollständigen Verlauf meiner Gründungsakte chronologisch nachvollziehen können
damit ich sehe, wer wann was entschieden, angefordert oder bestätigt hat – und Vertrauen in den Prozess behalte.

---

## Kontext

Ohne Timeline bleiben Gründungsprozesse undurchsichtig: Wann wurde der Gewerbeschein erteilt? Wann hat das Finanzamt nachgefragt? Welche Unterlage wurde wann akzeptiert? Fehlende Nachvollziehbarkeit erzeugt Misstrauen und zusätzliche Statusanfragen. Die Verlaufsansicht ist das Audit-Log der Gründungsakte aus Bürgersicht.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Lückenlose Orientierung über den bisherigen Verlauf |
| **Verwaltungswert** | Weniger Streit über „was wurde wann gesagt“ |
| **Transparenzwert** | Jedes relevante Ereignis mit Zeitstempel und Urheber |

---

## Akzeptanzkriterien

1. Ereignisse sind chronologisch (neueste zuerst oder klar datiert) dargestellt.
2. Jedes Ereignis hat Typ/Bezeichnung, Datum und handelnde Stelle bzw. System.
3. Relevante Ereignistypen umfassen mindestens: Einreichung, Statuswechsel, Dokumentanforderung, Rückfrage, Behördenentscheidung.
4. Der Verlauf ist lesend zugänglich – Einträge sind nach Erstellung nicht manipulierbar dargestellt.
5. Ein Demo-Hinweis macht kenntlich, dass die Daten fiktiv sind.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Normalzustand | Mehrere Ereignisse vorhanden | Timeline / Ereignisliste |
| Leerzustand | Noch keine Ereignisse | Erklärender Leerzustand |
| Filter (optional) | Fokus auf Ereignistyp | Filter-Chips (falls implementiert) |

---

## Nicht-Ziele

- Kein vollständiges forensisches Behördenseiten-Audit für Dritte in dieser Story.
- Kein Export als rechtssicheres Beweismittel in der Demo-Phase.
- Keine Bearbeitung historischer Einträge durch den Gründer.

---

## Offene fachliche Fragen

- Welche Mindest-Ereignistypen sind für eine rechtskonforme Akte erforderlich?
- Sollen Zugriffe durch Behörden in der Bürgersicht sichtbar sein (Audit-Transparenz vs. Überfrachtung)?

---

## Rechtliche / Policy-Offenheit

- Unveränderlichkeit und Aufbewahrung von Audit-Logs müssen den jeweiligen Verwaltungsverfahrens- und Datenschutzregeln entsprechen.
- Protokollierung personenbezogener Zugriffe unterliegt DSGVO-Anforderungen.

---

## Relevante Screens / Komponenten

- Demo-Route `/gruendung/verlauf`
- Timeline-Komponente analog zur AV-Domäne
- Ereignisdaten aus der Gründungsakte

---

## Technische Anschlussstellen

- `GET /api/v1/gruendung/{id}/verlauf`
- Mock-Feld `timeline` / Verlaufsereignisse in `demo/data/mockGruendungsfall.ts`
- Domain-Typen für Timeline-Ereignisse in `demo/types/gruendung.ts`

---

## Verwandte Stories

- [US-UG-001] – Gründungsstatus einsehen
- [US-UG-004] – Rückfrage verstehen und beantworten
- [US-UG-006] – Nächste Schritte und Pflichten verstehen
