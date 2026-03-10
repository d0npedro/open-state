# 06 – Datenmodell und Kennzahlenlogik

## Schichtenmodell der Daten

```
EINRICHTUNGSEBENE (Betriebsdaten)
├── Einrichtung
├── Gruppe
├── Betreuungsvertrag (nicht personenbezogen in Aggregaten)
├── Tageserfassung
├── Personalstunde
└── Meldung (freigegeben)
       ↓ Aggregation (keine Rohdaten-Weitergabe)
STEUERUNGSEBENE (Jugendamt intern)
├── Versorgungskennzahl
├── Wartelistenkennzahl
├── Personallagenindikator
├── Planungsraumanalyse
└── Maßnahmenstand
       ↓ Freigabe (aktiv, durch JA-Leitung)
TRANSPARENZEBENE (öffentlich)
├── Freigegebene Kennzahl (mit Zeitstempel)
├── Methodikbeschreibung
└── Exportdatei
```

---

## Kernentitäten (Betriebsschicht)

### Einrichtung

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | string | Eindeutige Einrichtungs-ID |
| `bezeichnung` | string | Name der Einrichtung |
| `traeger_id` | string | Zugehöriger Träger |
| `einrichtungstyp` | enum | KRIPPE / KITA / HORT / KOMBINIERT |
| `planungsraum_id` | string | Zugeordneter Planungsraum |
| `genehmigte_plaetze` | Objekt | Aufschlüsselung nach Altersgruppe und Gruppentyp |
| `aktiv_seit` | date | Betriebsaufnahme |
| `status` | enum | AKTIV / TEMPORAER_GESCHLOSSEN / UMBAU / GESCHLOSSEN |

### Gruppe

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | string | Gruppen-ID innerhalb der Einrichtung |
| `einrichtung_id` | string | Zugehörige Einrichtung |
| `gruppentyp` | enum | KRIPPE / ELEMENTAR / INKLUSION / HORT |
| `genehmigter_umfang` | int | Maximale Platzzahl |
| `ist_aktiv` | bool | Gruppe derzeit in Betrieb |

### Tageserfassung

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `datum` | date | Erfassungsdatum |
| `einrichtung_id` | string | Einrichtungsbezug |
| `gruppe_id` | string | Gruppenbezug |
| `kinder_anwesend` | int | Anzahl anwesender Kinder |
| `kinder_krank` | int | Krankgemeldete Kinder |
| `kinder_urlaub` | int | Im Urlaub |
| `personal_soll` | decimal | Geplante Personalstunden |
| `personal_ist` | decimal | Tatsächliche Personalstunden |
| `personalschluessel_unterschritten` | bool | Flag (keine Begründung oder Person) |
| `erfasst_von` | role | Nur Rollenbezug, kein Personenname |
| `freigegeben` | bool | Durch Kita-Leitung freigegeben |

### Betreuungsvertrag (anonymisiert)

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | string | Anonyme Vertrags-ID |
| `einrichtung_id` | string | Einrichtungsbezug |
| `gruppe_id` | string | Gruppenbezug |
| `altersgruppe` | enum | U3 / Ü3 / SCHULKIND |
| `betreuungsumfang_stunden_woche` | int | Gebuchte Stunden |
| `vertragsbeginn` | date | Beginn |
| `vertragsende` | date | Ende (oder offen) |
| `inklusion` | bool | Inklusionsplatz? |

---

## Kennzahlenlogik (Steuerungsschicht)

### Auslastungsgrad

```
Auslastungsgrad =
  Anzahl belegter Plätze
  ─────────────────────────── × 100
  Anzahl real nutzbarer Plätze

Belegte Plätze = Betreuungsverträge mit aktivem Vertragsstatus
Real nutzbare Plätze = Genehmigte Plätze − dauerhaft nicht nutzbare Plätze
```

**Hinweis:** „Real nutzbar" ist kleiner als „genehmigt", wenn Gruppen temporär geschlossen sind oder Umbaumaßnahmen laufen.

### Versorgungsquote (je Altersgruppe und Region)

```
Versorgungsquote (U3) =
  Belegte U3-Plätze in Region X
  ──────────────────────────────── × 100
  Kinder unter 3 Jahren in Region X
```

Einwohnerdaten (Altersstruktur nach Region) werden extern bereitgestellt (amtliche Statistik). Die Schnittstelle ist konzeptionell vorgesehen, technisch noch zu definieren.

### Wartelistendruck

```
Wartelistendruck (je Region) =
  Offene Wartelistenanfragen in Region X
  ───────────────────────────────────────
  Real freie Plätze in Region X

Wert > 1 = mehr Anfragen als freie Plätze (Engpass)
Wert < 1 = freie Plätze übersteigen aktuelle Anfragen
```

### Personalausfallquote

```
Ausfallquote (Einrichtung, Periode) =
  Summe ausgefallener Personalstunden
  ─────────────────────────────────── × 100
  Summe geplanter Personalstunden
```

Einrichtungsübergreifend aggregierbar zu Regional- oder Gesamtwerten.

### Unterschreitungsrate Personalschlüssel

```
Unterschreitungsrate =
  Anzahl Tage mit Unterschreitung des Mindestpersonalschlüssels
  ─────────────────────────────────────────────────────────── × 100
  Anzahl Betriebstage im Zeitraum
```

Maßgeblicher Personalschlüssel richtet sich nach Landesrecht (unterschiedlich je Bundesland). Die rechtliche Grundlage wird je Einrichtung hinterlegt.

---

## Aggregationsregeln

- **Mindestmenge für regionale Darstellung:** Regionen mit weniger als 3 aktiven Einrichtungen werden nicht einzeln ausgewiesen, um Rückschlüsse auf Einzeleinrichtungen zu verhindern.
- **Rundungsregeln:** Prozentwerte werden auf eine Nachkommastelle gerundet.
- **Datenlücken:** Fehlt eine Einrichtungsmeldung, wird die letzte verfügbare Meldung verwendet und als „Schätzwert (Datenlücke)" gekennzeichnet – nicht still aufgefüllt.
- **Keine Imputation:** Es werden keine fehlenden Werte automatisch geschätzt oder interpoliert, ohne dass dies als Schätzung ausgewiesen wird.

---

## Versionierung und Historienprinzip

- Freigegebene Steuerungs- und Transparenzdaten werden versioniert
- Jede neue Freigabe überschreibt nicht die vorherige, sondern erzeugt eine neue Version
- Historische Berichte bleiben einsehbar
- Die Methodik jeder Version wird dokumentiert, sodass Zeitreihenvergleiche auch nach Methodenänderungen nachvollziehbar bleiben

---

## Schnittstellen (konzeptionell)

| Schnittstelle | Zweck | Status |
|--------------|-------|--------|
| Einwohnermelde-Statistik | Altersstruktur je Region | Konzeptionell vorgesehen |
| KiJuP (Bundesstatistik) | Abgleich mit nationalen Kennzahlen | Konzeptionell (→ [docs/14_KiJuP_Integration.md](../../14_KiJuP_Integration.md)) |
| Amtliche Kita-Statistik (Destatis) | Plausibilitätsabgleich | Konzeptionell vorgesehen |
| Open-Data-Schnittstelle | Maschinenlesbarer Export | Konzeptionell, rechtlich zu klären |
