# US-KJ-003 – Monatsbericht abrufen

**Story-ID:** US-KJ-003
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Kita-Leitung

---

## User Story

Als Kita-Leitung
möchte ich am Ende eines Monats einen vollständigen Monatsbericht für meine Einrichtung abrufen können, ohne diesen manuell zusammenstellen zu müssen,
damit ich diese Zeit für Leitungsaufgaben nutze und nicht für Tabellenerstellung.

---

## Kontext

Monatliche Auswertungen (Anwesenheitsquoten, Auslastung, Personalstunden) werden heute von Leitungen manuell aus verschiedenen Quellen zusammengestellt. Für Jahresberichte, Trägernachweise und Förderabrechnungen ist dieser Aufwand erheblich und fehleranfällig.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Einrichtungswert** | Mehrere Stunden Aufwand pro Monat entfallen |
| **Verwaltungswert** | Konsistente, maschinenlesbare Auswertungen als Basis für Berichte |
| **Transparenzwert** | Nachvollziehbare Grundlage für Abrechnungen und Fördernachweise |

---

## Akzeptanzkriterien

1. Der Monatsbericht enthält: Anwesenheitsquote je Gruppe, Auslastungsgrad, Ausfallquote Personal, Anzahl Tage mit Unterschreitung Personalschlüssel.
2. Vorjahresmonat wird zum direkten Vergleich angezeigt.
3. Bericht ist als PDF und CSV exportierbar.
4. Alle Berechnungsgrundlagen sind im Bericht sichtbar (welche Tage, welche Gruppen, welche Definitionen).
5. Fehlende Tagesstände werden als Datenlücke ausgewiesen, nicht still aufgefüllt.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Vollständig | Alle Tagesstände erfasst | Vollständiger Bericht mit Export |
| Lückenhaft | Tagesstände fehlen | Bericht mit Hinweis auf Datenlücken, welche Tage fehlen |
| Noch nicht verfügbar | Monat noch nicht abgeschlossen | Vorschau auf bisherigen Stand mit Hinweis |

---

## Nicht-Ziele

- Keine automatische Übermittlung an den Träger oder das Jugendamt (eigenständige Freigabe erforderlich)
- Kein erweiterter Qualitätsbericht (pädagogische Einschätzungen etc.)

---

## Verwandte Stories

- US-KJ-001 – Tagesstand erfassen (Quelldaten)
- US-KJ-004 – Meldung prüfen und freigeben (nutzt Monatsdaten als Grundlage)
