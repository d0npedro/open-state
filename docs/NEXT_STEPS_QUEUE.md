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

## Queue

### Priorität 1 – Demo-Qualität und Story-Konsistenz

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-001 | Story-Datei `US-AV-008_Verfahrenslage_verstehen.md` in `docs/stories/arbeitsverwaltung/` anlegen — Route `/fall/hinweise` existiert, Datei fehlt | DOCS | S | – | OFFEN |
| Q-002 | `demo/data/storyRegistry.ts` um US-KJ-001 bis US-KJ-010 erweitern, damit `/stories` die Kita-Domäne zeigt | DEMO | S | – | OFFEN |
| Q-003 | `/stories`-Seite: Domänen-Filterung oder Gruppierung (AV / KJ / UG) hinzufügen — bei 18+ Stories nötig | DEMO | M | Q-002 | OFFEN |
| Q-004 | Fairness-Regelwerk: echte Datumsberechnung statt statischem `fristTage`-Feld — Frist als ISO-Datum in mockFall, Delta gegen fiktives „Heute" berechnen | DEMO | S | – | OFFEN |

### Priorität 2 – Neue Demo-Domäne: Unternehmensgründung

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-010 | Story-Map und Stories anlegen: `docs/stories/unternehmensgruendung/STORY_MAP.md` + mind. 6 Stories (US-UG-001–006) | DOCS | M | – | OFFEN |
| Q-011 | Mock-Daten für Gründungsfall anlegen (`demo/data/mockGruendungsfall.ts`): Gewerbeanmeldung, Dokumente, Behörden, Status | DEMO | M | Q-010 | OFFEN |
| Q-012 | Typen für Unternehmensgründung anlegen (`demo/types/gruendung.ts`) | DEMO | S | Q-011 | OFFEN |
| Q-013 | Demo-Routen `/gruendung` und Subseiten anlegen (Übersicht, Dokumente, Behörden, Verlauf) | DEMO | L | Q-012 | OFFEN |
| Q-014 | Navigation und Landing Page um zweite Demo-Domäne erweitern | DEMO | S | Q-013 | OFFEN |
| Q-015 | Fairness-Regeln für Unternehmensgründung anlegen (fehlende Genehmigung, blockierter nächster Schritt, Fristlage) | DEMO | M | Q-013 | OFFEN |

### Priorität 3 – Öffentliche Berichtsschicht (Kita-Domäne Demo)

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-020 | Mock-Daten für Kita-Lagebild anlegen (`demo/data/mockKitaLagebild.ts`): Einrichtungen, Planungsräume, Kennzahlen, Zeitreihen | DEMO | M | – | OFFEN |
| Q-021 | Typen für Kita-Kennzahlen anlegen (`demo/types/kita.ts`) | DEMO | S | Q-020 | OFFEN |
| Q-022 | Demo-Route `/kita`: öffentlicher Transparenzbericht-Screen (US-KJ-009) | DEMO | L | Q-021 | OFFEN |
| Q-023 | Demo-Route `/kita/lagebild`: Jugendamt-Steuerungs-Screen (US-KJ-005, US-KJ-006) mit Planungsraumübersicht | DEMO | L | Q-022 | OFFEN |
| Q-024 | Zeitreihen-Visualisierung: tabellarische Darstellung ohne Chart-Bibliothek (HTML-Tabelle reicht für Demo) | DEMO | M | Q-022 | OFFEN |

### Priorität 4 – Demo-Infrastruktur und Interaktivität

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-030 | Navigationsstruktur für mehrere Domänen überarbeiten (Landing Page zeigt alle Demo-Domänen) | DEMO | M | Q-014 | OFFEN |
| Q-031 | Mock-State via React Context einführen: Demo-Interaktionen (z. B. „Rückfrage beantworten") zeigen echten State-Wechsel | DEMO | M | – | OFFEN |
| Q-032 | `/fall/hinweise` nach State-Wechsel: weniger Signale sichtbar — Demonstration des Regelwerks live | DEMO | S | Q-031 | OFFEN |

### Priorität 5 – API-Verträge und Datenschnittstellen

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-040 | API-Vertrag für Arbeitsverwaltungs-Fallakte als OpenAPI-Entwurf (`docs/api/arbeitsverwaltung-fall-api.yaml`) | DOCS | M | – | OFFEN |
| Q-041 | API-Vertrag für Kita-Meldeschnittstelle (`docs/api/kita-meldung-api.yaml`) | DOCS | M | Q-020 | OFFEN |
| Q-042 | Datenvertrag: wie Betriebsdaten in Steuerungsdaten aggregiert werden (formal, nicht nur Prosa) | DOCS | M | Q-041 | OFFEN |

### Priorität 6 – Architektur und Dokumentation

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-050 | arc42 Kapitel 05 (Bausteinsicht) um Kita-Domäne und Berichtsschicht erweitern | ARCH | M | – | OFFEN |
| Q-051 | arc42 Kapitel 08 (Querschnittskonzepte) um Theme-Architektur ergänzen | ARCH | S | – | OFFEN |
| Q-052 | arc42 Kapitel 09 (ADRs) um Entscheidung „Drei-Schichten-Modell" ergänzen | ARCH | S | – | OFFEN |
| Q-053 | `CLAUDE.md` aktualisieren: Design System, ThemeProvider, ThemeSwitcher als Teil des Architekturwissens | DOCS | S | – | OFFEN |

### Priorität 7 – Contributor- und Feedback-Struktur

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-060 | `CONTRIBUTING.md` anlegen: Beitragsstandards, Story-Beantragung, Review-Prozess | DOCS | M | – | OFFEN |
| Q-061 | GitHub Issue-Templates anlegen (`.github/ISSUE_TEMPLATE/`): Fachlicher Hinweis, Bug, Story-Antrag, Rechtliche Einschätzung | CHORE | S | – | OFFEN |
| Q-062 | GitHub Actions Workflow für Build-Check bei PR (verhindert kaputte Builds im main) | CHORE | M | – | OFFEN |

---

## Abgeschlossene Schritte

| ID | Schritt | Commit |
|----|---------|--------|
| – | Arbeitsverwaltungs-Demo Vertical Slice (7 Screens, 8 Stories) | `3b6dc30` |
| – | Demo-Deployment auf Vercel konfiguriert | `e038699` |
| – | Verfahrensfairness-Hinweisschicht in Demo integriert | `9966c5e` |
| – | Domäne Kita-Betrieb & Jugendamt-Steuerung dokumentiert (10 Stories, 7 Domänendokumente) | `50c0f69` |
| – | Agenten-Betriebssystem v1 angelegt (AGENTS.md, DELIVERY_SYSTEM.md, NEXT_STEPS_QUEUE.md, BUILD_STATE.md, DECISION_LOG.md) | `<agent-os-v1>` |
| – | Theme-Architektur: 4 Themes, 2 Density Modes, ThemeSwitcher, Anti-Flash, Design System Docs | `d6fc0c7` |
| – | Agenten-Betriebssystem v2 — vollständige Überarbeitung und Aktualisierung | aktuell |

---

## Priorisierungslogik

- **Priorität 1** schließt bekannte Inkonsistenzen (fehlende Story-Datei, fehlende Registry-Einträge) — kleiner Aufwand, sofortige Qualitätsverbesserung.
- **Priorität 2** (Unternehmensgründung) ergibt den größten sichtbaren Demo-Fortschritt — zweite Domäne macht die Plattformidee greifbar.
- **Priorität 3** (Kita-Demo) ist konzeptionell stark — jetzt Demo-Umsetzung, um die Drei-Schichten-Idee klickbar zu machen.
- **Priorität 4** (Interaktivität) wäre ein wichtiger Qualitätssprung für die Demo-Wirkung.
- **Priorität 5–7** sind sinnvoll, aber nicht dringend — eher für stabilisierende Phasen.
