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
| US-AV-008 | Arbeitsverwaltung | Verfahrenslage verstehen | Bürger | `/fall/hinweise` | ENTWURF | 5 | Regelbasierte Hinweise aus Falldaten, keine Personenbewertung | `berechneFairnessSignale`, FairnessPanel |

---

## Unternehmensgründung (UG)

| Story-ID | Domäne | Kurztitel | Primäre Rolle | UI-Screen | Status | AK-Anzahl | Transparenzbezug | Technische Referenz |
|----------|--------|-----------|---------------|-----------|--------|-----------|-----------------|---------------------|
| US-UG-001 | Unternehmensgründung | Gründungsstatus einsehen | Gründerin / Gründer | `/gruendung` | ENTWURF | 6 | Klartext-Status, Fortschritt, nächster Schritt | `GET /api/v1/gruendung/{id}`, mockGruendungsfall |
| US-UG-002 | Unternehmensgründung | Beteiligte Behörden einsehen | Gründerin / Gründer | `/gruendung/behoerden` | ENTWURF | 5 | Rolle, Status und Kontakt je Behörde | `GET /api/v1/gruendung/{id}/behoerden` |
| US-UG-003 | Unternehmensgründung | Unterlagen nachreichen | Gründerin / Gründer | `/gruendung/dokumente` | ENTWURF | 6 | Anforderung mit Begründung und Dokumentenstatus | `GET/POST /api/v1/gruendung/{id}/dokumente` |
| US-UG-004 | Unternehmensgründung | Rückfrage verstehen und beantworten | Gründerin / Gründer | `/gruendung/rueckfragen` | ENTWURF | 6 | Begründung, Frist und Konsequenz je Rückfrage | `GET/POST .../rueckfragen`, GruendungStateContext |
| US-UG-005 | Unternehmensgründung | Verfahrensverlauf nachvollziehen | Gründerin / Gründer | `/gruendung/verlauf` | ENTWURF | 5 | Chronologische Timeline mit Urheber | `GET /api/v1/gruendung/{id}/verlauf` |
| US-UG-006 | Unternehmensgründung | Nächste Schritte und Pflichten verstehen | Gründerin / Gründer | `/gruendung`, `/gruendung/hinweise` | ENTWURF | 5 | Fallbezogene Handlungshinweise mit Begründung | offeneAufgaben, Fairness-Signale |

---

## Hinweise zur Verwendung

- **AK-Anzahl**: Gibt an, wie viele nummerierte Akzeptanzkriterien in der Story definiert sind. Alle müssen erfüllt sein, bevor eine Story als DEMONSTRIERBAR gilt.
- **Transparenzbezug**: Beschreibt den spezifischen Aspekt der Nachvollziehbarkeit, den diese Story für den Bürger herstellt.
- **Technische Referenz**: Gibt API-Endpunkte und interne Services als Orientierung an. Die Endpunkte sind konzeptionell; die finale Spezifikation liegt in der API-Dokumentation.
- **Status**: Entspricht dem Status-Schema aus `docs/stories/README.md`.

---

## Geplante Domänen (noch ohne Story-Dateien in docs/stories)

| Domäne | Kürzel | Status |
|--------|--------|--------|
| Sozialleistungen | SL | Ausstehend |
| Jugendhilfe | JH | Ausstehend (KJ-Stories existieren unter kita_betrieb_und_jugendamt_steuerung) |
| Wohnsitzmanagement | WM | Ausstehend |
| Rechtsstreit / Bußgeld | RB | Ausstehend |

---

*Zuletzt aktualisiert: Q-010 – UG Stories US-UG-001–006*
*Maschinenlesbar: [story_registry.json](story_registry.json) (generiert aus `demo/data/storyRegistry.ts`, Q-305)*

