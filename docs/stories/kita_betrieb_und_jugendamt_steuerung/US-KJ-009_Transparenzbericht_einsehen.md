# US-KJ-009 – Öffentlichen Transparenzbericht einsehen

**Story-ID:** US-KJ-009
**Domäne:** Kita-Betrieb & Jugendamt-Steuerung
**Status:** ENTWURF
**Primäre Rolle:** Öffentlichkeit / interessierte Bürger / Gremien

---

## User Story

Als interessierter Bürger und Vater eines Kleinkindes
möchte ich in meiner Stadt nachvollziehen können, wie viele Kitaplätze verfügbar sind, wo die Wartelisten lang sind und was die Stadt dagegen unternimmt,
damit ich mir ein eigenes, sachlich begründetes Bild von der Versorgungslage machen kann.

---

## Kontext

Heute sind öffentliche Informationen zur Kitaversorgung entweder nicht vorhanden, schwer zugänglich oder auf Presseberichte und Jahresberichte beschränkt. Bürgerinnen und Bürger können die Versorgungslage nicht selbst einschätzen. Das schwächt das Vertrauen in die kommunale Infrastruktur.

---

## Nutzen

| Dimension | Beschreibung |
|-----------|-------------|
| **Bürgerwert** | Nachvollziehbares Bild der Versorgungslage ohne Behördenumweg |
| **Demokratiewert** | Basis für informierte Beteiligung und öffentliche Debatte |
| **Vertrauenswert** | Öffentliche Darstellung von Engpässen ohne Weichzeichnung schafft Glaubwürdigkeit |

---

## Akzeptanzkriterien

1. Der Bericht zeigt: Auslastungsgrad, freie Plätze, Wartelistenbestand – gesamt und je Region.
2. Methodik und Definitionen sind auf der Berichtsseite erreichbar – kein Extra-Klick erforderlich.
3. Datenstand und letzte Aktualisierung sind sichtbar.
4. Der Bericht ist ohne Registrierung zugänglich.
5. Einschränkungen und Datenlücken sind sichtbar dokumentiert (keine Hochglanzdarstellung).
6. Ein Download der Rohdaten (CSV) ist möglich.

---

## UI-Zustände

| Zustand | Beschreibung | Sichtbares UI-Element |
|---------|-------------|----------------------|
| Aktuell | Freigegebener Bericht vorhanden | Bericht mit Datenstand und Aktualitätsstempel |
| Veraltet | Bericht älter als definierter Zeitraum | Hinweis auf Aktualitätslücke |
| Datenlücke | Einrichtungen fehlen im Bericht | Transparenter Hinweis, welcher Umfang fehlt |

---

## Nicht-Ziele

- Keine einrichtungsbezogene Darstellung (keine Qualitätsbewertung einzelner Kitas)
- Keine personenbezogenen Daten (Kinder, Eltern, Personal)
- Keine politischen Bewertungen oder Werbung für Verwaltungsleistungen

---

## Offene fachliche Fragen

- Welche Granularität ist für öffentliche Regionendaten zulässig (Stadtbezirk vs. Sozialraum vs. Planungsraum)?
- Welche Mindesteinrichtungsanzahl verhindert Rückschlüsse auf Einzeleinrichtungen?
- Rechtlicher Rahmen für öffentliche Datenbereitstellung (IFG, Open-Data-Gesetze je Bundesland)?

---

## Verwandte Stories

- US-KJ-008 – Politische Vorlage freigeben (Freigabeprozess)
- US-KJ-010 – Zeitreihen und Regionenvergleich analysieren (Analysefunktionen im öffentlichen Bericht)
