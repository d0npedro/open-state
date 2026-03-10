# US-KJ-010 – Zeitreihen und Regionenvergleich analysieren

**Story-ID:** US-KJ-010
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Öffentlichkeit / Gremien / Forschende / Journalismus

---

## User Story

Als Journalistin, die über kommunale Infrastruktur berichtet,
möchte ich Kennzahlen zur Kitaversorgung über Zeit und nach Stadtteilen vergleichen können,
damit ich belastbare, datengestützte Berichte schreiben kann, ohne auf Anfragen bei der Behörde angewiesen zu sein.

---

## Kontext

Datenjournalismus und öffentliche Rechenschaftsarbeit erfordern Zugang zu maschinenlesbaren, historischen Daten. Heute ist dieser Zugang kaum vorhanden. Berichte über die Kitaversorgung basieren daher oft auf Einzelaussagen, Pressemitteilungen oder veralteten Jahresberichten – nicht auf belastbarer Zeitreihenanalyse.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Eigenständige, informierte Einschätzung der Entwicklung |
| **Demokratiewert** | Unabhängige Kontrollfunktion durch Öffentlichkeit und Presse |
| **Forschungswert** | Nutzbare Datenbasis für kommunale und sozialwissenschaftliche Forschung |

---

## Akzeptanzkriterien

1. Zeitreihen sind für alle Kernkennzahlen über mindestens 12 Monate rückwirkend darstellbar.
2. Regionenfilter: Bericht kann auf einzelne Planungsräume oder Stadtbezirke eingegrenzt werden.
3. Vergleichsfunktion: Zwei Regionen können nebeneinander mit denselben Kennzahlen verglichen werden.
4. Export: Gefilterte Daten als CSV, vollständige Zeitreihentabelle als Download.
5. Methodik ist je Kennzahl einblendbar – kein separates Dokument, direkt im Analysebereich.
6. Datenlücken und Änderungen in der Berechnungsmethodik sind im Zeitverlauf sichtbar markiert.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Standardansicht | Gesamtkommune, aktueller Zeitraum | Zeitreihe mit Filter-Controls |
| Gefiltert | Planungsraum oder Zeitraum gewählt | Angepasste Darstellung |
| Vergleichsansicht | Zwei Regionen nebeneinander | Spaltenweise Gegenüberstellung |
| Methodikansicht | Kennzahl-Definition geöffnet | Eingebetteter Erklärungsbereich |

---

## Nicht-Ziele

- Keine Darstellung von Einrichtungsindividualdaten
- Keine personenbezogenen Daten
- Keine automatische Bewertung von Trendentwicklungen

---

## Offene fachliche Fragen

- Wie lange werden historische Daten vorgehalten?
- Bei Methodikänderungen: Wie werden Zeitreihenbrüche transparent gemacht?
- Welche Lizenz gilt für exportierte Daten (Open Data, CC-BY, etc.)?

---

## Rechtliche / Policy-Offenheit

- Open-Data-Lizenzierung: Je nach Bundesland unterschiedlich geregelt
- Datenschutzrechtliche Zulässigkeit des maschinenlesbaren Exports (auch für aggregierte Daten)

---

## Verwandte Stories

- US-KJ-009 – Öffentlichen Transparenzbericht einsehen (Basisansicht)
- US-KJ-006 – Engpass-Regionen identifizieren (interne Perspektive derselben Daten)
