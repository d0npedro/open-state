# US-KJ-004 – Meldung prüfen und freigeben

**Story-ID:** US-KJ-004
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Kita-Leitung

---

## User Story

Als Kita-Leitung
möchte ich die vom System vorbereitete Monatsmeldung für das Jugendamt prüfen und aktiv freigeben,
damit ich Verantwortung für den übermittelten Inhalt trage und keine Daten ohne meine Kenntnis weitergegeben werden.

---

## Kontext

Meldungen an das Jugendamt werden heute manuell erstellt, was fehleranfällig und zeitaufwändig ist. Das Gegenteil – vollautomatische Übermittlung ohne Kontrolle – ist keine akzeptable Alternative: Die Leitung muss wissen und bestätigen, was gemeldet wird.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Einrichtungswert** | Kein manuelles Aufbereiten der Meldedaten mehr |
| **Verwaltungswert** | Einheitliches Meldungsformat, kein Nachfrageprozess |
| **Transparenzwert** | Freigabe ist dokumentiert – nachvollziehbar, wann wer was gemeldet hat |

---

## Akzeptanzkriterien

1. Das System bereitet die Monatsmeldung automatisch aus den freigegebenen Tagesständen vor.
2. Die Leitung sieht den vollständigen Meldeinhalt vor Freigabe – kein Blindübermitteln.
3. Die Leitung kann einzelne Werte vor Freigabe korrigieren (mit Dokumentation der Korrektur).
4. Die Freigabe erfolgt durch aktiven Bestätigungsschritt (keine stillen Übertragungen).
5. Nach Freigabe wird Zeitstempel, Rollenbezeichnung und Freigabe-ID gespeichert.
6. Eine eingegangene Meldung beim Jugendamt ist für die Leitung einsehbar (Eingangsdatum, Inhalt).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Meldung bereit | Automatisch aufbereitet, wartet auf Freigabe | Übersicht mit Freigabe-Button |
| Korrektur erforderlich | Leitung hat Abweichung markiert | Korrekturmaske mit Begründungsfeld |
| Freigegeben | Meldung übermittelt | Bestätigung mit Zeitstempel |
| Überfällig | Meldefrist überschritten | Hinweis auf Verzug, kein automatisches Senden |

---

## Nicht-Ziele

- Keine automatische Meldungsübermittlung ohne Freigabe
- Kein Zugriff des Jugendamts auf unfreigegebene Meldungsentwürfe

---

## Offene fachliche Fragen

- Welche Meldungen sind gesetzlich vorgeschrieben (SGB VIII, Landesrecht) und in welchem Zyklus?
- Wie werden Korrekturen nach bereits erfolgter Freigabe behandelt (Korrekturmeldung)?
- Wie wird mit Meldeverzug umgegangen (Erinnerung, Eskalation)?

---

## Rechtliche / Policy-Offenheit

- Rechtsgrundlage für digitale Meldungsübermittlung je Bundesland unterschiedlich
- Formvorschriften für Meldungen (Schriftform, qualifizierte Signatur?) noch zu klären

---

## Verwandte Stories

- US-KJ-003 – Monatsbericht abrufen (Datenbasis für die Meldung)
- US-KJ-005 – Versorgungslagebild abrufen (empfängt freigegebene Meldungen)
