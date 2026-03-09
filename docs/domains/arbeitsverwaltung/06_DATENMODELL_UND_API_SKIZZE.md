# 06 – Datenmodell und API-Skizze: Arbeitsverwaltung

> **Hinweis:** Diese Datei beschreibt ein konzeptionelles Datenmodell. Es ist kein finales technisches Spezifikationsdokument. Alle Entitäten, Felder und API-Pfade sind als Ausgangsbasis für Implementierungsarbeiten zu verstehen und unterliegen rechtlicher, datenschutzrechtlicher und fachtechnischer Prüfung.

---

## 1. Kernentitäten

### 1.1 Case (Fallakte)

```
Case {
  id:                  UUID                    // primärer Identifikator
  case_type:           Enum                    // ARBEITSLOSENMELDUNG | LEISTUNGSANTRAG |
                                               // AENDERUNGSMITTEILUNG | WIDERSPRUCH | ...
  status:              Enum                    // siehe Statusmodell
  status_since:        Timestamp
  priority:            Enum                    // LOW | MEDIUM | HIGH | CRITICAL
  priority_source:     Enum                    // SYSTEM | MANUAL
  priority_reason:     String?                 // bei manueller Überschreibung
  person_ref:          UUID                    // Verweis auf Datentresor (kein Direktzugriff)
  responsible_unit:    OrganizationalUnit
  responsible_person:  StaffMember (pseudonym)
  created_at:          Timestamp
  updated_at:          Timestamp
  closed_at:           Timestamp?
  escalated:           Boolean
  escalation_reason:   String?
  next_action:         String                  // Bürger-verständlicher Hinweis
  next_deadline:       Timestamp?
}
```

### 1.2 CaseDocument (Fallakte-Dokument)

```
CaseDocument {
  id:                  UUID
  case_id:             UUID                    // Verweis auf Case
  document_type:       Enum                    // ARBEITSBESCHEINIGUNG | KONTOAUSZUG |
                                               // PERSONALAUSWEIS | MIETVERTRAG | ...
  label:               String                  // Anzeigename für Bürger
  required:            Boolean
  required_reason:     String                  // Warum wird dieses Dokument benötigt?
  status:              Enum                    // ANGEFORDERT | HOCHGELADEN | IN_PRUEFUNG |
                                               // AKZEPTIERT | ABGELEHNT | NACHREICHUNG_NOETIG
  rejection_reason:    String?                 // Bei ABGELEHNT: Begründung
  uploaded_at:         Timestamp?
  reviewed_at:         Timestamp?
  deadline:            Timestamp?
  file_ref:            UUID                    // Verweis auf Datentresor-Objekt
}
```

### 1.3 Clarification (Rückfrage)

```
Clarification {
  id:                  UUID
  case_id:             UUID
  type:                Enum                    // DOCUMENT_REQUEST | INFORMATION_REQUEST |
                                               // CORRECTION_REQUEST
  title:               String                  // Kurztitel für Bürger-Ansicht
  description:         String                  // Vollständige Erklärung in klarer Sprache
  legal_basis:         String?                 // Rechtsgrundlage (§ und Gesetz)
  consequence:         String                  // Was passiert bei Nicht-Erfüllung?
  deadline:            Timestamp
  status:              Enum                    // OPEN | ANSWERED | TIMED_OUT | WITHDRAWN
  created_by:          StaffMember (pseudonym)
  created_at:          Timestamp
  answered_at:         Timestamp?
  answer_document_ids: [UUID]                 // Verweise auf eingereichte Dokumente
  answer_note:         String?                // Erläuterung des Bürgers
}
```

### 1.4 Decision (Entscheidung)

```
Decision {
  id:                  UUID
  case_id:             UUID
  decision_type:       Enum                    // GRANT | PARTIAL_GRANT | DENY | SUSPEND |
                                               // REFER | REVOKE
  summary_citizen:     String                  // Verständliche Zusammenfassung für Bürger
  summary_legal:       String                  // Formeller Bescheidtext
  legal_grounds:       [LegalGround]          // Liste angewendeter Normen
  decision_factors:    [DecisionFactor]       // Geprüfte Kriterien mit Ergebnis
  decided_by:          StaffMember (pseudonym)
  decided_at:          Timestamp
  delivered_at:        Timestamp?
  appeal_deadline:     Timestamp?
  notice_ref:          UUID                    // Verweis auf Bescheid-Dokument
}

LegalGround {
  statute:             String                  // z.B. "SGB III"
  section:             String                  // z.B. "§ 137"
  description:         String                  // Erklärung in Alltagssprache
}

DecisionFactor {
  factor_name:         String                  // z.B. "Anwartschaftszeit"
  assessed_value:      String                  // z.B. "12 Monate beitragspflichtig"
  required_value:      String                  // z.B. "Mindestens 12 Monate"
  outcome:             Enum                    // MET | NOT_MET | PARTIAL
}
```

### 1.5 CaseEvent (Audit-Log-Eintrag)

```
CaseEvent {
  id:                  UUID
  case_id:             UUID
  event_type:          Enum                    // Vollständige Liste in 04_FALLAKTE
  timestamp:           Timestamp
  actor_role:          Enum                    // CITIZEN | STAFF | SYSTEM | MANAGEMENT
  actor_id:            UUID (pseudonymisiert)
  related_entity_type: String?                // "document" | "clarification" | "decision"
  related_entity_id:   UUID?
  explanation:         String                  // Menschenlesbarer Text
  is_visible_to_citizen: Boolean              // Steuerung Bürger-Sichtbarkeit
  signature:           String                  // Kryptografische Signatur
}
```

### 1.6 Appointment (Termin)

```
Appointment {
  id:                  UUID
  case_id:             UUID
  type:                Enum                    // IN_PERSON | VIDEO | PHONE
  scheduled_at:        Timestamp
  duration_minutes:    Integer
  location:            String?                // Bei IN_PERSON
  video_link:          URL?                   // Bei VIDEO
  status:              Enum                    // SCHEDULED | COMPLETED | CANCELLED
  cancelled_by:        Enum?                  // CITIZEN | STAFF
  cancellation_reason: String?
  notes_ref:           UUID?                  // Verweis auf Gesprächsnotiz
}
```

---

## 2. Entitäten-Beziehungsübersicht

```
                    ┌──────────────┐
                    │     Case     │ ─────────────── 1:n ────→ CaseEvent
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┬──────────────┐
            │              │              │              │
            ▼              ▼              ▼              ▼
     CaseDocument    Clarification    Decision      Appointment
          │                │              │
          ▼                ▼              ▼
    Datentresor      CaseDocument     Notice-PDF
    (file_ref)       (answer)         (Bescheid)
```

---

## 3. API-Skizze (konzeptionell)

### 3.1 API-Prinzipien

- RESTful, JSON
- OAuth2 mit rollenbasiertem Scope-System
- Alle schreibenden Operationen erfordern explizite Authentifizierung
- Alle Antworten enthalten Datenschutz-Header (welche Rechtsgrundlage gilt für diese Abfrage)
- Rate-Limiting je Scope und Akteur
- Alle API-Calls werden auditiert

### 3.2 Bürger-API (Scope: `citizen:case:read`, `citizen:case:write`)

```
GET    /cases                           // Alle Fälle des authentifizierten Bürgers
GET    /cases/{case_id}                 // Detailansicht eines Falls
GET    /cases/{case_id}/events          // Chronologischer Ereignisverlauf
GET    /cases/{case_id}/documents       // Dokumentenstatus
POST   /cases/{case_id}/documents      // Dokument hochladen
GET    /cases/{case_id}/clarifications  // Rückfragen
POST   /cases/{case_id}/clarifications/{id}/respond  // Auf Rückfrage antworten
GET    /cases/{case_id}/decisions       // Bescheide
POST   /cases/{case_id}/appeals        // Widerspruch einlegen
GET    /cases/{case_id}/appointments   // Termine
POST   /cases/{case_id}/appointments/request  // Termin anfragen
GET    /cases/{case_id}/audit-log      // Eigener Datenzugriffs-Log
GET    /data-export                     // Vollständiger Datentresor-Export
```

### 3.3 Sachbearbeitungs-API (Scope: `staff:case:read`, `staff:case:write`)

```
GET    /staff/cases                     // Alle zugewiesenen Fälle (mit Filterung)
GET    /staff/cases/{case_id}           // Vollständige Fallansicht
PATCH  /staff/cases/{case_id}/status   // Statusänderung (erfordert Begründung)
PATCH  /staff/cases/{case_id}/priority // Prioritätsänderung (erfordert Begründung)
POST   /staff/cases/{case_id}/clarifications   // Rückfrage stellen
POST   /staff/cases/{case_id}/decisions        // Entscheidung erfassen
POST   /staff/cases/{case_id}/transfer         // Fall übertragen
POST   /staff/cases/{case_id}/escalate         // Eskalation markieren
POST   /staff/cases/{case_id}/appointments     // Termin vereinbaren
GET    /staff/queue                            // Priorisierte Fallliste
```

### 3.4 Adapter-API (Richtung: externe Systeme → Open State)

```
POST   /adapters/ba/arbeitsbescheinigung     // Arbeitsbescheinigung von BA-System
POST   /adapters/rentenversicherung/zeiten   // Versicherungszeiten-Daten
POST   /adapters/kommunal/meldedaten         // Meldedaten nach Änderung (Once-Only)
POST   /adapters/arbeitgeber/bescheinigung   // Arbeitgeberbescheinigung
```

### 3.5 Adapter-API (Richtung: Open State → Behörden)

```
POST   /adapters/elster/steuerdaten-abfrage  // Steuerdaten für Einkommensprüfung
GET    /adapters/sozialversicherung/zeiten   // Versicherungszeitenabfrage
GET    /adapters/einwohnermeldeamt/meldedaten // Adressdaten (Once-Only)
```

---

## 4. Datenschutz-Modell

### 4.1 Datensparsamkeit

- Kein Feld wird ohne Rechtsgrundlage erhoben
- Jedes Datenelement hat eine dokumentierte Zweckbindung
- Jede Datenweitergabe (intern und extern) erfordert einen API-Call mit Rechtsgrundlage-Header

### 4.2 Trennung von Identitätsdaten und Vorgangsdaten

```
DATENTRESOR (zero-knowledge)          FALLAKTE (verschlüsselt, aber nicht ZK)
────────────────────────────────      ────────────────────────────────────────
Name, Anschrift, Geburtsdatum   ←────  Nur Verweis (UUID)
Bankverbindung                        Vorgangsdaten, Dokumente, Events
Biometrische Daten                    Prüfprotokolle, Bescheide
────────────────────────────────      ────────────────────────────────────────
```

Die Fallakte enthält **keinen Klartext** personenbezogener Stammdaten. Diese werden nur bei Bedarf und nur für die verarbeitende Sachbearbeitung aus dem Datentresor abgerufen – und dieser Abruf wird protokolliert.

### 4.3 Aufbewahrungsfristen

> **Rechtliche Offenheit:** Aufbewahrungsfristen für Fallakten in SGB-III- und SGB-II-Verfahren unterliegen gesetzlichen Mindestvorgaben (§ 304 SGB III). Die genaue Umsetzung im System erfordert fachliche und juristische Abstimmung.

---

## 5. Ereignis-Streaming (konzeptionell)

Statusänderungen und Ereignisse werden über einen internen Event-Bus propagiert:

```
SYSTEM → Kafka-Topic: case.events
  → Notification-Service: Push/SMS/E-Mail an Bürger
  → Audit-Service: Unveränderliche Speicherung
  → Analytics-Service: Aggregierte Metriken (anonymisiert)
  → Staff-Dashboard: Echtzeit-Update für Sachbearbeitung
```

---

*Weiter: [07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md](07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md)*
