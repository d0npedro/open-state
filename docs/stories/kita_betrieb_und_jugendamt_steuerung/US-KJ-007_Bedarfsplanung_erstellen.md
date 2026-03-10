# US-KJ-007 – Bedarfsplanungsentwurf erstellen

**Story-ID:** US-KJ-007
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Sachgebiet Planung und Berichtswesen

---

## User Story

Als Planungsverantwortliche im Jugendamt
möchte ich auf Basis der aktuellen Versorgungsdaten einen strukturierten Bedarfsplanungsentwurf erstellen,
damit die Planung auf belastbaren aktuellen Zahlen basiert und nicht auf Jahresberichten, die 18 Monate alt sind.

---

## Kontext

Die gesetzliche Pflicht zur Bedarfsplanung (§ 80 SGB VIII) verlangt eine kontinuierliche Einschätzung des Bedarfs an Kindertagesbetreuung. In der Praxis erfolgt dies oft auf Basis von Jahresberichten und Schätzungen. Aktuelle Daten aus dem laufenden Betrieb stehen nicht strukturiert zur Verfügung.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Planungswert** | Bedarfsplanung auf aktueller Datenbasis |
| **Rechtswert** | Dokumentierter Nachweis der Planungspflicht nach § 80 SGB VIII |
| **Politikwert** | Sachliche Grundlage für Investitionsentscheidungen |

---

## Akzeptanzkriterien

1. Der Entwurf zeigt für jeden Planungsraum: aktuellen Versorgungsgrad, Wartelistendruck, laufende Maßnahmen und erwartete Kapazitätsveränderungen.
2. Die Planungslücke (Bedarf minus vorhandenes + geplantes Angebot) ist je Region ausgewiesen.
3. Der Entwurf enthält einen Zeitraumbezug und ist versioniert.
4. Alle Kennzahlen im Entwurf sind mit Quelle und Datenstand belegt.
5. Der Entwurf enthält keine automatische Handlungsempfehlung – die Einschätzung bleibt Aufgabe der Planung.
6. Entwurf kann kommentiert und vor Freigabe an die JA-Leitung weitergeleitet werden.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Entwurf | In Bearbeitung, noch nicht freigegeben | Bearbeitungsstatus, Kommentarfeld |
| Zur Freigabe | Fertig, wartet auf JA-Leitung | Weiterleitung-Button mit Empfängerbestätigung |
| Freigegeben | Von JA-Leitung bestätigt | Freigabestempel, unveränderliche Version |

---

## Nicht-Ziele

- Keine automatische Empfehlung für konkrete Maßnahmen (z. B. „Bau in Stadtteil X empfohlen")
- Keine Bewertung von Trägerleistungen
- Kein Ersatz für den politischen Beschluss über Investitionen

---

## Offene fachliche Fragen

- Wie werden demografische Prognosedaten eingebunden (Einwohnerzahl nach Altersgruppe je Region)?
- Welche Schnittstelle zu amtlichen Statistikdaten ist realisierbar?
- Wie wird mit erheblicher Datenunsicherheit (fehlende Einrichtungsmeldungen) transparent umgegangen?

---

## Rechtliche / Policy-Offenheit

- § 80 SGB VIII: Inhalt und Form der Bedarfsplanung sind gesetzlich geregelt, aber wenig spezifiziert
- Landesrecht präzisiert Anforderungen je Bundesland unterschiedlich
- Datenschutzrechtliche Anforderungen an Planungsdatenbank

---

## Verwandte Stories

- US-KJ-005 – Versorgungslagebild abrufen
- US-KJ-006 – Engpass-Regionen identifizieren
- US-KJ-008 – Politische Vorlage freigeben (nutzt Planungsentwurf)
