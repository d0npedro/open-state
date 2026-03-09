# Repo-Erweiterung: Story-System und Frontend-Traceability

---

## Zusammenfassung

Dieses Dokument beschreibt die Erweiterung des Open-State-Repositorys um ein vollständiges Story-getriebenes Entwicklungssystem. Das Story-System verbindet fachliche Anforderungen mit UI-Implementierungen über nachvollziehbare Story-IDs, definierte Akzeptanzkriterien und einen Coverage-Mechanismus im Frontend.

---

## Neu erstellte Dateien

| Datei | Beschreibung |
|-------|-------------|
| `docs/stories/README.md` | Einführung ins Story-System: Zweck, Grundprinzip, Namensschema, Domänen-Kürzel, Status-Schema, Verzeichnisstruktur |
| `docs/stories/STORY_TEMPLATE.md` | Vollständiges Template für neue Stories mit allen Pflichtfeldern |
| `docs/stories/TRACEABILITY_MATRIX.md` | Übersichtstabelle aller dokumentierten Stories mit UI-Screen, AK-Anzahl, technischer Referenz und Transparenzbezug |
| `docs/stories/FRONTEND_TRACEABILITY_PRINCIPLES.md` | Prinzipien für Story-Coverage im Frontend: StoryBadge, Coverage Screen, Datenquelle, Designgrundsätze, Unterschied demonstrierbar/produktionsbereit |
| `docs/stories/story_registry.json` | Maschinenlesbare Story-Registry (JSON-Array), Datenquelle für den Coverage Screen |
| `docs/stories/arbeitsverwaltung/README.md` | Domänenbeschreibung, Story-Übersicht, Abdeckungsstand, nicht abgedeckte Bereiche |
| `docs/stories/arbeitsverwaltung/STORY_MAP.md` | Story Map mit Backbone-Struktur, User Activities je Phase, MVP-Demo-Priorisierung |
| `docs/stories/arbeitsverwaltung/US-AV-001_Fall_anlegen.md` | Story: Fallanlage nach Arbeitslosigkeit – 6 AK, 6 UI-Zustände |
| `docs/stories/arbeitsverwaltung/US-AV-002_Status_einsehen.md` | Story: Jederzeit nachvollziehbarer Fallstatus – 6 AK, 5 UI-Zustände |
| `docs/stories/arbeitsverwaltung/US-AV-003_Unterlagen_nachreichen.md` | Story: Digitaler Dokumentenupload mit Kontext – 6 AK, 7 UI-Zustände |
| `docs/stories/arbeitsverwaltung/US-AV-004_Rueckfrage_verstehen.md` | Story: Rückfragen mit Begründung und Frist – 6 AK, 5 UI-Zustände |
| `docs/stories/arbeitsverwaltung/US-AV-005_Termin_einsehen_und_verstehen.md` | Story: Terminkontext und Vorbereitung – 5 AK, 5 UI-Zustände |
| `docs/stories/arbeitsverwaltung/US-AV-006_Bescheid_verstehen.md` | Story: Zwei-Schichten-Bescheiddarstellung – 6 AK, 5 UI-Zustände |
| `docs/stories/arbeitsverwaltung/US-AV-007_Historie_nachvollziehen.md` | Story: Vollständige Fallhistorie mit Export – 6 AK, 4 UI-Zustände |
| `app-design/09_Story_Coverage_UI.md` | Konzept und ASCII-Mockup des Coverage Screens, Designprinzipien, Komponentenübersicht |
| `app-design/10_Story_Component_Contract.md` | Komponentenvertrag für StoryBadge, StorySummaryCard, CoverageBar, StoryCoverageScreen, Datenfluss, TransparencyMode-Kontext |

---

## Geänderte Dateien

| Datei | Art der Änderung |
|-------|-----------------|
| `README.md` | Neuer Abschnitt „Entwicklungsansatz" mit Link auf das Story-System, eingefügt vor „Demo & Deployment" |
| `docs/domains/arbeitsverwaltung/README.md` | Neuer Abschnitt „User Stories dieser Domäne" am Ende: Link auf Story-Übersicht, Tabelle der 7 Stories mit Kurzbeschreibung des Problems |
| `app-design/07_UI_UX_User_Flows.md` | Hinweis-Block nach dem Header: Erklärung der Überführung in das Story-System, Verlinkung auf Coverage Screen und Traceability Matrix |
| `docs/11_Entwickler_Handover.md` | Neuer Abschnitt „Story-IDs als Traceability-Ankerpunkte" vor der Architekturübersicht: Erklärung der Story-ID-Verwendung in Code, UI, API-Dokumentation und Akzeptanzkriterien |

---

## Eingeführte Story-Logik

Das Story-System funktioniert nach folgendem Prinzip:

```
Problem (dokumentiert)
    ↓
User Story (Rolle + Funktion + Nutzen)
    ↓
Akzeptanzkriterien (konkret, nummeriert, prüfbar)
    ↓
UI-Zustände (was zeigt die Oberfläche wann)
    ↓
Story-ID als Traceability-Anker in Code und UI
    ↓
story_registry.json als maschinenlesbare Datenquelle
    ↓
Coverage Screen im Frontend als Transparenzinstrument
```

Kein Feature ohne Story. Keine Story ohne Akzeptanzkriterien. Kein DEMONSTRIERBAR-Status ohne erfüllte Akzeptanzkriterien.

---

## Die 7 ersten Stories (Arbeitsverwaltung)

| Story-ID | Titel | Status | AK |
|----------|-------|--------|----|
| US-AV-001 | Fall anlegen | ENTWURF | 6 |
| US-AV-002 | Status einsehen | ENTWURF | 6 |
| US-AV-003 | Unterlagen nachreichen | ENTWURF | 6 |
| US-AV-004 | Rückfrage verstehen | ENTWURF | 6 |
| US-AV-005 | Termin einsehen und verstehen | ENTWURF | 5 |
| US-AV-006 | Bescheid verstehen | ENTWURF | 6 |
| US-AV-007 | Historie nachvollziehen | ENTWURF | 6 |

Alle 7 Stories sind im Status ENTWURF. Die Überführung in BEREIT erfordert fachliche Abstimmung mit Vertreterinnen der Agentur für Arbeit / Jobcenter und rechtliche Prüfung der offenen Fragen (insbesondere SGB II/III, VwVfG, SGB X).

---

## Wie Traceability zur UI hergestellt wird

1. **story_registry.json** ist die Datenquelle. Sie enthält je Story: ID, Domäne, Titel, Rolle, Status, Problem, zugehöriger Screen, Transparenzbezug, AK-Anzahl, Quell-Datei.

2. **StoryBadge-Komponente** wird auf UI-Komponenten aufgebracht, die eine Story implementieren. Der Badge zeigt Story-ID und Status. Er ist in Produktionsumgebungen standardmäßig ausgeblendet und über einen Transparenz-Modus einblendbar.

3. **StoryCoverageScreen** zeigt alle Stories einer Domäne mit Implementierungsstand. Er ist kein Marketing-Element, sondern ein sachlicher Zustandsspiegel.

4. **TransparencyModeContext** ermöglicht Bürgerinnen, Prüfinstanzen und interessierten Nutzern, Story-Badges in der App einzublenden und direkt auf die fachliche Grundlage einer Funktion zuzugreifen.

---

## Offene technische Fragen

- Automatisierung der story_registry.json: Soll die Registry manuell gepflegt oder aus einem angebundenen Issue-System (z.B. Linear, Jira) befüllt werden?
- AK-Erfüllungsnachweis: Wie wird `acceptanceCriteriaFulfilled` je Story maschinell nachverfolgbar? Testautomatisierung oder manuelle Pflege?
- Story-Badge-Implementierung: In welchem Frontend-Framework und wann wird die Badge-Komponente erstmals implementiert?
- TransparencyMode: Wo in der App-Navigation ist der Toggle für den Transparenz-Modus verankert?

## Offene fachliche Fragen

- Für alle 7 AV-Stories: Rechtliche Prüfung der Fristen, Zustellungsformen und Mitwirkungspflichten nach SGB II, SGB III, VwVfG, SGB X.
- US-AV-001: Klärung der Mindestanforderungen für eine gültige digitale Arbeitslosmeldung (§ 141 SGB III).
- US-AV-006: Klärung der Erstellungsverantwortung für die Erklärungsschicht und Sicherstellung der rechtlichen Korrektheit.
- US-AV-007: Klärung der Akteneinsichtsrechte nach § 29 VwVfG / § 25 SGB X und was davon über die Timeline abgedeckt wird.
- Allgemein: Welche Stories erfordern Abstimmung auf Bundesebene (BA, BMAS) und welche können auf kommunaler/Länderebene pilotiert werden?
