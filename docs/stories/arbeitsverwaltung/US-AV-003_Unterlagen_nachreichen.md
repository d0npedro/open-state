# US-AV-003 – Unterlagen nachreichen

**Story-ID:** US-AV-003
**Domäne:** Arbeitsverwaltung
**Status:** ENTWURF
**Primäre Rolle:** Bürger

---

## User Story

Als Bürger
möchte ich angeforderte Unterlagen direkt in der App hochladen können
damit kein Postweg nötig ist, der Upload dem richtigen Fall und der richtigen Anforderung zugeordnet wird und ich weiß, ob das Dokument erfolgreich eingegangen ist.

---

## Kontext

Fehlende Dokumente sind einer der häufigsten Verzögerungsgründe in der Arbeitsverwaltung. Heute erfährt der Bürger per Brief, dass ein Dokument fehlt – oft ohne genaue Erklärung, welches Dokument, in welchem Format und bis wann. Er sendet es per Post oder Fax, erhält keine Bestätigung und weiß nicht, ob es angekommen ist und richtig zugeordnet wurde. Diese Medienbrüche kosten auf beiden Seiten Zeit und erzeugen Misstrauen. Die digitale Nachreichung muss nicht nur technisch möglich sein – sie muss den Kontext der Anforderung vollständig mitliefern.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Kein Postweg, sofortige Bestätigung, Klarheit über Anforderung und Frist. Dokument ist direkt dem richtigen Fall zugeordnet. |
| **Verwaltungswert** | Dokumente kommen digital und strukturiert an, sind direkt der richtigen Rückfrage und dem richtigen Fall zugeordnet. Kein manuelles Zuordnen, kein verlorenes Fax. |
| **Transparenzwert** | Jedes hochgeladene Dokument ist mit Zeitstempel und Prüfstatus sichtbar. Der Bürger weiß, was damit passiert ist. |

---

## Akzeptanzkriterien

1. Die Anforderung zeigt an: welches Dokument benötigt wird, warum es benötigt wird (konkrete Begründung, kein Textbaustein), bis wann es einzureichen ist (konkretes Datum, nicht „zeitnah") und in welchem Format (z.B. PDF, Foto, Scan).
2. Nach erfolgreichem Upload wird dem Bürger eine Bestätigung mit Zeitstempel angezeigt – noch auf demselben Screen, ohne Navigation.
3. Jedes hochgeladene Dokument ist in einer Liste mit Status sichtbar: „Eingegangen", „In Prüfung", „Akzeptiert" oder „Abgelehnt mit Begründung".
4. Bei falschemDateiformat (z.B. .exe statt PDF) oder überschrittener Dateigröße erscheint ein konkreter Fehlerhinweis mit Angabe des erlaubten Formats und der Maximalgröße – kein technischer Fehlercode.
5. Der Upload wird dem richtigen Fall und der richtigen Dokumentenanforderung automatisch zugeordnet; der Bürger muss keine manuelle Zuordnung vornehmen.
6. Ist ein Dokument abgelehnt worden, enthält die Ablehnung eine konkrete Begründung und die Möglichkeit, das Dokument erneut in korrekter Form einzureichen.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Anforderung anzeigen | Sachbearbeitung hat Dokument angefordert | Karte mit Dokumentenname, Begründung, Frist, Format-Anforderung, Upload-Button |
| Dokument auswählen / hochladen | Bürger wählt Datei oder macht Kamerafoto | Dateiauswahl-Dialog oder Kamera-Aufruf, Dateivorschau vor dem Absenden |
| Upload läuft | Datei wird hochgeladen | Fortschrittsbalken mit Prozentangabe, Abbrechen-Option |
| Upload bestätigt | Upload erfolgreich | Bestätigungskarte mit Zeitstempel, Dateiname, Zuordnungsbestätigung |
| Dokument in Prüfung | Sachbearbeitung prüft das Dokument | Statuskarte „Eingegangen – wird geprüft" mit letztem Aktualisierungsdatum |
| Akzeptiert | Dokument ist akzeptiert | Statuskarte „Akzeptiert" mit Zeitstempel |
| Abgelehnt | Dokument wurde abgelehnt | Statuskarte „Abgelehnt" mit Begründung und Option zum erneuten Upload |

---

## Nicht-Ziele

- Diese Story regelt nicht, welche Dokumente für welchen Antragstyp generell erforderlich sind – das ist Teil der Fallanlage (US-AV-001) und des Leistungsantrags.
- Die Story deckt nicht die interne Dokumentenverarbeitung durch die Sachbearbeitung ab.
- Automatisierte OCR-Erkennung und -Klassifikation ist ein technisches Feature, das außerhalb des Story-Scopes liegt.

---

## Offene fachliche Fragen

- Wie lange sind hochgeladene Dokumente im System gespeichert? Welche Aufbewahrungsfristen gelten?
- Können Bürger bereits hochgeladene Dokumente löschen, und wenn ja, unter welchen Bedingungen?
- Wie wird verhindert, dass Dokumente versehentlich dem falschen Fall zugeordnet werden, wenn ein Bürger mehrere laufende Fälle hat?

---

## Rechtliche / Policy-Offenheit

- Datenschutzrechtliche Anforderungen an den Upload von Ausweisdokumenten, Einkommensnachweisen und Gesundheitsinformationen (Art. 9 DSGVO).
- Anforderungen an elektronische Dokumente im Verwaltungsverfahren (§ 3a VwVfG).

---

## Relevante Screens / Komponenten

- `DokumentenAnforderungCard`
- `DocumentUploadFlow`
- `UploadProgressBar`
- `UploadBestätigungCard`
- `DokumentenStatusList`

---

## Technische Anschlussstellen

- `POST /api/v1/cases/{id}/documents` – Dokument-Upload
- `GET /api/v1/cases/{id}/document-requests` – Liste der Anforderungen mit Status
- `DocumentService` – Speicherung, Metadaten, Prüfstatus
- `StorageAdapter` – Verschlüsselte Ablage (Zero-Knowledge-kompatibel)

---

## Verwandte Stories

- [US-AV-004] – Rückfrage verstehen (Dokumentenanforderungen kommen als Rückfragen)
- [US-AV-002] – Status einsehen (ausstehende Dokumente erscheinen als To-do im Status)
- [US-AV-007] – Historie nachvollziehen (jeder Upload ist Ereignis in der Timeline)
