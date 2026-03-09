# Open State – Monetarisierungs- & Finanzmodell

*Basis: docs/01–08*

---

## 1. Finanzierungsphilosophie

Open State ist primär **staatlich finanzierte Infrastruktur** – wie Straßen, Schulen oder die Bundeswehr. Das Grundprinzip: Verwaltungseffizienz ist kein Geschäftsmodell, sondern staatliche Pflicht. Jeder eingesparte Euro im Verwaltungsaufwand ist eine Rendite für den Steuerzahler.

Dennoch gibt es drei komplementäre Einnahmequellen, die Abhängigkeit vom Bundeshaushalt reduzieren und das Projekt politisch robuster machen:

```
┌─────────────────────────────────────────────────────┐
│         OPEN STATE FINANZIERUNGSPYRAMIDE            │
├─────────────────────────────────────────────────────┤
│  Basis (70–80%): Bundeshaushalt / Effizienzrendite  │
├─────────────────────────────────────────────────────┤
│  Schicht 2 (10–20%): Länder- & EU-Kofinanzierung    │
├─────────────────────────────────────────────────────┤
│  Schicht 3 (5–10%): Optionale Werbung (geprüft)     │
├─────────────────────────────────────────────────────┤
│  Schicht 4 (2–5%): API-Lizenzierung (Kommunen/EU)   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Kostenmodell

### 2.1 Einmalige Aufbaukosten (CAPEX)

| Kostenblock | Phase 1 (2026) | Phase 2 (2027–28) | Phase 3 (2029–30) | Gesamt |
|-------------|---------------|-------------------|-------------------|--------|
| Technische Infrastruktur | 45 Mio. € | 80 Mio. € | 60 Mio. € | 185 Mio. € |
| Software-Entwicklung | 60 Mio. € | 90 Mio. € | 50 Mio. € | 200 Mio. € |
| CaseMatch AI (Training + Infrastruktur) | 20 Mio. € | 30 Mio. € | 15 Mio. € | 65 Mio. € |
| Sicherheit & BSI-Zertifizierung | 15 Mio. € | 10 Mio. € | 5 Mio. € | 30 Mio. € |
| Rechtliche & regulatorische Arbeit | 8 Mio. € | 5 Mio. € | 3 Mio. € | 16 Mio. € |
| UX-Forschung & Testing | 5 Mio. € | 8 Mio. € | 4 Mio. € | 17 Mio. € |
| Behörden-Adapter-Entwicklung | 30 Mio. € | 50 Mio. € | 20 Mio. € | 100 Mio. € |
| Change Management & Schulungen | 10 Mio. € | 15 Mio. € | 8 Mio. € | 33 Mio. € |
| **CAPEX Gesamt** | **193 Mio. €** | **288 Mio. €** | **165 Mio. €** | **646 Mio. €** |

### 2.2 Laufende Betriebskosten (OPEX, ab 2027)

| Kostenblock | 2027 | 2028 | 2029 | 2030 |
|-------------|------|------|------|------|
| Serverinfrastruktur & Cloud | 18 Mio. € | 28 Mio. € | 40 Mio. € | 55 Mio. € |
| Personal (500 FTE bei Vollbetrieb) | 60 Mio. € | 85 Mio. € | 110 Mio. € | 130 Mio. € |
| Sicherheit & Audits | 8 Mio. € | 10 Mio. € | 12 Mio. € | 14 Mio. € |
| KI-Modellpflege & Retraining | 5 Mio. € | 8 Mio. € | 10 Mio. € | 12 Mio. € |
| Support & Helpdesk | 6 Mio. € | 9 Mio. € | 12 Mio. € | 15 Mio. € |
| Barrierefreiheit & Übersetzungen | 3 Mio. € | 4 Mio. € | 5 Mio. € | 5 Mio. € |
| Marketing & Adoption | 10 Mio. € | 8 Mio. € | 5 Mio. € | 3 Mio. € |
| **OPEX Gesamt** | **110 Mio. €** | **152 Mio. €** | **194 Mio. €** | **234 Mio. €** |

---

## 3. Effizienzrendite-Kalkulation (ROI Staatskasse)

### 3.1 Kernformel

```
JÄHRLICHE EFFIZIENZRENDITE (E) =

E = (N × T_avg × K_std) + (V × K_vor) + (F × K_fehler) - OPEX

Dabei:
N      = Anzahl digitaler Transaktionen pro Jahr
T_avg  = Durchschnittliche eingesparte Bearbeitungszeit pro Vorgang
         (Bürger + Behördenmitarbeiter kombiniert)
K_std  = Kosten pro Arbeitsstunde (Verwaltung: ~55 €/h inkl. Overhead)
V      = Vermiedene Vorgänge (weil Bürger Anspruch proaktiv erkennt
         und einmalig richtig stellt statt mehrfach Fehler korrigiert)
K_vor  = Kosten eines vermiedenen Folgevorgangs (~120 €)
F      = Vermiedene Fehlbescheide durch bessere Datenbasis
K_fehler = Kosten eines korrigierten Fehlbescheids (~350 €)
OPEX   = Laufende Betriebskosten
```

### 3.2 Berechnungsbeispiel (2030, Vollbetrieb)

```
EINGANGSDATEN:
N        = 200.000.000 Transaktionen/Jahr (50 Mio. Bürger × 4 Vorgänge)
T_avg    = 0,5 Stunden eingespart (30 Min Bürger + 30 Min Behörde)
K_std    = 55 €/Stunde
V        = 10.000.000 vermiedene Folgevorgänge
K_vor    = 120 €
F        = 2.000.000 vermiedene Fehlbescheide
K_fehler = 350 €

BERECHNUNG:
Zeitersparnis:      200.000.000 × 0,5 × 55 €  = 5.500.000.000 €
Vermiedene Folgen:   10.000.000 × 120 €        =   1.200.000.000 €
Vermied. Fehler:      2.000.000 × 350 €        =     700.000.000 €
                                              ─────────────────────
Brutto-Rendite:                                  7.400.000.000 €
Abzgl. OPEX 2030:                               -  234.000.000 €
                                              ─────────────────────
NETTO-EFFIZIENZRENDITE 2030:                     7.166.000.000 €
ROI auf CAPEX (646 Mio. €):                            1.109 %
Amortisation CAPEX:                              < 1 Jahr (ab 2030)
```

### 3.3 Konservative Schätzung (50 % Abschlag)

```
Netto-Effizienzrendite 2030 (konservativ): ~3.583.000.000 €/Jahr
= 3,6 Milliarden Euro Einsparung pro Jahr für Bund, Länder, Kommunen
```

**Vergleich:** Das Bundesministerium für Inneres gibt aktuell ~12 Mrd. €/Jahr für Verwaltungsdigitalisierung aus – mit deutlich geringerem Wirkungsgrad. Open State wäre der bisher effizienteste Einsatz dieser Mittel.

---

## 4. Einnahmemodell – Schicht 3: Optionale Werbung

### 4.1 Grundprinzipien (aus Blueprint & Rechtsgutachten)

- **Nur staatlich geprüfte Partner** (Zertifizierungsprozess, jährliche Re-Prüfung)
- **Strikte Datentrennung:** Verwaltungsdaten fließen niemals in Werbe-Targeting
- **Transparenz:** Werbung immer klar als „Werbung" oder „Empfehlung" gekennzeichnet
- **Opt-out kostenlos:** Jeder Bürger kann Werbung dauerhaft deaktivieren
- **Kontextuell, nicht behavioral:** Targeting nur nach aktuellem Kontext (z.B. Ummeldung → Umzugshelfer), nie nach Verhaltenshistorie

### 4.2 Erlaubte Werbepartner-Kategorien

| Kategorie | Beispiele | Platzierungskontexte |
|-----------|-----------|---------------------|
| Finanzdienstleister (geprüft) | Verbraucherschutz-zertifizierte Banken, Versicherungen | Nach Steuererklärung, Gewerbeanmeldung |
| Rechtsberatung | Anwaltskanzleien, Legal-Tech mit Zulassung | Nach CaseMatch-Analyse |
| Mobilität | ÖPNV-Anbieter, geprüfte Umzugsunternehmen | Nach Ummeldung |
| Bildung & Weiterbildung | Staatlich anerkannte Bildungsanbieter | Nach Gewerbeanmeldung |
| Wohnen | Geprüfte Immobilienportale, Mietrechtsberatung | Nach Ummeldung |

### 4.3 Werbe-Revenue-Formel

```
WERBEEINNAHMEN (W) =

W = (MAU × CTR × CPM/1000 × Werbeflächen_pro_Session)
    × (1 - Opt-out-Rate)

Dabei:
MAU              = Monthly Active Users
CTR              = Click-Through-Rate (Benchmark Government Apps: 0,8%)
CPM              = Cost per 1000 Impressions (staatlich geprüft: ~8–15€)
Werbeflächen     = ~2 Werbeplätze pro aktiver Session
Opt-out-Rate     = Geschätzt 40% (datenschutzbewusste Bevölkerung)
```

### 4.4 Werbe-Revenue-Projektion

| Jahr | MAU | CPM | Opt-out | Jahres-Revenue |
|------|-----|-----|---------|----------------|
| 2027 | 1 Mio. | 10 € | 40 % | ~4,3 Mio. € |
| 2028 | 5 Mio. | 11 € | 38 % | ~23 Mio. € |
| 2029 | 15 Mio. | 12 € | 35 % | ~84 Mio. € |
| 2030 | 30 Mio. | 13 € | 32 % | ~196 Mio. € |

**Hinweis:** Werbeeinnahmen decken maximal ~84 % der OPEX in 2030. Dies ist gewollt – Open State bleibt primär staatlich finanziert.

---

## 5. Einnahmemodell – Schicht 4: API-Lizenzierung

### 5.1 Lizenzmodell für Kommunen & EU-Partner

Andere Kommunen, Bundesländer und EU-Mitgliedsstaaten können die Open State Infrastruktur lizenzieren:

**Lizenzstufen:**

| Stufe | Zielgruppe | Umfang | Preis |
|-------|-----------|--------|-------|
| **Basic** | Deutsche Kommunen < 50.000 EW | Identity + 3 Basismodule | 0 € (gefördert) |
| **Standard** | Deutsche Kommunen > 50.000 EW | Alle Bundesmodule | 0,50 €/Bürger/Jahr |
| **Professional** | Bundesländer | Alle Module + Support SLA | 0,80 €/Bürger/Jahr |
| **EU Export** | EU-Mitgliedsstaaten | White-Label-Lizenz + Anpassung | Verhandlung (ab 5 Mio. €) |

### 5.2 EU-Export-Revenue-Projektion

```
Szenario 2029: 3 EU-Partnerländer (je ~8 Mio. Einwohner relevant)
Lizenzgebühr: 0,40 €/Bürger/Jahr (Mengenrabatt)
Revenue: 3 × 8.000.000 × 0,40 € = 9,6 Mio. €/Jahr

Szenario 2030: 8 EU-Partnerländer
Revenue: ~25 Mio. €/Jahr
```

---

## 6. Gesamtfinanzplan 2026–2030

### 6.1 Einnahmen vs. Ausgaben

| Jahr | CAPEX | OPEX | Bundeshaushalt | Effizienz-ROI* | Werbung | API | Netto |
|------|-------|------|---------------|----------------|---------|-----|-------|
| 2026 | 193 Mio. | 40 Mio. | 200 Mio. | 30 Mio. | — | — | **-3 Mio.** |
| 2027 | 288 Mio. | 110 Mio. | 280 Mio. | 350 Mio. | 4 Mio. | 2 Mio. | **+238 Mio.** |
| 2028 | 165 Mio. | 152 Mio. | 200 Mio. | 1.500 Mio. | 23 Mio. | 8 Mio. | **+1.414 Mio.** |
| 2029 | 0 | 194 Mio. | 150 Mio. | 4.200 Mio. | 84 Mio. | 20 Mio. | **+4.260 Mio.** |
| 2030 | 0 | 234 Mio. | 100 Mio. | 7.166 Mio. | 196 Mio. | 25 Mio. | **+7.253 Mio.** |

*Effizienz-ROI = Einsparungen für gesamten Staat (Bund + Länder + Kommunen), anteilig verrechnet

### 6.2 Break-Even-Analyse

```
BREAK-EVEN-ZEITPUNKT:

Kumulierte Investitionen (2026–2027): ~831 Mio. €
Kumulierter ROI (2027):               ~386 Mio. €
Kumulierter ROI (2028):              ~1.900 Mio. €

Break-Even: Q2 2028 (ca. 2,5 Jahre nach Projektstart)

Ab 2029: Netto-Überschuss von ~4 Mrd. €/Jahr für den Staatshaushalt
```

---

## 7. Risikoangepasstes Finanzmodell

### 7.1 Szenario-Analyse

| Szenario | Annahme | Netto-ROI 2030 |
|---------|---------|----------------|
| **Optimistisch** | 95 % Adoption, alle Module aktiv | +9,1 Mrd. €/Jahr |
| **Basis** | 60 % Adoption, Kernmodule | +7,2 Mrd. €/Jahr |
| **Konservativ** | 40 % Adoption, Verzögerungen | +3,6 Mrd. €/Jahr |
| **Pessimistisch** | 20 % Adoption, 3 Jahre Verzug | +800 Mio. €/Jahr |

**Selbst im pessimistischsten Szenario übersteigt der ROI die Investitionskosten.**

### 7.2 Hauptrisiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Politischer Rückzug | Mittel | Hoch | Staatsvertrag mit Ländern; parlamentarische Verankerung |
| Cyberangriff / Datenpanne | Niedrig | Sehr hoch | BSI-Zertifizierung, Versicherung, Incident-Response-Plan |
| Adoption-Versagen | Mittel | Hoch | UX-First, keine Pflicht zuerst, Gamification |
| Behörden-Verweigerung | Hoch | Mittel | Finanzanreize, Bundesvollzugsgesetz |
| KI-Fehler (CaseMatch) | Niedrig | Mittel | Stagierter Rollout, Human-in-the-Loop |
| Kostensteigerung IT | Mittel | Mittel | Fixed-Price-Ausschreibungen, Open Source |

---

## 8. Governance des Finanzmodells

**Haushaltskontrolle:**
- Jährliche Prüfung durch Bundesrechnungshof
- Öffentlicher Finanzbericht (Einnahmen, Ausgaben, ROI) jährlich
- Parlamentarische Kontrolle: Haushaltsausschuss berichtet quartalsweise

**Effizienz-Messung:**
- Automatisiertes Dashboard: Transaktionskosten pro Vorgang in Echtzeit
- Benchmarking gegen internationale Systeme (Estland, Singapur)
- KPI: Kosten pro Transaktion < 0,50 € bis 2030 (vs. ~18 € heute analog)

**Reinvestitionsregel:**
- 20 % des jährlichen Effizienz-ROI fließen zurück in Plattform-Innovation
- 10 % in digitale Inklusion (Schulungen, Hardware-Förderprogramm)
- 70 % an Bund/Länder/Kommunen als Haushaltsentlastung

---

## 9. Zusammenfassung

```
╔══════════════════════════════════════════════════════════╗
║           OPEN STATE – FINANZMODELL ZUSAMMENFASSUNG      ║
╠══════════════════════════════════════════════════════════╣
║  Gesamtinvestition (5 Jahre):        ~1,05 Mrd. €        ║
║  Break-Even:                         Q2 2028             ║
║  Jährlicher ROI ab 2030:             ~7,2 Mrd. €         ║
║  Amortisation CAPEX:                 < 1 Jahr (ab 2030)  ║
║  Kosten/Transaktion Ziel 2030:       < 0,50 €            ║
║  Kosten/Transaktion heute (analog):  ~18 €               ║
║  Kostenreduktion pro Vorgang:        > 97 %              ║
╠══════════════════════════════════════════════════════════╣
║  Finanzierung:  70% Bund | 20% Länder/EU | 10% Markt     ║
║  Werbung:       Optional, geprüft, opt-out kostenlos     ║
║  API-Lizenz:    EU-Export ab 2029                        ║
╚══════════════════════════════════════════════════════════╝
```

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md bis app-design/08_Prototyp_Prompts.md*
*Alle Zahlen: Modellrechnungen auf Basis öffentlich verfügbarer Verwaltungskosten-Benchmarks*
