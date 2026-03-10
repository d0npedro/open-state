# Repo Summary: Domäne Kita-Betrieb & Jugendamt-Steuerung

Erweiterung von Open State um eine neue Domäne, die operative Entlastung von Kitas,
laufende Jugendamt-Steuerung und öffentliche Transparenzberichte als sinnvolles
zusammenhängendes System konzipiert.

---

## Neu erstellte Dateien

### Domänendokumentation

| Datei | Inhalt |
|-------|--------|
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/README.md` | Überblick, Zielbild, 3-Schichten-Modell, Rollenübersicht |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/01_PROBLEMRAUM_UND_ZIELBILD.md` | Ist-Zustand auf Kita-, Jugendamt- und gesellschaftlicher Ebene; Zielbild je Ebene |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/02_BENUTZERROLLEN_UND_AKTEURE.md` | Alle Rollen mit Zugriffsmatrix und offenen Fragen |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/03_OPERATIVE_PROZESSE_IN_DER_KITA.md` | 7 Kernprozesse: Belegung, Anwesenheit, Personal, Warteliste, Verträge, Meldungen, Auswertungen |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/04_JUGENDAMT_STEUERUNG_UND_BERICHTSWESEN.md` | Kennzahlen, Analyseformen, Bedarfsplanung, politische Vorlagen, Freigabelogik |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/05_OEFFENTLICHE_TRANSPARENZBERICHTE.md` | Öffentliche vs. interne Inhalte, Analysefunktionen, Freigabelogik, Exportformat, Rhythmus |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/06_DATENMODELL_UND_KENNZAHLENLOGIK.md` | Kernentitäten, Kennzahlformeln, Aggregationsregeln, Schnittstellen |
| `docs/domains/kita_betrieb_und_jugendamt_steuerung/07_RECHTLICHE_UND_DATENSCHUTZ_GRENZEN.md` | DSGVO-Grundlagen, besonders sensible Bereiche, Rechtsrahmen, offene Rechtsfragen |

### Story-System

| Datei | Inhalt |
|-------|--------|
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/STORY_MAP.md` | Backbone, User Activities, 10 Stories priorisiert |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-001_Tagesstand_erfassen.md` | Tägliche Anwesenheits- und Personalerfassung |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-002_Belegungsstand_einsehen.md` | Belegungsübersicht je Gruppe und Gesamt |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-003_Monatsbericht_abrufen.md` | Automatisch erzeugter Monatsbericht |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-004_Meldung_freigeben.md` | Aktive Freigabe strukturierter Meldungen an das JA |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-005_Versorgungslagebild_abrufen.md` | Aggregiertes Lagebild für das Jugendamt |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-006_Engpass_Regionen_identifizieren.md` | Regionenvergleich mit Wartelistendruck |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-007_Bedarfsplanung_erstellen.md` | Kennzahlenbasierter Bedarfsplanungsentwurf |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-008_Politische_Vorlage_freigeben.md` | Vorlagenerstellung und Freigabe für Gremien |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-009_Transparenzbericht_einsehen.md` | Öffentlicher Bericht ohne Registrierung |
| `docs/stories/kita_betrieb_und_jugendamt_steuerung/US-KJ-010_Zeitreihen_Regionenvergleich.md` | Zeitreihen, Regionenvergleich, Export |

### App-Design und UI-Konzept

| Datei | Inhalt |
|-------|--------|
| `app-design/11_Kita_Steuerung_und_Berichtsportal.md` | Drei Interface-Konzepte: Kita-Betrieb / Jugendamt-Steuerung / Öffentliches Berichtsportal |

### Zusammenfassung

| Datei | Inhalt |
|-------|--------|
| `REPO_REWRITE_SUMMARY_KITA_STEUERUNG_UND_BERICHTE.md` | Diese Datei |

---

## Geänderte Dateien

| Datei | Änderung |
|-------|---------|
| `README.md` | Neue Domäne in Kerndomänen-Tabelle und Projektdokumentation; neuer Strategieabsatz zu operativer Entlastung, Steuerung und Transparenz |

---

## Domänenlogik: Wie die drei Schichten zusammenwirken

```
BETRIEBSSCHICHT (Kita)
  Tagesstand → Belegungsstand → Monatsbericht → Meldung (freigegeben)
       ↓
STEUERUNGSSCHICHT (Jugendamt, intern)
  Versorgungslagebild → Engpassanalyse → Bedarfsplanung → Politische Vorlage
       ↓
TRANSPARENZSCHICHT (öffentlich, freigegeben)
  Aggregierte Kennzahlen + Methodik + Zeitreihen + Export
```

Kein Schritt erfolgt automatisch über Schichtgrenzen.
Jeder Übergang erfordert aktive Freigabe durch eine benannte verantwortliche Person.

---

## Kennzahlen und Analyseformen

Operative Ebene (Kita-intern):
- Anwesenheitsquote je Gruppe, Auslastungsgrad, Personalstunden soll/ist, Ausfallquote
- Wartelistenbestand, Betreuungszeitwunsch

Steuerungsebene (JA-intern):
- Genehmigte / real nutzbare / belegte / freie Plätze
- Auslastungsgrad und Versorgungsquote je Altersgruppe und Region
- Wartelistendruck (Anfragen je freiem Platz)
- Personalausfallquote, Unterschreitungsrate Personalschlüssel
- Maßnahmenstand (in Planung / genehmigt / im Bau / fertig)

Öffentliche Ebene:
- Alle obigen Kennzahlen in freigegebener Aggregation
- Zeitreihen (12 Monate)
- Regionenvergleich (mit Mindesteinrichtungszahl für Datenschutz)
- Methodikbeschreibung jeder Kennzahl

---

## Datenschutz- und Freigabegrenzen

| Grenze | Beschreibung |
|--------|-------------|
| Kindesdaten | Nie im zentralen System; nur in der Einrichtung |
| Personenname (Personal) | Nie in aggregierten Berichten |
| Einrichtungsindividualdaten | Nur für Jugendamt mit rechtlicher Grundlage |
| Kleine Regionen | Aggregation verhindert Rückschlüsse auf Einzeleinrichtungen |
| Öffentliche Daten | Nur nach aktiver Freigabe durch JA-Leitung |
| Rohdaten | Nie öffentlich; nur freigegebene Aggregatstufe |

---

## Offene fachliche Prüfpunkte

1. **Datenschutz-Folgeabschätzung (DSFA):** Für alle Verarbeitungsschritte erforderlich, noch nicht durchgeführt.
2. **Betriebsrat/Personalrat:** Einführung digitaler Anwesenheitserfassung ist mitbestimmungspflichtig.
3. **Bundeslandspezifische Ausführungsgesetze:** Meldepflichten, Personalschlüssel und Fristen variieren stark.
4. **Trägerautonomie:** Ob und wie freie Träger zur Nutzung des Systems verpflichtet werden können, ist ungeklärt.
5. **Öffentliche Datenlizenz:** Open-Data-Export erfordert rechtliche Klärung je Bundesland.
6. **Eltern-Schnittstelle (Warteliste):** Konzeptionell vorgesehen, datenschutzrechtlich besonders sensibel, noch nicht ausgearbeitet.
7. **Demografische Prognosedaten:** Schnittstelle zu amtlichen Statistikquellen (Einwohnerzahlen) noch nicht definiert.
8. **KiJuP-Kompatibilität:** Abgleich mit bundesweiter Kita-Statistik → [docs/14_KiJuP_Integration.md](docs/14_KiJuP_Integration.md)
