# NEXT_STEPS_QUEUE.md – Priorisierte Weiterentwicklungs-Queue

Jeder Schritt ist einzeln umsetzbar.
Abhängigkeiten sind notiert.
Status: `OFFEN` | `IN_ARBEIT` | `DONE` | `BLOCKIERT`

Befehl: „Entwickle weiter" → obersten `OFFEN`-Eintrag nehmen und umsetzen.

---

## Legende

- **Typ:** `DEMO` = UI/Code in demo/ | `DOCS` = Dokumentation | `ARCH` = Architektur | `CHORE` = Infrastruktur
- **Aufwand:** S (< 1h) / M (1–3h) / L (3h+)
- **Abhängigkeit:** welche Schritt-ID muss vorher DONE sein

---

## Priorisierungslogik

1. Sichtbarer Produktwert vor Dokumentationspflege
2. Klickbare Demo vor zusätzlicher Story-Verwaltung
3. Öffentliche Transparenz- und Berichtsschicht vor interner Strukturkosmetik
4. Technische Korrektheit und Build-Stabilität vor neuen Seitengleisen

---

## Queue

### Priorität 1 – Technische Korrektheit (Demo-Glaubwürdigkeit)

Die Fairness-Signale zeigen statische Fristtage statt berechneter Daten.
Das ist ein Glaubwürdigkeitsproblem gegenüber jedem, der die Demo kritisch betrachtet.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-004 | Fairness-Regelwerk: Fristen als ISO-Datum in `mockFall.ts`, Delta gegen fiktives „Heute" berechnen — entfernt statische `fristTage`-Angaben | DEMO | S | – | DONE `27a5f87` |

---

### Priorität 2 – Demo-Interaktivität (größter qualitativer Sprung)

Die Demo ist vollständig statisch. Nichts verändert sich, wenn man handelt.
Das macht es unmöglich zu zeigen, wie das Regelwerk auf Statuswechsel reagiert.
React State-Einführung ist der größte Demo-Qualitätssprung ohne neue Routen.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-031 | Mock-State via React Context einführen: Demo-Interaktionen (z. B. „Rückfrage beantworten") lösen echten State-Wechsel aus | DEMO | M | – | DONE `4552636` |
| Q-032 | `/fall/hinweise` nach State-Wechsel: Fairness-Signale reduzieren sich live — Demonstration des Regelwerks in Aktion | DEMO | S | Q-031 | DONE `8db3c74` |

---

### Priorität 3 – Öffentliche Berichtsschicht Kita (einzigartiger Demo-Inhalt)

Das konzeptionell stärkste Alleinstellungsmerkmal von Open State:
eine öffentlich zugängliche, methodisch transparente Berichtsschicht für Kindertagesbetreuung.
Kein anderes Verwaltungssystem demonstriert dies klickbar.
Die Kita-Domäne ist mit 7 Dokumenten und 10 Stories am stärksten vorbereitete unimplementierte Domäne.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-020 | Mock-Daten für Kita-Lagebild anlegen (`demo/data/mockKitaLagebild.ts`): Einrichtungen, Planungsräume, Versorgungsquoten, Zeitreihen nach Monaten | DEMO | M | – | DONE `f66a656` |
| Q-021 | Typen für Kita-Kennzahlen anlegen (`demo/types/kita.ts`) | DEMO | S | Q-020 | DONE `f66a656` |
| Q-022 | Demo-Route `/kita`: öffentlicher Transparenzbericht mit Versorgungsquoten, Planungsraumübersicht und Methodik-Hinweis (US-KJ-009) | DEMO | L | Q-021 | DONE `650498b` |
| Q-024 | Monatsvergleich / Trenddarstellung: HTML-Tabelle mit Zeitreihe, Veränderung zum Vormonat sichtbar — ohne Chart-Bibliothek | DEMO | M | Q-022 | OFFEN |
| Q-023 | Demo-Route `/kita/lagebild`: Jugendamt-Steuerungsansicht mit Planungsräumen, Bedarfslücken, Handlungsfeldern (US-KJ-005, US-KJ-006) — nur intern zugänglich in Demo-Logik | DEMO | L | Q-022 | OFFEN |

---

### Priorität 4 – Zweite klickbare Domäne: Unternehmensgründung

Eine zweite Demo-Domäne macht die Plattformidee greifbar:
Open State ist kein Ein-Zweck-System, sondern eine Infrastruktur für mehrere Verwaltungsbereiche.
Die Domänendokumentation existiert bereits (`docs/domains/unternehmensgruendung/`).
Story-Dokumentation ist kein Pflicht-Vorläufer für Mock-Daten und Typen.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-011 | Mock-Daten für Gründungsfall anlegen (`demo/data/mockGruendungsfall.ts`): Gewerbeanmeldung, Dokumente, beteiligte Behörden, Statusverlauf | DEMO | M | – | OFFEN |
| Q-012 | Typen für Unternehmensgründung anlegen (`demo/types/gruendung.ts`) | DEMO | S | Q-011 | OFFEN |
| Q-013 | Demo-Routen `/gruendung` und Subseiten (Übersicht, Dokumente, Behörden, Verlauf) | DEMO | L | Q-012 | OFFEN |
| Q-014 | Navigation und Landing Page um zweite Demo-Domäne erweitern | DEMO | S | Q-013 | OFFEN |
| Q-015 | Fairness-Regeln für Unternehmensgründung anlegen (fehlende Genehmigung, blockierter Folgeschritt, Fristlage) | DEMO | M | Q-013 | OFFEN |
| Q-030 | Navigationsstruktur für mehrere Domänen: Landing Page zeigt alle klickbaren Demo-Domänen mit kurzem Kontext | DEMO | M | Q-014 | OFFEN |

---

### Priorität 5 – Story-System-Ausbau (ergänzend, kein Demo-Blocker)

Sinnvoll, aber kein Endnutzerwert. Verbessert Nachvollziehbarkeit auf `/stories`,
nicht die klickbare Demo selbst.
Q-001 und Q-010 sind reine Dokumentationsarbeiten ohne Demo-Effekt.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-002 | `demo/data/storyRegistry.ts` um US-KJ-001–010 erweitern — macht Kita-Domäne auf `/stories` sichtbar | DEMO | S | – | OFFEN |
| Q-003 | `/stories`-Seite: Domänen-Gruppierung (AV / KJ / UG) — bei 18+ Stories nötig | DEMO | M | Q-002 | OFFEN |
| Q-010 | Story-Map und Stories anlegen: `docs/stories/unternehmensgruendung/` + 6 Stories (US-UG-001–006) | DOCS | M | – | OFFEN |
| Q-001 | Story-Datei `US-AV-008_Verfahrenslage_verstehen.md` anlegen — Docs-Konsistenz, kein Demo-Effekt | DOCS | S | – | OFFEN |

---

### Priorität 6 – Technische Infrastruktur

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-062 | GitHub Actions Workflow für Build-Check bei PR — verhindert kaputte Builds im main | CHORE | M | – | OFFEN |
| Q-053 | `CLAUDE.md` aktualisieren: Design System, ThemeProvider, ThemeSwitcher als Teil des Architekturwissens ergänzen | DOCS | S | – | OFFEN |

---

### Priorität 7 – Architektur-Dokumentation

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-050 | arc42 Kapitel 05 (Bausteinsicht) um Kita-Domäne und Berichtsschicht erweitern | ARCH | M | Q-022 | OFFEN |
| Q-051 | arc42 Kapitel 08 (Querschnittskonzepte) um Theme-Architektur ergänzen | ARCH | S | – | OFFEN |
| Q-052 | arc42 Kapitel 09 (ADRs) um Drei-Schichten-Entscheidung ergänzen | ARCH | S | – | OFFEN |

---

### Priorität 8 – API-Verträge

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-040 | OpenAPI-Entwurf für Arbeitsverwaltungs-Fallakte (`docs/api/arbeitsverwaltung-fall-api.yaml`) | DOCS | M | – | OFFEN |
| Q-041 | OpenAPI-Entwurf für Kita-Meldeschnittstelle (`docs/api/kita-meldung-api.yaml`) | DOCS | M | Q-022 | OFFEN |
| Q-042 | Datenvertrag: Betriebsdaten → Steuerungsdaten-Aggregation (formal, nicht nur Prosa) | DOCS | M | Q-041 | OFFEN |

---

### Priorität 9 – Contributor-Struktur

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-060 | `CONTRIBUTING.md` anlegen: Beitragsstandards, Story-Beantragung, Review-Prozess | DOCS | M | – | OFFEN |
| Q-061 | GitHub Issue-Templates: Fachlicher Hinweis, Bug, Story-Antrag, Rechtliche Einschätzung | CHORE | S | – | OFFEN |

---

## Stabile Bausteine (kein Handlungsbedarf)

Diese Punkte wurden in früheren Iterationen abgeschlossen und sind produktionsreif:

| Baustein | Status |
|---------|--------|
| `/feedback`-Route → GitHub Issues | ✓ vorhanden und funktional |
| BuildInfo-Footer (Env / Version / Commit-SHA) | ✓ vorhanden |
| Vercel-Deployment aus `demo/` | ✓ konfiguriert und stabil |
| Theme-Architektur (4 Themes, 2 Density Modes) | ✓ vollständig |
| Fairness-Signale in allen AV-Routen | ✓ integriert |

---

## Abgeschlossene Iterationen

| Iteration | Ergebnis | Commit |
|-----------|---------|--------|
| AV Vertical Slice | 7 Screens, 8 Stories, Mock-Falldaten | `3b6dc30` |
| Vercel-Deployment | Konfiguration und Build-Config | `e038699` |
| Verfahrensfairness | 5 Regeln, FairnessPanel, `/fall/hinweise` | `9966c5e` |
| Kita-Domäne Dokumentation | 7 Dokumente, 10 Stories | `50c0f69` |
| Agenten-Betriebssystem v1 | AGENTS.md, DELIVERY_SYSTEM.md, Queue, Build-State, Decision-Log | — |
| Theme-Architektur | 4 Themes, 2 Density Modes, ThemeSwitcher, Anti-Flash | `d6fc0c7` |
| Agenten-Betriebssystem v2 + v3 | Vollständige Überarbeitung, hebelorientierte Queue | `dc72ff9` |
