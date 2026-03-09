# US-AV-004 – Rückfrage verstehen

**Story-ID:** US-AV-004
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich Rückfragen der Sachbearbeitung mit vollständiger Begründung, Frist und Konsequenz einsehen können
damit ich verstehe, was konkret gefordert wird, warum es gefordert wird und was passiert, wenn ich nicht rechtzeitig reagiere.

---

## Kontext

Rückfragen sind der häufigste Kontaktpunkt zwischen Sachbearbeitung und Bürger – und gleichzeitig einer der größten Frustrationsauslöser. Heute kommen Rückfragen als Brief mit Standard-Textbausteinen, die weder den konkreten Kontext erklären noch die Konsequenz einer Nichtantwort benennen. Bürger fragen zurück, versäumen Fristen oder antworten unvollständig, weil sie die Anforderung nicht verstanden haben. Jede Rückfrage muss so formuliert und angezeigt sein, dass ein Mensch ohne juristische Vorbildung sofort handeln kann.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Klares Verständnis der Anforderung ohne Rückfrage auf die Rückfrage. Keine überraschenden Konsequenzen durch nicht erkannte Fristen. |
| **Verwaltungswert** | Höhere Qualität der Rückantworten durch besseres Verständnis. Weniger Rückfragen auf Rückfragen. Reduzierung von Fristversäumnissen durch Unwissenheit. |
| **Transparenzwert** | Jede Anforderung an den Bürger ist mit einer Begründung versehen. Kein opakes „Bitte reichen Sie Dokument X ein." |

---

## Akzeptanzkriterien

1. Jede Rückfrage zeigt vier Pflichtbestandteile: (a) den konkreten Inhalt der Anforderung, (b) die Begründung (warum ist das notwendig?), (c) die Frist als konkretes Datum, (d) die Konsequenz bei Fristversäumnis in sachlicher, nicht drohender Formulierung.
2. Eine Rückfrage, die ausschließlich aus einem Standard-Textbaustein besteht ohne Konkretisierung auf den spezifischen Fall, darf nicht an den Bürger übermittelt werden – das System erzwingt eine Mindestkonkretisierung auf Sachbearbeitungsseite.
3. Zu jeder Rückfrage gibt es einen direkten Link zur Handlungsmöglichkeit: Upload eines Dokuments, Texteingabe als Erklärung oder Antrag auf Fristverlängerung.
4. Rückfragen mit einer Restfrist von weniger als drei Tagen werden visuell hervorgehoben – ohne Alarmästhetik, aber als eindeutig dringend erkennbar.
5. Jede Rückfrage trägt einen Zeitstempel: wann sie gestellt wurde und wann die Frist endet.
6. Ist eine Frist abgelaufen, zeigt das System den Zustand „Frist abgelaufen" mit einer sachlichen Erklärung, was das bedeutet und welche (begrenzte) Handlungsmöglichkeit ggf. noch besteht.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Neue Rückfrage (ungelesen) | Rückfrage ist eingegangen, noch nicht geöffnet | Benachrichtigungspunkt auf Fallübersicht, Rückfragekarte mit Markierung „Neu" |
| Rückfrage offen | Bürger hat Rückfrage gelesen, Frist läuft noch | Vollständige Rückfragekarte mit Begründung, Frist, Konsequenz, Handlungslinks |
| Frist kritisch | Restfrist unter drei Tagen | Hervorgehobene Datumsanzeige, Countdown-Text (z.B. „Noch 2 Tage") |
| Frist abgelaufen | Frist ist verstrichen ohne Antwort | Statuskarte „Frist abgelaufen", sachliche Erklärung der Situation, ggf. Hinweis auf Fristverlängerungsantrag |
| Rückfrage beantwortet | Bürger hat geantwortet, Eingang bestätigt | Statuskarte „Ihre Antwort ist eingegangen", Zeitstempel, Verweis auf Prüfstatus |

---

## Nicht-Ziele

- Diese Story regelt nicht die Eingabe einer Rückfrage durch die Sachbearbeitung – das ist Teil der Sachbearbeitungs-Stories.
- Automatische Fristverlängerungen sind kein Bestandteil dieser Story.
- Diese Story behandelt nicht die inhaltliche Bewertung der Antwort durch die Sachbearbeitung.

---

## Offene fachliche Fragen

- Welche Fristen sind gesetzlich vorgeschrieben versus intern gesetzt? Haben sie unterschiedliche Rechtsfolgen?
- Wie wird ein Fristverlängerungsantrag behandelt – automatisch oder menschlich entschieden?
- Welche Mitwirkungspflichten (§ 60 SGB I) sind relevant und wie wirken sich Fristversäumnisse rechtlich konkret aus?

---

## Rechtliche / Policy-Offenheit

- § 60 SGB I (Mitwirkungspflichten) und §§ 66–67 SGB I (Folgen fehlender Mitwirkung): Die Darstellung von Konsequenzen muss rechtlich korrekt und verhältnismäßig formuliert sein.
- Die Formulierung von Konsequenzen darf keine unzulässige Drohung oder übermäßige Einschüchterung darstellen.

---

## Relevante Screens / Komponenten

- `RückfrageCard`
- `FristCountdown`
- `HandlungsoptionenPanel`
- `FristverlängerungsantragFlow`

---

## Technische Anschlussstellen

- `GET /api/v1/cases/{id}/inquiries` – Liste aller Rückfragen mit Status
- `POST /api/v1/cases/{id}/inquiries/{inquiryId}/response` – Antwort einreichen
- `POST /api/v1/cases/{id}/inquiries/{inquiryId}/extension-request` – Fristverlängerungsantrag
- `InquiryService` – Rückfrageverwaltung
- `NotificationService` – Push/E-Mail bei neuer Rückfrage

---

## Verwandte Stories

- [US-AV-003] – Unterlagen nachreichen (häufige Antwort auf eine Rückfrage)
- [US-AV-002] – Status einsehen (offene Rückfragen erscheinen als To-do)
- [US-AV-007] – Historie nachvollziehen (Rückfragen und Antworten sind Ereignisse in der Timeline)
