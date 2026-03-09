# 04 – Fallakte und Statusmodell: Arbeitsverwaltung

---

## 1. Konzept der digitalen Fallakte

Die digitale Fallakte ist das zentrale Informationsobjekt der Arbeitsverwaltungs-Domäne. Sie vereint alle relevanten Daten, Dokumente, Kommunikation und Ereignisse eines Vorgangs in einer strukturierten, auditfähigen Einheit.

**Grundprinzipien:**
- Kein Informationsverlust: Jeder Kanal (digital, postalisch, persönlich) wird in die Akte überführt
- Kein Parallelprozess außerhalb der Akte
- Volle Auditierbarkeit: Jede Änderung ist zeitgestempelt, mit Akteur versehen und unveränderlich protokolliert
- Rollensensitive Ansicht: Bürger und Sachbearbeitung sehen jeweils das, was für ihre Rolle bestimmt ist

---

## 2. Fallstruktur (konzeptionell)

```
DIGITALE FALLAKTE – Arbeitsverwaltung
════════════════════════════════════════════════════════════════════

IDENTIFIKATION
  Fall-ID:              AV-[UUID]
  Vorgangstyp:          [Arbeitslosmeldung | Leistungsantrag | Vermittlung |
                         Änderungsmitteilung | Widerspruch | Sonstige]
  Anlage-Zeitpunkt:     [ISO 8601 Zeitstempel]
  Zuständige Stelle:    [Institution, Standort]
  Aktueller Bearbeiter: [Rolle + anonymisierter Bezeichner für Bürger-Ansicht]

PERSON
  Personen-Ref:         [Verweis auf Datentresor-Eintrag, nicht in Akte gespeichert]
  Haushaltsbezug:       [Optional: Haushaltsgröße, relevante Dritte mit Einwilligung]
  Bevollmächtigte:      [Vollmachtenregister-Verweis]

AKTUELLER STATUS
  Status:               [Enum – siehe Statusmodell unten]
  Seit:                 [Zeitstempel]
  Nächster Schritt:     [Text + erwartbarer Zeitraum]
  Blockierende Punkte:  [Liste: was hält den Fall auf?]

CHECKLISTE / OFFENE PUNKTE
  Dokumente:            [Liste mit Status je Dokument: ausstehend / eingegangen /
                         geprüft / abgelehnt]
  Rückfragen:           [Liste offener Rückfragen mit Frist und Status]
  Mitwirkungspflichten: [Liste mit Frist und Erfüllungsstatus]

FRISTEN
  Erstmeldungsfrist:    [Datum]
  Antragsfrist:         [Datum]
  Dokumentenfristen:    [Je Dokument]
  Bescheidsfristen:     [Widerspruchsfrist nach Bescheid]
  Nächste Wiedervorlage:[Datum + Begründung]

DOKUMENTE
  Dokument-Liste:       [ID | Typ | Eingangsdatum | Status | Klassifikation]

KOMMUNIKATIONSHISTORIE
  Einträge:             [Zeitstempel | Kanal | Richtung | Inhalt-Ref | Akteur]

BEARBEITUNGSHISTORIE
  Ereignis-Log:         [Vollständige Event-Liste, chronologisch, unveränderlich]

ENTSCHEIDUNGEN
  Entscheidungs-Liste:  [Datum | Typ | Grundlage | Entscheider | Bescheid-Ref]

ESKALATION
  Eskaliert:            [Boolean]
  Eskalationsgrund:     [Text]
  Eskalations-Zeitpunkt:[Zeitstempel]
  Bestätigt durch:      [Teamleitung – Rolle]

PRIORITÄT
  Systemvorschlag:      [niedrig | mittel | hoch | kritisch]
  Manuelle Überschreibung: [Zeitstempel + Begründung + Akteur]

AUDIT-LOG
  → Vollständiges, unveränderliches Protokoll aller Zugriffe und Änderungen
════════════════════════════════════════════════════════════════════
```

---

## 3. Statusmodell

### 3.1 Statuszustände

```
                    ┌─────────────────────┐
                    │   FALL_ANGELEGT     │  ← Initialer Zustand
                    └──────────┬──────────┘
                               │
              ┌────────────────▼────────────────┐
              │   IDENTITAET_AUSSTEHEND         │  ← eID noch nicht verifiziert
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │   UNTERLAGEN_ANGEFORDERT        │  ← Dokumente ausstehend
              └────────────────┬────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │           PRUEFUNG_LAEUFT                   │  ← Sachbearbeitung aktiv
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │           RUECKFRAGE_GESTELLT               │  ← Warten auf Bürger
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │           RUECKFRAGE_BEANTWORTET            │  ← Bürger hat geantwortet
        └──────────────────────┬──────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │           ENTSCHEIDUNG_VORBEREITET          │  ← Prüfprotokoll fertig
        └──────────────────────┬──────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │     BESCHEID_ERTEILT            │  ← Bescheid zugestellt
              └────────────────┬────────────────┘
                               │
   ┌───────────────────────────┼───────────────────────────┐
   │                           │                           │
┌──▼──────────────┐   ┌────────▼────────────┐   ┌─────────▼───────────┐
│ WIDERSPRUCH_    │   │  FALL_ABGESCHLOSSEN  │   │  WEITERLEITUNG_     │
│ EINGEGANGEN     │   │  (regulär)           │   │  ERFOLGT            │
└──────────────── ┘   └─────────────────────┘   └─────────────────────┘

Querschnittsstatus (jederzeit möglich):
┌────────────────────────────────────────────────────────────┐
│ FALL_PAUSIERT_MIT_BEGRUENDUNG                              │
│ ESKALIERT                                                  │
│ FRIST_VERPASST                                             │
└────────────────────────────────────────────────────────────┘
```

### 3.2 Statusbeschreibungen (für Bürger-Ansicht)

| Status | Bürger-Text | Erklärung |
|--------|------------|-----------|
| FALL_ANGELEGT | „Ihr Vorgang ist registriert." | Fallakte wurde erstellt, noch keine Bearbeitung |
| IDENTITAET_AUSSTEHEND | „Ihre Identität wird noch geprüft." | eID-Verifikation ausstehend |
| UNTERLAGEN_ANGEFORDERT | „Wir warten auf Ihre Unterlagen." | Dokumente fehlen noch |
| PRUEFUNG_LAEUFT | „Ihr Vorgang wird bearbeitet." | Sachbearbeitung ist aktiv |
| RUECKFRAGE_GESTELLT | „Wir haben eine Frage an Sie." | Rückfrage mit Frist offen |
| RUECKFRAGE_BEANTWORTET | „Ihre Antwort ist eingegangen." | Sachbearbeitung wird fortgesetzt |
| ENTSCHEIDUNG_VORBEREITET | „Eine Entscheidung wird vorbereitet." | Prüfung abgeschlossen, Bescheid in Vorbereitung |
| BESCHEID_ERTEILT | „Ihr Bescheid liegt vor." | Bitte Bescheid öffnen und Frist beachten |
| WIDERSPRUCH_EINGEGANGEN | „Ihr Widerspruch ist eingegangen." | Widerspruch wird geprüft |
| FALL_ABGESCHLOSSEN | „Ihr Vorgang ist abgeschlossen." | Keine weiteren Schritte offen |
| FALL_PAUSIERT_MIT_BEGRUENDUNG | „Ihr Vorgang ist vorübergehend pausiert." | Grund und voraussichtliche Dauer werden angezeigt |
| ESKALIERT | „Ihr Fall wurde als dringend eingestuft." | Prioritätsbehandlung wurde angeordnet |
| FRIST_VERPASST | „Eine Frist wurde nicht eingehalten." | Details und nächste Schritte sind sichtbar |

---

## 4. Ereignistypen (Event-Log)

Alle Ereignisse werden unveränderlich im Audit-Log gespeichert. Jedes Ereignis enthält:
- `event_id` (UUID)
- `event_type` (Enum, s.u.)
- `timestamp` (ISO 8601)
- `actor_role` (Bürger / Sachbearbeitung / System / Teamleitung)
- `actor_id` (pseudonymisiert in Bürger-Ansicht)
- `related_entity` (Dokument-ID / Rückfrage-ID / Bescheid-ID)
- `explanation` (menschenlesbarer Erklärungstext)

### Vollständige Ereignis-Liste

| Event-Typ | Bedeutung | Warum wichtig |
|-----------|-----------|---------------|
| `case_created` | Fallakte wurde angelegt | Startpunkt, setzt Zeitstempel für alle Folgefristen |
| `identity_pending` | eID-Verifikation ausstehend | Nachvollziehbarkeit, warum Fall noch nicht läuft |
| `identity_verified` | eID-Verifikation erfolgreich | Basis für alle weiteren Prüfungen |
| `documents_requested` | Dokumente wurden angefordert | Frist beginnt zu laufen |
| `document_received` | Einzelnes Dokument eingegangen | Checklistenstatus aktualisiert |
| `document_classified` | Dokument durch Sachbearbeitung klassifiziert | Qualitätssicherung |
| `document_rejected` | Dokument nicht akzeptiert (mit Begründung) | Bürger muss wissen, warum |
| `review_started` | Sachbearbeitung hat begonnen | Bürger weiß, dass etwas passiert |
| `review_paused` | Prüfung unterbrochen (mit Begründung) | Transparenz bei Stillstand |
| `clarification_requested` | Rückfrage gestellt (Typ + Frist) | Mitwirkungspflicht beginnt |
| `clarification_received` | Antwort eingegangen | Sachbearbeitung informiert |
| `clarification_timed_out` | Rückfrage-Frist abgelaufen | Protokoll des Mitwirkungsversagens |
| `decision_prepared` | Entscheidungsvorbereitung abgeschlossen | Prüfprotokoll gespeichert |
| `decision_issued` | Bescheid erteilt | Rechtlich relevanter Zeitstempel |
| `decision_delivered` | Bescheid zugestellt (digital oder postalisch) | Widerspruchsfrist beginnt |
| `appeal_filed` | Widerspruch eingereicht | Neuer Prozessast |
| `case_transferred` | Fall an andere Stelle übertragen (mit Grund) | Keine Blackbox bei Zuständigkeitswechsel |
| `case_paused_with_reason` | Pause mit dokumentierter Begründung | Verhinderung von unbegründetem Stillstand |
| `case_closed` | Fall regulär abgeschlossen | Ende des Vorgangs |
| `escalation_flagged` | Eskalation markiert | Priorisierungsanlass |
| `escalation_confirmed` | Eskalation bestätigt durch Teamleitung | Menschliche Kontrolle |
| `escalation_lifted` | Eskalation aufgehoben (mit Begründung) | Nachvollziehbarkeit |
| `deadline_missed` | Frist verpasst – intern oder Bürger | Protokoll für Folgeentscheidungen |
| `appointment_scheduled` | Termin vereinbart (Datum, Ort/digital) | Koordination |
| `appointment_completed` | Termin abgehalten | Gesprächsnotiz verknüpft |
| `appointment_cancelled` | Termin abgesagt (Partei + Grund) | Nachvollziehbarkeit |
| `priority_changed` | Priorität manuell geändert (Begründung) | Audit der Priorisierungsentscheidung |
| `data_accessed` | Datenzugriff durch externen Akteur (mit Rechtsgrundlage) | DSGVO-Pflicht |

### Warum diese Events für Transparenz und Verwaltungsqualität wichtig sind

**Für Bürger:**
- Jedes Ereignis kann in verständlicher Sprache angezeigt werden
- Kein Informationsmonopol der Verwaltung
- Nachweisbare Fristen und Handlungszeitpunkte

**Für Sachbearbeitung:**
- Vollständige Fallhistorie ohne Nachfragen
- Lückenlose Übergabe bei Zuständigkeitswechsel
- Basis für Qualitätsauswertung ohne Datenschutzverstoß

**Für Aufsicht und Kontrolle:**
- Lückenloser Audit-Trail
- Prüfung durch Bundesrechnungshof und Datenschutzbehörden ohne Systemeingriff
- Erkennung systematischer Muster (z.B. zu hohe Rückfragequote in bestimmten Bereichen)

---

## 5. Dokumentenstatus-Modell

| Status | Bedeutung | Anzeige für Bürger |
|--------|-----------|-------------------|
| `ANGEFORDERT` | Dokument wurde angefordert | „Dieses Dokument fehlt noch" |
| `HOCHGELADEN` | Bürger hat Datei eingereicht | „Eingegangen, wird geprüft" |
| `IN_PRUEFUNG` | Sachbearbeitung prüft | „Wird derzeit geprüft" |
| `AKZEPTIERT` | Dokument wurde anerkannt | „Anerkannt" |
| `ABGELEHNT` | Dokument nicht akzeptiert | „Nicht ausreichend – Begründung: [...]" |
| `NACHREICHUNG_NOETIG` | Dokument unvollständig | „Bitte ergänzen: [...]" |

---

*Weiter: [05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md](05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md)*
