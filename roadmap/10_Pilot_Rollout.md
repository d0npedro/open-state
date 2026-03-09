# Open State – Pilot- & Rollout-Strategie

*Basis: docs/01–09*

---

## 1. Pilotprojekt-Strategie

### 1.1 Grundprinzip: „Kleinstadttests, Großstadtlernen"

Das Pilotprojekt folgt dem bewährten Prinzip erfolgreicher E-Government-Reformen (Estland, Dänemark, Georgien): **Nicht mit dem Härtesten anfangen, sondern mit dem Machbarsten** – und die Erkenntnisse dann skalieren.

**Auswahlkriterien Pilotkommune:**
- Einwohnerzahl: 30.000–80.000 (handhabbar, aber repräsentativ)
- Politischer Wille: Bürgermeister/Stadtrat als aktiver Champion
- IT-Basis: Mindestens ein modernes Behörden-IT-System vorhanden
- Demografie: Repräsentativ für Deutschland (Altersstruktur, Bildungsgrad)
- Geografie: Je eine Pilot-Gemeinde pro Bundesland-Cluster (Nord, Süd, Ost, West)

**Empfohlene Pilotstädte:**
| Stadt | EW | Begründung |
|-------|----|------------|
| Erlangen | 115.000 | Starke IT-Infrastruktur, progressiver Stadtrat |
| Rostock | 210.000 | Repräsentativ Ost, Universitätsstadt, digitale Aufgeschlossenheit |
| Münster | 320.000 | NRW-Multiplikator, starke Bürgerbeteiligung, gut vernetzte Verwaltung |
| Freiburg | 235.000 | Baden-Württemberg-Pilot, hohe Digitalisierungsbereitschaft |

---

## 2. Rollout-Plan (zustandsbasiert)

Die Rollout-Phasen sind nicht an kalendarische Daten gebunden, sondern an nachgewiesene Zustände: Jede Phase beginnt erst dann, wenn die vorherige Phase ihre Qualitätsziele erreicht hat. Verzögerungen verlängern die Phase – sie verschieben keine festgelegten Termine.

---

### PHASE 0 – Vorbereitung | Initiale Ausbaustufe

**Ziel:** Rechtliche, technische und organisatorische Grundlagen schaffen.

#### Ausbaustufe A.1 – Rechtliche & organisatorische Grundlage

**Rechtlich:**
- [ ] Kabinettsbeschluss: Open State als nationales Infrastrukturprojekt
- [ ] Bundesbeauftragter Open State ernannt (Staatssekretärs-Ebene)
- [ ] OZG-Novellen-Entwurf (Paket A) eingebracht
- [ ] Staatsvertrag-Entwurf mit ersten 4 Pilotbundesländern

**Organisatorisch:**
- [ ] Föderales Kompetenzzentrum GmbH gegründet
- [ ] Technologierat berufen (15 Mitglieder: Tech, Recht, Datenschutz, Zivilgesellschaft)
- [ ] Bürgerbeirat (50 Mitglieder) konstituiert
- [ ] Erste 100 Entwickler-FTE eingestellt (Tarifvertrag öffentlicher Dienst + Tech-Zulagen)

**Technisch:**
- [ ] Infrastruktur-Ausschreibung veröffentlicht (GAIA-X Sovereign Cloud)
- [ ] Security-Konzept an BSI übergeben
- [ ] Open-Source-Repository auf GitHub eingerichtet
- [ ] Entwicklungsumgebung (GitLab CI, K8s-Cluster Dev) aufgebaut

#### Ausbaustufe A.2 – Technische Basis

**Technisch:**
- [ ] eID-Server-Integration (Bundesdruckerei) vertraglich gesichert
- [ ] API-Standards (XÖV 3.0) mit IT-Planungsrat abgestimmt und verabschiedet
- [ ] Sovereign Cloud Infrastruktur provisioniert (Frankfurt Primary + Berlin DR)
- [ ] Identity Service Alpha entwickelt

**Pilotgemeinden:**
- [ ] Pilotgemeinde-Verträge unterzeichnet (4 Städte)
- [ ] Kickoff-Workshops mit Behördenleitern in allen 4 Pilotstädten
- [ ] Bürger-Testpanel je Pilotstadt aufgebaut (250 repräsentative Teilnehmer)
- [ ] Behörden-Adapter-Bestandsaufnahme (welche Legacy-Systeme vorhanden?)

#### Ausbaustufe A.3 – Infrastruktur & Kommunikation

**Technisch:**
- [ ] API Gateway (Kong) produktionsreif konfiguriert
- [ ] Wohnsitz-Adapter für Einwohnermeldeämter der Pilotstädte entwickelt
- [ ] Datentresor-Architektur (Zero-Knowledge) implementiert und DSGVO-geprüft
- [ ] Erstes internes Security Audit durch BSI-akkreditiertes Unternehmen

**Kommunikation:**
- [ ] Brand & Kommunikationsstrategie fertiggestellt
- [ ] Landing Page openstate.bund.de live
- [ ] Informationsmaterialien für Pilotstädte vorbereitet

**Eingangsvoraussetzungen Phase 1:**
- Alle rechtlichen Voraussetzungen für Pilotbetrieb erfüllt: ✓/✗
- Technische Infrastruktur: > 95 % bereit: ✓/✗
- Personal: Mind. 150 FTE eingestellt: ✓/✗

---

### PHASE 1 – Closed Alpha | Validierter Pilotzustand

**Ziel:** Kernmodule mit internen Testern und 1.000 Pilotbürgern validieren.

**Scope:**
- Modul 1.1: eID-Onboarding
- Modul 1.2: Wohnsitzummeldung
- Modul 1.3: Steuererklärung AutoFill (nur Ansicht, noch kein Submit)

**Teilnehmer:** 1.000 ausgewählte Bürger pro Pilotstadt = 4.000 Alpha-Tester
- 25 % über 65 Jahre (Seniorenvertretungen)
- 20 % Migrationshintergrund (Sprachvielfalt testen)
- 15 % mit Behinderung (Barrierefreiheit)
- 40 % „typische" Nutzer

#### Alpha-Start

**Woche 1–2:**
- [ ] Alpha-App für iOS + Android veröffentlicht (Closed TestFlight / Internal Track)
- [ ] Onboarding-Workshop für alle 4.000 Alpha-Tester (hybrid: vor Ort + digital)
- [ ] Helpdesk 24/7 aktiv (dediziertes Alpha-Support-Team)

**Woche 3–4:**
- [ ] Erste 500 Ummeldungen durchgeführt
- [ ] Tägliche Bug-Reports ausgewertet, kritische Bugs innerhalb 24h gepatcht
- [ ] NPS-Erhebung: Erste Messung

**Eingangs-KPIs Alpha:**
- 80 % der Alpha-Tester führen mindestens 1 Transaktion durch
- Ummeldung Erfolgsquote: > 90 %
- Ø Prozesszeit Ummeldung: < 5 Minuten (Lernkurve)
- NPS: > 40

#### Alpha-Iteration

- [ ] Steuererklärung AutoFill (Ansicht) für alle Alpha-Tester
- [ ] Erste UX-Iteration auf Basis Alpha-Feedback (Sprint 1)
- [ ] Barrierefreiheits-Audit mit echten betroffenen Nutzern
- [ ] Einfache-Sprache-Version von allen Alpha-Screens
- [ ] Erstes öffentliches Update: Blog-Post mit anonymisierten Alpha-Erkenntnissen

**Meilenstein-KPIs:**
- Ø Prozesszeit Ummeldung: < 3 Minuten
- Barrierefreiheits-Score: WCAG 2.1 AA bestanden
- Kritische Bugs: 0

#### Alpha-Abschluss

- [ ] CaseMatch AI Alpha (nur intern, 50 Juristen als Tester)
- [ ] Steuererklärung Submit-Funktion (mit ELSTER-Testschnittstelle)
- [ ] Performance-Lasttest: 50.000 simulierte gleichzeitige Nutzer
- [ ] Sicherheitstest: Externer Penetrationstest #1
- [ ] Alpha-Abschlussbericht: Lessons Learned + Blueprint-Aktualisierung

**Eingangsvoraussetzungen Phase 2 (Gesamt Alpha):**
- 4.000 Alpha-Tester aktiv
- 10.000+ Transaktionen durchgeführt
- NPS > 55
- Prozesszeit Ummeldung Ø < 3 Min
- 0 Datenpannen
- Behörden-Adapter: 100 % der Pilot-Ämter angebunden

---

### PHASE 2 – Open Beta Pilotgemeinden | Erweiterter Pilotzustand

**Ziel:** Alle Einwohner der 4 Pilotstädte können Open State freiwillig nutzen.

**Scope (erweitert):**
- Alle Phase-1-Module (jetzt mit Steuererklärung Submit)
- Modul 2.4: KFZ-Ummeldung (neu)
- CaseMatch AI Beta: Bußgeldfälle (neu)
- Datentresor vollständig

**Potenzielle Nutzerbasis:** ~880.000 Einwohner (4 Pilotstädte)
**Ziel-Adoption:** 15 % = ~132.000 aktive Nutzer

#### Beta-Launch

**Launch-Woche:**
- [ ] Öffentliche Information der Bevölkerung: „Open State ist für alle zugänglich"
- [ ] App Store Release (iOS + Android, Rating ab 16+)
- [ ] Bürgerversammlungen in allen 4 Pilotstädten (Bürgermeister präsentiert)
- [ ] Sonderseiten auf Webseiten der Pilotstädte
- [ ] Bibliotheks-Workshops: Digitale Assistenz für ältere Bürger

**Technisch:**
- [ ] Auto-Scaling unter echten Lastbedingungen beobachtet
- [ ] Echtzeit-KPI-Dashboard öffentlich geschaltet
- [ ] Feedback-Kanal direkt in App integriert

#### Beta-Vertiefung

- [ ] CaseMatch AI Beta: Erste öffentliche Bußgeld-Widersprüche
- [ ] Erste Auswertung: Akzeptanzraten nach Altersgruppe, Region, Bildungsgrad
- [ ] Sprint 2: UX-Iteration auf Basis Beta-Feedback
- [ ] Erster CaseMatch-Bias-Audit (intern)
- [ ] Erster monatlicher öffentlicher Transparenzbericht

**Meilenstein-KPIs:**
- Aktive Beta-Nutzer: > 50.000
- CaseMatch-Nutzungen: > 2.000
- Behördliche Antwortzeit Ummeldung: Ø < 24h

#### Beta-Evaluation

- [ ] Unabhängige Evaluation durch Fraunhofer-Institut (Benutzerfreundlichkeit + Effizienz)
- [ ] Behörden-Feedback-Runde: Was müssen die Ämter intern anpassen?
- [ ] Politische Berichterstattung: Bundestag-Ausschuss informiert
- [ ] Vorbereitung Phase 3: Bundesländer-Rollout

**Eingangsvoraussetzungen Phase 3 (Gesamt Beta):**
- 100.000+ aktive Nutzer in Pilotstädten
- Adoption Rate: > 12 %
- NPS: > 60
- Ummeldung Ø Prozesszeit: < 2:30 Min
- CaseMatch: > 5.000 Analysen, Juristen-Audit bestanden
- Datenpannen: 0

---

### PHASE 3 – Bundesländer-Rollout | Föderale Anschlussfähigkeit

**Ziel:** 5 Bundesländer vollständig anbinden, auf 2 Millionen Nutzer skalieren.

**Ziel-Bundesländer (nach politischem Vorlauf):**
1. Bayern (Pilotland, starke IT-Infrastruktur)
2. Hamburg (Stadtstaat, einheitliche Verwaltung)
3. Thüringen (Ost-Repräsentation, Reformbereitschaft)
4. Baden-Württemberg (Industrieland, hohe Digitalisierungsbereitschaft)
5. Schleswig-Holstein (Norden, E-Government-Vorreiter)

#### Rollout-Stufe 3.1

- [ ] Behörden-Adapter für alle 5 Bundesländer vollständig deployed
- [ ] Landesspezifische Anpassungen (unterschiedliche Verwaltungsstrukturen)
- [ ] Schulungsprogramm für 5.000 Behördenmitarbeiter in 5 Ländern
- [ ] Gewerbeanmeldungs-Modul 2.1 live (alle 5 Länder)
- [ ] Sozialleistungs-Modul 2.3 Beta: Bürgergeld-Antrag

#### Rollout-Stufe 3.2

- [ ] 1-Jahres-Review: Vollständiger Lessons-Learned-Report
- [ ] Blueprint-Update v2.0 basierend auf Echtdaten aus Pilotbetrieb
- [ ] CaseMatch AI v2: Erweitert auf Widersprüche gegen Steuerbescheide (Beta)
- [ ] Erster Transparenzbericht (öffentlich, mit Wirtschaftlichkeitsnachweis)
- [ ] Erster EU-Austausch: Präsentation bei EU-Kommission

#### Rollout-Stufe 3.3

- [ ] 2-Millionen-Nutzer-Meilenstein
- [ ] Alle Priorität-1-Module produktionsreif (bundesweit in 5 Ländern)
- [ ] Vorbereitung bundesweiter Rollout (Phase 4)
- [ ] API-Lizenz-Pilotgespräche mit 3 EU-Ländern
- [ ] App Store Rating: Ziel > 4,5 Sterne

**Eingangsvoraussetzungen Phase 4:**
- Aktive Nutzer: > 2.000.000
- Bundesländer angebunden: 5/16
- Transaktionen/Monat: > 5.000.000
- NPS: > 65
- Behörden-Anbindungsquote: > 95 % aller relevanten Ämter in 5 Ländern

---

### PHASE 4 – Bundesweiter Rollout | Bundesweit übertragbares Modell

**Ziel:** Alle 16 Bundesländer, alle Priorität-2-Module, 10+ Millionen Nutzer.

#### Rollout-Stufe 4.1

- [ ] Weitere 6 Bundesländer anbinden (NRW, Niedersachsen, Hessen, Sachsen, Brandenburg, Rheinland-Pfalz)
- [ ] CaseMatch AI GA (General Availability): Alle OWiG-Fälle
- [ ] Sozialleistungs-Modul vollständig: Bürgergeld, Wohngeld, Elterngeld
- [ ] KFZ-Zulassung bundesweit live
- [ ] 5-Millionen-Nutzer-Meilenstein

#### Rollout-Stufe 4.2

- [ ] Letzte 5 Bundesländer anbinden (Berlin, Bremen, Mecklenburg-Vorpommern, Saarland, Sachsen-Anhalt)
- [ ] **Alle 16 Bundesländer vollständig angebunden**
- [ ] Digitales Notarmodul Beta (nach BeurkG-Novelle)
- [ ] EU-EUDIW-Kompatibilität hergestellt
- [ ] Erste EU-Export-Lizenzen (3 Partnerländer)

#### Rollout-Stufe 4.3 – Vollbetrieb

- [ ] 10 Millionen aktive Nutzer
- [ ] Alle Priorität-2-Module im GA-Status
- [ ] Erster vollständiger Jahresbericht mit Wirtschaftlichkeitsnachweis
- [ ] Bundesrechnungshof-Prüfung abgeschlossen
- [ ] Meilenstein-Präsentation im Bundestag
- [ ] Konzept für nächste Ausbaustufe (Priorität-3-Module) verabschiedet

**Eingangsvoraussetzungen Vollbetrieb (Gesamtziele):**
- Aktive Nutzer: > 10.000.000
- Bundesländer vollständig: 16/16
- Transaktionen seit Launch: > 50.000.000
- NPS: > 70
- Ummeldung Ø Prozesszeit: < 2 Minuten
- Kosten pro Transaktion: < 1,50 € (Ziel Vollbetrieb: < 0,50 €)
- Datenpannen: 0
- App Store Rating: > 4,6 Sterne (iOS + Android)
- Behördenmitarbeiter geschult: > 50.000
- Break-Even in Sicht: ✓

---

## 3. Phasenübersicht

```
PHASE:    0            1             2             3              4
          [VORB.]   [CL.ALPHA]   [OPEN BETA]  [LÄNDER-RO.]  [BUNDESWEIT]

Rechtl.:  [=========]
eID/Ident:[===]
Wohnsitz:       [==============================...]
Steuer:             [==========================...]
CaseMatch:               [====================...]
KFZ:                           [================...]
Gewerbe:                             [============...]
Sozial:                                    [========...]
Notarmod.:                                              [=====...]
EU-Export:                                                        [======]
```

---

## 4. Change-Management-Strategie

### 4.1 Bürger-Adoption

**Phasenmodell der Adoption (nach Rogers: Diffusion of Innovation):**

| Gruppe | Anteil | Rollout-Phase | Strategie |
|--------|--------|---------------|----------|
| Innovatoren | 2,5 % | Alpha | Tech-affine Freiwillige, Beta-Programm |
| Frühe Übernehmer | 13,5 % | Beta | Bürgeramts-Empfehlung, gezielte Kommunikation |
| Frühe Mehrheit | 34 % | Phase 3 | Medien, Mundpropaganda, Schul-Workshops |
| Späte Mehrheit | 34 % | Phase 4 | Vereinfachungen, Kiosk-Unterstützung |
| Nachzügler | 16 % | Nach Vollbetrieb | Persönliche Unterstützung, Pflicht nur wo rechtlich zulässig |

**Adoption-Kanäle:**
- Bürgeramt-Empfehlung: Bei jedem Besuch wird App vorgestellt
- Bibliotheks-Workshops: 1.500 Workshops bundesweit
- Schulen: Digitales Bürgerkunde-Programm ab Klasse 9
- Arbeitgeber-Programm: HR-Abteilungen informieren Mitarbeiter
- Öffentliche Kommunikation: ARD/ZDF Public-Service-Informationen (kein bezahltes Advertising)

### 4.2 Behörden-Onboarding

**Das größte Risiko:** Behördenmitarbeiter, die Open State als Bedrohung ihrer Stellen sehen.

**Kommunikation:**
- „Open State ersetzt keine Stellen – es befreit Mitarbeiter von Routine für komplexe Fälle"
- Konkrete Beispiele: Sachbearbeiter, die statt 200 Ummeldungen täglich abzutippen, jetzt komplexe Sozialfälle begleiten
- Schulung als Karrierechance kommunizieren: „Open-State-Zertifikat" für Verwaltungsmitarbeiter

**Incentives:**
- Pionierstädte erhalten erhöhte IT-Fördermittel
- Frühe Behörden bekommen priorisierten Support
- Öffentliche Anerkennung: „Open-State-Vorreitergemeinde"-Auszeichnung

### 4.3 Politisches Stakeholder-Management

| Stakeholder | Hauptinteresse | Strategie |
|-------------|---------------|-----------|
| Bundestag | Kosteneinsparung, Bürgernutzen | Quartalsberichte, Effizienz-KPIs |
| Bundesländer | Souveränität, Kofinanzierung | Staatsvertrag mit fairer Kostenteilung |
| Kommunen | Entlastung, Finanzierung | Förderpaket, frühzeitige Einbindung |
| Datenschutzbeauftragter | DSGVO-Konformität | Enge Kooperation, Co-Design |
| IT-Verbände | Marktchancen | Open-Source-Ökosystem, API-Lizenzierung |
| Medien | Transparenz, Kritik | Offene Kommunikation, Fehler eingestehen |
| Zivilgesellschaft | Inklusion, Datenschutz | Bürgerbeirat, regelmäßige Dialoge |

---

## 5. Krisenplan

### Szenario A: Systemausfall > 4 Stunden

1. Sofortige Aktivierung des DR-Rechenzentrums (< 30 Min RTO)
2. Statuspage-Update auf status.openstate.bund.de (< 15 Min)
3. Push-Notification an alle Nutzer mit ETA
4. Automatische Fristverlängerung für laufende Vorgänge
5. Post-Mortem öffentlich innerhalb 72h

### Szenario B: Datenpanne

1. Sofortige Systemabschaltung betroffener Module
2. BfDI informiert innerhalb 1 Stunde (DSGVO Art. 33: 72h-Pflicht)
3. Betroffene Bürger benachrichtigt innerhalb 24h (Art. 34 DSGVO)
4. Forensische Untersuchung BSI-akkreditiertes Unternehmen
5. Krisen-Pressebriefing innerhalb 4h

### Szenario C: Politischer Rückzug eines Bundeslandes

1. Automatischer Fallback: Bürger können weiterhin über Bundesportal agieren
2. Adapter-Freeze: Daten des Landes werden eingefroren, nicht gelöscht
3. Verhandlungsteam innerhalb 48h aktiv
4. Plan B: Direkte Kommunalpartnerschaft ohne Landesebene

---

## 6. Erfolgsmessung & KPI-Framework

### 6.1 North Star Metric

**„Verwaltungsaufwand eingespart pro Bürger und Jahr"**

Ziel im validierten Vollbetrieb: Jeder aktive Nutzer spart Ø 4 Stunden Verwaltungsaufwand pro Jahr.

### 6.2 KPI-Dashboard (Echtzeit, öffentlich)

| KPI | Ausgangswert | Ziel Alpha | Ziel Beta | Ziel Vollbetrieb |
|-----|-------------|-----------|----------|-----------------|
| Aktive Nutzer | 0 | 4.000 | 100.000 | 10.000.000 |
| Ummeldung Ø Zeit | ~4 Wochen | 5 Min | 3 Min | < 2 Min |
| NPS | — | 40 | 60 | 70 |
| Transaktionen/Monat | 0 | 10.000 | 500.000 | 20.000.000 |
| Bundesländer angebunden | 0 | 0 | 0 | 16 |
| Kosten/Transaktion | ~18 € | 8 € | 3 € | < 0,50 € |
| App Store Rating | — | 4,0 | 4,4 | 4,6 |
| Datenpannen | 0 | 0 | 0 | 0 |
| CaseMatch Accuracy | — | — | 75 % | 78 % |
| Barrierefreiheit | WCAG A | WCAG AA | WCAG AA | WCAG AA+ |

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md bis roadmap/09_Monetarisierung_Finanzmodell.md*
