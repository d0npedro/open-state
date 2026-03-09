# REPO_REWRITE_SUMMARY – Domäne Arbeitsverwaltung

**Zweck:** Dokumentation aller Änderungen und Neuerstellungen im Rahmen der Arbeitsverwaltungs-Domäne.
**Scope:** Neue Domänendokumentation + Integration in bestehende Projektstruktur.

---

## 1. Neu erstellte Dateien

### Domänendokumentation (neu)

| Datei | Inhalt |
|-------|--------|
| `docs/domains/arbeitsverwaltung/README.md` | Überblick, Zielbild, Kernprobleme, Prinzipien, Nutzen, Dokumentenübersicht |
| `docs/domains/arbeitsverwaltung/01_PROBLEMRAUM_UND_ZIELBILD.md` | Detaillierte Ist-Situation, Zielzustand, messbare Zielkennzahlen |
| `docs/domains/arbeitsverwaltung/02_BENUTZERROLLEN_UND_AKTEURE.md` | Alle 8 Rollen mit Sichtrechten, Handlungsmöglichkeiten, Rollenmatrix |
| `docs/domains/arbeitsverwaltung/03_KERNPROZESSE.md` | 8 vollständige Prozessbeschreibungen (A–H) mit User Journeys |
| `docs/domains/arbeitsverwaltung/04_FALLAKTE_UND_STATUSMODELL.md` | Fallaktenstruktur, Statusmodell (13 Zustände), 24 Ereignistypen mit Begründungen |
| `docs/domains/arbeitsverwaltung/05_TRANSPARENZ_UND_NACHVOLLZIEHBARKEIT.md` | Was Bürger sehen, Statusdarstellung, Rückfragen-UX, Bescheid-Overlay |
| `docs/domains/arbeitsverwaltung/06_DATENMODELL_UND_API_SKIZZE.md` | 6 Kernentitäten, API-Endpunkte, Datenschutzmodell, Event-Streaming |
| `docs/domains/arbeitsverwaltung/07_RISIKEN_GRENZEN_RECHTLICHE_OFFENHEIT.md` | 7 offene Rechtsfragen, Datenschutzrisiken, Grenzen des Systems |
| `docs/domains/arbeitsverwaltung/08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md` | 6 Kostentreiber mit Einsparlogik, qualitative Effizienzgewinne |
| `docs/domains/arbeitsverwaltung/09_UX_PRINZIPIEN.md` | 13 UX-Prinzipien mit konkreten Formulierungsbeispielen |

---

## 2. Angepasste bestehende Dateien

| Datei | Art der Änderung |
|-------|----------------|
| `README.md` | Neue „Kerndomänen"-Sektion mit Arbeitsverwaltung als erstem Domäneneintrag; Modul D1 in Projektdokumentationstabelle |
| `docs/01_Master_Blueprint.md` | Modul 2.5 „Arbeitsverwaltung" mit 9 Kernleistungen hinzugefügt |
| `architecture/05_Systemarchitektur.md` | Arbeitsverwaltungs-Adapter im Mermaid-Diagramm; BA/Jobcenter im Behörden-Backendsystem; neuer Abschnitt 9 „Domänen-Architektur Arbeitsverwaltung" mit eigenem Mermaid-Diagramm, Schnittstellentabelle und Rollentabelle |
| `roadmap/09_Monetarisierung_Finanzmodell.md` | Neuer Unterabschnitt 3.3 mit Effizienzrendite-Beispiel für Domäne Arbeitsverwaltung |

---

## 3. Arbeitsverwaltung in zentralen Außenwirkungsdokumenten

### Was wurde wo ergänzt

**README.md:**
- Neue Tabelle „Kerndomänen" mit Arbeitsverwaltung als prominenter erster Eintrag
- Direktlink zur Domänendokumentation

**Master Blueprint:**
- Modul 2.5 auf Augenhöhe mit anderen Modulen (Wohnsitz, Steuern, CaseMatch, Sozialleistungen)
- 9 Kernergebnisse dieser Domäne benannt

**Systemarchitektur:**
- Vollständiger Domänen-Architektur-Abschnitt mit Mermaid-Diagramm
- Arbeitsverwaltungs-Adapter als gleichwertige Komponente neben FA, JUS, KBA, GEW
- BA-Backend und Jobcenter-Backend als Behörden-Backendsysteme aufgenommen
- API-Scope-Schema für Arbeitsverwaltung dokumentiert

**Finanzmodell:**
- Konkrete Effizienzrendite-Logik für Arbeitsverwaltung als Domänen-Beispiel

---

## 4. Geschärfte Nutzenargumente

### Vorher (allgemein)
- „Sozialleistungen in < 3 Minuten beantragen"
- Abstrakte ROI-Nennung ohne Domänenbezug

### Nachher (konkret Arbeitsverwaltung)
- 6 benannte Kostentreiber mit konkreter Einsparlogik (Statusanfragen, Erstantragsqualität, Rückfragezyklen, Fehlbescheide, Doppelerfassung, Terminchaos)
- Strukturelle Effizienzargumentation ohne Fantasiezahlen
- Qualitative Effizienzgewinne (Ressourcennutzung Fachpersonal, Vertrauenskapital) explizit benannt
- Klare Aussage: valide Quantifizierung erst nach Pilotbetrieb

---

## 5. Offen markierte Annahmen

Alle folgenden Punkte sind im Dokument explizit als offen markiert und bedürfen fachlicher oder juristischer Prüfung:

| Punkt | Datei | Art der Offenheit |
|-------|-------|------------------|
| Zuständigkeitsabgrenzung SGB II / SGB III | 07_RISIKEN | Rechtliche Klärung + institutionelle Abstimmung |
| Digitale Vollmachten (§ 13 SGB X) | 07_RISIKEN | Formklärung, ggf. gesetzliche Klarstellung |
| Anhörungspflicht (§ 24 SGB X) digital | 07_RISIKEN | Prozessrechtliche Spezifikation |
| Akteneinsichtsrecht vs. Schutz Deliberation | 07_RISIKEN | Grenzziehung mit Datenschutzbehörden |
| Schriftformerfordernis bei Bescheiden | 07_RISIKEN | Mapping welche Bescheidtypen rein digital möglich |
| Datenschutz-Folgenabschätzung (DSFA) | 07_RISIKEN | Verpflichtend vor Pilotierung (Art. 35 DSGVO) |
| Digitale Vollmachtserteilung in der App | 02_AKTEURE | Rechtliche Prüfung |
| Jobcenter-Adapter-Datenstandardisierung | 06_DATENMODELL | Föderale Abstimmung mit IT-Planungsrat + BMAS |
| Aufbewahrungsfristen für Fallakten | 06_DATENMODELL | § 304 SGB III + länderspezifische Regelungen |
| Zumutbarkeitsprüfung (§ 140 SGB III) digital | 03_KERNPROZESSE | Keine automatisierte Prüfung; juristische Gestaltung |

---

## 6. Stellen mit Prüfbedarf (fachlich, juristisch, politisch)

### Juristisch zwingend vor Pilotierung

1. **DSFA** für die gesamte Domäne Arbeitsverwaltung (Art. 35 DSGVO)
2. **Klärung Schriftformäquivalenz** (§ 36a SGB I) für alle Bescheidtypen
3. **Vollmachtsmodul** (§ 13 SGB X) – Formklärung
4. **Anhörungsworkflow** (§ 24 SGB X) – Prozessspezifikation

### Fachlich mit BA und Jobcenter abzustimmen

5. **ALLEGRO-Schnittstellendefinition** – technische API-Spezifikation mit BA
6. **SGB-II-Datenstandardisierung** – mit kommunalen Trägern und IT-Planungsrat
7. **Priorisierungslogik** – Bias-Audit-Anforderungen festlegen
8. **Arbeitgeberbescheinigung digital** – § 312 SGB III, Formklärung

### Politisch / föderaler Abstimmungsbedarf

9. **Staatsvertrag oder Rahmengesetz** für bundesweiten Jobcenter-Zugang
10. **Datenschutzbeauftragte Länder** einbeziehen (Jobcenter = kommunale Zuständigkeit)

---

## 7. Was diese Domäne bewusst nicht tut

- Keine automatisierten Verwaltungsakte
- Keine KI-Entscheidungen ohne menschliche Bestätigung
- Keine Profilbildung über gesetzlichen Zweck hinaus
- Kein Stellenabbau durch Automatisierung
- Keine Leistungsreduzierung durch Effizienzoptimierung
- Keine zeitgebundenen Versprechen über Einführungszeitraum

---

*Alle Änderungen sind im Git-Log nachvollziehbar.*
*Diese Dokumentation folgt dem Grundsatz: Was nicht gelöst ist, wird offen gesagt.*
