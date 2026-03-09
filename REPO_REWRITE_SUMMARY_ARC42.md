# Zusammenfassung: arc42-Architekturdokumentation Open State

---

## Neu erstellte arc42-Dateien

| Datei | Kapitel | Inhalt |
|-------|---------|--------|
| `architecture/arc42/README.md` | Navigation | Zweck, Verhältnis zu 05_Systemarchitektur.md, 12-Kapitel-Navigation, Grundprinzip Stories → Architektur |
| `architecture/arc42/01_EINFUEHRUNG_UND_ZIELE.md` | 1 | Aufgabe von Open State, fachliche Ziele aus US-AV-001 bis US-AV-007, Qualitätsziele-Tabelle, Stakeholder-Tabelle |
| `architecture/arc42/02_RANDBEDINGUNGEN.md` | 2 | Rechtliche (DSGVO, OZG, SGB III/II/VIII, § 35a VwVfG), organisatorische (keine Werbung, Open Source, föderale Realität), technische (WCAG, eID, Zero-Knowledge, XÖV, OAuth2/FIDO2) und methodische Randbedingungen |
| `architecture/arc42/03_KONTEXTABGRENZUNG.md` | 3 | Was liegt innerhalb/außerhalb Open State, Schnittstellentabelle mit 9 externen Systemen, Mermaid-Kontextdiagramm |
| `architecture/arc42/04_LOESUNGSSTRATEGIE.md` | 4 | Begründungen für domänenorientierte Architektur, Story-driven Development, Fallakte, Statusmodell, Erklärschicht, Audit-Log, KI nur als Assistenz |
| `architecture/arc42/05_BAUSTEINSICHT.md` | 5 | 11 Bausteine mit Verantwortung, Story-Bezug, Inputs, Outputs, Abhängigkeiten; Mermaid-Übersichtsdiagramm |
| `architecture/arc42/06_LAUFZEITSICHT.md` | 6 | 3 Szenarien: Fall anlegen (US-AV-001), Unterlagen nachreichen (US-AV-003), Bescheid einsehen (US-AV-006) – je mit vollständiger Schritt-für-Schritt-Beschreibung und Fehlerzuständen |
| `architecture/arc42/07_VERTEILUNGSSICHT.md` | 7 | 5 logische Schichten (Frontend, API Gateway, Anwendungslogik, Adapter, Datenhaltung), Mermaid-Verteilungsdiagramm, Sicherheitszonierung |
| `architecture/arc42/08_QUERSCHNITTSKONZEPTE.md` | 8 | 8 Querschnittskonzepte: Transparenz, Story-Traceability, KI-Erklärbarkeit, Auditierbarkeit, Datensouveränität, Zustandsmodell, Barrierefreiheit, Fehlerkommunikation |
| `architecture/arc42/09_ARCHITEKTURENTSCHEIDUNGEN.md` | 9 | 6 ADRs: Story-driven Development, Fallakte als Grundmuster, KI nur als Assistenz, Statusmodell als Pflicht, keine Werbefinanzierung, Erklärschicht als Pflicht |
| `architecture/arc42/10_QUALITAETSANFORDERUNGEN.md` | 10 | Qualitätsbaum, 10 Qualitätsszenarien mit Messbarkeit und Story-Bezug, Qualitätssicherungsansätze |
| `architecture/arc42/11_RISIKEN_UND_TECHNISCHE_SCHULDEN.md` | 11 | 4 rechtliche Risiken, 5 technische Risiken, 4 konzeptuelle Schulden, 2 operative Risiken – ehrlich und vollständig |
| `architecture/arc42/12_GLOSSAR.md` | 12 | 19 präzise Begriffsdefinitionen (je 2–5 Sätze) |

---

## Geänderte bestehende Dateien

| Datei | Änderung |
|-------|---------|
| `README.md` | Neuer Abschnitt `## Architekturdokumentation` mit Link auf `architecture/arc42/README.md` – eingefügt vor dem Entwicklungsansatz-Abschnitt |
| `architecture/05_Systemarchitektur.md` | Hinweis-Block nach dem ersten Header: Verhältnis zu arc42-Dokumentation, gegenseitige Ergänzung |

---

## Wie Stories in Architektur übersetzt wurden

Das arc42-Dokument schließt die Schleife zwischen fachlichem Bedarf (User Stories) und technischer Systemstruktur:

| Story | Architekturantwort |
|-------|-------------------|
| US-AV-001 (Fall anlegen) | Fallakte als Grundmuster, eID-Integration im Identitätsdienst, Benachrichtigungsdienst, Laufzeitszenario 1 |
| US-AV-002 (Status einsehen) | Statusmodell als Zustandsmaschine, ADR-004, Verfahrensstillstand als expliziter Zustand |
| US-AV-003 (Unterlagen nachreichen) | Dokumentenverwaltungs-Baustein, Laufzeitszenario 2, Fehlerkommunikationskonzept |
| US-AV-004 (Rückfrage verstehen) | Erklärschicht-Baustein, Kommunikationshistorie, Qualitätsziel Verständlichkeit |
| US-AV-006 (Bescheid verstehen) | Erklärschicht-Baustein, ADR-006, Laufzeitszenario 3, Qualitätsziel Verständlichkeit |
| US-AV-007 (Historie nachvollziehen) | Audit-Log-Baustein, Querschnittskonzept Transparenz, Qualitätsziel Auditierbarkeit |

---

## Wichtigste ADRs (Kurzfassung)

| ADR | Entscheidung | Kernbegründung |
|-----|-------------|----------------|
| ADR-001 | Story-driven Development | Jede Funktion braucht fachliche Legitimation; Prüfbarkeit für Aufsichtsstellen |
| ADR-002 | Fallakte für alle Domänen | Konsistente Transparenz- und Auditstandards; Grundlage für domänenübergreifende Werkzeuge |
| ADR-003 | KI nur als Assistenz | § 35a VwVfG; Rechtssicherheit; Anfechtbarkeit; Würde der Bürger |
| ADR-004 | Statusmodell als Pflicht | 40–60 % BA-Kontakte sind Statusanfragen; strukturell beseitigbar |
| ADR-005 | Keine Werbefinanzierung | Staatliche Infrastruktur darf keine kommerziellen Interessen bedienen |
| ADR-006 | Erklärschicht als Pflicht | Versäumte Fristen und verfallende Ansprüche durch Unverständnis sind strukturell vermeidbar |

---

## Offene Risiken und Schulden (Top 5)

1. **DSFA nicht durchgeführt** – Art. 35 DSGVO verpflichtend; blockierend für jeden Pilotbetrieb
2. **Keine klickbare Demo** – Größtes operatives Risiko; Konzepte ohne Nutzervalidierung
3. **Legacy-Systeme der Behörden** – ALLEGRO und kommunale Jobcenter-Systeme können API-Standards nicht garantieren
4. **Audit-Log Immutabilität nur dokumentiert, nicht technisch gesichert** – Implementierungsdetails fehlen
5. **Stories für 5 Domänen fehlen** – Unternehmensgründung, Sozialleistungen, Jugendhilfe, Wohnsitz, Rechtsstreit ohne Story-Basis

---

*Diese Zusammenfassung reflektiert den Stand nach dem initialen arc42-Aufbau.*
*Zustandsbasiert dokumentiert – keine Versprechen über Zeitpunkte.*
