# 11 – Kita-Steuerung und öffentliches Berichtsportal

**Bereich:** UI/UX-Konzept · Kita-Betrieb & Jugendamt-Steuerung
**Schicht:** Drei getrennte Interfaces je Nutzergruppe

---

## Grundprinzipien der Darstellung

- Kein gemeinsames Interface für verschiedene Rollen: Kita-Leitung, Jugendamt und Öffentlichkeit haben getrennte, auf ihre Aufgabe zugeschnittene Ansichten.
- Kein Durchgriff: Das öffentliche Interface zeigt ausschließlich freigegebene, aggregierte Daten.
- Sachlichkeit vor Design: Kennzahlen stehen im Vordergrund. Keine Infografik-Ästhetik ohne Datenbasis.
- Methodik sichtbar: Jede angezeigte Zahl hat einen Erklärungsweg.

---

## Interface 1: Kita-Betriebsoberfläche

### Zielgruppe
Kita-Leitung und Fachkräfte in der Einrichtung.

### Hauptansichten

**Dashboard Tagesstand**
```
┌─────────────────────────────────────────────────────┐
│  Heute: Montag, [Datum]                             │
│                                                     │
│  Gruppe A    ██████████░░░░  12 / 15 Kinder         │
│  Gruppe B    ████████░░░░░░  10 / 14 Kinder  ⚑ Personalschlüssel knapp
│  Krippe       ██████░░░░░░░   8 / 12 Kinder         │
│                                                     │
│  Personal heute:  18,5 h geplant / 16,0 h ist      │
│                                                     │
│  [Tagesstand freigeben]                             │
└─────────────────────────────────────────────────────┘
```
- Kein Kindname, kein Personenname
- Unterschreitung Personalschlüssel → sichtbar markiert, nicht gewertet
- Freigabe-Button nur wenn Vollständigkeit gegeben

**Belegungsübersicht**
```
┌─────────────────────────────────────────────────────┐
│  Belegungsstand – Stand: [Datum]                    │
│                                                     │
│  Genehmigt:      45 Plätze                         │
│  Real nutzbar:   43 Plätze  (2 wegen Umbau gesperrt)│
│  Belegt:         41 Plätze                         │
│  Frei:            2 Plätze                         │
│  Warteliste:     14 Anfragen                       │
│                                                     │
│  Auslastungsgrad: 95 %                              │
└─────────────────────────────────────────────────────┘
```

**Monatsbericht (Auszug)**
- Anwesenheitsquote je Gruppe und Gesamt
- Personalauslastung: Soll vs. Ist
- Vergleich Vormonat
- Export CSV / PDF
- Datenlücken-Hinweis wenn Tage fehlen

**Meldung vorbereiten & freigeben**
- Automatisch ausgefüllte Meldung aus Tagesständen
- Prüf-Ansicht vor Freigabe (kein Blindversand)
- Bearbeitungsfelder für Korrekturen
- Freigabe-Schritt mit Bestätigung und Dokumentation

---

## Interface 2: Jugendamt-Steuerungsoberfläche

### Zielgruppe
Sachgebiet Planung und Berichtswesen, Jugendamtsleitung.

### Hauptansichten

**Versorgungslagebild**
```
┌─────────────────────────────────────────────────────────┐
│  Versorgungslagebild – [Monat/Jahr]                     │
│  Datenstand: [Datum], [x] von [y] Einrichtungen gemeldet│
│                                                         │
│  GESAMTKOMMUNE                                          │
│  Genehmigte Plätze:    2.340                           │
│  Real nutzbar:         2.280 (60 temporär gesperrt)    │
│  Belegt:               2.155                           │
│  Frei:                   125                           │
│  Auslastungsgrad:       94,5 %                         │
│  Warteliste gesamt:      487 Anfragen                  │
│                                                         │
│  PLANUNGSRÄUME                                          │
│  ──────────────────────────────────────────────────    │
│  Nord      │ 97 % Auslastung │ 89 auf Warteliste │ ▲   │
│  Mitte     │ 91 % Auslastung │ 62 auf Warteliste │ →   │
│  Süd       │ 88 % Auslastung │ 34 auf Warteliste │ ▼   │
│  West      │ 99 % Auslastung │ 143 auf Warteliste│ ▲▲  │
│                                                         │
│  ▲ = steigende Warteliste  → = stabil  ▼ = sinkend     │
└─────────────────────────────────────────────────────────┘
```

**Zeitreihenanalyse (intern)**
- Auslastungsgrad: 12-Monats-Verlauf je Region
- Wartelistenentwicklung: absolut und relativ
- Personalausfalltrend: kommunal aggregiert

**Bedarfsplanungsentwurf**
- Versorgungsgrade je Planungsraum und Altersgruppe
- Planungslücken: Bedarf minus (verfügbar + geplant)
- Maßnahmenstatus: in Planung / genehmigt / im Bau / fertig
- Versionierung: Entwurf → Freigabe → Archiv

**Vorlageneditor**
- Strukturierte Vorlage mit Datenbezügen
- Kommentarfunktion für Sachgebiet und JA-Leitung
- Freigabe mit Zeitstempel
- Export als PDF für Gremiensitzungen

---

## Interface 3: Öffentliches Berichtsportal

### Zielgruppe
Öffentlichkeit, Eltern, Journalisten, Forschende, politische Gremien.

### Design-Leitlinien
- Keine Registrierung erforderlich
- Keine Werbung, kein Tracking
- Alle Angaben mit Methodik und Datenstand
- Klarer Hinweis auf Grenzen der Daten

### Hauptansichten

**Übersichtsseite**
```
┌──────────────────────────────────────────────────────────┐
│  Kindertagesbetreuung [Stadtname] – Transparenzbericht   │
│  Stand: [Monat/Jahr] · Zuletzt aktualisiert: [Datum]     │
│                                                          │
│  Kennzahlen auf einen Blick:                            │
│  ┌────────────┬──────────────┬──────────────┐           │
│  │ 2.155      │ 125          │ 487          │           │
│  │ belegte    │ freie        │ Anfragen auf │           │
│  │ Plätze     │ Plätze       │ Warteliste   │           │
│  └────────────┴──────────────┴──────────────┘           │
│                                                          │
│  Auslastungsgrad: 94,5 %  [was bedeutet das? ▼]         │
│                                                          │
│  [Zeitreihe ansehen] [Regionen vergleichen] [Download]  │
└──────────────────────────────────────────────────────────┘
```

**Zeitreihenansicht (öffentlich)**
- 12-Monats-Verlauf der Kernkennzahlen
- Saisonale Muster sichtbar
- Methodikänderungen im Verlauf markiert

**Regionenvergleich (öffentlich)**
- Tabelle mit Kennzahlen je Planungsraum
- Hinweis auf statistische Einschränkungen bei kleinen Regionen
- Kein Ranking, keine Wertung

**Maßnahmenstand (öffentlich)**
- Laufende Kapazitätserweiterungen
- Status: in Planung / genehmigt / im Bau / fertig
- Erwartete neue Plätze je Region

**Methodik- und Definitionsseite (Pflicht)**
- Vollständige Definition jeder Kennzahl
- Berechnungsformel
- Datenquelle
- Bekannte Einschränkungen
- Hinweis auf fehlende Einrichtungen

**Download**
- CSV: Kennzahlentabelle
- PDF: Aufbereiteter Monatsbericht

---

## Verbindungen zwischen den Interfaces

```
Kita-Betriebsoberfläche
    ↓ (Freigabe durch Leitung)
Jugendamt-Steuerungsoberfläche
    ↓ (Freigabe durch JA-Leitung)
Öffentliches Berichtsportal
```

Es gibt keine Rückverbindung:
- Öffentliches Portal schreibt keine Daten zurück
- JA hat keinen direkten Lesezugriff auf nicht freigegebene Kita-Daten
- Öffentlichkeit sieht nie mehr als das JA explizit freigegeben hat

---

## Barrierefreiheit und Zugang

- WCAG 2.1 AA für alle Interfaces
- Öffentliches Portal: Einfache Sprache für Kernkennzahlen
- Kein Flash, kein proprietäres Format für Berichte
- Alle Diagramme haben tabellarische Alternativdarstellung
