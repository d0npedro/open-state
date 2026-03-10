# US-KJ-002 – Belegungsstand einsehen

**Story-ID:** US-KJ-002
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Kita-Leitung

---

## User Story

Als Kita-Leitung
möchte ich jederzeit auf einen Blick sehen, wie viele Plätze in meiner Einrichtung belegt, frei und reserviert sind,
damit ich Aufnahmegespräche planbar führen kann, ohne zuerst manuell zu zählen.

---

## Kontext

Die Belegungssituation ist heute in den meisten Einrichtungen nicht tagesgenau abrufbar. Leitungen müssen manuell zählen oder sich auf mentale Buchhaltung verlassen. Bei Trägerüberblicken oder Anfragen des Jugendamts entsteht regelmäßig Aufwand für eine eigentlich einfache Frage.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Einrichtungswert** | Sofortiger Überblick ohne Zählaufwand |
| **Verwaltungswert** | Grundlage für Kapazitätsmeldungen ohne manuelle Aufbereitung |
| **Transparenzwert** | Nachvollziehbarer Belegungsstand für Trägerkommunikation und Jugendamt |

---

## Akzeptanzkriterien

1. Die Ansicht zeigt je Gruppe: genehmigte Plätze / belegte Plätze / freie Plätze / reservierte Plätze.
2. Zeitlicher Stand ist sichtbar (z. B. „aktuell" vs. „letzter Werktag").
3. Einschränkungen (z. B. Gruppe temporär geschlossen) werden sichtbar erklärt.
4. Die Ansicht ist auf Einrichtungsebene aggregiert einsehbar (Gesamtübersicht).
5. Ein Export der Belegungsübersicht ist möglich (CSV oder PDF).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Vollständig belegt | Keine freien Plätze | Deutliche visuelle Markierung, Hinweis auf Warteliste |
| Freie Plätze vorhanden | Mindestens 1 freier Platz | Anzahl freier Plätze prominent dargestellt |
| Temporäre Einschränkung | Gruppe geschlossen oder reduziert | Erklärungshinweis mit Dauer |
| Daten veraltet | Letzte Erfassung > 3 Tage | Hinweis auf fehlende Aktualisierung |

---

## Nicht-Ziele

- Keine Darstellung einzelner Kinder oder Vertragsdaten mit Personenbezug
- Keine direkte Bearbeitungsfunktion für Belegungen (eigenständiger Prozess)

---

## Offene fachliche Fragen

- Ab welcher zeitlichen Lücke gilt der Belegungsstand als „nicht aktuell"?
- Wie werden vorübergehende Platzsperrungen (z. B. Renovierung) vom regulären Leerstand unterschieden?

---

## Verwandte Stories

- US-KJ-001 – Tagesstand erfassen (liefert Basisdaten)
- US-KJ-005 – Versorgungslagebild abrufen (nutzt aggregierte Belegungsdaten)
