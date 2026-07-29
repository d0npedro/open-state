# US-UG-004 – Rückfrage verstehen und beantworten

**Story-ID:** US-UG-004
**Domäne:** Unternehmensgründung
**Status:** ENTWURF
**Primäre Rolle:** Gründerin / Gründer

---

## User Story

Als Gründerin oder Gründer
möchte ich behördliche Rückfragen in verständlicher Sprache mit Begründung, Frist und Konsequenz sehen und beantworten können
damit die Bearbeitung nicht unnötig stockt und ich weiß, was genau von mir erwartet wird.

---

## Kontext

Rückfragen – etwa zur Kleinunternehmerregelung (§ 19 UStG) oder zu Angaben im Fragebogen zur steuerlichen Erfassung – sind fachlich oft berechtigt, aber sprachlich unzugänglich. Ohne Frist und Konsequenz entstehen Verzögerungen und Unsicherheit. In Open State ist jede Rückfrage Teil der Akte: erklärbar, fristgebunden und dauerhaft nachvollziehbar.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Verständliche Frage statt Behördensprache; klarer Antwortweg |
| **Verwaltungswert** | Schnellere, vollständigere Antworten; weniger Nachfassaktionen |
| **Transparenzwert** | Begründung, Frist und Konsequenz sind fester Bestandteil der Kommunikation |

---

## Akzeptanzkriterien

1. Jede offene Rückfrage zeigt die fragende Behörde und den Bezug zum Vorgang.
2. Die Frage ist in Alltagssprache formuliert (zusätzlich oder anstelle reiner Behördensprache).
3. Begründung und/oder Rechtsgrundlage sind sichtbar.
4. Frist und Konsequenz bei Nichtbeantwortung sind dargestellt.
5. Ein Antwortweg ist in der Demo bzw. im Konzept vorgesehen (Eingabe oder Statuswechsel nach Antwort).
6. Beantwortete Rückfragen bleiben in der Historie der Akte einsehbar.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Offen | Antwort ausstehend | Hervorgehobene Karte, Frist, Handlungsbutton |
| Beantwortet | Antwort übermittelt | Status „beantwortet“, Zeitstempel |
| Überfällig | Frist abgelaufen | Warnstatus mit erklärter Konsequenz |
| Leerzustand | Keine Rückfragen | Neutraler Hinweis „Keine offenen Fragen“ |

---

## Nicht-Ziele

- Keine telefonische Beantwortung ohne Dokumentation in der Akte (Domänenprinzip).
- Keine automatische Rechtsberatung durch KI – KI höchstens als Formulierungshilfe, Entscheidung und Verantwortung bleiben beim Menschen.
- Keine endgültige steuerliche Entscheidung durch das System.

---

## Offene fachliche Fragen

- Welche Antwortformate sind für Finanzamts-Rückfragen rechtlich ausreichend (Freitext, Auswahl, Belegupload)?
- Wie werden Fristen behördlich verbindlich gesetzt und im System abgebildet?

---

## Rechtliche / Policy-Offenheit

- Steuerliche Rückfragen unterliegen besonderer Vertraulichkeit.
- Mündliche Auskünfte haben nur beratenden Charakter, solange sie nicht aktenkundig sind.

---

## Relevante Screens / Komponenten

- Demo-Route `/gruendung/rueckfragen`
- Action-Banner auf `/gruendung` bei offener Rückfrage
- Fairness-/Hinweislogik bei fristkritischen Rückfragen

---

## Technische Anschlussstellen

- `GET /api/v1/gruendung/{id}/rueckfragen`
- `POST /api/v1/gruendung/{id}/rueckfragen/{rqId}/antwort` (Konzept)
- Demo-State: `GruendungStateContext` (Antwort löst Statuswechsel aus)
- Mock-Feld `rueckfragen` in `demo/data/mockGruendungsfall.ts`

---

## Verwandte Stories

- [US-UG-001] – Gründungsstatus einsehen
- [US-UG-003] – Unterlagen nachreichen
- [US-UG-005] – Verfahrensverlauf nachvollziehen
- [US-UG-006] – Nächste Schritte und Pflichten verstehen
