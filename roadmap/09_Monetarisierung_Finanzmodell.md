# Open State – Finanzierungs- & Effizienzmodell

*Basis: docs/01–08*

---

## 1. Finanzierungsphilosophie

Open State ist **staatlich finanzierte Infrastruktur** – wie Straßen, Schulen oder das öffentliche Rechtssystem. Das Grundprinzip: Verwaltungseffizienz ist kein Geschäftsmodell, sondern staatliche Pflicht. Jeder eingesparte Euro im Verwaltungsaufwand ist eine Rendite für den Steuerzahler.

Open State wird ausschließlich durch staatliche Mittel und fiskalische Effizienzgewinne finanziert. Eine Werbefinanzierung – in jeder Form – ist ausgeschlossen. Staatliche Infrastruktur ist keine Werbefläche.

```
┌─────────────────────────────────────────────────────┐
│         OPEN STATE FINANZIERUNGSPYRAMIDE            │
├─────────────────────────────────────────────────────┤
│  Basis (70–80%): Bundeshaushalt / Effizienzrendite  │
├─────────────────────────────────────────────────────┤
│  Schicht 2 (10–20%): Länder- & EU-Kofinanzierung    │
├─────────────────────────────────────────────────────┤
│  Schicht 3 (5–10%): API-Lizenzierung (Kommunen/EU)  │
└─────────────────────────────────────────────────────┘
```

---

## 2. Kostenmodell

### 2.1 Einmalige Aufbaukosten (CAPEX)

| Kostenblock | Pilotbetrieb | Ausbau | Vollbetrieb | Gesamt |
|-------------|-------------|--------|-------------|--------|
| Technische Infrastruktur | 45 Mio. € | 80 Mio. € | 60 Mio. € | 185 Mio. € |
| Software-Entwicklung | 60 Mio. € | 90 Mio. € | 50 Mio. € | 200 Mio. € |
| CaseMatch AI (Training + Infrastruktur) | 20 Mio. € | 30 Mio. € | 15 Mio. € | 65 Mio. € |
| Sicherheit & BSI-Zertifizierung | 15 Mio. € | 10 Mio. € | 5 Mio. € | 30 Mio. € |
| Rechtliche & regulatorische Arbeit | 8 Mio. € | 5 Mio. € | 3 Mio. € | 16 Mio. € |
| UX-Forschung & Testing | 5 Mio. € | 8 Mio. € | 4 Mio. € | 17 Mio. € |
| Behörden-Adapter-Entwicklung | 30 Mio. € | 50 Mio. € | 20 Mio. € | 100 Mio. € |
| Change Management & Schulungen | 10 Mio. € | 15 Mio. € | 8 Mio. € | 33 Mio. € |
| **CAPEX Gesamt** | **193 Mio. €** | **288 Mio. €** | **165 Mio. €** | **646 Mio. €** |

*Phasenbeschriftungen: „Pilotbetrieb" = initiale Ausbaustufe; „Ausbau" = föderale Anschlussfähigkeit; „Vollbetrieb" = bundesweit übertragbares Modell*

### 2.2 Laufende Betriebskosten (OPEX)

| Kostenblock | Pilotbetrieb | Ausbau | Skalierung | Vollbetrieb |
|-------------|-------------|--------|-----------|-------------|
| Serverinfrastruktur & Cloud | 18 Mio. € | 28 Mio. € | 40 Mio. € | 55 Mio. € |
| Personal (bis 500 FTE bei Vollbetrieb) | 60 Mio. € | 85 Mio. € | 110 Mio. € | 130 Mio. € |
| Sicherheit & Audits | 8 Mio. € | 10 Mio. € | 12 Mio. € | 14 Mio. € |
| KI-Modellpflege & Retraining | 5 Mio. € | 8 Mio. € | 10 Mio. € | 12 Mio. € |
| Support & Helpdesk | 6 Mio. € | 9 Mio. € | 12 Mio. € | 15 Mio. € |
| Barrierefreiheit & Übersetzungen | 3 Mio. € | 4 Mio. € | 5 Mio. € | 5 Mio. € |
| Bürger-Adoption & Kommunikation | 10 Mio. € | 8 Mio. € | 5 Mio. € | 3 Mio. € |
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

### 3.2 Berechnungsbeispiel (Vollbetrieb, bundesweite Anschlussfähigkeit)

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
Abzgl. OPEX (Vollbetrieb):                      -  234.000.000 €
                                              ─────────────────────
NETTO-EFFIZIENZRENDITE (Vollbetrieb):            7.166.000.000 €
ROI auf CAPEX (646 Mio. €):                            1.109 %
Amortisation CAPEX:                              < 1 Jahr (ab Vollbetrieb)
```

### 3.3 Konservative Schätzung (50 % Abschlag)

```
Netto-Effizienzrendite Vollbetrieb (konservativ): ~3.583.000.000 €/Jahr
= 3,6 Milliarden Euro Einsparung pro Jahr für Bund, Länder, Kommunen
```

**Vergleich:** Das Bundesministerium des Innern gibt jährlich ~12 Mrd. € für Verwaltungsdigitalisierung aus – mit deutlich geringerem Wirkungsgrad. Open State wäre der bisher effizienteste Einsatz dieser Mittel.

### 3.3 Effizienzrendite Domäne Arbeitsverwaltung

Die Domäne Arbeitsverwaltung ist ein besonders deutliches Beispiel für strukturelle Effizienzgewinne:

| Reibungsverlust | Einsparung durch Open State |
|----------------|----------------------------|
| Statusanfragen ohne inhaltlichen Mehrwert (~40–60 % aller Inbound-Kontakte) | Echtzeit-Statusanzeige → Reduktion um 60–75 % |
| Unvollständige Erstanträge (geschätzt ~60–70 % aller Einreichungen) | Vollständigkeitsprüfung bei Eingang → Anteil vollständiger Anträge > 75 % |
| Rückfrage-Wiederholungszyklen durch unklare Standardformulierungen | Strukturierte, begründete Rückfragen → Wiederholungsrate -50 % |
| Fehlbescheide durch unvollständige Akten | Vollständige strukturierte Fallakte → Widerspruchsquote -30–50 % |
| Doppelerfassung durch Medienbrüche | Alle Kanäle in einer Akte → Erfassungsaufwand -70–85 % |
| Ineffektive Termine durch unpräparierte Bürger | Termin-Checkliste → Ineffektivitätsquote -40–60 % |

> Die Bundesagentur für Arbeit verwaltet jährlich Ausgaben von deutlich über 40 Mrd. € (ALG I, Bürgergeld, Eingliederungsleistungen, Verwaltungsaufwand). Selbst eine Effizienzverbesserung im Verwaltungsaufwand von 10–15 % bedeutet fiskalisch eine substanzielle Entlastung.
> Valide Quantifizierung erst nach Pilotbetrieb möglich. Detaillierte Effizienzlogik: [docs/domains/arbeitsverwaltung/08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md](../docs/domains/arbeitsverwaltung/08_STEUERENTLASTUNG_UND_EFFIZIENZLOGIK.md)

---

### 3.4 Domäne Unternehmensgründung: Fiskalische Effizienzlogik

Die Domäne Unternehmensgründung unterscheidet sich von der Arbeitsverwaltung in ihrer fiskalischen Logik: Hier geht es weniger um die Optimierung hoher Leistungsvolumina als um die Beseitigung struktureller Reibungsverluste, die wirtschaftliche Aktivität verzögern oder verhindern.

**Ausgangslage: Verwaltungskosten je Gründungsvorgang**

Ein Gründungsvorgang berührt typischerweise drei bis fünf Behörden. Jede dieser Behörden führt eigenständig Bearbeitungsschritte durch. Ohne systemseitige Koordination entstehen:

- Redundante Dateneingaben: dieselben Grunddaten werden mehrfach erfasst
- Rückfragezyklen durch unvollständige Ersteinreichungen
- Koordinationsaufwand zwischen Behörden ohne gemeinsames System
- Nachbearbeitungen durch fehlerhafte oder inkonsistente Angaben

Eine belastbare Schätzung der Ist-Kosten je Gründungsvorgang setzt eine empirische Erhebung voraus, die im Rahmen des Pilotbetriebs durchzuführen ist. Strukturell lässt sich festhalten: Mehrfache Rückfragezyklen und behördenübergreifende Koordinationsaufwände stellen einen erheblichen Teil der Bearbeitungszeit dar.

**Effizienzpotenziale durch Open State**

| Reibungsverlust | Strukturelle Verbesserung |
|----------------|--------------------------|
| Unvollständige Ersteinreichungen | Fallspezifische Anforderungsliste vor Einreichung – höhere Vollständigkeitsquote |
| Redundante Dateneingaben | Einmalige Eingabe, koordinierte Weiterleitung (mit Einwilligung) |
| Unklare Anforderungen → Rückfragen | Verständliche, erklärte Anforderungen → weniger Nachfragebedarf |
| Kein Statusüberblick → Statusanfragen | Echtzeit-Statusanzeige → Entlastung bei Inbound-Kontakten |
| Verzögerte steuerliche Ersterfassung | Koordinierter Prozess → frühere Erfassung |

**Fiskalische Bedeutung früher Betriebsaufnahme**

Jede vermiedene Verzögerungswoche bei einer Gründung entspricht einer Woche ohne:
- Umsatzsteuervoranmeldung
- Einkommensteuer-Vorauszahlung
- Sozialversicherungsbeiträge
- Gewerbesteueranmeldung

Bei einer hohen Gesamtzahl von Gründungen in Deutschland ist die fiskalische Bedeutung früherer Betriebsaufnahmen messbar, auch wenn eine exakte Schätzung erst nach Pilotbetrieb möglich ist.

**Standortwirkung als mittelfristiger fiskalischer Faktor**

Eine messbar verbesserte Gründungsinfrastruktur hat eine Standortwirkung, die sich mittelfristig in der Steuerbasis niederschlägt: Gründerinnen und Gründer, die sich für den Standort Deutschland entscheiden statt für Alternativen, generieren langfristige steuerliche und wirtschaftliche Aktivität. Dieser Effekt ist qualitativ beschreibbar, aber nicht mit Zuverlässigkeit zu quantifizieren.

> Valide Quantifizierung aller Effizienzpotenziale erst nach Pilotbetrieb möglich.
> Detaillierte Domänendokumentation: [docs/domains/unternehmensgruendung/](../docs/domains/unternehmensgruendung/README.md)

---

## 4. Einnahmemodell – API-Lizenzierung

### 4.1 Lizenzmodell für Kommunen & EU-Partner

Andere Kommunen, Bundesländer und EU-Mitgliedsstaaten können die Open State Infrastruktur lizenzieren:

**Lizenzstufen:**

| Stufe | Zielgruppe | Umfang | Preis |
|-------|-----------|--------|-------|
| **Basic** | Deutsche Kommunen < 50.000 EW | Identity + 3 Basismodule | 0 € (gefördert) |
| **Standard** | Deutsche Kommunen > 50.000 EW | Alle Bundesmodule | 0,50 €/Bürger/Jahr |
| **Professional** | Bundesländer | Alle Module + Support SLA | 0,80 €/Bürger/Jahr |
| **EU Export** | EU-Mitgliedsstaaten | White-Label-Lizenz + Anpassung | Verhandlung (ab 5 Mio. €) |

### 4.2 EU-Export-Revenue-Projektion (nach nachgewiesener Wirksamkeit)

```
Pilotszenario (3 EU-Partnerländer, je ~8 Mio. Einwohner relevant):
Lizenzgebühr: 0,40 €/Bürger/Jahr (Mengenrabatt)
Revenue: 3 × 8.000.000 × 0,40 € = 9,6 Mio. €/Jahr

Erweitertes Szenario (8 EU-Partnerländer, nach föderaler Anschlussfähigkeit):
Revenue: ~25 Mio. €/Jahr
```

---

## 5. Gesamtfinanzplan (zustandsbasiert)

### 5.1 Einnahmen vs. Ausgaben nach Entwicklungsstufe

| Ausbaustufe | CAPEX | OPEX | Bundeshaushalt | Effizienz-ROI* | API | Netto |
|-------------|-------|------|---------------|----------------|-----|-------|
| Initialer Aufbau | 193 Mio. | 40 Mio. | 200 Mio. | 30 Mio. | — | **-3 Mio.** |
| Pilotbetrieb | 288 Mio. | 110 Mio. | 280 Mio. | 350 Mio. | 2 Mio. | **+234 Mio.** |
| Bundeslandebene | 165 Mio. | 152 Mio. | 200 Mio. | 1.500 Mio. | 8 Mio. | **+1.391 Mio.** |
| Skalierung | 0 | 194 Mio. | 150 Mio. | 4.200 Mio. | 20 Mio. | **+4.176 Mio.** |
| Vollbetrieb | 0 | 234 Mio. | 100 Mio. | 7.166 Mio. | 25 Mio. | **+7.057 Mio.** |

*Effizienz-ROI = Einsparungen für gesamten Staat (Bund + Länder + Kommunen), anteilig verrechnet

### 5.2 Break-Even-Analyse

```
BREAK-EVEN-ZEITPUNKT:

Kumulierte Investitionen (Aufbau + Pilotbetrieb): ~831 Mio. €
Kumulierter ROI (Pilotbetrieb):                  ~386 Mio. €
Kumulierter ROI (Bundeslandebene):              ~1.900 Mio. €

Break-Even: Nach abgeschlossener Pilotphase und initialem Bundesland-Rollout

Ab Skalierungsphase: Netto-Überschuss von ~4 Mrd. €/Jahr für den Staatshaushalt
```

---

## 6. Risikoangepasstes Finanzmodell

### 6.1 Szenario-Analyse

| Szenario | Annahme | Netto-ROI (Vollbetrieb) |
|---------|---------|------------------------|
| **Optimistisch** | 95 % Adoption, alle Module aktiv | +9,1 Mrd. €/Jahr |
| **Basis** | 60 % Adoption, Kernmodule | +7,2 Mrd. €/Jahr |
| **Konservativ** | 40 % Adoption, Verzögerungen | +3,6 Mrd. €/Jahr |
| **Pessimistisch** | 20 % Adoption, substanzielle Verzögerungen | +800 Mio. €/Jahr |

**Selbst im pessimistischsten Szenario übersteigt der ROI die Investitionskosten.**

### 6.2 Hauptrisiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Politischer Rückzug | Mittel | Hoch | Staatsvertrag mit Ländern; parlamentarische Verankerung |
| Cyberangriff / Datenpanne | Niedrig | Sehr hoch | BSI-Zertifizierung, Versicherung, Incident-Response-Plan |
| Adoption-Versagen | Mittel | Hoch | UX-First, keine Nutzungspflicht in der Pilotphase |
| Behörden-Verweigerung | Hoch | Mittel | Finanzanreize, Bundesvollzugsgesetz |
| KI-Fehler (CaseMatch) | Niedrig | Mittel | Gestufter Rollout, Human-in-the-Loop zwingend |
| Kostensteigerung IT | Mittel | Mittel | Fixed-Price-Ausschreibungen, Open Source |

---

## 7. Governance des Finanzmodells

**Haushaltskontrolle:**
- Jährliche Prüfung durch Bundesrechnungshof
- Öffentlicher Finanzbericht (Einnahmen, Ausgaben, ROI) jährlich
- Parlamentarische Kontrolle: Haushaltsausschuss berichtet quartalsweise

**Effizienz-Messung:**
- Automatisiertes Dashboard: Transaktionskosten pro Vorgang in Echtzeit
- Benchmarking gegen internationale Systeme (Estland, Singapur)
- KPI: Kosten pro Transaktion < 0,50 € im validierten Vollbetrieb (vs. ~18 € heute analog)

**Reinvestitionsregel:**
- 20 % des jährlichen Effizienz-ROI fließen zurück in Plattform-Innovation
- 10 % in digitale Inklusion (Schulungen, Hardware-Förderprogramm)
- 70 % an Bund/Länder/Kommunen als Haushaltsentlastung

---

## 8. Zusammenfassung

```
╔══════════════════════════════════════════════════════════╗
║        OPEN STATE – FINANZMODELL ZUSAMMENFASSUNG         ║
╠══════════════════════════════════════════════════════════╣
║  Gesamtinvestition (alle Ausbaustufen): ~1,05 Mrd. €     ║
║  Break-Even:           nach Pilotphase + initialem Rollout║
║  Jährlicher ROI (Vollbetrieb):         ~7,2 Mrd. €       ║
║  Amortisation CAPEX:   < 1 Jahr (im validierten Betrieb) ║
║  Kosten/Transaktion Ziel:              < 0,50 €           ║
║  Kosten/Transaktion heute (analog):    ~18 €              ║
║  Kostenreduktion pro Vorgang:          > 97 %             ║
╠══════════════════════════════════════════════════════════╣
║  Finanzierung: 70% Bund | 20% Länder/EU | 10% API-Lizenz ║
║  Werbung:      Ausgeschlossen. Keine Ausnahmen.           ║
╚══════════════════════════════════════════════════════════╝
```

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md bis app-design/08_Prototyp_Prompts.md*
*Alle Zahlen: Modellrechnungen auf Basis öffentlich verfügbarer Verwaltungskosten-Benchmarks*
