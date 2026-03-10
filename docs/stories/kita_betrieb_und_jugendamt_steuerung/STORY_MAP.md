# Story Map – Kita-Betrieb & Jugendamt-Steuerung

Diese Story Map strukturiert die Anforderungen nach dem dreischichtigen Betriebsmodell der Domäne:
Operative Kita-Ebene → Jugendamt-Steuerungsebene → Öffentliche Transparenzebene.

---

## BACKBONE (Aktivitätsebenen)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     BACKBONE – Kita-Betrieb & Jugendamt-Steuerung               │
│                                                                                  │
│  BETRIEBSEBENE (Kita)                                                           │
│  ─────────────────────────────────────────────────────────────────────────      │
│  Belegung        Anwesenheit    Personal/Ausfälle    Warteliste    Meldungen    │
│                                                                                  │
│  STEUERUNGSEBENE (Jugendamt)                                                    │
│  ─────────────────────────────────────────────────────────────────────────      │
│  Lagebild        Bedarfsplanung    Politische Vorlage    Maßnahmenstand         │
│                                                                                  │
│  TRANSPARENZEBENE (Öffentlichkeit)                                              │
│  ─────────────────────────────────────────────────────────────────────────      │
│  Bericht einsehen    Zeitreihe    Regionenvergleich    Methodik    Export       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## BETRIEBSEBENE – Stories für Kita-Leitung und Fachkräfte

### B1: Tageserfassung

```
Fachkraft erfasst täglich Anwesenheiten, Ausfälle und Personalstunden
    └── US-KJ-001  Tagesstand erfassen
                   Schnelle, strukturierte Tageserfassung ohne doppelte Eingabe
```

### B2: Belegungsüberblick

```
Kita-Leitung will wissen, wie viele Plätze belegt, frei und reserviert sind
    └── US-KJ-002  Belegungsstand einsehen
                   Aktueller Überblick ohne manuelle Zählung
```

### B3: Monatsbericht

```
Kita-Leitung erstellt monatliche Übersicht für interne und externe Zwecke
    └── US-KJ-003  Monatsbericht abrufen
                   Automatisch erzeugte Auswertung auf Basis der Tageserfassungen
```

### B4: Meldung freigeben

```
Kita-Leitung gibt strukturierte Monatsmeldung an das Jugendamt frei
    └── US-KJ-004  Meldung prüfen und freigeben
                   Automatisch vorbereitete Meldung, aktive Freigabe erforderlich
```

---

## STEUERUNGSEBENE – Stories für Jugendamt und Planung

### S1: Lagebild abrufen

```
Jugendamt-Planung will wissen, wie die aktuelle Versorgungslage ist
    └── US-KJ-005  Versorgungslagebild abrufen
                   Aggregiertes Lagebild aus freigegebenen Einrichtungsdaten
```

### S2: Engpässe erkennen

```
Jugendamt-Planung will frühzeitig Regionen mit kritischer Belegung erkennen
    └── US-KJ-006  Engpass-Regionen identifizieren
                   Regionenvergleich mit Wartelistendruck und Auslastungsgrad
```

### S3: Bedarfsplanung vorbereiten

```
Sachgebiet Planung will Bedarfsplanung auf Basis aktueller Daten aufbauen
    └── US-KJ-007  Bedarfsplanungsentwurf erstellen
                   Kennzahlenbasierter Planungsentwurf ohne automatische Entscheidung
```

### S4: Politische Vorlage erstellen

```
Sachgebiet erstellt Vorlage für Jugendhilfeausschuss
    └── US-KJ-008  Politische Vorlage vorbereiten und freigeben
                   Strukturierte Vorlage mit Datenbasis, Freigabe durch JA-Leitung
```

---

## TRANSPARENZEBENE – Stories für Öffentlichkeit und Gremien

### T1: Transparenzbericht einsehen

```
Interessierte Person will wissen, wie die Kitaversorgung in ihrer Stadt steht
    └── US-KJ-009  Öffentlichen Transparenzbericht einsehen
                   Freigegebene Kennzahlen mit Methodik und Aktualitätshinweis
```

### T2: Zeitreihen- und Regionenvergleich

```
Journalist oder Forschende will Entwicklung über Zeit und Regionen vergleichen
    └── US-KJ-010  Zeitreihen und Regionenvergleich analysieren
                   Filterbare Zeitreihen, Regionenvergleiche, Export
```

---

## PRIORISIERUNG

### Minimal demonstrierbarer Kern

| Priorität | Story-ID | Begründung |
|-----------|----------|-----------|
| 1 | US-KJ-002 | Operativer Einstieg: Belegungsüberblick zeigt Kernentlastung |
| 2 | US-KJ-005 | Steuerungsnutzen: Lagebild ohne Mehraufwand für Einrichtungen |
| 3 | US-KJ-009 | Transparenzversprechen: öffentlicher Bericht mit Methodik |

### Vollständige Storyabdeckung

| Story-ID | Titel | Rolle |
|----------|-------|-------|
| US-KJ-001 | Tagesstand erfassen | Fachkraft / Kita-Leitung |
| US-KJ-002 | Belegungsstand einsehen | Kita-Leitung |
| US-KJ-003 | Monatsbericht abrufen | Kita-Leitung |
| US-KJ-004 | Meldung prüfen und freigeben | Kita-Leitung |
| US-KJ-005 | Versorgungslagebild abrufen | Sachgebiet Planung |
| US-KJ-006 | Engpass-Regionen identifizieren | Sachgebiet Planung |
| US-KJ-007 | Bedarfsplanungsentwurf erstellen | Sachgebiet Planung |
| US-KJ-008 | Politische Vorlage vorbereiten und freigeben | Sachgebiet / JA-Leitung |
| US-KJ-009 | Öffentlichen Transparenzbericht einsehen | Öffentlichkeit |
| US-KJ-010 | Zeitreihen und Regionenvergleich analysieren | Öffentlichkeit / Gremien |

---

*Verweis auf Domänendokumentation: [docs/domains/kita_betrieb_und_jugendamt_steuerung/README.md](../../domains/kita_betrieb_und_jugendamt_steuerung/README.md)*
