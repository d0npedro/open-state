# US-KJ-005 – Versorgungslagebild abrufen

**Story-ID:** US-KJ-005
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Sachgebiet Planung und Berichtswesen (Jugendamt)

---

## User Story

Als Planungsmitarbeiterin im Jugendamt
möchte ich jederzeit ein aktuelles Lagebild zur Kindertagesbetreuung in meinem Zuständigkeitsbereich abrufen können,
damit ich nicht erst bei allen Einrichtungen nachfragen muss und Steuerungsentscheidungen auf belastbarer, aktueller Grundlage treffen kann.

---

## Kontext

Heute werden Lagebilder entweder gar nicht laufend erstellt oder manuell aus heterogenen Meldungen zusammengestellt. Das Ergebnis ist veraltet, unvollständig und für politische Prozesse kaum nutzbar. Gleichzeitig sind die Einrichtungen durch Einzelabfragen belastet.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Planungswert** | Belastbare Entscheidungsgrundlage ohne Zusatzabfragen |
| **Einrichtungsentlastung** | Keine weiteren Einzelanfragen an Kitas für Standardkennzahlen |
| **Transparenzwert** | Lagebilder sind nachvollziehbar – Kennzahlen sind definiert und datiert |

---

## Akzeptanzkriterien

1. Das Lagebild zeigt: genehmigte Plätze, real nutzbare Plätze, belegte Plätze, freie Plätze, Auslastungsgrad – gesamt und je Planungsraum.
2. Wartelistenbestand und Entwicklung der letzten 3 Monate sind sichtbar.
3. Personalausfallquote (kommunaler Durchschnitt) ist sichtbar.
4. Einrichtungen mit fehlenden oder veralteten Meldungen sind als „Datenlücke" markiert – nicht ignoriert.
5. Alle Kennzahlen sind mit Definition und Datenstand verknüpft.
6. Das Lagebild ist auf Gesamtkommune- und Planungsraumebene filterbar.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Aktuell | Alle Meldungen vollständig | Vollständiges Lagebild mit Zeitstempel |
| Datenlücken | Einrichtungen fehlen | Kennzeichnung fehlender Einrichtungen, Gesamtbild mit Vorbehalt |
| Engpass erkannt | Planungsraum mit kritischer Auslastung | Hervorhebung ohne Alarmlanguage |

---

## Nicht-Ziele

- Kein direkter Zugriff auf operative Rohdaten der Einrichtungen
- Keine automatische Maßnahmenempfehlung
- Keine Bewertung einzelner Einrichtungen

---

## Offene fachliche Fragen

- Welche Aggregationsstufen sind sinnvoll (Planungsraum, Stadtbezirk, gesamte Kommune)?
- Wie werden Einrichtungen in Randlagen oder mit Sonderstatus (z. B. betriebliche Kitas) einbezogen?

---

## Verwandte Stories

- US-KJ-004 – Meldung freigeben (liefert Daten)
- US-KJ-006 – Engpass-Regionen identifizieren (vertieft die Lagebild-Analyse)
- US-KJ-007 – Bedarfsplanungsentwurf erstellen (baut auf Lagebild auf)
