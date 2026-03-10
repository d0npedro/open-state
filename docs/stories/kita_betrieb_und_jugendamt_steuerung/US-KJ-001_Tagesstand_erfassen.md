# US-KJ-001 – Tagesstand erfassen

**Story-ID:** US-KJ-001
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Fachkraft in der Kita / Kita-Leitung

---

## User Story

Als Fachkraft in einer Kindertageseinrichtung
möchte ich täglich in wenigen Schritten erfassen, welche Kinder und welches Personal anwesend sind,
damit ich nicht mehr Papierformulare führen oder manuell zählen muss
und damit ein belastbarer Tagesstand entsteht, der auch für Meldungen genutzt werden kann.

---

## Kontext

Heute werden Anwesenheiten in den meisten Einrichtungen auf Papier oder in Excel erfasst. Die Daten sind nicht aggregierbar, nicht für Monatsberichte nutzbar und müssen bei Bedarf manuell aufbereitet werden. Das bindet Zeit, die für pädagogische Arbeit fehlt.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Einrichtungswert** | Kein Papier, kein doppeltes Erfassen, sofortiger Tagesüberblick |
| **Verwaltungswert** | Strukturierte Daten als Basis für Monatsberichte und Meldungen |
| **Transparenzwert** | Lückenloser Nachweis für Förderabrechnungen und Betriebskontrollen |

---

## Akzeptanzkriterien

1. Die Erfassung eines Tagesstands (Anwesenheiten, Personal) ist in unter 3 Minuten abgeschlossen.
2. Für jede Gruppe können Kinder als anwesend / krank / Urlaub / sonstiges markiert werden.
3. Personalstunden (geplant / ist) werden je Gruppe erfasst – kein Personenname im Hauptsystem.
4. Eine Unterschreitung des Personalschlüssels wird sichtbar markiert, aber nicht automatisch gemeldet.
5. Der Tagesstand ist nach Freigabe durch die Leitung gesperrt gegen nachträgliche Änderung (Revisionssicherheit).
6. Die Erfassung funktioniert auch ohne dauerhaft stabile Internetverbindung (Offline-Modus als Anforderung an Produktdesign).

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Noch nicht erfasst | Tagesstand für heute fehlt | Aufforderung zur Erfassung mit Datumsbezug |
| In Erfassung | Gruppenweise Eingabe | Strukturiertes Eingabeformular je Gruppe |
| Zur Freigabe bereit | Erfassung abgeschlossen | Freigabe-Button mit Zusammenfassung |
| Freigegeben | Tagesstand bestätigt | Schreibschutz, Zeitstempel sichtbar |

---

## Nicht-Ziele

- Keine Erfassung von Kindernamen oder personenbezogenen Kinddaten im zentralen System
- Keine automatische Meldung an das Jugendamt – Freigabe ist Pflicht
- Keine Kommunikation mit Eltern über diesen Kanal

---

## Offene fachliche Fragen

- Wie wird Offline-Funktionalität technisch realisiert?
- Welche minimalen Pflichtfelder sind für eine vollständige Tageserfassung rechtlich notwendig?
- Wie wird mit nachträglichen Korrekturen umgegangen (z. B. Fehleingabe bemerkt am Folgetag)?

---

## Rechtliche / Policy-Offenheit

- DSGVO-Konformität der Tageserfassung (welche Daten überhaupt verarbeitet werden dürfen)
- Betriebsrat-/Personalrat-Zustimmung für digitale Anwesenheitserfassung von Fachkräften
- Fördernachweispflichten je Bundesland: welche Daten in welchem Format nachgewiesen werden müssen

---

## Verwandte Stories

- US-KJ-002 – Belegungsstand einsehen (nutzt dieselbe Datenbasis)
- US-KJ-003 – Monatsbericht abrufen (aggregiert Tagesstände)
- US-KJ-004 – Meldung prüfen und freigeben (verwendet freigegebene Tagesstände)
