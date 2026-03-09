# Story Coverage UI – Konzept und Designprinzipien

---

## Konzept

Der Coverage Screen ist ein Transparenzinstrument. Er zeigt, welche Funktionen von Open State auf dokumentierten User Stories beruhen, wie weit deren Umsetzung fortgeschritten ist und welche Akzeptanzkriterien bereits erfüllt sind.

Der Coverage Screen ist kein Fortschrittsbalken für Marketing-Zwecke. Er ist ein ehrlicher Zustandsspiegel des Systems.

---

## Aufbau des Coverage Screens

### Domänenübersicht (Einstiegsebene)

```
┌─────────────────────────────────────────────────────────┐
│  Story Coverage – Open State                             │
│  ─────────────────────────────────────────────────────  │
│  Arbeitsverwaltung     7 Stories  |  0 demonstrierbar   │
│  ░░░░░░░░░░░░░░░░░░░░  0 %                              │
│                                                          │
│  Unternehmensgründung  — Stories  |  — demonstrierbar   │
│  (noch keine Stories dokumentiert)                       │
│                                                          │
│  Sozialleistungen      — Stories  |  — demonstrierbar   │
│  (noch keine Stories dokumentiert)                       │
│                                                          │
│  Jugendhilfe           — Stories  |  — demonstrierbar   │
│  (noch keine Stories dokumentiert)                       │
│                                                          │
│  Wohnsitzmanagement    — Stories  |  — demonstrierbar   │
│  (noch keine Stories dokumentiert)                       │
│                                                          │
│  Rechtsstreit/Bußgeld  — Stories  |  — demonstrierbar   │
│  (noch keine Stories dokumentiert)                       │
└─────────────────────────────────────────────────────────┘
```

### Domänendetail: Arbeitsverwaltung

```
┌─────────────────────────────────────────────────────────┐
│  Story Coverage – Arbeitsverwaltung                      │
│  7 Stories | 0 demonstrierbar | 7 Entwurf               │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  US-AV-001  Fall anlegen                                 │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  6 AK · 6 UI-Zustände · Rolle: Bürger                   │
│  Problem: Einstieg nach Arbeitslosigkeit unklar          │
│                                                          │
│  US-AV-002  Status einsehen                              │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  6 AK · 5 UI-Zustände · Rolle: Bürger                   │
│  Problem: 40–60 % aller BA-Kontakte sind Statusanfragen  │
│                                                          │
│  US-AV-003  Unterlagen nachreichen                       │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  6 AK · 7 UI-Zustände · Rolle: Bürger                   │
│  Problem: Dokumentenanforderungen ohne Kontext           │
│                                                          │
│  US-AV-004  Rückfrage verstehen                          │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  6 AK · 5 UI-Zustände · Rolle: Bürger                   │
│  Problem: Behördensprache ohne Erklärung                 │
│                                                          │
│  US-AV-005  Termin einsehen und verstehen                │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  5 AK · 5 UI-Zustände · Rolle: Bürger                   │
│  Problem: Termine per Post ohne Kontext                  │
│                                                          │
│  US-AV-006  Bescheid verstehen                           │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  6 AK · 5 UI-Zustände · Rolle: Bürger                   │
│  Problem: Juristische Bescheide unverstanden             │
│                                                          │
│  US-AV-007  Historie nachvollziehen                      │
│  ░░░░░░░░░░░░░░░░░░░░  ENTWURF                          │
│  6 AK · 4 UI-Zustände · Rolle: Bürger                   │
│  Problem: Kein Überblick über Fallverlauf                │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│  Legende:                                                │
│  ░░  ENTWURF · BEREIT                                    │
│  ▒▒  IN_ENTWICKLUNG                                      │
│  ██  DEMONSTRIERBAR · ABGESCHLOSSEN                      │
└─────────────────────────────────────────────────────────┘
```

### Story-Detailansicht (nach Klick auf eine Story)

```
┌─────────────────────────────────────────────────────────┐
│  ← Zurück zur Übersicht                                  │
│                                                          │
│  US-AV-006                            ENTWURF           │
│  Bescheid verstehen                                      │
│  Domäne: Arbeitsverwaltung · Rolle: Bürger               │
│                                                          │
│  Problem                                                 │
│  Bescheide sind juristische Texte. Widerspruchsfristen   │
│  werden versäumt, weil Bürger den Bescheid nicht         │
│  verstehen.                                              │
│                                                          │
│  Transparenzbezug                                        │
│  Zwei-Schichten-Darstellung: juristische Fassung und     │
│  erklärte Fassung mit Widerspruchsfrist.                 │
│                                                          │
│  Akzeptanzkriterien  0 / 6 erfüllt                      │
│  ░░░░░░░░░░░░░░░░░░░░                                   │
│                                                          │
│  AK 1: Zwei-Schichten-Darstellung                       │
│  AK 2: Erklärungsschicht mit 4 Pflichtbestandteilen     │
│  AK 3: Widerspruchsfrist als Datum + Countdown          │
│  AK 4: Rechtsgrundlage benannt                          │
│  AK 5: Widerspruchsbutton mit Begleittext               │
│  AK 6: Zustellzeitpunkt dokumentiert                    │
│                                                          │
│  → Vollständige Story-Datei öffnen                      │
└─────────────────────────────────────────────────────────┘
```

---

## Designprinzipien

### Kein Marketing

Der Coverage Screen zeigt den tatsächlichen Zustand. Eine Story im Status ENTWURF wird als ENTWURF angezeigt, nicht als „geplant" oder mit einer positiven Umrahmung. Fortschritt ist sichtbar, wenn er tatsächlich vorhanden ist.

### Keine falschen Signalwerte

Keine Ampeln im klassischen Grün/Gelb/Rot-Schema, die eine normative Wertung transportieren. Der Fortschrittsbalken zeigt Implementierungsstand – er bewertet nicht, ob der aktuelle Stand gut oder schlecht ist.

Die Statusbezeichnungen sind eindeutig und erklärbar:
- ENTWURF: Story ist formuliert, aber noch nicht umgesetzt
- BEREIT: Story ist vollständig, kann umgesetzt werden
- IN_ENTWICKLUNG: Story wird aktiv implementiert
- DEMONSTRIERBAR: Story ist in der Demo prüfbar und alle Akzeptanzkriterien sind erfüllt
- ABGESCHLOSSEN: Story ist vollständig integriert und geprüft

### Sachliche Beschriftungen

Keine Formulierungen wie „Fast da!" oder „Exzellente Abdeckung". Die Anzeige beschreibt, sie bewertet nicht.

### Keine Vollständigkeitssuggestionen

Der Coverage Screen zeigt was dokumentiert und was implementiert ist. Er macht keine Aussage darüber, was das Gesamtsystem einmal leisten wird.

---

## Datenquelle

Der Coverage Screen bezieht alle Daten aus `docs/stories/story_registry.json`. Diese Datei wird bei Statusänderungen manuell aktualisiert.

In einer produktiven Umgebung würde die Datenquelle automatisiert aus dem Projektsystem befüllt. Im aktuellen Projektstadium ist die manuelle Aktualisierung der registry ausreichend.

---

## Komponenten

| Komponente | Beschreibung |
|-----------|-------------|
| `StoryBadge` | Kleines Label mit Story-ID und Status – wird auf UI-Komponenten aufgebracht |
| `CoverageBar` | Horizontaler Fortschrittsbalken (Füllstand = Anteil demonstrierbarer/abgeschlossener AK) |
| `StorySummaryCard` | Karte mit Story-ID, Titel, Status, AK-Zähler, Kurzproblem |
| `StoryCoverageScreen` | Gesamtbildschirm mit Domänenübersicht und Filterlogik |
| `StoryDetailView` | Vollständige Einzelansicht einer Story mit allen AK |
| `DomainCoverageHeader` | Kopfzeile je Domäne mit Gesamtanzahl und Statusverteilung |

---

## Zugänglichkeit

Der Coverage Screen ist in Entwicklungs- und Demo-Umgebungen standardmäßig zugänglich. In produktiven Bürger-Kontexten ist er über einen „Transparenz-Modus" oder eine explizite Verlinkung zugänglich, aber nicht im Hauptnavigationsfluss.

Story-Badges auf UI-Komponenten sind in produktiven Umgebungen standardmäßig ausgeblendet und über den Transparenz-Modus einblendbar.

---

*Verweis auf Komponenten-Kontrakt: [10_Story_Component_Contract.md](10_Story_Component_Contract.md)*
*Verweis auf Traceability-Prinzipien: [docs/stories/FRONTEND_TRACEABILITY_PRINCIPLES.md](../docs/stories/FRONTEND_TRACEABILITY_PRINCIPLES.md)*
