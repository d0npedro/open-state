# US-KJ-006 – Engpass-Regionen identifizieren

**Story-ID:** US-KJ-006
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Sachgebiet Planung und Berichtswesen

---

## User Story

Als Planungsmitarbeiterin im Jugendamt
möchte ich auf einen Blick sehen, in welchen Planungsräumen die Nachfrage das verfügbare Angebot übersteigt,
damit wir Ressourcen zielgerichtet einsetzen und Engpässe frühzeitig erkennen – bevor sie politisch eskalieren.

---

## Kontext

Ohne strukturierte Übersicht werden Engpässe oft erst sichtbar, wenn Eltern sich beschweren oder Meldungen im Stadtrat landen. Eine laufende, nachvollziehbare Engpassanalyse ermöglicht proaktives Handeln und schafft eine sachliche Grundlage für Prioritätsentscheidungen.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Planungswert** | Frühzeitige Erkennung von Versorgungsengpässen |
| **Politikwert** | Objektive Priorisierungsgrundlage ohne subjektiven Lobbyeinfluss |
| **Transparenzwert** | Engpässe sind nachvollziehbar belegt, nicht behauptet |

---

## Akzeptanzkriterien

1. Alle Planungsräume werden nach Wartelistendruck (Anfragen je freiem Platz) sortiert angezeigt.
2. Farbliche Differenzierung zwischen Planungsräumen (kein Ampelsystem, sondern kontinuierliche Skala mit Zahlenwert).
3. Zeitvergleich: Wie hat sich der Wartelistendruck gegenüber dem Vorquartal verändert?
4. Klick auf Planungsraum öffnet Detailsicht: Einrichtungsanzahl, Auslastungsgrad, Warteliste, laufende Maßnahmen.
5. Bericht ist exportierbar.
6. Methodik (wie wird „Engpass" definiert?) ist direkt erreichbar.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Übersicht | Alle Regionen sichtbar | Tabelle oder Visualisierung mit Kennzahlen |
| Detail-Drilldown | Einzelner Planungsraum | Kennzahlen, Einrichtungen, Maßnahmen |
| Trendanzeige | Vergleich Vorperiode | Delta-Wert je Region |

---

## Nicht-Ziele

- Keine automatische Empfehlung, wo gebaut werden soll
- Keine Bewertung von Einrichtungen oder Trägern
- Keine Darstellung auf Einrichtungsebene in öffentlichen Ansichten

---

## Offene fachliche Fragen

- Wie wird mit Planungsräumen umgegangen, die sehr wenige Einrichtungen haben (statistische Unsicherheit)?
- Welche räumliche Granularität ist sinnvoll (Stadtbezirk, Sozialraum, Gemeinde)?

---

## Verwandte Stories

- US-KJ-005 – Versorgungslagebild abrufen (Gesamtübersicht)
- US-KJ-007 – Bedarfsplanungsentwurf erstellen (Engpässe als Planungsgrundlage)
- US-KJ-009 – Öffentlichen Transparenzbericht einsehen (aggregierte Engpassdarstellung)
