# US-KJ-008 – Politische Vorlage vorbereiten und freigeben

**Story-ID:** US-KJ-008
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Sachgebiet Planung (Erstellung) / Jugendamtsleitung (Freigabe)

---

## User Story

Als Jugendamtsleitung
möchte ich strukturierte Berichtsvorlagen für politische Gremien auf Basis aktueller Daten freigeben,
damit politische Entscheidungen auf belastbarer, nachvollziehbarer Grundlage getroffen werden – und nicht auf Präsentationen, deren Datenbasis unklar ist.

---

## Kontext

Vorlagen für den Jugendhilfeausschuss oder Stadtrat werden heute oft mit erheblichem manuellen Aufwand erstellt. Die Datenbasis ist nicht immer transparent dokumentiert. Politische Gremien können nicht einschätzen, wie aktuell oder vollständig die Zahlen sind. Das Vertrauen in die Datenbasis schwächt die Entscheidungsqualität.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Politikwert** | Entscheidungen auf belastbarer, datierter, nachvollziehbarer Grundlage |
| **Verwaltungswert** | Signifikant reduzierter Aufwand für Vorlagenerstellung |
| **Transparenzwert** | Methodik und Datenbasis sind Teil der Vorlage, nicht verborgen |

---

## Akzeptanzkriterien

1. Die Vorlage wird aus dem aktuellen Steuerungslagebild automatisch als Entwurf erzeugt.
2. Sachgebiet kann Entwurf bearbeiten, kommentieren und ergänzen.
3. Freigabe erfolgt durch die Jugendamtsleitung – aktiv, mit Bestätigung des Inhalts.
4. Freigegebene Vorlagen erhalten einen unveränderlichen Zeitstempel und Freigabe-Nachweis.
5. Vorlage enthält Methodikabschnitt: welche Daten, welcher Zeitraum, welche Einschränkungen.
6. Vorlage ist als PDF exportierbar (für Gremiensitzungen).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Entwurf in Bearbeitung | Sachgebiet bearbeitet | Bearbeitungsstatus, Version, Kommentare |
| Zur Freigabe vorgelegt | An JA-Leitung weitergeleitet | Status „Wartet auf Freigabe" |
| Freigegeben | JA-Leitung hat bestätigt | Freigabestempel, Export-Button |
| Zurückgegeben | Korrektur angefordert | Korrekturhinweis, Bearbeitungshistorie |

---

## Nicht-Ziele

- Kein automatisches Erstellen von Beschlussvorlagen ohne menschliche Redaktion
- Kein Versand an Gremien ohne aktive Freigabe
- Kein Ersetzen von Fachabwägungen durch Systemvorschläge

---

## Offene fachliche Fragen

- Welche Anforderungen haben verschiedene Gremien an das Vorlagenformat?
- Wie wird mit vertraulichen Teilen (z. B. nicht öffentlicher Teil einer Sitzung) umgegangen?

---

## Verwandte Stories

- US-KJ-007 – Bedarfsplanungsentwurf erstellen (Quelldaten für Vorlage)
- US-KJ-009 – Öffentlichen Transparenzbericht einsehen (Öffentlichkeit erhält freigegebene Teilmenge)
