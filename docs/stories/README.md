# Story-System – Open State

---

## Zweck

Open State wird anhand nachvollziehbarer User Stories entwickelt. Jede sichtbare Funktion in der Anwendung führt auf ein konkretes, dokumentiertes Problem zurück – und auf messbare Akzeptanzkriterien, die zeigen, ob dieses Problem gelöst wurde.

Das Story-System erfüllt drei Zwecke:

1. **Entwicklungssteuerung** – Welche Funktion wird warum gebaut? Was ist die Mindestanforderung?
2. **Traceability** – Jede UI-Komponente kann auf eine Story-ID zurückgeführt werden. Kein Feature ohne Begründung.
3. **Transparenz nach außen** – Bürger, Prüfinstanzen und Fachleute können nachvollziehen, welches Problem eine Funktion löst und welche Kriterien erfüllt sein müssen.

---

## Grundprinzip

```
Problem (dokumentiert)
    ↓
User Story (Rolle + Funktion + Nutzen)
    ↓
Akzeptanzkriterien (konkret, prüfbar, nummeriert)
    ↓
UI-Zustände (was zeigt die Oberfläche in welcher Situation)
    ↓
Nachweis im Frontend (Story-Badge, Coverage-Anzeige)
```

Keine Story ohne Problem. Keine Implementierung ohne Story. Keine "demonstrierbar"-Einstufung ohne erfüllte Akzeptanzkriterien.

---

## Namensschema

```
US-[DOMÄNE]-[NNN]_[Kurztitel].md
```

Beispiele:
- `US-AV-001_Fall_anlegen.md`
- `US-UG-003_Gewerbeanmeldung_Eingang.md`
- `US-SL-002_Buergergeld_Antrag_Status.md`

---

## Domänen-Kürzel

| Kürzel | Domäne |
|--------|--------|
| **AV** | Arbeitsverwaltung |
| **UG** | Unternehmensgründung |
| **SL** | Sozialleistungen |
| **JH** | Jugendhilfe |
| **WM** | Wohnsitzmanagement |
| **RB** | Rechtsstreit / Bußgeld |

---

## Status-Schema

| Status | Bedeutung |
|--------|-----------|
| **ENTWURF** | Story ist formuliert, aber noch nicht fachlich abgenommen |
| **BEREIT** | Story ist vollständig, fachlich geprüft, umsetzungsbereit |
| **IN_ENTWICKLUNG** | Story wird aktiv implementiert |
| **DEMONSTRIERBAR** | Story ist in der Demo sichtbar und alle Akzeptanzkriterien sind nachweislich erfüllt |
| **ABGESCHLOSSEN** | Story ist in einer stabilen, verifizierten Ausbaustufe vollständig integriert |

Der Übergang von DEMONSTRIERBAR zu ABGESCHLOSSEN erfordert eine explizite Entscheidung – nicht nur funktionale Vollständigkeit, sondern auch Barrierefreiheit, Fehlerbehandlung und Prüfbarkeit durch Dritte.

---

## Verzeichnisstruktur

```
docs/stories/
├── README.md                          ← dieses Dokument
├── STORY_TEMPLATE.md                  ← Vorlage für neue Stories
├── TRACEABILITY_MATRIX.md             ← Übersicht aller Stories
├── FRONTEND_TRACEABILITY_PRINCIPLES.md ← Wie Story-IDs in der UI auftauchen
├── story_registry.json                ← Maschinenlesbare Story-Übersicht
│
└── arbeitsverwaltung/
    ├── README.md
    ├── STORY_MAP.md
    ├── US-AV-001_Fall_anlegen.md
    ├── US-AV-002_Status_einsehen.md
    ├── US-AV-003_Unterlagen_nachreichen.md
    ├── US-AV-004_Rueckfrage_verstehen.md
    ├── US-AV-005_Termin_einsehen_und_verstehen.md
    ├── US-AV-006_Bescheid_verstehen.md
    └── US-AV-007_Historie_nachvollziehen.md
```

Weitere Domänen folgen demselben Muster unter `docs/stories/[domäne]/`.

---

## Wie Stories im Projekt verwendet werden

### In der Entwicklung

Story-IDs werden als Anker in Code-Kommentaren, Commit-Messages und Pull-Request-Beschreibungen referenziert. Eine Implementierung ohne Story-ID gilt als unvollständig dokumentiert.

### Im UI-Design

Jede UI-Komponente, die eine Story-Funktion abbildet, trägt einen Story-Badge. Dieser ist im Frontend sichtbar (in Entwicklungs- und Demo-Umgebungen) und verweist auf die Story-ID.

### Im Review- und Prüfprozess

Akzeptanzkriterien sind das Abnahmekriterium. Eine Story gilt erst dann als DEMONSTRIERBAR, wenn alle nummerierten Akzeptanzkriterien in der Demo prüfbar erfüllt sind.

### In der externen Kommunikation

Die Traceability Matrix und der Coverage Screen ermöglichen es Fachleuten, Prüfinstanzen und interessierten Bürgern nachzuvollziehen, welche Funktionen auf welcher Grundlage gebaut wurden.

---

*Dieses Story-System ist Teil der Entwicklungsdokumentation von Open State.*
*Gesamtprojekt: [README.md](../../README.md)*
