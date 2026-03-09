# Open State – Rechtliche Machbarkeitsstudie

*Basis: docs/01_Master_Blueprint.md & docs/02_Vergleich_Best_Practices.md*

---

## 1. Einleitung & Prüfungsumfang

Diese Machbarkeitsstudie analysiert die rechtliche Vereinbarkeit von Open State mit dem geltenden deutschen und europäischen Rechtsrahmen. Geprüft werden:

- Grundgesetz (GG)
- Datenschutz-Grundverordnung (DSGVO) + BDSG
- Onlinezugangsgesetz (OZG)
- Vertrauensdienstegesetz (VDG) / eIDAS-Verordnung
- Verwaltungsverfahrensgesetz (VwVfG)
- Abgabenordnung (AO) / ELSTER
- Strafprozessordnung (StPO) / OWiG (für CaseMatch AI)
- Bundesnotarordnung (BNotO)
- Berufsgeheimnis / Anwaltliche Verschwiegenheit (BRAO)
- IT-Sicherheitsgesetz / KRITIS-Regulierung

---

## 2. Vereinbarkeits-Analyse: Hauptrechtsgebiete

### 2.1 Grundgesetz

| Artikel | Inhalt | Vereinbarkeit | Handlungsbedarf |
|---------|--------|---------------|-----------------|
| Art. 1 GG | Menschenwürde, informationelle Selbstbestimmung (BVerfGE 65,1) | ✅ Vereinbar | Zero-Knowledge-Architektur technisch umsetzen; keine Zwangspflicht zur App |
| Art. 2 Abs. 1 GG | Allgemeines Persönlichkeitsrecht | ✅ Vereinbar mit Auflagen | Datensparsamkeit als Designprinzip; Opt-out-Option für alle nicht-obligatorischen Dienste |
| Art. 3 GG | Gleichheitsgrundsatz | ⚠️ Bedingt vereinbar | Physische Fallback-Option gesetzlich sichern; digitale Inklusion als Pflicht |
| Art. 10 GG | Fernmeldegeheimnis | ✅ Vereinbar | Ende-zu-Ende-Verschlüsselung als technischer Mindeststandard |
| Art. 19 Abs. 4 GG | Rechtsschutzgarantie | ⚠️ Bedingt vereinbar | KI-Entscheidungen dürfen niemals final sein; menschliche Überprüfung muss immer möglich bleiben |
| Art. 20 GG | Demokratieprinzip / Gewaltenteilung | ✅ Vereinbar | Hoheitliche Entscheidungen bleiben bei Menschen; KI nur als Assistenz |
| Art. 28 GG | Kommunale Selbstverwaltung | ⚠️ Konfliktpotenzial | Bundesgesetz mit Vollzugspflicht benötigt Zustimmung Bundesrat; Rechte der Kommunen beachten |
| Art. 30/83 ff. GG | Föderalismus / Länderkompetenz | ⚠️ Erhebliches Konfliktpotenzial | Verfassungsänderung oder Staatsvertrag für bundesweiten Vollzug erforderlich |

**Fazit Grundgesetz:** Open State ist grundsätzlich verfassungskonform, sofern (a) keine Nutzungspflicht besteht, (b) KI-Entscheidungen immer human-reviewable sind, und (c) der föderale Rahmen durch entsprechende Gesetzgebung abgesichert wird.

---

### 2.2 DSGVO & BDSG

| Artikel DSGVO | Inhalt | Vereinbarkeit | Handlungsbedarf |
|---------------|--------|---------------|-----------------|
| Art. 5 | Grundsätze der Verarbeitung (Zweckbindung, Datensparsamkeit) | ✅ Vereinbar | Jedes Modul braucht eigene Datenschutz-Folgenabschätzung |
| Art. 6 | Rechtmäßigkeit der Verarbeitung | ✅ Vereinbar | Rechtsgrundlage: Art. 6 Abs. 1 lit. e (öffentliches Interesse) für Pflichtdienste; Einwilligung für optionale |
| Art. 9 | Besondere Kategorien (Gesundheit, Strafverfolgung) | ⚠️ Erhöhte Anforderungen | ePA-Modul und CaseMatch AI benötigen explizite gesetzliche Grundlage nach Art. 9 Abs. 2 lit. g |
| Art. 17 | Recht auf Löschung | ✅ Vereinbar | 1-Klick-Löschung technisch implementieren; Ausnahmen (Aufbewahrungspflichten) klar kommunizieren |
| Art. 20 | Datenübertragbarkeit | ✅ Vereinbar | Exportfunktion für alle Bürger-Daten in maschinenlesbarem Format (JSON/XML) |
| Art. 22 | Automatisierte Einzelentscheidungen | ⚠️ Kritisch für CaseMatch AI | KI-Empfehlungen sind keine Entscheidungen; Widerspruchsrecht explizit einbauen; menschliche Letztentscheidung |
| Art. 25 | Privacy by Design & Default | ✅ Vereinbar | In Architektur bereits vorgesehen; muss in technischen Spezifikationen verankert werden |
| Art. 35 | Datenschutz-Folgenabschätzung | Pflicht | Für jedes Modul obligatorisch vor Go-Live |

**Besondere DSGVO-Risiken:**
- CaseMatch AI verarbeitet potenziell strafrechtsrelevante Daten → Art. 10 DSGVO i.V.m. § 22 BDSG: Nur mit expliziter gesetzlicher Grundlage
- Proaktive Anspruchserkennung (Modul 2.3) analysiert Einkommensverhältnisse → Besondere Schutzpflicht
- Werbemodul: Strikte Trennung von Verwaltungsdaten und Werbedaten technisch und vertraglich sichern

---

### 2.3 Onlinezugangsgesetz (OZG)

| OZG-Aspekt | Status | Handlungsbedarf |
|------------|--------|-----------------|
| OZG § 1: Pflicht zur digitalen Bereitstellung | ✅ Open State erfüllt und übererfüllt OZG-Pflichten | — |
| OZG § 2: Portalverbund | ⚠️ Open State müsste als zentrales Portal im Portalverbund anerkannt werden | Gesetzliche Verankerung als Bundes-Frontend |
| OZG-Reifegrade (1–4) | Open State zielt auf Reifegrad 4 (vollautomatisch) | OZG derzeit nur Reifegrad 3 als Standard; Gesetzesanpassung nötig |
| OZG 2.0 (2024) | Grundlage vorhanden, Once-Only noch nicht verpflichtend | Once-Only-Pflicht als OZG-Ergänzung gesetzlich verankern |

**Kernforderung:** OZG-Novelle mit verbindlichem Once-Only-Prinzip und Reifegrad-4-Standard als Pflicht für alle Verwaltungsleistungen (mittelfristig verbindlich).

---

### 2.4 eIDAS / VDG / Signaturgesetz

| Aspekt | Vereinbarkeit | Handlungsbedarf |
|--------|---------------|-----------------|
| eIDAS-Verordnung (EU 910/2014) | ✅ Vereinbar | Deutsche eID ist eIDAS-konform (Sicherheitsniveau „hoch") |
| eIDAS 2.0 / EUDIW (Rollout läuft) | ✅ Zukunftssicher | Open State sollte EUDIW-kompatibel sein; EU Digital Identity Wallet als Erweiterung vorsehen |
| Qualifizierte elektronische Signatur (QES) | ⚠️ Für Notarfunktionen erforderlich | Digitales Notarmodul benötigt QES-Infrastruktur; Kooperation mit Bundesnetzagentur |
| VDG (Vertrauensdienstegesetz) | ✅ Vereinbar | Zugelassener Vertrauensdiensteanbieter als Partner einbinden |
| Schriftformerfordernis (§ 126 BGB) | ⚠️ Konfliktpotenzial | Für viele Verwaltungsakte gilt noch Schriftformerfordernis → Gesetzesänderungen für elektronische Form nötig |

---

### 2.5 Verwaltungsverfahrensgesetz (VwVfG)

| Aspekt | Vereinbarkeit | Handlungsbedarf |
|--------|---------------|-----------------|
| § 3a VwVfG: Elektronische Kommunikation | ✅ Grundsätzlich vereinbar | Open State nutzt gesetzlich anerkannte elektronische Kommunikation |
| § 28 VwVfG: Anhörungsrecht | ✅ Vereinbar | CaseMatch AI: Stellungnahme-Modul erfüllt Anhörungspflicht |
| § 37 VwVfG: Bestimmtheit des Verwaltungsakts | ⚠️ KI-generierte Bescheide | KI darf Bescheide nur vorbereiten, nicht erlassen; Behördensignatur als Pflichtschritt |
| § 39 VwVfG: Begründungspflicht | ⚠️ Für KI-Empfehlungen | Jede KI-Empfehlung braucht verständliche Begründung (Explainable AI Pflicht) |
| § 80 VwGO: Aufschiebende Wirkung | ✅ Vereinbar | Widerspruchs-Modul muss aufschiebende Wirkung automatisch kommunizieren |

---

### 2.6 Steuerrecht (AO / EStG / ELSTER)

| Aspekt | Vereinbarkeit | Handlungsbedarf |
|--------|---------------|-----------------|
| § 87a AO: Elektronische Kommunikation | ✅ Vereinbar | ELSTER-Schnittstelle bereits rechtlich anerkannt |
| § 150 AO: Steuererklärungspflicht | ✅ Vereinbar | AutoFill reduziert Fehler, ändert aber nicht die Erklärungspflicht |
| § 173 AO: Änderung bei neuen Tatsachen | ⚠️ Aufklärungspflicht | Bürger muss informiert werden, wenn vorausgefüllte Daten unvollständig sein könnten |
| Datenschutz Steuerdaten | ⚠️ Erhöhter Schutz | Steuergeheimnis (§ 30 AO) gilt uneingeschränkt; separate Datentresor-Partition für Steuerdaten |

---

### 2.7 OWiG / StPO (CaseMatch AI)

| Aspekt | Vereinbarkeit | Handlungsbedarf |
|--------|---------------|-----------------|
| § 67 OWiG: Einspruch gegen Bußgeldbescheid | ✅ Vereinbar | Digitaler Einspruch ist rechtlich zulässig |
| § 55 OWiG: Anhörung | ✅ Vereinbar | Stellungnahme-Modul erfüllt Anhörungsrecht |
| Anwaltliches Berufsgeheimnis (§ 43a BRAO) | ⚠️ CaseMatch AI ist keine Rechtsberatung | Klarer Disclaimer: KI-Empfehlungen sind keine Rechtsberatung; Hinweis auf Anwaltspflicht bei komplexen Fällen |
| RDG (Rechtsdienstleistungsgesetz) | ⚠️ Kritisch | CaseMatch AI darf keine individuelle Rechtsberatung leisten; muss als „allgemeine rechtliche Information" klassifiziert werden |
| Datenschutz bei Strafverfolgungsdaten | ⚠️ Art. 10 DSGVO | Besondere gesetzliche Grundlage für Verarbeitung bußgeldrelevanter Daten erforderlich |

---

### 2.8 Bundesnotarordnung (BNotO)

| Aspekt | Vereinbarkeit | Handlungsbedarf |
|--------|---------------|-----------------|
| § 1 BNotO: Notarpflicht | ⚠️ Konflikt mit digitalem Notarmodul | Digitales Notarmodul nur mit Videoidentifikation + QES zulässig; GmbH-Gründung bleibt beurkundungspflichtig |
| Fernbeurkundung | ⚠️ Derzeit nur eingeschränkt | § 16a BeurkG erlaubt Online-Beurkundung seit 2022; Ausbau nötig |
| GmbH-Musterprotokoll | ✅ Vereinbar | Vereinfachte Gründung per Musterprotokoll (§ 2 GmbHG) ist bereits digital möglich |

---

## 3. Gesamtbewertung der Vereinbarkeit

| Modul | Rechtliche Ampel | Hauptrisiko | Lösbarkeit |
|-------|-----------------|-------------|------------|
| eID-Onboarding | 🟢 Grün | — | Sofort umsetzbar |
| Wohnsitzmanagement | 🟢 Grün | Föderale Zuständigkeit | Staatsvertrag |
| Steuererklärung AutoFill | 🟡 Gelb | § 30 AO Steuergeheimnis | Gesetzesanpassung |
| Gewerbeanmeldung | 🟢 Grün | Beurkundungspflicht GmbH | Teildigitalisierung |
| CaseMatch AI | 🔴 Rot (mit Auflagen) | RDG, Art. 10 DSGVO, Art. 22 DSGVO | Gesetzespaket nötig |
| Sozialleistungen | 🟡 Gelb | Proaktive Datenanalyse | DSGVO-Folgenabschätzung |
| KFZ-Zulassung | 🟢 Grün | — | Sofort umsetzbar |
| ePA-Integration | 🔴 Rot (mit Auflagen) | SGB V, Patientenrechtegesetz | Gesetzespaket nötig |
| Digitales Notarmodul | 🔴 Rot (mit Auflagen) | BNotO, BeurkG | Gesetzesreform nötig |
| Bürgerabstimmungen | 🟡 Gelb | Wahlrechtsgrundsätze | Verfassungsrechtliche Prüfung |

---

## 4. Gesetzesänderungs-Paket „Open State Act"

### Paket A: Sofortmaßnahmen (ohne Verfassungsänderung)

**A1 – OZG-Novelle (prioritär):**
- Once-Only-Prinzip als Pflicht für alle Bundesbehörden (§ 2a OZG neu)
- Reifegrad 4 als Standard mittelfristig verbindlich (§ 1 Abs. 3 OZG neu)
- Open State als zentrales Bundes-Frontend gesetzlich anerkannt

**A2 – VwVfG-Änderung:**
- § 3a VwVfG: Elektronische Form gleichgestellt mit Schriftform für alle Verwaltungsakte
- § 37 VwVfG Ergänzung: KI-assistierte Bescheide mit Begründungspflicht und Widerspruchsrecht
- § 8a VwVfG neu: Behördliche Datenteilung auf Basis standardisierter APIs als Pflicht

**A3 – BDSG-Ergänzung:**
- § 22a BDSG neu: Gesetzliche Grundlage für Verarbeitung bußgeldrelevanter Daten in KI-Systemen
- Explainability-Pflicht für KI-Systeme im Verwaltungsbereich

**A4 – AO-Ergänzung:**
- § 87b AO neu: Automatische Datenweitergabe zwischen Arbeitgebern, Sozialversicherungsträgern und Finanzämtern für AutoFill
- § 30 AO Klarstellung: Datentresor-Architektur wahrt Steuergeheimnis

### Paket B: Mittelfristige Gesetzgebung (12–24 Monate)

**B1 – Digitalisierungsgesetz des Bundes (DigiG Bund):**
- Bundeszwang für Länder zur Anbindung an Open State API-Standards
- Föderales Kompetenzzentrum als Körperschaft des öffentlichen Rechts
- Standardisierte Datenschnittstellen (XÖV 3.0) als verbindliche Norm

**B2 – KI-Verwaltungsgesetz:**
- Gesetzliche Klassifikation von CaseMatch AI als „Entscheidungsassistenz" (nicht Rechtsberatung i.S.d. RDG)
- Pflicht zu menschlicher Letztentscheidung bei allen hoheitlichen Akten
- Jährliches Bias-Audit durch unabhängige Stelle als Zulassungsvoraussetzung

**B3 – BeurkG-Novelle:**
- Vollständige digitale Beurkundung (Video + QES) für alle Gesellschaftsformen
- Notarielle Online-Beurkundung als Regelfall

**B4 – SGB-Novelle (für ePA-Integration):**
- Interoperabilität ePA ↔ Open State gesetzlich ermöglicht
- Datensouveränität des Patienten als Grundsatz verankert

### Paket C: Langfristige Verfassungsebene (3–5 Jahre)

**C1 – Grundgesetz Art. 91c Ergänzung:**
- Bundeskompetenzerweiterung für digitale Verwaltungsinfrastruktur
- Opt-in für Kommunen mit Bundesförderung als Anreiz statt Zwang

**C2 – Grundrechtsschutz digitale Identität:**
- Art. 2 GG: Ausdrückliche Verankerung des Rechts auf digitale Selbstbestimmung
- Verbot staatlicher Datenzentralisierung ohne parlamentarische Kontrolle

---

## 5. Umsetzungsempfehlungen

### Sofort (ohne Gesetzesänderung):
1. Pilotprojekt in Bundesland ohne Länderkompetenz-Konflikt (z.B. Bremen/Hamburg als Stadtstaaten)
2. DSGVO-Folgenabschätzungen für alle Module beauftragen
3. Bundesbeauftragter für Open State mit Koordinierungsmandat einsetzen
4. Technische Standards (API, Datenschnittstellen) als DIN-Normen festlegen

### Kurzfristig (6–12 Monate):
1. Paket A einbringen und verabschieden
2. Staatsvertrag der Länder für Once-Only und API-Standards
3. Pilotkommune-Vertrag mit rechtlicher Absicherung

### Mittelfristig (1–3 Jahre):
1. Paket B vollständig verabschieden
2. Föderales Kompetenzzentrum gründen
3. CaseMatch AI mit unabhängigem Rechtsgutachten zur RDG-Konformität prüfen

### Langfristig (3–5 Jahre):
1. Paket C anstreben
2. EU-Ebene: Open State als Beitrag zur EUDIW-Umsetzung positionieren

---

## 6. Fazit

Open State ist **rechtlich machbar**, erfordert aber ein koordiniertes Gesetzgebungspaket auf Bundes- und Länderebene. Die größten rechtlichen Risiken liegen bei:

1. **CaseMatch AI** → RDG-Graubereich und Art. 22 DSGVO (lösbar durch KI-Verwaltungsgesetz)
2. **Föderale Kompetenzverteilung** → Art. 28/30 GG (lösbar durch Staatsvertrag + Art. 91c GG Erweiterung)
3. **Datenschutz bei Gesundheits- und Steuerdaten** → Besonderer Schutzbedarf (lösbar durch technische Zero-Knowledge-Architektur + gesetzliche Klarstellung)

Die technische Umsetzung kann **parallel zur Gesetzgebung** beginnen, wobei die roten Module (CaseMatch AI, ePA, Notarmodul) erst nach Verabschiedung der entsprechenden Rechtspakete produktiv gehen dürfen.

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md, docs/02_Vergleich_Best_Practices.md*
*Rechtsstand: Vor Pilotierung zu aktualisieren*
