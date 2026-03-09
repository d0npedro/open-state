# Unternehmensgründung – Fallakte und Statusmodell

---

## 1. Die Digitale Gründungsakte

Die digitale Gründungsakte ist das zentrale Informationsobjekt der Domäne Unternehmensgründung. Sie fasst alle Informationen zu einem Gründungsvorgang an einem Ort zusammen und ist für alle berechtigten Akteure – primär die Gründerin oder der Gründer – jederzeit vollständig einsehbar.

### 1.1 Kerndaten

| Feld | Beschreibung |
|------|-------------|
| Fall-ID | Eindeutige, systemgenerierte Kennung des Vorgangs |
| Vorgangstyp | z.B. Gewerbeanmeldung, Freiberufliche Anmeldung, Betriebserweiterung |
| Rechtsform | Einzelunternehmen, GbR, UG, GmbH, etc. |
| Gewerbetyp | Klassifizierung nach WZ-Code (Wirtschaftszweig) |
| Aktenstand | Aktueller Gesamtstatus |
| Zuständiges Gewerbeamt | Mit Kontaktangaben und Sitzgemeinde |
| Zuständiges Finanzamt | Mit Kontaktangaben und Bezirk |
| Zugeordnete IHK/HWK | Sofern zutreffend |
| Gründungsdatum (geplant) | Optional, ohne verbindliche Wirkung |
| Ersteinreichung | Datum der ersten Einreichung |
| Letzte Aktualisierung | Datum der letzten Statusänderung |

### 1.2 Offene Anforderungen

Für jeden offenen Schritt im Vorgang enthält die Akte:
- Bezeichnung der Anforderung
- Anfordernde Stelle
- Frist (wenn behördlich gesetzt)
- Erklärung in Alltagssprache: was wird benötigt und warum
- Link zu Erläuterungen oder Formularen
- Status: ausstehend / eingereicht / bestätigt / abgelehnt

### 1.3 Zuständigkeiten

- Welche Stelle ist für welchen Schritt zuständig?
- Status der Zuständigkeitszuweisung (eindeutig / unklar / strittig)
- Bei Zuständigkeitswechseln: Datum, Grund, neuer Zuständiger

### 1.4 Fristen

- Alle behördlich gesetzten Fristen mit Datum und Herkunft
- System-Fristen (automatische Erinnerungen)
- Gesetzliche Fristen (automatisch berechnet, mit Rechtsgrundlage)
- Warnhinweise bei nahenden Fristen

### 1.5 Kommunikationshistorie

- Alle Nachrichten zwischen Gründer und Behörden, chronologisch
- Alle Rückfragen und deren Antworten
- Alle automatischen Systembenachrichtigungen
- Zeitstempel, Absender und Empfänger für jeden Eintrag
- Unveränderlich (Read-Only nach Erstellung)

### 1.6 Dokumente

- Liste aller hochgeladenen Dokumente mit Datum, Dateiname und Status
- Status je Dokument: hochgeladen / eingereicht / geprüft / akzeptiert / abgelehnt (mit Grund)
- Versionierung bei Neueinreichungen

### 1.7 Audit-Log

- Jede Statusänderung mit Zeitstempel und handelnder Stelle
- Alle System-Aktionen (automatische Statuswechsel, Benachrichtigungen)
- Alle Zugriffe auf die Akte durch Behörden
- Unveränderlich, kryptografisch gesichert

### 1.8 Erklärschicht für Gründer

Für jeden Schritt in der Akte kann der Gründer eine Erklärung abrufen:
- Was bedeutet dieser Schritt?
- Was muss ich jetzt tun?
- Was passiert, wenn ich nichts tue?
- An wen kann ich mich wenden?

Die Erklärschicht ist in Alltagssprache formuliert und enthält optionale Verweise auf die rechtliche Grundlage.

---

## 2. Statusmodell

Das Statusmodell beschreibt alle möglichen Zustände eines Gründungsvorgangs sowie die Bedingungen für Zustandsübergänge.

### 2.1 Zustände

| Status | Bedeutung |
|--------|-----------|
| **Entwurf** | Vorgang wurde begonnen, aber noch nicht eingereicht. Änderungen durch Gründer möglich. |
| **Eingereicht** | Vorgang wurde vollständig eingereicht. Behördliche Bearbeitung ausstehend. |
| **Angenommen** | Gewerbeamt hat Eingang bestätigt und Bearbeitung aufgenommen. |
| **Rückfrage ausstehend** | Behörde hat Rückfrage oder Anforderung gestellt. Gründer muss handeln. |
| **Rückfrage beantwortet** | Gründer hat Rückfrage beantwortet. Behörde prüft die Antwort. |
| **In Bearbeitung** | Behörde bearbeitet den Vorgang aktiv. Kein Handlungsbedarf beim Gründer. |
| **Entscheidung ausstehend** | Alle Unterlagen vollständig, Entscheidung wird getroffen. |
| **Genehmigt** | Alle Pflichtschritte abgeschlossen, Genehmigungen erteilt. |
| **Abgelehnt** | Behörde hat Antrag abgelehnt. Begründung und Widerspruchsbelehrung liegen vor. |
| **Widerspruch eingelegt** | Gründer hat Widerspruch gegen eine Entscheidung eingelegt. |
| **Widerspruch in Bearbeitung** | Widerspruch wird von der zuständigen Stelle geprüft. |
| **Aktiver Betrieb** | Gründung abgeschlossen. Betrieb aufgenommen. Akte in Archivmodus. |
| **Betrieb eingestellt** | Gewerbe abgemeldet oder Tätigkeit aufgegeben. Akte archiviert. |
| **Stillstand markiert** | Verfahrensfairness Engine hat Liegezeit-Anomalie erkannt. Prüfung läuft. |

### 2.2 Zustandsübergänge

```
Entwurf → Eingereicht
  Bedingung: Gründer hat alle Pflichtfelder ausgefüllt und Einreichung bestätigt

Eingereicht → Angenommen
  Bedingung: Behörde hat Eingangsbestätigung ausgestellt

Angenommen → Rückfrage ausstehend
  Bedingung: Behörde hat mindestens eine Rückfrage oder Anforderung gestellt

Angenommen / Rückfrage beantwortet → In Bearbeitung
  Bedingung: Alle Anforderungen vollständig, keine offenen Rückfragen

Rückfrage ausstehend → Rückfrage beantwortet
  Bedingung: Gründer hat alle offenen Rückfragen beantwortet

In Bearbeitung → Entscheidung ausstehend
  Bedingung: Behörde hat Prüfung abgeschlossen

Entscheidung ausstehend → Genehmigt
  Bedingung: Alle beteiligten Behörden haben Genehmigungen erteilt

Entscheidung ausstehend → Abgelehnt
  Bedingung: Mindestens eine beteiligte Behörde hat Antrag abgelehnt

Abgelehnt → Widerspruch eingelegt
  Bedingung: Gründer hat Widerspruch fristgerecht eingelegt

Widerspruch eingelegt → Widerspruch in Bearbeitung
  Bedingung: Zuständige Widerspruchsstelle hat Bearbeitung aufgenommen

Genehmigt → Aktiver Betrieb
  Bedingung: Gründer hat Betriebsaufnahme bestätigt

Aktiver Betrieb → Betrieb eingestellt
  Bedingung: Gewerbeabmeldung wurde eingereicht und bestätigt

Beliebiger aktiver Status → Stillstand markiert
  Bedingung: Verfahrensfairness Engine erkennt Liegezeit-Anomalie
```

---

## 3. Ereignistypen

Jede Statusänderung und jede relevante Aktion wird als typisiertes Ereignis im Audit-Log erfasst.

| Ereignistyp | Auslöser |
|------------|---------|
| `vorgang_erstellt` | Gründer initiiert Gründungsakte |
| `dokument_hochgeladen` | Gründer lädt Dokument hoch |
| `vorgang_eingereicht` | Gründer bestätigt Einreichung |
| `eingang_bestaetigt` | Behörde bestätigt Eingang |
| `rueckfrage_gestellt` | Behörde stellt dokumentierte Rückfrage |
| `rueckfrage_beantwortet` | Gründer beantwortet Rückfrage |
| `dokument_akzeptiert` | Behörde nimmt eingreichtes Dokument an |
| `dokument_abgelehnt` | Behörde lehnt Dokument ab (mit Begründung) |
| `bescheid_erteilt` | Behörde erteilt Genehmigung oder Bescheid |
| `ablehnung_erteilt` | Behörde erlässt Ablehnungsbescheid |
| `widerspruch_eingeleitet` | Gründer leitet Widerspruchsverfahren ein |
| `zustaendigkeitswechsel` | Vorgang wechselt zu anderer Stelle |
| `steuernummer_vergeben` | Finanzamt vergibt Steuernummer |
| `status_aktualisiert` | Allgemeine Statusänderung durch Behörde |
| `stillstand_markiert` | Verfahrensfairness Engine: Liegezeit-Anomalie |
| `gründungsakte_abgeschlossen` | Alle Pflichtschritte abgeschlossen |
| `betrieb_eingestellt` | Gewerbeabmeldung abgeschlossen |

---

*Die Gründungsakte ist Teil des Bürger-Datentresors und unterliegt der Zero-Knowledge-Architektur von Open State. Behörden erhalten nur die für ihren Verfahrensschritt notwendigen Datensätze.*
