# US-AV-001 – Fall anlegen

**Story-ID:** US-AV-001
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich meinen Fall nach dem Verlust meiner Beschäftigung digital anlegen können
damit ich sofort eine Fallnummer und Eingangsbestätigung erhalte und weiß, welche nächsten Schritte auf mich zukommen.

---

## Kontext

Wer seine Arbeit verliert, steht vor einem komplexen bürokratischen Prozess: Wo melde ich mich? Was muss ich mitbringen? Hat meine Meldung irgendetwas ausgelöst? Heute mündet das Fehlen klarer Eingangssignale in Anrufen, erneuten Besuchen und Unsicherheit. Die gesetzliche Pflicht zur Arbeitslosmeldung (§ 141 SGB III) setzt eine Frist von drei Tagen nach Kenntnisnahme des Endes des Beschäftigungsverhältnisses – diese Frist ist vielen Bürgern nicht bekannt. Die Fallanlage ist der erste und wichtigste Schritt: Er muss verlässlich, verständlich und sofort bestätigend sein.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Sofortige Orientierung in einer belastenden Situation: Was habe ich getan? Was kommt als Nächstes? Fallnummer als Nachweis. |
| **Verwaltungswert** | Strukturierte, vollständige Datenerfassung beim Eingang; Reduzierung von Mehrfachmeldungen und Rückfragen zum Eingangsstatus. |
| **Transparenzwert** | Der Eingang eines Vorgangs ist für den Bürger unmittelbar und nachprüfbar bestätigt – kein „Ist das angekommen?" mehr. |

---

## Akzeptanzkriterien

1. Nach Abschluss der Fallanlage wird dem Bürger eine eindeutige, systemgenerierte Fallnummer angezeigt – noch auf demselben Screen, ohne weitere Navigation.
2. Die Eingangsbestätigung enthält Datum, Uhrzeit und die zuständige Stelle (Agentur für Arbeit oder Jobcenter), systemseitig ermittelt nach Wohnort und Anspruchssituation.
3. Direkt nach der Fallanlage werden die nächsten drei Schritte in Klarsprache angezeigt (z.B. „Dokument X bis [Zeitraum] einreichen", „Termin wird zugeteilt", „Prüfung beginnt").
4. Die gesetzliche Meldefrist nach § 141 SGB III wird prominent und verständlich angezeigt, sofern sie noch nicht abgelaufen ist.
5. Fehlen Pflichtfelder beim Absenden, wird je fehlendem Feld ein konkreter, verständlicher Fehlerhinweis direkt am Feld angezeigt – kein generisches „Bitte füllen Sie alle Pflichtfelder aus".
6. Die Fallanlage ist über eID authentifiziert; ohne erfolgreiche Identifikation kann kein Fall angelegt werden. Der Fehlerfall bei fehlgeschlagener eID-Verifikation ist mit einer klaren Handlungsanweisung versehen.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Leerzustand / Start | Bürger öffnet die Fallanlage-Funktion ohne vorherige Anmeldung | Einstiegsscreen mit Erklärung des Prozesses, eID-Startbutton |
| eID-Verifizierung | NFC-Scan läuft | Animierter NFC-Rahmen, Hinweis „PIN nicht gespeichert", Fortschrittsindikator |
| Dateneingabe | Pflichtfelder zum Fall werden ausgefüllt | Strukturiertes Formular, Erklärungstexte je Feld, Validierung beim Verlassen des Feldes |
| Bestätigung ausstehend | Bürger hat abgesandt, System verarbeitet | Ladeindikator mit Hinweis „Ihr Fall wird angelegt…" – kein Spinner ohne Text |
| Fall angelegt | Fallanlage erfolgreich abgeschlossen | Fallnummer prominent, Eingangsbestätigung, Liste der nächsten Schritte, Fristenhinweis |
| Fehlerzustand | Pflichtfeld fehlt oder eID-Fehler | Inlinefehler am betroffenen Feld, bei eID-Fehler: erklärter Alternativweg |

---

## Nicht-Ziele

- Diese Story umfasst nicht die vollständige Leistungsantragsstellung (Haushaltsdaten, Einkommensverhältnisse) – das ist ein eigener Prozess.
- Die Zuweisung eines konkreten Sachbearbeiters erfolgt nicht innerhalb dieser Story.
- Diese Story regelt nicht die Bearbeitung des Falls durch die Sachbearbeitung.
- Automatisierte Anspruchsprüfung oder -einschätzung ist kein Bestandteil dieser Story.

---

## Offene fachliche Fragen

- Welche Minimalangaben sind gesetzlich für eine gültige Arbeitslosmeldung ausreichend (§ 141 SGB III)?
- Wie wird die zuständige Stelle systemseitig korrekt ermittelt (Agentur vs. Jobcenter) – welche Datenbasis, welche Schnittstelle?
- Darf die Fallnummer sofort endgültig sein oder nur vorläufig, bis eine menschliche Prüfung erfolgt ist?

---

## Rechtliche / Policy-Offenheit

- § 141 SGB III: Meldefrist und Form der Meldung – digitale Meldung als gleichwertige Form muss gesetzlich verankert sein.
- Die Zuständigkeitsermittlung (BA vs. Jobcenter) folgt komplexen Regelungen; fehlerhafte Zuweisung hat rechtliche Konsequenzen.
- eID-Pflicht bei Fallanlage: rechtlicher Rahmen für verpflichtende elektronische Identifikation noch zu prüfen.

---

## Relevante Screens / Komponenten

- `FallanlageScreen`
- `eIDVerificationFlow`
- `EingangsbestätigungCard`
- `NächsteSchritteList`
- `FristhinweisBanner`
- `InlineFieldError`

---

## Technische Anschlussstellen

- `POST /api/v1/cases` – Fallanlage, gibt Fallnummer zurück
- `GET /api/v1/jurisdiction?plz={plz}` – Zuständigkeitsermittlung
- eID-Adapter (NFC-Schnittstelle / AusweisApp2-SDK)
- `CaseService` – Fallverwaltung
- `NotificationService` – Eingangsbestätigung per Push/E-Mail

---

## Verwandte Stories

- [US-AV-002] – Status einsehen (unmittelbar folgende Story im Lebenszyklus)
- [US-AV-003] – Unterlagen nachreichen (ergibt sich aus den nächsten Schritten)
- [US-AV-007] – Historie nachvollziehen (die Fallanlage ist Ereignis 1 in der Timeline)
