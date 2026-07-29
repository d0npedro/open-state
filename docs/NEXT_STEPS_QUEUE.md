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
| Q-071 | Dokument-Upload interaktiv: `uploadDokument` im DemoStateContext; `/fall/dokumente` ändert Status live; Fairness-Signal UNTERLAGE_FEHLT entfällt | DEMO | S | Q-031 | DONE |
| Q-072 | Alle AV-Unterseiten an DemoState; Timeline-Ereignisse bei Rückfrage/Upload; Fairness auf Bescheid/Verlauf konsistent | DEMO | S | Q-071 | DONE |
| Q-075 | Demo-Session zurücksetzen (AV + UG): `resetSession`, Session-Leiste nach Interaktion | DEMO | S | Q-073 | DONE |

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
| Q-024 | Monatsvergleich / Trenddarstellung: HTML-Tabelle mit Zeitreihe, Veränderung zum Vormonat sichtbar — ohne Chart-Bibliothek | DEMO | M | Q-022 | DONE `97f2916` |
| Q-023 | Demo-Route `/kita/lagebild`: Jugendamt-Steuerungsansicht mit Planungsräumen, Bedarfslücken, Handlungsfeldern (US-KJ-005, US-KJ-006) — nur intern zugänglich in Demo-Logik | DEMO | L | Q-022 | DONE `7988f18` |
| Q-074 | Planungsraum-Filter auf `/kita`: Chip-Filter + Detailkarte + gefilterte Maßnahmen (US-KJ-009, interaktiv) | DEMO | S | Q-022 | DONE |
| Q-076 | Demo-Route `/kita/bedarfsplanung`: Bedarfsplanungsentwurf aus Lagebild-Daten, Planungslücke, Kommentar/Freigabe (US-KJ-007) | DEMO | M | Q-023 | DONE |
| Q-077 | Demo-Route `/kita/vorlage`: politische Gremienvorlage aus Lagebild, JA-Freigabe, Druck/PDF (US-KJ-008) | DEMO | M | Q-076 | DONE |
| Q-078 | Demo-Route `/kita/einrichtung`: Belegungsstand je Gruppe, aggregiert, CSV (US-KJ-002) | DEMO | M | – | DONE |
| Q-079 | Demo-Route `/kita/monatsbericht`: Monatsbericht je Gruppe, Vorjahresvergleich, CSV/Druck (US-KJ-003) | DEMO | M | Q-078 | DONE |
| Q-080 | Demo-Route `/kita/meldung`: Monatsmeldung prüfen, korrigieren, freigeben (US-KJ-004) | DEMO | M | Q-079 | DONE |
| Q-083 | Demo-Route `/kita/tagesstand` oder Erweiterung Einrichtung: aggregierte Tagesstand-Erfassung session-lokal (US-KJ-001) | DEMO | M | Q-078 | DONE |

---

### Priorität 4 – Zweite klickbare Domäne: Unternehmensgründung

Eine zweite Demo-Domäne macht die Plattformidee greifbar:
Open State ist kein Ein-Zweck-System, sondern eine Infrastruktur für mehrere Verwaltungsbereiche.
Die Domänendokumentation existiert bereits (`docs/domains/unternehmensgruendung/`).
Story-Dokumentation ist kein Pflicht-Vorläufer für Mock-Daten und Typen.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-011 | Mock-Daten für Gründungsfall anlegen (`demo/data/mockGruendungsfall.ts`): Gewerbeanmeldung, Dokumente, beteiligte Behörden, Statusverlauf | DEMO | M | – | DONE `12689b1` |
| Q-012 | Typen für Unternehmensgründung anlegen (`demo/types/gruendung.ts`) | DEMO | S | Q-011 | DONE `12689b1` |
| Q-013 | Demo-Routen `/gruendung` und Subseiten (Übersicht, Dokumente, Behörden, Verlauf) | DEMO | L | Q-012 | DONE `55ede29` |
| Q-014 | Navigation und Landing Page um zweite Demo-Domäne erweitern | DEMO | S | Q-013 | DONE `2fafb78` |
| Q-015 | Fairness-Regeln für Unternehmensgründung anlegen (fehlende Genehmigung, blockierter Folgeschritt, Fristlage) | DEMO | M | Q-013 | DONE `48e62e1` |
| Q-030 | Navigationsstruktur für mehrere Domänen: Landing Page zeigt alle klickbaren Demo-Domänen mit kurzem Kontext | DEMO | M | Q-014 | DONE `d11873a` |
| Q-073 | UG Dokument-Upload interaktiv + Fairness UG_UNTERLAGE_FEHLT + Verlaufsereignisse bei Rückfrage/Upload | DEMO | S | Q-015 | DONE |
| Q-082 | UG Verlauf-Filter nach handelnder Stelle (Alle / Sie / Behörde / System) mit Anzahlen und Leerzustand | DEMO | S | Q-073 | DONE |
| Q-084 | UG Behörden-Karte: CTA zu offener Rückfrage der jeweiligen Behörde | DEMO | S | Q-082 | DONE |

---

### Priorität 4b – AV Demo-Verfeinerung (Domain-Loop)

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-081 | AV Tab-Badges: Zähler offener Fragen/Unterlagen in Fall-Navigation, live mit DemoState | DEMO | S | Q-072 | DONE |
| Q-085 | AV Rückfrage-Antwort: kurzer Bestätigungsdialog (was wurde beantwortet) | DEMO | S | Q-081 | DONE |
| Q-086 | AV Fristen-Countdown auf Übersicht für offene Dokumente (analog RQ-Frist) | DEMO | S | Q-072 | DONE |
| Q-089 | AV Tab-Badge „Termine“ nur bei unbestätigt / bald fällig | DEMO | S | Q-081 | DONE |
| Q-095 | AV Verlauf: Antworttext als lesbarer Quittungsblock (kein 80-Zeichen-Kürzel) | DEMO | S | Q-085 | DONE |
| Q-092 | AV Termin-Bestätigung session-lokal (Badge entfällt live) | DEMO | S | Q-089 | OFFEN |

---

### Priorität 4c – UG Demo-Verfeinerung (Domain-Loop)

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-087 | UG Hinweise-Tab in Navigation + Behörden-Zeile auf Übersicht mit Link zur offenen Rückfrage | DEMO | S | Q-084 | DONE |
| Q-090 | UG Übersicht: Fairness-Kurzblock mit Link zu `/gruendung/hinweise` (analog AV) | DEMO | S | Q-087 | DONE |
| Q-093 | UG Hinweise: CTA „Frage beantworten“ aus RELEVANT-Signal (Anker `#rq-…`) | DEMO | S | Q-090 | DONE |
| Q-096 | UG Hinweise: CTA „Zur Behördenkarte“ aus RELEVANT-BG-Anmeldung (`#beh-…`) | DEMO | S | Q-093 | DONE |
| Q-098 | UG Hinweise: CTA „Zu den Unterlagen“ aus HINWEIS-Unterlagen-Signal (`#dok-…`) | DEMO | S | Q-096 | DONE |

---

### Priorität 4d – Kita Demo-Verfeinerung (Domain-Loop)

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-088 | Kita Lagebild: Meldeeingang freigegebener Monatsmeldungen (Session-Link von `/kita/meldung`) | DEMO | M | Q-080 | DONE |
| Q-091 | Kita Lagebild: Planungsraum Südost nach Session-Freigabe Sonnenwinkel hervorheben | DEMO | S | Q-088 | DONE |
| Q-097 | Kita Monatsbericht: Vorschau laufender Monat mit gemischten Tagesstand-Quellen | DEMO | S | Q-079 | DONE |
| Q-094 | Kita Bedarfsplanung: Datenlücke Südost aus Meldeeingang ableiten | DEMO | S | Q-091 | DONE |
| Q-099 | Kita Lagebild: Meldeeingang mit Monatsbericht-Vorschau koppeln (Sonnenwinkel) | DEMO | S | Q-097 | DONE |

---

### Priorität 5 – Story-System-Ausbau (ergänzend, kein Demo-Blocker)

Sinnvoll, aber kein Endnutzerwert. Verbessert Nachvollziehbarkeit auf `/stories`,
nicht die klickbare Demo selbst.
Q-001 und Q-010 sind reine Dokumentationsarbeiten ohne Demo-Effekt.

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-002 | `demo/data/storyRegistry.ts` um US-KJ-001–010 erweitern — macht Kita-Domäne auf `/stories` sichtbar | DEMO | S | – | DONE `0dc93da` |
| Q-003 | `/stories`-Seite: Domänen-Gruppierung (AV / KJ / UG) — bei 18+ Stories nötig | DEMO | M | Q-002 | DONE `1a412b5` |
| Q-010 | Story-Map und Stories anlegen: `docs/stories/unternehmensgruendung/` + 6 Stories (US-UG-001–006) | DOCS | M | – | DONE |
| Q-001 | Story-Datei `US-AV-008_Verfahrenslage_verstehen.md` anlegen — Docs-Konsistenz, kein Demo-Effekt | DOCS | S | – | DONE |
| Q-070 | `demo/data/storyRegistry.ts` um US-UG-001–006 erweitern — UG-Stories auf `/stories` sichtbar | DEMO | S | Q-010 | DONE |

---

### Priorität 6 – Technische Infrastruktur

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-062 | GitHub Actions Workflow für Build-Check bei PR — verhindert kaputte Builds im main | CHORE | M | – | DONE |
| Q-053 | `CLAUDE.md` aktualisieren: Design System, ThemeProvider, ThemeSwitcher als Teil des Architekturwissens ergänzen | DOCS | S | – | DONE |

---

### Priorität 7 – Architektur-Dokumentation

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-050 | arc42 Kapitel 05 (Bausteinsicht) um Kita-Domäne und Berichtsschicht erweitern | ARCH | M | Q-022 | DONE |
| Q-051 | arc42 Kapitel 08 (Querschnittskonzepte) um Theme-Architektur ergänzen | ARCH | S | – | DONE |
| Q-052 | arc42 Kapitel 09 (ADRs) um Drei-Schichten-Entscheidung ergänzen | ARCH | S | – | DONE |

---

### Priorität 8 – API-Verträge

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-040 | OpenAPI-Entwurf für Arbeitsverwaltungs-Fallakte (`docs/api/arbeitsverwaltung-fall-api.yaml`) | DOCS | M | – | DONE |
| Q-041 | OpenAPI-Entwurf für Kita-Meldeschnittstelle (`docs/api/kita-meldung-api.yaml`) | DOCS | M | Q-022 | DONE |
| Q-042 | Datenvertrag: Betriebsdaten → Steuerungsdaten-Aggregation (formal, nicht nur Prosa) | DOCS | M | Q-041 | DONE |

---

### Priorität 9 – Contributor-Struktur

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-060 | `CONTRIBUTING.md` anlegen: Beitragsstandards, Story-Beantragung, Review-Prozess | DOCS | M | – | DONE |
| Q-061 | GitHub Issue-Templates: Fachlicher Hinweis, Bug, Story-Antrag, Rechtliche Einschätzung | CHORE | S | – | DONE |

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
| Q-010 UG Stories | Story-Map + 6 Stories US-UG-001–006 | `50d3827` |
| Q-001 US-AV-008 | Story-Datei Verfahrenslage verstehen | `ee20fc6` |
| Q-062 Build CI | GitHub Actions Build-Check | `e16c707` |
| Q-053 CLAUDE.md | Design System / Themes dokumentiert | (Folge) |
| Q-050–052 arc42 | Kita-Schicht, Theme, ADR-007 | (Folge) |
| Q-040–042 API | OpenAPI AV + Kita + Aggregationsvertrag | (Folge) |
| Q-060–061 Contrib | CONTRIBUTING.md + Issue-Templates | (Folge) |
| Q-070 UG Registry | US-UG-001–006 in demo storyRegistry | `70937e8` |
| Q-071 Dokument-Upload | Interaktiver Upload AV + Fairness live | `9a5f89a` |
| Q-072 AV-State/Timeline | Alle AV-Seiten + Timeline-Events | `91567b3` |
| Q-073 UG Upload/Fairness | Interaktiver UG-Upload + UG_UNTERLAGE_FEHLT | `7b18166` |
| Q-074 Kita-Planungsfilter | Filter/Detail auf Transparenzbericht | `27803ca` |
| Q-075 Demo-Reset | Session-Leiste + resetSession AV/UG | `9f55a89` |
| Q-076 Bedarfsplanung | `/kita/bedarfsplanung` US-KJ-007 | `bd935e8` |
| Q-077 Gremienvorlage | `/kita/vorlage` US-KJ-008 Freigabe | `c7a1599` |
| Q-078 Kita-Belegung | `/kita/einrichtung` US-KJ-002 | `6c63d65` |
| Multi-Loop AV | Progress UNTERLAGEN_FEHLEN + Ruhezustand | `a42cf4c` → main |
| Multi-Loop UG | Strukturierte Rückfrage + Fristcountdown | `0571ef6` → main |
| Multi-Loop Kita | Monatsbericht US-KJ-003 | `259b361` → main |
| Q-081 AV Tab-Badges | Offene Fragen/Unterlagen in Fall-Nav | `9c45c2e` → main |
| Q-082 UG Verlauf-Filter | Filter nach handelnder Stelle | `ccba7da` → main |
| Q-080 Kita Meldefreigabe | `/kita/meldung` US-KJ-004 | `4b3fd8c` → main |
