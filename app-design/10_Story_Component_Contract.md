# Story Component Contract – Open State

Dieses Dokument definiert die Komponentenverträge für alle Story-bezogenen UI-Elemente in Open State. Ein Komponentenvertrag beschreibt Props, erwartetes Verhalten und Darstellungsregeln – unabhängig von der konkreten Frontend-Implementierung.

---

## Typen und Enumerationen

```typescript
type StoryStatus =
  | "ENTWURF"
  | "BEREIT"
  | "IN_ENTWICKLUNG"
  | "DEMONSTRIERBAR"
  | "ABGESCHLOSSEN";

type DomainCode = "AV" | "UG" | "SL" | "JH" | "WM" | "RB";

interface StoryRegistryEntry {
  id: string;                          // z.B. "US-AV-001"
  domain: string;                      // z.B. "Arbeitsverwaltung"
  title: string;
  role: string;
  status: StoryStatus;
  problem: string;
  screen: string;
  transparency_focus: string;
  acceptance_criteria_count: number;
  source_file: string;
}
```

---

## StoryBadge

### Zweck

Diskretes Label-Element, das auf UI-Komponenten oder Screens aufgebracht wird, die eine dokumentierte Story implementieren. Verbindet die laufende Anwendung mit ihrer fachlichen Grundlage.

### Props

```typescript
interface StoryBadgeProps {
  id: string;           // Story-ID (z.B. "US-AV-001")
  status: StoryStatus;
  domain: DomainCode;
  interactive?: boolean; // Bei true: Klick öffnet StorySummaryCard. Default: true
  visible?: boolean;     // Bei false: Badge ist ausgeblendet. Default: abhängig von Umgebung
}
```

### Darstellung

```
┌──────────────────┐
│ US-AV-001        │
│ DEMONSTRIERBAR   │
└──────────────────┘
```

### Statusfarben

| Status | Hintergrundfarbe | Textfarbe | Bedeutung |
|--------|-----------------|-----------|-----------|
| ENTWURF | `#E8E8E8` | `#555555` | Story existiert, noch nicht implementiert |
| BEREIT | `#D4E8FF` | `#003F8C` | Story ist umsetzungsbereit |
| IN_ENTWICKLUNG | `#FFF3CC` | `#8B6000` | Story wird gerade implementiert |
| DEMONSTRIERBAR | `#D4F5E9` | `#1A6B45` | Story ist in Demo vollständig prüfbar |
| ABGESCHLOSSEN | `#003F8C` | `#FFFFFF` | Story ist vollständig integriert |

### Darstellungsregeln

- In Entwicklungs- und Demo-Umgebungen: immer sichtbar, wenn `visible` nicht explizit auf `false` gesetzt.
- In Produktionsumgebungen: standardmäßig `visible: false`; einblendbar über globalen `transparencyMode`-Kontext.
- Badge erscheint in der oberen rechten Ecke der übergeordneten Komponente, ohne Layoutverschiebung.
- Badge ist nicht skalierbar – feste Größe, immer lesbar.

---

## StorySummaryCard

### Zweck

Karte mit den wesentlichen Metadaten einer Story. Erscheint beim Klick auf einen StoryBadge oder als Element im StoryCoverageScreen.

### Props

```typescript
interface StorySummaryCardProps {
  storyId: string;
  title: string;
  domain: string;
  role: string;
  status: StoryStatus;
  problem: string;
  acceptanceCriteriaCount: number;
  acceptanceCriteriaFulfilled: number;   // Anzahl erfüllter AK (manuell gepflegt oder aus Testsystem)
  transparencyFocus: string;
  sourceFile: string;                    // Pfad zur vollständigen Story-Datei
  onClose?: () => void;
  onOpenDetail?: () => void;
}
```

### Felder der Anzeige

```
┌─────────────────────────────────────────────────────────┐
│  US-AV-006                            [ENTWURF]         │
│  Bescheid verstehen                                      │
│  Domäne: Arbeitsverwaltung · Rolle: Bürger               │
│                                                          │
│  Problem                                                 │
│  [problem-Text, max. 2 Zeilen, danach truncate]          │
│                                                          │
│  Transparenzbezug                                        │
│  [transparency_focus-Text]                               │
│                                                          │
│  Akzeptanzkriterien                                      │
│  [CoverageBar]  0 / 6 erfüllt                           │
│                                                          │
│  [→ Vollständige Story öffnen]   [×  Schließen]         │
└─────────────────────────────────────────────────────────┘
```

### Darstellungsregeln

- Die Karte erscheint als Modal oder als Seitenleisten-Panel, nicht als Inline-Element.
- `problem` wird auf maximal 2 Zeilen gekürzt; vollständiger Text erscheint in der StoryDetailView.
- Der CoverageBar zeigt `acceptanceCriteriaFulfilled / acceptanceCriteriaCount` als Füllstand.
- Wenn `acceptanceCriteriaFulfilled === 0`, zeigt der Balken einen leeren Zustand ohne Wertung.
- „Vollständige Story öffnen" verlinkt auf die Story-Datei oder eine gerenderte Detailansicht.

---

## CoverageBar

### Zweck

Horizontaler Fortschrittsbalken zur Anzeige des Implementierungsstands einer Story (erfüllte vs. definierte Akzeptanzkriterien).

### Props

```typescript
interface CoverageBarProps {
  fulfilled: number;   // Anzahl erfüllter Akzeptanzkriterien
  total: number;       // Gesamtanzahl definierter Akzeptanzkriterien
  status: StoryStatus; // Beeinflusst Farbe des Balkens
  showLabel?: boolean; // Zeigt "x / y erfüllt" als Text. Default: true
}
```

### Darstellungsregeln

- Balkenfarbe entspricht der Statusfarbe des StoryBadge.
- Keine prozentualen Anzeigen ohne absolute Zahlen – immer `x / y`.
- Bei `fulfilled === 0`: leerer Balken, kein Label „0 %", nur „0 / y".
- Bei `total === 0`: Balken wird nicht gerendert, stattdessen Text „Keine AK definiert".

---

## StoryCoverageScreen

### Zweck

Vollständiger Screen zur Anzeige aller Stories eines Domäne mit Filterlogik. Einstiegspunkt für Transparenz-interessierte Nutzer, Prüfinstanzen und Entwickler.

### Props

```typescript
interface StoryCoverageScreenProps {
  domain?: string;        // Filter: nur Stories dieser Domäne. Wenn leer: alle Domänen.
  registry: StoryRegistryEntry[];
}
```

### Layoutstruktur

```
StoryCoverageScreen
├── DomainCoverageHeader
│   ├── Domänenname
│   ├── Gesamtanzahl Stories
│   └── Statusverteilung (je Status: Anzahl)
├── FilterPanel
│   ├── Filter: Status (MultiSelect)
│   ├── Filter: Rolle (MultiSelect)
│   └── Filterreset-Button
└── StoryList
    └── StorySummaryCard[] (eine je Story, gefiltert und sortiert nach Story-ID)
```

### Filterlogik

- Standardfilter: alle Stories, alle Status, alle Rollen.
- Filter sind kombinierbar (AND-Logik).
- Filterauswahl ist im URL-State persistierbar (für Deep-Links in Dokumentation).
- Kein Suchfeld – die Anzahl der Stories ist überschaubar.

### Sortierung

- Standardsortierung: Story-ID aufsteigend (US-AV-001, US-AV-002, ...).
- Keine benutzerdefinierbaren Sortierungen in der ersten Ausbaustufe.

---

## Datenfluss: story_registry.json → UI

```
story_registry.json
    ↓
[Ladevorgang: statisch oder via API-Endpunkt /api/v1/stories]
    ↓
StoryRegistryEntry[]
    ↓
StoryCoverageScreen (Props: registry)
    ↓
je Entry:
    → StorySummaryCard (Props: aus Entry)
        → StoryBadge (Props: id, status, domain)
        → CoverageBar (Props: fulfilled, total, status)
```

Im aktuellen Projektstadium wird `story_registry.json` als statische Datei geladen. In einer späteren Ausbaustufe kann die Registry über eine API dynamisch befüllt werden, z.B. aus einem angebundenen Issue-Tracking-System.

---

## Kontextprovider: TransparencyMode

Damit Story-Badges in produktiven Umgebungen einblendbar sind, wird ein globaler `TransparencyModeContext` benötigt:

```typescript
interface TransparencyModeContextValue {
  isEnabled: boolean;
  toggle: () => void;
}
```

- Ist `isEnabled: true`, werden alle StoryBadges mit `visible`-Default eingeblendet.
- Der Modus wird im lokalen Storage der Anwendung persistiert.
- Ein globaler Toggle (z.B. in den Einstellungen oder im Footer) aktiviert/deaktiviert den Modus.

---

*Verweis auf Coverage-UI-Design: [09_Story_Coverage_UI.md](09_Story_Coverage_UI.md)*
*Verweis auf Traceability-Prinzipien: [docs/stories/FRONTEND_TRACEABILITY_PRINCIPLES.md](../docs/stories/FRONTEND_TRACEABILITY_PRINCIPLES.md)*
*Verweis auf Design System: [07_UI_UX_User_Flows.md](07_UI_UX_User_Flows.md)*
