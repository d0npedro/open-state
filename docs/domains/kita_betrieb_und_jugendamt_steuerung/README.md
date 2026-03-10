# Open State – Domäne: Kita-Betrieb & Jugendamt-Steuerung

**Bereich:** Kindertagesbetreuung · Betriebsunterstützung · Bedarfsplanung · Berichtswesen · Öffentliche Transparenz
**Status:** Konzeptioneller Ausgangszustand

---

## Zielbild

Kitas sind operative Einrichtungen mit intensiver Alltagsverwaltung: Belegungsführung, Personalplanung, Ausfallkommunikation, Meldepflichten, Dokumentationspflichten. Diese Arbeit wird heute weitgehend manuell, fragmentiert und ohne systemischen Steuerungsnutzen geleistet.

Open State überträgt den Grundsatz operativer Entlastung auf diesen Bereich:

> Einrichtungen arbeiten für ihren eigenen Betrieb – nicht als Datenzulieferer für Behörden.
> Steuerungsdaten entstehen als sinnvolle Ableitung aus guter Betriebsführung.

Das Jugendamt erhält dadurch laufend aktuelle, strukturierte Lagebilder – ohne Zusatzaufwand für Einrichtungen. Politische Gremien erhalten vorbereitete Berichtsvorlagen. Ein freigegebener Teil dieser Daten wird öffentlich als Transparenzbericht zugänglich gemacht.

---

## Drei Schichten – klar getrennt

```
┌─────────────────────────────────────────────────────────┐
│  TRANSPARENZSCHICHT   (öffentlich, freigegeben)         │
│  Aggregierte Kennzahlen · Trends · Methodik sichtbar    │
├─────────────────────────────────────────────────────────┤
│  STEUERUNGSSCHICHT    (intern, Jugendamt & Politik)     │
│  Lagebilder · Bedarfsplanung · Politische Vorlagen      │
├─────────────────────────────────────────────────────────┤
│  BETRIEBSSCHICHT      (einrichtungsintern, Kita)        │
│  Belegung · Personal · Anwesenheit · Meldungen          │
└─────────────────────────────────────────────────────────┘
```

Jede Schicht hat eigene Sichtbarkeitsregeln, Zugriffsrechte und Aggregationsstufen.
Der Übergang zwischen Schichten ist aktiv freizugeben – kein automatischer Durchgriff.

---

## Kernprobleme, die diese Domäne löst

| Problem | Folge heute | Ziel mit Open State |
|---------|------------|---------------------|
| Belegungsverwaltung in Excel/Papier | Fehleranfällig, nicht aggregierbar | Strukturierte, maschinenlesbare Belegungsführung |
| Meldungen manuell je Behörde | Mehrfacheingaben, Inkonsistenz | Einmal erfassen, strukturiert weitergeben |
| Jugendamt fragt Daten manuell ab | Zeitverzug, Vollständigkeit unklar | Laufende, automatisch erzeugte Lagebilder |
| Bedarfsplanung auf Basis veralteter Zahlen | Fehlinvestition, Unterversorgung | Aktuelle Grundlage für Planung |
| Öffentlichkeit hat keinen Einblick | Vertrauensverlust, keine Prüfbarkeit | Transparenzberichte mit nachvollziehbarer Methodik |
| Personalausfälle nicht systemisch sichtbar | Reaktives Handeln | Lagebilder mit Ausfallsituation je Region |

---

## Kernprinzipien dieser Domäne

1. **Operative Entlastung zuerst** – Kitas profitieren selbst davon, Daten zu pflegen
2. **Keine Doppelerfassung** – was für den eigenen Betrieb erfasst wird, dient als Basis für Berichte
3. **Menschliche Freigabe** – kein automatischer Durchgriff auf operative Rohdaten; Steuerungs- und Transparenzdaten werden aktiv freigegeben
4. **Datenschutz als Designprinzip** – keine personenbezogenen Daten in aggregierten Berichten; Kindeswohl hat höchste Priorität
5. **Nachvollziehbare Methodik** – jede Kennzahl ist definiert, jede Berechnungsgrundlage ist einsehbar
6. **Kein automatisierter Planungsentscheid** – Bedarfsplanung ist Vorschlag, Entscheidung liegt bei Menschen

---

## Beteiligte Rollen

| Rolle | Ebene | Funktion |
|-------|-------|---------|
| Kita-Leitung | Einrichtung | Betriebsführung, Freigabe von Meldungen |
| Fachkraft / Verwaltung Kita | Einrichtung | Tageserfassung, Anwesenheit, Dokumente |
| Jugendamtsleitung | Behörde | Strategische Steuerung, Genehmigungen |
| Sachgebiet Planung/Berichtswesen | Behörde | Lagebilder, Bedarfsplanung, politische Vorlagen |
| Politische Gremien | Steuerung | Entscheidung auf Basis von Vorlagen |
| Öffentlichkeit / Bürger | Extern | Einsicht in Transparenzberichte |

---

## Dokumentenübersicht

| Datei | Inhalt |
|-------|--------|
| [01_PROBLEMRAUM_UND_ZIELBILD.md](01_PROBLEMRAUM_UND_ZIELBILD.md) | Ist-Zustand, Problemtiefe, angestrebtes Zielbild |
| [02_BENUTZERROLLEN_UND_AKTEURE.md](02_BENUTZERROLLEN_UND_AKTEURE.md) | Alle Rollen, Rechte, Zugriffsebenen |
| [03_OPERATIVE_PROZESSE_IN_DER_KITA.md](03_OPERATIVE_PROZESSE_IN_DER_KITA.md) | Belegung, Personal, Meldungen, Auswertungen |
| [04_JUGENDAMT_STEUERUNG_UND_BERICHTSWESEN.md](04_JUGENDAMT_STEUERUNG_UND_BERICHTSWESEN.md) | Lagebilder, Bedarfsplanung, politische Vorlagen |
| [05_OEFFENTLICHE_TRANSPARENZBERICHTE.md](05_OEFFENTLICHE_TRANSPARENZBERICHTE.md) | Was öffentlich wird, Methodik, Analysefunktionen |
| [06_DATENMODELL_UND_KENNZAHLENLOGIK.md](06_DATENMODELL_UND_KENNZAHLENLOGIK.md) | Entitäten, Kennzahlen, Berechnungslogik |
| [07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md](07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md) | Datenschutz, Kindeswohl, Rechtsgrundlagen |

---

## User Stories dieser Domäne

→ [Story-Übersicht Kita-Betrieb & Jugendamt-Steuerung](../../../docs/stories/kita_betrieb_und_jugendamt_steuerung/STORY_MAP.md)

---

*Diese Domäne ist Teil von Open State – dem transparenten Betriebs- und Vertrauensmodell für staatliches Handeln.*
*Verweis auf Gesamtarchitektur: [architecture/05_Systemarchitektur.md](../../../architecture/05_Systemarchitektur.md)*
*Verweis auf Leitbild: [docs/LEITBILD_STAAT_UND_VERTRAUEN.md](../../LEITBILD_STAAT_UND_VERTRAUEN.md)*
