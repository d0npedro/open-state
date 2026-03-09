# US-AV-006 – Bescheid verstehen

**Story-ID:** US-AV-006
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich einen Bescheid in zwei Versionen sehen können – der rechtlich korrekten Fassung und einer erklärten, verständlichen Fassung –
damit ich verstehe, was entschieden wurde, warum diese Entscheidung gefallen ist und welche Möglichkeiten ich habe, wenn ich anderer Meinung bin.

---

## Kontext

Verwaltungsbescheide sind juristische Dokumente. Sie müssen bestimmte rechtliche Pflichtbestandteile enthalten, was sie für den durchschnittlichen Bürger unlesbar macht. Die Folgen sind gravierend: Widerspruchsfristen werden versäumt, weil die Frist nicht erkannt wird. Leistungsansprüche verfallen, weil der Bürger den Bescheid nicht versteht und keine Konsequenz zieht. Berechtigte Einwände werden nicht geltend gemacht, weil niemand erklärt hat, dass das möglich wäre. Open State löst das durch ein Zwei-Schichten-Modell: Die rechtlich verbindliche Fassung bleibt vollständig erhalten. Darüber liegt eine verständliche Erklärungsschicht, die jeder lesen kann.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Vollständiges Verständnis einer staatlichen Entscheidung ohne juristische Vorbildung. Keine versäumten Fristen durch Unverständnis. |
| **Verwaltungswert** | Reduzierung unnötiger Widersprüche durch Missverständnisse. Geringere Belastung der Widerspruchsstellen durch grundlose Einwände. |
| **Transparenzwert** | Staatliche Entscheidungen sind erklärbar – was entschieden wurde, auf welcher Grundlage und mit welchen Konsequenzen. Das ist Kernbestandteil des Transparenzversprechens von Open State. |

---

## Akzeptanzkriterien

1. Der Bescheid wird in zwei klar abgegrenzten Schichten dargestellt: (a) die rechtlich verbindliche Fassung vollständig und unverändert, (b) eine Erklärungsschicht in Klarsprache, die standardmäßig aktiviert ist und ausgeblendet werden kann.
2. Die Erklärungsschicht enthält vier Pflichtbestandteile: (a) was wurde entschieden, (b) warum wurde so entschieden (in maximal drei Sätzen ohne Juristendeutsch), (c) was bedeutet das konkret für den Bürger im Alltag, (d) was kann der Bürger tun, wenn er anderer Meinung ist.
3. Die Widerspruchsfrist wird prominent angezeigt: als konkretes Datum und als Countdown in Tagen, ab dem Zeitpunkt der Zustellung des Bescheids.
4. Die Rechtsgrundlage der Entscheidung ist benannt (Paragraph und Gesetz), mit einer kurzen Erklärung in einem Satz, was diese Norm regelt.
5. Ein Button „Widerspruch einlegen" ist sichtbar, solange die Widerspruchsfrist läuft – mit einem Begleittext, der erklärt, was ein Widerspruch ist und welche Schritte folgen.
6. Der Zeitpunkt der Zustellung des Bescheids ist dokumentiert und sichtbar, weil er rechtlich relevant für den Fristbeginn ist.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Neuer Bescheid (ungelesen) | Bescheid ist in der Fallakte eingegangen, noch nicht geöffnet | Benachrichtigung, Bescheidkarte mit Markierung „Neu", Fristhinweis schon auf der Übersicht |
| Bescheid gelesen | Bürger hat Bescheid geöffnet | Zwei-Schichten-Ansicht mit Toggle, Widerspruchsfrist mit Countdown, Widerspruchsbutton aktiv |
| Widerspruchsfrist läuft | Bescheid wurde gelesen, Frist ist noch nicht abgelaufen | Countdown sichtbar, Widerspruchsbutton prominent, Erklärungsschicht aktiv |
| Widerspruch eingereicht | Bürger hat Widerspruch eingelegt | Statuskarte „Ihr Widerspruch ist eingegangen", Zeitstempel, Hinweis auf weiteren Verfahrensverlauf |
| Frist abgelaufen | Widerspruchsfrist ist verstrichen | Countdown entfernt, Widerspruchsbutton deaktiviert, sachlicher Hinweis auf mögliche Rechtsmittel (Klage) mit Hinweis auf Rechtsberatung |

---

## Nicht-Ziele

- Diese Story behandelt nicht die vollständige Widerspruchseinlegung als eigenständigen Prozess – der Button initiiert den Widerspruch, der Gesamtprozess ist eine separate Story.
- Die inhaltliche Prüfung des Widerspruchs durch die Verwaltung liegt außerhalb des Scope.
- Automatisierte Übersetzung von Bescheidtexten durch KI ohne menschliche Prüfung ist kein akzeptiertes Verfahren innerhalb dieser Story.

---

## Offene fachliche Fragen

- Wer erstellt die Erklärungsschicht: Sachbearbeitung, zentrales Redaktionsteam, KI-Assistenz mit menschlicher Prüfung?
- Wie wird sichergestellt, dass die Erklärungsschicht rechtlich korrekt ist und keine unzulässige Vereinfachung darstellt?
- Wie wird die Zustellung rechtssicher dokumentiert (De-Mail, EGVP, einfache App-Notification)?

---

## Rechtliche / Policy-Offenheit

- §§ 35 ff. VwVfG, §§ 83 ff. SGB X: Begründungspflicht und Rechtsbehelfsbelehrung als Pflichtinhalt eines Bescheids – die Erklärungsschicht darf diese nicht ersetzen, sondern nur ergänzen.
- Die rechtliche Fassung muss unverändert und vollständig zugänglich bleiben – die Erklärungsschicht darf nie die einzige zugängliche Version sein.
- Rechtliche Anforderungen an die elektronische Zustellung von Verwaltungsakten (§ 41 VwVfG, § 37 SGB X).

---

## Relevante Screens / Komponenten

- `BescheidViewer` (Zwei-Schichten-Darstellung)
- `ErklärungsSchichtOverlay`
- `WiderspruchsFristCountdown`
- `WiderspruchsButton`
- `RechtsgrundlagenHinweis`

---

## Technische Anschlussstellen

- `GET /api/v1/cases/{id}/notices/{noticeId}` – Bescheid abrufen (juristische Fassung + Erklärungsschicht)
- `GET /api/v1/cases/{id}/notices/{noticeId}/explanation` – Erklärungsschicht separat abrufbar
- `POST /api/v1/cases/{id}/notices/{noticeId}/objection` – Widerspruch initiieren
- `NoticeService` – Bescheidverwaltung
- `ExplanationLayer` – Verwaltung und Versionierung der Erklärungsschichten

---

## Verwandte Stories

- [US-AV-002] – Status einsehen (neuer Bescheid erscheint als To-do im Status)
- [US-AV-007] – Historie nachvollziehen (Bescheid und Widerspruch sind Ereignisse in der Timeline)
- [US-AV-001] – Fall anlegen (Bescheid ist das Endergebnis des durch US-AV-001 initiierten Verfahrens)
