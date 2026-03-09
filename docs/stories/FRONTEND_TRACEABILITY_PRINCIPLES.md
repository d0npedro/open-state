# Frontend Traceability – Prinzipien und Konzept

---

## Grundprinzip

Jede demonstrierbare Funktion in Open State soll auf eine Story-ID zurückführbar sein. Das ist kein dekoratives Feature – es ist ein Rechenschaftsmechanismus.

Ein Bürger oder eine Prüfinstanz soll in der Lage sein, bei jeder sichtbaren Funktion zu fragen: Welches Problem löst das? Wer hat das entschieden? Welche Kriterien wurden erfüllt? Die Antwort auf diese Fragen liegt in den Story-Dateien – und die Verbindung stellt das Frontend über Story-IDs her.

---

## Datenquelle

Alle Story-Metadaten werden aus einer zentralen maschinenlesbaren Quelle geladen:

```
docs/stories/story_registry.json
```

Diese Datei enthält je Story:

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | String | Story-ID (z.B. `US-AV-001`) |
| `domain` | String | Domänenname |
| `title` | String | Kurztitel der Story |
| `role` | String | Primäre Rolle |
| `status` | String | Aktueller Status |
| `problem` | String | Kurzbeschreibung des Problems |
| `screen` | String | UI-Screen, auf dem die Story sichtbar ist |
| `transparency_focus` | String | Spezifischer Transparenzbeitrag dieser Story |
| `acceptance_criteria_count` | Integer | Anzahl definierter Akzeptanzkriterien |
| `source_file` | String | Relativer Pfad zur vollständigen Story-Datei |

---

## Wie Story-Coverage im Frontend dargestellt wird

### Story-Badge

Ein Story-Badge ist ein kleines, diskretes Element, das auf UI-Komponenten angezeigt wird, die einer Story zugeordnet sind. Er zeigt die Story-ID und den aktuellen Status.

Darstellung:
```
┌──────────────────┐
│ US-AV-001        │
│ DEMONSTRIERBAR   │
└──────────────────┘
```

Der Badge erscheint in Entwicklungs- und Demo-Umgebungen. In produktiven Bürger-Kontexten ist er standardmäßig ausgeblendet, aber über einen "Transparenz-Modus" einblendbar.

### Coverage-Screen

Der Coverage Screen zeigt alle Stories einer Domäne mit ihrem Implementierungsstand. Er ist kein Marketinginstrument – er zeigt sachlich, was gebaut wurde, was in Arbeit ist und was noch aussteht.

```
┌─────────────────────────────────────────────┐
│  Story Coverage – Arbeitsverwaltung          │
│  7 Stories | 0 demonstrierbar | 7 Entwurf   │
│                                              │
│  US-AV-001  Fall anlegen                     │
│  ░░░░░░░░░░  ENTWURF                         │
│  6 AK · 5 UI-Zustände · Rolle: Bürger        │
│                                              │
│  US-AV-002  Status einsehen                  │
│  ░░░░░░░░░░  ENTWURF                         │
│  6 AK · 5 UI-Zustände · Rolle: Bürger        │
│                                              │
│  US-AV-003  Unterlagen nachreichen           │
│  ░░░░░░░░░░  ENTWURF                         │
│  6 AK · 6 UI-Zustände · Rolle: Bürger        │
│                                              │
│  [...]                                       │
│                                              │
│  ─────────────────────────────────────────  │
│  Legende:                                    │
│  ░░  ENTWURF / BEREIT                        │
│  ▒▒  IN_ENTWICKLUNG                          │
│  ██  DEMONSTRIERBAR / ABGESCHLOSSEN          │
└─────────────────────────────────────────────┘
```

---

## Komponenten

### StoryBadge

```
Props:
  id: string            // Story-ID (z.B. "US-AV-001")
  status: StoryStatus   // Enum: ENTWURF | BEREIT | IN_ENTWICKLUNG | DEMONSTRIERBAR | ABGESCHLOSSEN
  domain: string        // Domänenkürzel (z.B. "AV")

Darstellung:
  - Kleine Kachel, rechtsbündig in Komponente oder Seitenleiste
  - Statusfarbe: ENTWURF = grau, IN_ENTWICKLUNG = amber, DEMONSTRIERBAR = grün, ABGESCHLOSSEN = dunkelgrün
  - Klick öffnet StorySummaryCard oder verlinktes Story-Dokument
```

### StorySummaryCard

```
Props:
  storyId: string
  title: string
  domain: string
  role: string
  status: StoryStatus
  problem: string
  acceptanceCriteriaCount: number
  acceptanceCriteriaFulfilled: number
  transparencyFocus: string
  sourceFile: string

Darstellung:
  - Karte mit Story-ID prominent oben links
  - Statusbadge
  - Kurzproblem und Transparenzfokus
  - Fortschrittsbalken AK erfüllt / gesamt
  - Link zur vollständigen Story-Datei
```

### StoryCoverageScreen

```
Layout:
  - Header: Domänenname, Gesamtanzahl Stories, Anzahl je Status
  - Liste: StorySummaryCard pro Story, sortiert nach Story-ID
  - Filter: nach Status, nach Rolle, nach Domäne
  - Keine Suchfunktion (Anzahl überschaubar)

Datenfluss:
  story_registry.json → StoryCoverageScreen → StorySummaryCard[] + StoryBadge
```

---

## Designprinzipien für die Coverage-Ansicht

1. **Kein Marketing** – Die Coverage-Ansicht zeigt den tatsächlichen Stand, nicht einen optimierten. Ein ENTWURF wird als ENTWURF gezeigt.

2. **Kein falscher Signalwert** – Keine Ampeln, die "alles grün" suggerieren, wenn etwas noch offen ist. Der Balken zeigt Fortschritt, keine Wertung.

3. **Sachliche Beschriftung** – Statusbezeichnungen sind eindeutig. DEMONSTRIERBAR bedeutet: in der Demo sichtbar und alle AK erfüllt. Nicht mehr, nicht weniger.

4. **Erklärbarkeit** – Jeder Status ist mit einem Kurztext erklärbar, der auf Nachfrage eingeblendet werden kann.

5. **Kein Vollständigkeitsversprechen** – Der Coverage Screen zeigt was existiert, nicht was das Gesamtsystem leisten wird.

---

## Wichtiger Unterschied: demonstrierbar ≠ produktionsbereit

| DEMONSTRIERBAR | Produktionsbereit |
|----------------|-------------------|
| Funktion ist in der Demo-Umgebung sichtbar | Funktion läuft unter echten Produktionsbedingungen |
| Alle Akzeptanzkriterien sind in der Demo erfüllt | Barrierefreiheit vollständig geprüft |
| Happy Path und wichtigste Fehlerzustände abgedeckt | Lasttest, Sicherheitsaudit, Rechtskonformitätsprüfung abgeschlossen |
| Story-ID nachvollziehbar verknüpft | Vier-Augen-Prüfung aller Ausgaben und Entscheidungen |

Der Übergang zwischen beiden Zuständen erfordert eine explizite Freigabe – keine automatische Umstufung.

---

*Dieses Dokument ist Teil des Story-Systems von Open State.*
*Verwandte Dokumente: [story_registry.json](story_registry.json) · [TRACEABILITY_MATRIX.md](TRACEABILITY_MATRIX.md) · [app-design/09_Story_Coverage_UI.md](../../app-design/09_Story_Coverage_UI.md)*
