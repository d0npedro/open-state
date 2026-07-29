# Datenvertrag: Betriebsdaten → Steuerungsdaten-Aggregation

**Status:** Konzept (Phase 0)  
**Bezug:** Q-042 · ADR-007 · DEC-004 · `docs/api/kita-meldung-api.yaml`  
**Zweck:** Formale Beschreibung, welche Betriebsfelder wie zu Steuerungs- und öffentlichen Kennzahlen aggregiert werden – und was **niemals** die Betriebsebene verlässt.

---

## 1. Schichten und Übergänge

| Schicht | Akteure | Datenart | Zugang |
|---------|---------|----------|--------|
| **S0 Betrieb** | Kita-Leitung, Fachkräfte | Operative Erfassung (kann personenbezogen sein) | nur Einrichtung |
| **S1 Steuerung** | Jugendamt Planung | Aggregierte Kennzahlen je Planungsraum / Kommune | interner Zugang |
| **S2 Öffentlichkeit** | Bürger, Presse, Gremien | Freigegebene Aggregate + Methodik | ohne Login |

```
S0  --[Freigabe Meldung]-->  S1  --[Freigabe Bericht]-->  S2
```

Jeder Übergang ist:

1. **explizit** (aktive Freigabe, kein stiller Sync)
2. **protokollierbar** (wer, wann, welche Version)
3. **irreversibel im Audit-Sinn** (Freigabeereignis bleibt; Korrektur = neue Version)

---

## 2. Eingangsdaten (S0 → Meldung)

Pro Einrichtung und Monat (Schema `Monatsmeldung` in OpenAPI):

| Feld | Typ | Pflicht | Verlässt S0? |
|------|-----|---------|--------------|
| `genehmmigtePlaetze` | integer ≥ 0 | ja | ja (aggregiert) |
| `belegtePlaetze` | integer ≥ 0 | ja | ja (aggregiert) |
| `freiePlaetze` | integer ≥ 0 | ja | ja (aggregiert) |
| `wartelisteBestand` | integer ≥ 0 | ja | ja (aggregiert) |
| `personalAusfallquoteProzent` | number 0–100 | ja | ja (aggregiert / gemittelt) |
| Kind-Namen, Elternkontakte, Geburtsdaten | — | — | **nie** |
| Einrichtungsinterne Personal-Klarnamen | — | — | **nie** |
| Einzelne Anwesenheitslisten | — | — | **nie** (nur Summen) |

**Invariante S0:**  
`belegtePlaetze + freiePlaetze ≤ genehmmigtePlaetze` (Warnung bei Verletzung; Freigabe kann blockiert werden).

---

## 3. Aggregationsregeln (S0 → S1)

Aggregationseinheit: **Planungsraum** (Summe über alle freigegebenen Einrichtungen des Raums) und optional **Gesamtkommune**.

| Zielkennzahl S1 | Formel / Regel | Quelle |
|-----------------|----------------|--------|
| `genehmmigtePlaetze` | Σ freigegebene Meldungen | S0 |
| `belegtePlaetze` | Σ | S0 |
| `freiePlaetze` | Σ | S0 |
| `auslastungsgradProzent` | `100 * belegte / realNutzbare` (falls realNutzbare > 0) | abgeleitet |
| `wartelisteBestand` | Σ | S0 |
| `wartelisteDruckFaktor` | `wartelisteBestand / max(freiePlaetze, 1)` | abgeleitet |
| `personalAusfallquoteProzent` | gewichteter Mittelwert (Gewichtung: genehmmigte Plätze) | S0 |
| `versorgungsquote.u3` / `.ue3` | `100 * versorgteKinder / einwohnerKinder` je Altersgruppe | S0 + amtliche Bevölkerung |

**Einschlussregel:** Nur Meldungen mit `status = FREIGEGEBEN` und gültigem `monat` fließen ein.  
**Ausschluss:** ENTWURF, ZUR_PRUEFUNG, ZURUECKGEWIESEN.

**Mindestanonymität:** Liegt die Anzahl Einrichtungen pro Planungsraum unter einem konfigurierbaren Schwellenwert `N_min` (Vorschlag: 3), werden engpassbezogene Feinwerte in S2 unterdrückt oder mit „Datenlücke“ markiert (US-KJ-009).

---

## 4. Übergang S1 → S2 (Öffentlichkeit)

| Feld in S2 | aus S1 | Bedingung |
|------------|--------|-----------|
| Planungsraum-Kennzahlen (Aggregate) | ja | Bericht freigegeben |
| Zeitreihe (12 Monate) | ja | freigegebene Monatsschnitte |
| Engpassrangliste mit Begründung | optional | freigegeben und methodisch dokumentiert |
| Einrichtungs-IDs / Namen | **nein** | nie in S2 |
| Personenbezug | **nein** | nie |

Pflichtfelder jedes öffentlichen Berichts:

- `datenstand`
- `methodik` (Definition der Kennzahlen)
- `einschraenkungen` (bekannte Datenlücken)

---

## 5. Qualitäts- und Fairnessregeln

| ID | Regel | Wirkung |
|----|-------|---------|
| A-01 | Keine Aggregation aus unfreigegebenen Meldungen | harte Filterregel |
| A-02 | Division durch null vermeiden (`freiePlaetze = 0` → Druckfaktor mit max(...,1)) | definiert |
| A-03 | Zeitreihe: `wartelisteDeltaVormonat` nur wenn Vormonat existiert | sonst `null` |
| A-04 | Korrektur nach Freigabe = neue Meldungsversion, kein stilles Überschreiben | Audit |
| A-05 | KI darf Kennzahlen nicht „glätten“ oder fehlende Werte erfinden | verboten |

---

## 6. Mapping auf Demo

| Konzept | Demo-Artefakt |
|---------|----------------|
| S1 Lagebild | `/kita/lagebild`, Typen in `demo/types/kita.ts` |
| S2 Bericht | `/kita`, `mockKitaLagebild.ts` |
| API-Form | `docs/api/kita-meldung-api.yaml` |
| Stories | US-KJ-004, US-KJ-005, US-KJ-006, US-KJ-009, US-KJ-010 |

---

## 7. Offene Punkte

- Konkreter Wert für `N_min` je Kommune (rechtliche/statistische Abstimmung)
- Ob Wartelisten doppelt gezählt werden (Mehrfachbewerbungen) – Methodik muss es offen legen
- Schnittstelle zu amtlicher Bevölkerungsstatistik (Importformat)

---

*Dieses Dokument ist der formale Datenvertrag zur Aggregation. Es ersetzt keine landesspezifische Rechtsprüfung.*
