# NEXT_STEPS_QUEUE.md – Priorisierte Weiterentwicklungs-Queue

Jeder Schritt ist einzeln umsetzbar. Abhängigkeiten sind notiert.
Status: `OFFEN` | `IN_ARBEIT` | `DONE` | `BLOCKIERT`

Befehl: „Entwickle weiter" → obersten `OFFEN`-Eintrag nehmen und umsetzen.

---

## Legende

- **Typ:** `DEMO` = UI/Code in demo/ | `DOCS` = Dokumentation | `ARCH` = Architektur | `CHORE` = Infrastruktur
- **Aufwand:** S (< 1h) / M (1–3h) / L (3h+)
- **Abhängigkeit:** welche Schritt-ID muss vorher DONE sein

---

## Queue

### Priorität 1 – Demo-Qualität und Story-Abschluss

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-001 | Story-Datei `US-AV-008_Verfahrenslage_verstehen.md` in `docs/stories/arbeitsverwaltung/` anlegen (fehlt noch, Code existiert) | DOCS | S | – | OFFEN |
| Q-002 | `storyRegistry.ts` um `US-KJ-001` bis `US-KJ-010` erweitern, damit Story Coverage die Kita-Domain zeigt | DEMO | S | – | OFFEN |
| Q-003 | `/stories`-Seite: Domänen-Filterung oder Gruppierung nach Domain hinzufügen (8 AV + 10 KJ-Stories wären unübersichtlich flach) | DEMO | M | Q-002 | OFFEN |
| Q-004 | Fairness-Regelwerk: echte Datumsberechnung statt Mock-Feld `fristTage` — Frist als ISO-Datum im mockFall, Delta gegen fiktives „Heute" rechnen | DEMO | S | – | OFFEN |

### Priorität 2 – Neue Demo-Domäne: Unternehmensgründung

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-010 | Stories für Unternehmensgründung anlegen: `docs/stories/unternehmensgruendung/STORY_MAP.md` + mind. 6 Stories (US-UG-001–006) | DOCS | M | – | OFFEN |
| Q-011 | Mock-Daten für Unternehmensgründungsfall anlegen (`demo/data/mockGruendungsfall.ts`): Gewerbeanmeldung, Dokumente, Behörden, Status | DEMO | M | Q-010 | OFFEN |
| Q-012 | Typen für Unternehmensgründung anlegen (`demo/types/gruendung.ts`) | DEMO | S | Q-011 | OFFEN |
| Q-013 | Demo-Routen `/gruendung` und Subseiten anlegen (Übersicht, Dokumente, Behörden, Verlauf) | DEMO | L | Q-012 | OFFEN |
| Q-014 | Navigation und Landing Page um zweite Domäne erweitern | DEMO | S | Q-013 | OFFEN |
| Q-015 | Fairness-Regeln für Unternehmensgründung anlegen (fehlende Genehmigung, blockierter nächster Schritt, Fristlage) | DEMO | M | Q-013 | OFFEN |

### Priorität 3 – Öffentliche Berichtsschicht (Kita-Domäne Demo)

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-020 | Mock-Daten für Kita-Lagebild anlegen (`demo/data/mockKitaLagebild.ts`): Einrichtungen, Planungsräume, Kennzahlen, Zeitreihen | DEMO | M | – | OFFEN |
| Q-021 | Typen für Kita-Kennzahlen anlegen (`demo/types/kita.ts`) | DEMO | S | Q-020 | OFFEN |
| Q-022 | Demo-Route `/kita` oder `/bericht/kita`: öffentlicher Transparenzbericht-Screen (US-KJ-009) | DEMO | L | Q-021 | OFFEN |
| Q-023 | Demo-Route `/kita/lagebild`: Jugendamt-Steuerungs-Screen (US-KJ-005, 006) mit Planungsraumübersicht | DEMO | L | Q-022 | OFFEN |
| Q-024 | Zeitreihen-Visualisierung: einfache tabellarische Darstellung (keine Chart-Bibliothek nötig, HTML-Tabelle reicht für Demo) | DEMO | M | Q-022 | OFFEN |

### Priorität 4 – Demo-Infrastruktur und Persistenz

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-030 | Demo: Navigationsstruktur für mehrere Domänen überarbeiten (Landing Page zeigt alle Demo-Domänen) | DEMO | M | Q-014 | OFFEN |
| Q-031 | Demo: Mock-State via React Context oder Zustand-Library einführen, sodass Demo-Interaktionen (z. B. „Rückfrage beantworten") echten State-Wechsel zeigen | DEMO | M | – | OFFEN |
| Q-032 | Demo: `fall/hinweise`-Seite zeigt nach State-Wechsel weniger Signale (Demonstration des Regelwerks live) | DEMO | S | Q-031 | OFFEN |

### Priorität 5 – API-Verträge und Datenschnittstellen

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-040 | API-Vertrag für Arbeitsverwaltungs-Fallakte als OpenAPI-Entwurf (`docs/api/arbeitsverwaltung-fall-api.yaml`) | DOCS | M | – | OFFEN |
| Q-041 | API-Vertrag für Kita-Meldeschnittstelle (`docs/api/kita-meldung-api.yaml`) | DOCS | M | Q-020 | OFFEN |
| Q-042 | Datenvertrag-Dokument: wie Betriebsdaten in Steuerungsdaten aggregiert werden (formal, nicht nur prosa) | DOCS | M | Q-041 | OFFEN |

### Priorität 6 – Architektur und Dokumentation

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-050 | arc42 Kapitel 05 (Bausteinsicht) um Kita-Domäne und Berichtsschicht erweitern | ARCH | M | – | OFFEN |
| Q-051 | arc42 Kapitel 09 (ADRs) um Entscheidung „Drei-Schichten-Modell für öffentliche Berichte" ergänzen | ARCH | S | – | OFFEN |
| Q-052 | `DECISION_LOG.md` laufend pflegen (nach jeder größeren Architekturentscheidung) | DOCS | S | – | OFFEN |

### Priorität 7 – Contributor und Feedback-Struktur

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-060 | `CONTRIBUTING.md` anlegen: wie Beiträge geleistet werden, welche Standards gelten, wie Stories beantragt werden | DOCS | M | – | OFFEN |
| Q-061 | GitHub Issue-Templates anlegen (`.github/ISSUE_TEMPLATE/`) für: Fachlicher Hinweis, Bug, Story-Antrag, Rechtliche Einschätzung | CHORE | S | – | OFFEN |
| Q-062 | GitHub Actions Workflow für automatischen Build-Check bei PR (verhindert kaputte Builds im main) | CHORE | M | – | OFFEN |

---

## Abgeschlossene Schritte

| ID | Schritt | Commit |
|----|---------|--------|
| – | Arbeitsverwaltungs-Demo Vertical Slice (7 Screens) | `3b6dc30` |
| – | Demo-Deployment auf Vercel konfiguriert | `e038699` |
| – | Verfahrensfairness-Hinweisschicht in Demo integriert | `9966c5e` |
| – | Domäne Kita-Betrieb & Jugendamt-Steuerung dokumentiert (10 Stories, 7 Domänendokumente) | `50c0f69` |
| – | Agent-Betriebssystem angelegt | aktuell |

---

## Notizen zur Priorisierung

- Q-001 und Q-002 sind klein und schließen bekannte Inkonsistenzen — gut als Einstieg.
- Q-010–Q-015 (Unternehmensgründungs-Demo) ergibt den größten sichtbaren Fortschritt.
- Q-020–Q-024 (Kita-Demo) ist konzeptionell stark dokumentiert — jetzt Demo-Umsetzung.
- Q-031 (React State für Demo) wäre ein wichtiger Qualitätssprung für die Demo-Wirkung.
- Q-062 (CI) sollte vor einem öffentlichen PR-basierten Beitragsmodell umgesetzt sein.
