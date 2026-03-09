# US-AV-005 – Termin einsehen und verstehen

**Story-ID:** US-AV-005
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich anstehende Termine in meinem Fall mit Zweck, Ort und Vorbereitungshinweisen einsehen können
damit ich vorbereitet erscheinen kann und nicht unangekündigt vor unklaren Erwartungen stehe.

---

## Kontext

Termine bei der Agentur für Arbeit oder im Jobcenter werden heute vorrangig per Post mitgeteilt. Der Brief enthält selten Informationen darüber, was in dem Termin besprochen wird, welche Unterlagen mitgebracht werden sollen und ob der Termin persönlich oder per Videokonferenz stattfindet. Bürger erscheinen unvorbereitet, was die Effizienz des Termins für beide Seiten mindert. Die digitale Termineinsicht muss nicht nur den Zeitpunkt, sondern den vollständigen Kontext transportieren.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Vorbereiteter Erscheinen, keine unerwarteten Anforderungen im Termin. Weniger Stress durch vollständige Information im Vorfeld. |
| **Verwaltungswert** | Besser vorbereitete Bürger bedeuten effizientere Termine. Weniger Folgetermine wegen fehlender Unterlagen. |
| **Transparenzwert** | Der Zweck eines staatlichen Termins ist für den Bürger verständlich erklärt – kein Termin ohne Kontext. |

---

## Akzeptanzkriterien

1. Jeder Termin zeigt den Zweck in Klarsprache an (z.B. „Erstgespräch zur Eingliederungsvereinbarung" mit einer Erklärung, was das bedeutet) – keine internen Terminbezeichnungen ohne Erklärung.
2. Mitzubringende Unterlagen sind als konkrete Liste aufgeführt, mit Erklärung, wofür jedes Dokument benötigt wird.
3. Ort und Format des Termins sind eindeutig angegeben: persönlich (mit vollständiger Adresse), telefonisch oder per Videokonferenz (mit Einwahlinfos).
4. Der Bürger sieht, ob eine Terminänderung möglich ist, und wird direkt informiert, wenn sie nicht möglich ist (mit kurzer Begründung).
5. Am Tag vor dem Termin wird eine Erinnerung als Push-Benachrichtigung oder E-Mail gesendet (sofern der Bürger dies nicht deaktiviert hat).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Termin bestätigt | Termin ist festgesetzt und wurde dem Bürger übermittelt | Terminkarte mit Datum, Uhrzeit, Zweck, Ort, Vorbereitung, Terminänderungs-Option |
| Termin ausstehend | Termin ist angekündigt, aber noch nicht final bestätigt | Terminkarte mit Hinweis „Termin wird noch bestätigt", vorläufige Zeitangabe wenn vorhanden |
| Termin morgen (Erinnerung) | Termin ist am nächsten Tag | Hervorgehobene Terminkarte, Erinnerungshinweis, erneute Vorbereitungsliste |
| Termin abgesagt | Termin wurde seitens der Behörde abgesagt | Statuskarte „Termin wurde abgesagt", Begründung falls vorhanden, Information über Nachfolgetermin falls vereinbart |
| Kein Termin vorhanden | Im Fall ist kein Termin eingetragen | Leerzustand mit kurzer Erklärung, wann ein Termin typischerweise zugeteilt wird |

---

## Nicht-Ziele

- Diese Story behandelt nicht die Buchung eines Termins durch den Bürger – Terminvereinbarung auf Initiative des Bürgers ist eine eigene Story.
- Die Story regelt nicht die Verwaltung von Terminen durch die Sachbearbeitung.
- Videokonferenz-Infrastruktur ist nicht Gegenstand dieser Story, nur die Anzeige der Einwahlinformationen.

---

## Offene fachliche Fragen

- Unter welchen Bedingungen kann ein Bürger einen zugewiesenen Termin verschieben (Rechtsgrundlage)?
- Welche Terminarten gibt es in den Fachverfahren der BA/Jobcenter und wie sollen sie in Klarsprache übersetzt werden?
- Wie werden Terminerinnerungen technisch an den Benachrichtigungsdienst übergeben?

---

## Rechtliche / Policy-Offenheit

- Erscheinungspflichten des Bürgers bei Terminen (§ 309 SGB III, § 15 SGB II) und deren Konsequenzen bei Nichterscheinen: muss die App explizit darauf hinweisen?
- Datenschutzrechtliche Anforderungen an Video-Termininfrastruktur.

---

## Relevante Screens / Komponenten

- `TerminCard`
- `VorbereitungslistePanel`
- `TerminErinnerungBanner`
- `TerminänderungsFlow`

---

## Technische Anschlussstellen

- `GET /api/v1/cases/{id}/appointments` – Termindaten
- `AppointmentService` – Terminverwaltung
- `NotificationService` – Erinnerungs-Push/-E-Mail
- `CalendarExportAdapter` – optionaler Export in Kalender-App (iCal)

---

## Verwandte Stories

- [US-AV-002] – Status einsehen (anstehende Termine erscheinen als To-do im Status)
- [US-AV-007] – Historie nachvollziehen (Termine sind Ereignisse in der Timeline)
