# Open State – Transparenz- & Haftungskonzept

*Basis: docs/01_Master_Blueprint.md, docs/02_Vergleich_Best_Practices.md, legal/03_Rechtliche_Machbarkeitsstudie.md*

---

## 1. Grundprinzipien

Open State folgt drei unverhandelbaren Grundprinzipien, die alle Transparenz- und Haftungsfragen strukturieren:

1. **Radikale Nachvollziehbarkeit:** Jede Entscheidung – ob von Mensch oder KI – ist für den betroffenen Bürger vollständig nachvollziehbar.
2. **Klare Verantwortungsketten:** Es gibt immer eine eindeutig benannte juristische Person, die für jeden Schritt eines Prozesses haftet.
3. **Kein Verstecken hinter Algorithmen:** „Die KI hat das entschieden" ist keine rechtlich akzeptable Aussage. Immer ist ein Mensch oder eine Behörde verantwortlich.

---

## 2. Transparenzkonzept

### 2.1 Bürger-Datentransparenz

**Das persönliche Transparenz-Dashboard**

Jeder Bürger hat in der App einen vollständigen Überblick über:

- **Datentresor-Log:** Wer hat wann welche meiner Daten abgerufen?
  - Beispieleintrag: `[Datum], 09:14 Uhr – Einwohnermeldeamt München hat Adressdaten abgerufen (Grund: Ummeldungsverarbeitung)`
- **Aktive Datenweitergaben:** Welche Behörden haben aktuell Zugriff auf welche Daten?
- **Einwilligungen:** Welche optionalen Einwilligungen habe ich erteilt? (mit 1-Klick-Widerruf)
- **Prozess-Timeline:** Vollständiger Verlauf jedes Verwaltungsvorgangs, mit Zeitstempeln und handelnden Stellen
- **KI-Log:** Welche KI-Empfehlungen wurden in meinen Vorgängen eingesetzt?

**Technische Umsetzung:**
- Unveränderliches Audit-Log auf Basis kryptografischer Signaturen (jeder Log-Eintrag signiert)
- Bürger kann vollständigen Datentresor-Export jederzeit anfordern (JSON/PDF, < 24h)
- Löschprotokoll: Nach Datenlöschung erhält Bürger Bestätigung mit kryptografischem Nachweis

### 2.2 Algorithmische Transparenz (KI)

**Erklärungspflicht für jede KI-Empfehlung**

Jede Ausgabe der CaseMatch AI und aller anderen KI-Komponenten muss enthalten:

1. **Was wurde empfohlen:** Klare, verständliche Aussage (keine Fachsprache)
2. **Warum:** Erklärung in Alltagssprache, welche Faktoren die Empfehlung beeinflusst haben
3. **Datenbasis:** Anzahl der ausgewerteten Vergleichsfälle, Zeitraum, geografischer Radius
4. **Konfidenz:** Prozentualer Konfidenzwert mit Erklärung
5. **Grenzen:** Was die KI nicht berücksichtigen konnte (fehlende Datenpunkte)
6. **Alternativen:** Mindestens eine alternative Handlungsoption

**Muster-Erklärungstext CaseMatch AI:**
```
Diese Empfehlung basiert auf 847 vergleichbaren Bußgeldfällen (Falschparken,
Stadtgebiet, 50–100 €) aus den Jahren 2015–2025. In 78 % dieser Fälle war
ein Widerspruch erfolgreich, wenn ein gültiger Parkschein vorlag.

Nicht berücksichtigt: Spezifische lokale Regelungen Ihres Bezirks,
eventuelle Vorstrafen, besondere Tatumstände.

Konfidenz dieser Empfehlung: 74 %

Wichtig: Dies ist keine Rechtsberatung. Bei komplexen Fällen oder
Unsicherheit empfehlen wir die Beratung durch einen Rechtsanwalt.

[Einspruch einlegen] [Anwalt finden] [Mehr erfahren]
```

### 2.3 Institutionelle Transparenz

**Öffentliches KPI-Dashboard (live)**

Das Open State KPI-Dashboard ist für jeden Bürger kostenlos einsehbar und zeigt in Echtzeit:

| Kennzahl | Aktualisierung | Beispielwert |
|----------|----------------|--------------|
| Bearbeitete Transaktionen heute | Echtzeit | 142.847 |
| Ø Prozesszeit Wohnsitzummeldung | Täglich | 1 Min 54 Sek |
| Systemverfügbarkeit (30 Tage) | Stündlich | 99,94 % |
| NPS-Score (letzte 30 Tage) | Täglich | +72 |
| Offene Widersprüche (KI-Entscheidungen) | Täglich | 234 |
| Erfolgsquote menschliche Überprüfung | Monatlich | 91 % |
| Datenschutzvorfälle (laufendes Jahr) | Bei Ereignis | 0 |
| Aktive Nutzer | Täglich | 12,4 Mio. |

**Jährlicher Transparenzbericht:**
- Vollständige Statistiken aller Module
- Bias-Audit-Ergebnisse nach Bevölkerungsgruppen
- Finanzbericht (Betriebskosten, Subventionen, API-Lizenzeinnahmen)
- Sicherheitsvorfälle und Reaktionsmaßnahmen
- Geplante Änderungen im nächsten Jahr
- Veröffentlichung: jeweils 31. März für das Vorjahr

**Open Source:**
- Gesamter Quellcode der Kernkomponenten: öffentlich auf GitHub
- API-Dokumentation: vollständig öffentlich
- Algorithmen-Dokumentation: öffentlich, inkl. Trainingsdaten-Beschreibung
- Security-Advisories: innerhalb 72h nach Entdeckung veröffentlicht

---

## 3. Haftungskonzept

### 3.1 Haftungsarchitektur – Übersicht

```
┌─────────────────────────────────────────────────────────┐
│                  HAFTUNGSEBENEN                          │
├─────────────────────────────────────────────────────────┤
│  Ebene 1: Bund (Open State GmbH / Bundesbehörde)        │
│  → Infrastruktur, Plattform, KI-System, Datensicherheit │
├─────────────────────────────────────────────────────────┤
│  Ebene 2: Zuständige Fachbehörde                        │
│  → Inhaltliche Richtigkeit der Bescheide & Entscheidung │
├─────────────────────────────────────────────────────────┤
│  Ebene 3: KI-Anbieter / Technologiepartner              │
│  → Technische Korrektheit der KI-Outputs (vertraglich)  │
├─────────────────────────────────────────────────────────┤
│  Ebene 4: Bürger                                        │
│  → Korrektheit der selbst eingegebenen Daten            │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Haftung der Plattform (Open State / Bund)

**Staatshaftung nach Art. 34 GG i.V.m. § 839 BGB:**

Open State handelt in Ausübung eines öffentlichen Amtes. Für Schäden durch:

| Schadensfall | Haftung | Rechtsgrundlage |
|-------------|---------|-----------------|
| Systemausfall → Fristversäumnis des Bürgers | Bund haftet | Art. 34 GG, Staatshaftung |
| Datenpanne → Identitätsdiebstahl | Bund haftet (+ DSGVO Art. 82) | DSGVO Art. 82, § 83 BDSG |
| Falsche KI-Empfehlung → Bürger erleidet Schaden | Bund haftet subsidiär | Art. 34 GG, § 839 BGB |
| Datenverlust durch Angriff | Bund haftet bei grober Fahrlässigkeit | Art. 34 GG |
| Technischer Fehler in Übermittlung | Bund haftet | Amtshaftung |

**Haftungsausschluss der Plattform:**
- Schäden durch vom Bürger selbst eingegebene falsche Daten
- Schäden durch Nutzung auf unsicheren Geräten (Bürger hat Sicherheitspflicht)
- Schäden durch höhere Gewalt (Naturkatastrophen, Krieg)

### 3.3 Haftung der Fachbehörden

Die zuständige Fachbehörde haftet für:
- Inhaltliche Richtigkeit ihrer Bescheide und Verwaltungsakte
- Einhaltung gesetzlicher Fristen
- Korrektheit der in ihre Register eingespeisten Daten
- Handlungen ihrer Mitarbeiter bei menschlicher Überprüfung

**Wichtig:** Die Fachbehörde kann sich **nicht** mit dem Hinweis auf eine KI-Empfehlung von ihrer Haftung befreien. Jeder Verwaltungsakt bleibt Akt der Behörde.

### 3.4 Haftung bei KI-Entscheidungen (CaseMatch AI)

**Grundsatz:** CaseMatch AI trifft keine Entscheidungen. Sie erstellt ausschließlich Empfehlungen. Die Haftung für die Folgen einer Handlung liegt beim:

1. **Bürger:** Wenn er eine KI-Empfehlung befolgt und einen Widerspruch einlegt → eigene Entscheidung
2. **Behörde:** Wenn sie auf Basis einer KI-unterstützten Analyse einen Bescheid erlässt → Behördenhaftung
3. **Bund (subsidiär):** Wenn die KI-Empfehlung nachweislich fehlerhaft war und der Fehler auf einen Systemfehler zurückzuführen ist

**Haftungsausschluss CaseMatch AI:**
- Empfehlungen sind ausdrücklich keine Rechtsberatung (RDG)
- Konfidenzwert unter 60 %: Zusätzlicher Warnhinweis „Geringe Datenbasis – professionelle Beratung empfohlen"
- Keine Haftung für Entscheidungen des Bürgers auf Basis der Empfehlung

### 3.5 Datenschutz-Haftung (DSGVO Art. 82)

| Szenario | Verantwortlicher | Haftungsrahmen |
|----------|-----------------|----------------|
| Datenpanne durch Infrastruktur-Hack | Bund als Verantwortlicher | DSGVO Art. 82, unbegrenzt |
| Unbefugter Behördenzugriff auf Daten | Behörde als Verantwortlicher | DSGVO Art. 82 + Amtshaftung |
| Weitergabe an Werbepartner ohne Einwilligung | Bund als Verantwortlicher | DSGVO Art. 83 (bis 4 % Jahresumsatz) |
| Verletzung Löschpflicht | Bund als Verantwortlicher | DSGVO Art. 83 |

---

## 4. Muster-Rechtstexte

### 4.1 Nutzungsbedingungen – Kurzfassung (Einfache Sprache)

```
NUTZUNGSBEDINGUNGEN OPEN STATE – KURZFASSUNG
(Vollständige Version: openstate.de/nutzungsbedingungen)

Was ist Open State?
Open State ist die offizielle App der Bundesrepublik Deutschland
für Ihre Behördengänge. Sie wird vom Bund betrieben.

Was können Sie tun?
- Behördenangelegenheiten digital erledigen
- Ihre Daten jederzeit einsehen und löschen
- Widerspruch gegen jede Entscheidung einlegen

Was dürfen wir?
- Ihre Daten nur für den jeweiligen Verwaltungsvorgang nutzen
- Daten an die zuständige Behörde weitergeben (Sie sehen das immer)
- Anonyme Statistiken für die Verbesserung des Services erheben

Was dürfen wir NICHT?
- Ihre Daten verkaufen
- Ihre Verwaltungsdaten für Werbung nutzen
- Entscheidungen vollständig einer KI überlassen

Haftung:
Wenn durch einen Fehler unserer App ein Schaden entsteht,
haftet der Bund nach deutschem Staatshaftungsrecht.

Kontakt & Beschwerden:
datenschutz@openstate.bund.de | 0800 678 900 (kostenlos)
Ombudsmann: openstate.bund.de/ombudsmann
```

### 4.2 KI-Empfehlungs-Disclaimer (Pflichttext)

```
HINWEIS ZUR KI-EMPFEHLUNG

Diese Empfehlung wurde von einem KI-System (CaseMatch AI) erstellt
und stellt KEINE Rechtsberatung im Sinne des Rechtsdienstleistungs-
gesetzes (RDG) dar.

Die Empfehlung basiert auf statistischen Auswertungen vergleichbarer
Fälle. Ihr konkreter Fall kann abweichende rechtliche Besonderheiten
aufweisen, die das KI-System nicht berücksichtigen kann.

Konfidenz dieser Empfehlung: [XX] %
Basierend auf: [X.XXX] Vergleichsfällen ([YYYY]–[YYYY])

Für rechtlich verbindliche Beratung wenden Sie sich an:
→ Einen zugelassenen Rechtsanwalt (Anwaltssuchdienst)
→ Eine Verbraucherzentrale (kostenlos)
→ Ihr zuständiges Amtsgericht (Rechtsantragsstelle)

[Ich verstehe und möchte fortfahren] [Anwalt finden]
```

### 4.3 Einwilligungserklärung Datenteilung (DSGVO-konform)

```
EINWILLIGUNG ZUR DATENWEITERGABE
Vorgang: Wohnsitzummeldung
Datum: [DATUM]

Ich willige ein, dass meine folgenden Daten an die genannten
Stellen weitergegeben werden:

DATEN:                          EMPFÄNGER:
✓ Name, Vorname                 → Einwohnermeldeamt München
✓ Geburtsdatum                  → Einwohnermeldeamt München
✓ Alte Adresse                  → Einwohnermeldeamt Berlin (Abmeldung)
✓ Neue Adresse                  → Einwohnermeldeamt München
✓ Neue Adresse                  → Finanzamt München (automatisch)
✓ Neue Adresse                  → KFZ-Zulassungsstelle (automatisch)

Optional (ich kann ablehnen):
☐ Neue Adresse                  → Krankenversicherung [Name]
☐ Neue Adresse                  → Rentenversicherung

Zweck: Vollständige Ummeldung an allen zuständigen Stellen.
Rechtsgrundlage: Art. 6 Abs. 1 lit. e DSGVO (öffentliches Interesse)

Ich kann diese Einwilligung jederzeit in der App widerrufen.
Der Widerruf gilt für künftige Weitergaben; vergangene Weitergaben
sind rechtlich wirksam und können nicht rückgängig gemacht werden.

[BESTÄTIGEN MIT FINGERABDRUCK / PIN]
```

### 4.4 Widerspruchsbestätigung (Automatisch generiert)

```
WIDERSPRUCHSBESTÄTIGUNG
Aktenzeichen: OS-[JJJJ]-[XXXXXX]

Hiermit bestätigen wir den Eingang Ihres Widerspruchs:

Eingereicht von: [Name, eID-verifiziert]
Datum/Uhrzeit:   [Datum, Uhrzeit]
Betreff:         Bußgeldbescheid [Aktenzeichen Behörde]
Zuständige Behörde: [Behördenname]

Ihr Widerspruch wurde elektronisch bei der zuständigen Behörde
eingereicht und hat nach § 80 VwGO aufschiebende Wirkung
(Vollstreckung ist bis zur Entscheidung ausgesetzt).

Bearbeitungszeit der Behörde: bis zu 3 Monate (gesetzlich)
Aktuelle Schätzung: [X Wochen] (Basis: aktuelle Bearbeitungszeiten)

Status-Updates erhalten Sie automatisch per Push-Nachricht.

Anhänge Ihres Widerspruchs:
- Widerspruchsschreiben (automatisch generiert, von Ihnen bestätigt)
- [Ihre hochgeladenen Dokumente]

Bei Fragen: [Direktlink zur Behörde] | Aktenzeichen: OS-[JJJJ]-[XXXXXX]
```

### 4.5 Datenpanne – Pflicht-Benachrichtigung an Bürger (Art. 34 DSGVO)

```
WICHTIGE SICHERHEITSMITTEILUNG
Aktenzeichen Vorfall: OS-SEC-[JJJJ]-[XXX]

Sehr geehrte Bürgerinnen und Bürger,

wir informieren Sie über einen Sicherheitsvorfall, der möglicherweise
auch Ihre Daten betrifft.

WAS IST PASSIERT:
[Klare, verständliche Beschreibung des Vorfalls]

WELCHE DATEN SIND BETROFFEN:
[Auflistung der Datenkategorien]

WAS WIR GETAN HABEN:
- [Datum]: Vorfall erkannt und Systeme gesichert
- [Datum]: Aufsichtsbehörde (BfDI) informiert
- [Datum]: Strafanzeige erstattet

WAS SIE TUN SOLLTEN:
1. [Konkrete Handlungsempfehlung]
2. [Konkrete Handlungsempfehlung]

IHR ANSPRUCH AUF SCHADENSERSATZ:
Falls Ihnen ein nachweisbarer Schaden entstanden ist, haben Sie
Ansprüche nach Art. 82 DSGVO. Melden Sie sich unter:
datenpanne@openstate.bund.de | 0800 678 901 (kostenlos, 24/7)

Wir entschuldigen uns für diesen Vorfall.

[Unterschrift Bundesbeauftragter Open State]
```

---

## 5. Ombudsmann & Beschwerdemanagement

### 5.1 Dreistufiges Beschwerdesystem

**Stufe 1 – In-App-Beschwerden (< 48h Reaktion):**
- Direkt in der App nach jedem Vorgang bewertbar
- NPS + Freitextfeld
- Automatische Eskalation bei NPS < 6

**Stufe 2 – Formelle Beschwerde (< 10 Arbeitstage):**
- Formular in App oder per Post
- Dediziertes Beschwerdemanagement-Team
- Schriftliche Antwort mit Begründung garantiert

**Stufe 3 – Ombudsmann Open State (unabhängig):**
- Unabhängige Stelle, besetzt durch Bundesrat und Bundestag je zur Hälfte
- Zuständig für: systemische Fehler, Datenschutzverletzungen, KI-Diskriminierung
- Jährlicher Ombudsmann-Bericht öffentlich

**Externe Eskalationswege:**
- Bundesbeauftragter für Datenschutz (BfDI)
- Verwaltungsgericht (Rechtsweg immer offen)
- EU-Beschwerdestelle (EDPS)

---

## 6. Grundsatz zur kommerziellen Unabhängigkeit

Open State ist keine Werbeplattform. Staatliche Infrastruktur dient dem Bürger – nicht kommerziellen Interessen Dritter.

**Verbotene Nutzung von Verwaltungsdaten:**
- Keine Nutzung von Verwaltungsdaten für kommerzielle Zwecke
- Keine Weitergabe von Nutzungsdaten an Dritte zu Analysezwecken
- Keine Werbeplatzierung jeglicher Art innerhalb der App oder der Verwaltungsprozesse
- Keine Kooperationen, die staatliche Vertrauenswürdigkeit mit kommerziellen Interessen vermengen

**API-Lizenzierung als einziger kommerzieller Berührungspunkt:**
- Kommunen und EU-Partner können die Infrastruktur lizenzieren (klar abgegrenzte Vertragsbeziehung)
- Lizenznehmer unterliegen denselben Datenschutz- und Transparenzpflichten wie der Bund
- Lizenznehmer erhalten keinen Zugriff auf Nutzerdaten des Bundes-Systems

**Haftung für Drittanbieter-Integrationen:**
- Behördenadapter unterliegen denselben Sicherheits- und Transparenzpflichten
- Subdienstleister haften vertraglich; Bund haftet gegenüber Bürgern nach Staatshaftungsrecht
- Sofortige Abschaltung bei Sicherheits- oder Datenschutzverstößen, Prüfung innerhalb 24h

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md, docs/02_Vergleich_Best_Practices.md, legal/03_Rechtliche_Machbarkeitsstudie.md*
