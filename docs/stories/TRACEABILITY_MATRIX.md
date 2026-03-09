# Traceability Matrix – Open State Stories

Diese Matrix gibt einen vollständigen Überblick über alle dokumentierten User Stories. Sie verbindet fachliche Anforderungen mit UI-Screens, Rollen und technischen Referenzen.

---

## Arbeitsverwaltung (AV)

| Story-ID | Domäne | Kurztitel | Primäre Rolle | UI-Screen | Status | AK-Anzahl | Transparenzbezug | Technische Referenz |
|----------|--------|-----------|---------------|-----------|--------|-----------|-----------------|---------------------|
| US-AV-001 | Arbeitsverwaltung | Fall anlegen | Bürger | Fallanlage / Arbeitslosmeldung | ENTWURF | 6 | Eingangsbestätigung und Fallnummer sofort sichtbar | `POST /api/v1/cases`, eID-Adapter, CaseService |
| US-AV-002 | Arbeitsverwaltung | Status einsehen | Bürger | Fallstatus-Übersicht | ENTWURF | 6 | Statuserklärung in Klartext, letzter Aktualisierungszeitpunkt | `GET /api/v1/cases/{id}/status`, CaseStatusService |
| US-AV-003 | Arbeitsverwaltung | Unterlagen nachreichen | Bürger | Dokumenten-Upload | ENTWURF | 6 | Upload-Zeitstempel und Dokumentenstatus nachverfolgbar | `POST /api/v1/cases/{id}/documents`, DocumentService |
| US-AV-004 | Arbeitsverwaltung | Rückfrage verstehen | Bürger | Rückfragen-Ansicht | ENTWURF | 6 | Rückfrage mit Begründung, Frist und Konsequenz | `GET /api/v1/cases/{id}/inquiries`, InquiryService |
| US-AV-005 | Arbeitsverwaltung | Termin einsehen und verstehen | Bürger | Termin-Übersicht | ENTWURF | 5 | Terminzweck in Klarsprache, Vorbereitungshinweise | `GET /api/v1/cases/{id}/appointments`, AppointmentService |
| US-AV-006 | Arbeitsverwaltung | Bescheid verstehen | Bürger | Bescheid-Ansicht | ENTWURF | 6 | Zwei-Schichten-Darstellung (juristisch + erklärt) | `GET /api/v1/cases/{id}/notices`, NoticeService, ExplanationLayer |
| US-AV-007 | Arbeitsverwaltung | Historie nachvollziehen | Bürger | Fall-Timeline | ENTWURF | 6 | Vollständige Timeline aller Ereignisse mit Zeitstempel und Urheber | `GET /api/v1/cases/{id}/history`, AuditLogService |

---

## Hinweise zur Verwendung

- **AK-Anzahl**: Gibt an, wie viele nummerierte Akzeptanzkriterien in der Story definiert sind. Alle müssen erfüllt sein, bevor eine Story als DEMONSTRIERBAR gilt.
- **Transparenzbezug**: Beschreibt den spezifischen Aspekt der Nachvollziehbarkeit, den diese Story für den Bürger herstellt.
- **Technische Referenz**: Gibt API-Endpunkte und interne Services als Orientierung an. Die Endpunkte sind konzeptionell; die finale Spezifikation liegt in der API-Dokumentation.
- **Status**: Entspricht dem Status-Schema aus `docs/stories/README.md`.

---

## Geplante Domänen (noch ohne Stories)

| Domäne | Kürzel | Status |
|--------|--------|--------|
| Unternehmensgründung | UG | Ausstehend |
| Sozialleistungen | SL | Ausstehend |
| Jugendhilfe | JH | Ausstehend |
| Wohnsitzmanagement | WM | Ausstehend |
| Rechtsstreit / Bußgeld | RB | Ausstehend |

---

*Zuletzt aktualisiert: Story-System Initialversion*
*Pfad zur maschinenlesbaren Variante: [story_registry.json](story_registry.json)*
