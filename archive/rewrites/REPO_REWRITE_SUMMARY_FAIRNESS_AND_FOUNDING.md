# Repo-Rewrite-Zusammenfassung: Verfahrensfairness Engine und Unternehmensgründung

---

## 1. Neu erstellte Dateien

### Verfahrensfairness Engine

| Datei | Kurzbeschreibung |
|-------|-----------------|
| `docs/engines/verfahrensfairness/README.md` | Überblick der Engine, Begriffsklärung, Einordnung ins Gesamtsystem, Dokumentenübersicht |
| `docs/engines/verfahrensfairness/01_GRUNDSAETZE_UND_ABGRENZUNG.md` | Warum keine Gerechtigkeitsmaschine, Fairness durch Struktur, menschliche Letztverantwortung, explizite TUT/TUT-NICHT-Liste |
| `docs/engines/verfahrensfairness/02_FUNKTIONSWEISE.md` | Acht Kernfunktionen (Fallvergleich, Widerspruchserkennung, Begründungsqualität etc.), technische Verarbeitungslogik, Einsatzdomänen |
| `docs/engines/verfahrensfairness/03_SIGNALE_RISIKEN_HINWEISE.md` | Zehn typisierte Qualitäts- und Fairnesssignale mit Definition, Beispiel, Systemmarkierung und Menschlicher Entscheidung |
| `docs/engines/verfahrensfairness/04_TRANSPARENZ_UND_AUDITIERBARKEIT.md` | Öffentliche Prüfkriterien, Audit-Trails, Bias-Audits, Erklärbarkeit, Modellgrenzen, Übersteuerbarkeit, Kontrollmechanismen-Tabelle |
| `docs/engines/verfahrensfairness/05_EINSATZFELDER.md` | Konkrete Szenarien für alle fünf Domänen: Arbeitsverwaltung, Sozialleistungen, Rechtsstreit/Bußgeld, Jugendhilfe, Unternehmensgründung |
| `docs/engines/verfahrensfairness/06_RECHTLICHE_UND_ETHISCHE_GRENZEN.md` | VwVfG-Grenzen, AGG-Konformität, DSGVO, Scheinkonsistenzrisiko, Alt-Bias-Risiko, menschliche Entscheidungspflicht, offene Prüfpunkte |

### Domäne Unternehmensgründung

| Datei | Kurzbeschreibung |
|-------|-----------------|
| `docs/domains/unternehmensgruendung/README.md` | Kernthese, Zielbild, Nutzenübersicht für alle Akteure, Domänenprinzipien, Dokumentenübersicht |
| `docs/domains/unternehmensgruendung/01_PROBLEMRAUM_UND_ZIELBILD.md` | Acht Ist-Probleme, Zielbild mit fünf Qualitätsstandards, Tabelle mit Zielkennzahlen |
| `docs/domains/unternehmensgruendung/02_BENUTZERROLLEN_UND_AKTEURE.md` | Neun Rollen mit Beschreibung, Sichtrechten, Handlungsmöglichkeiten und Zuständigkeiten |
| `docs/domains/unternehmensgruendung/03_KERNPROZESSE.md` | Acht Kernprozesse (A–H) mit nummerierten Schritten und User-Flow-Beschreibungen |
| `docs/domains/unternehmensgruendung/04_FALLAKTE_UND_STATUSMODELL.md` | Digitale Gründungsakte (8 Bestandteile), 13 Statusdefinitionen mit Übergangsbedingungen, 17 typisierte Ereignistypen |
| `docs/domains/unternehmensgruendung/05_WIRTSCHAFTLICHER_NUTZEN_UND_STAATLICHER_MEHRWERT.md` | Strukturelle Nutzenlogik ohne Fantasiezahlen, fiskalische Effizienzargumentation, Standortwirkung |
| `docs/domains/unternehmensgruendung/06_RECHTLICHE_OFFENHEIT_UND_GRENZEN.md` | Föderale Struktur, Rechtsformunterschiede, Kammerpflicht, Handwerksrecht, Berufsrecht, offene Prüfpunkte-Tabelle |

---

## 2. Geänderte Dateien

| Datei | Art der Änderung |
|-------|-----------------|
| `ai-models/06_CaseMatch_Engine.md` | Neuer Abschnitt 0 "Einordnung in die Verfahrensfairness Engine"; Überarbeitung Designziele; Entschärfung richterähnlicher Sprache im System-Prompt; "Erfolgsaussichten" → "historische Verläufe"; "Rollout-Plan" → "Inbetriebnahme-Voraussetzungen" |
| `README.md` | Zwei neue Domänen in Kerndomänen-Tabelle; zwei neue Einträge in Projektdokumentationstabelle; Leitbild-Abschnitt um Positionierung pro Gründung/Leistung/Verantwortung ergänzt |
| `docs/LEITBILD_STAAT_UND_VERTRAUEN.md` | Zwei neue Abschnitte: "Fairness entsteht durch Struktur" (mit Verfahrensfairness Engine als struktureller Antwort) und "Open State ist pro Gründung, pro Leistung, pro Verantwortung" |
| `architecture/05_Systemarchitektur.md` | Neuer Abschnitt 2a mit Mermaid-Diagramm der Verfahrensfairness Engine als Querschnittsschicht; Prinzipienstabelle; Einordnung CaseMatch; Unternehmensgründung im Adapter-Layer |
| `roadmap/09_Monetarisierung_Finanzmodell.md` | Neuer Abschnitt 3.4 "Domäne Unternehmensgründung: Fiskalische Effizienzlogik" mit struktureller Nutzenargumentation, Effizienzpotenzial-Tabelle, Hinweis auf Pilotbetrieb als Quantifizierungsvoraussetzung |

---

## 3. Einführung der Verfahrensfairness Engine

**Konzept:** Die Verfahrensfairness Engine ist eine domänenübergreifende Querschnittskomponente, die Verwaltungsvorgänge auf strukturelle Qualitätsmerkmale prüft. Sie analysiert, vergleicht, erklärt und markiert – sie entscheidet nicht.

**Abgrenzung:** Der Begriff "Gerechtigkeits-KI" wird bewusst vermieden. Gerechtigkeit im Einzelfall erfordert menschliche Urteilsbildung. Die Engine prüft strukturelle Bedingungen fairer Verfahren (Begründungen, Konsistenz, Vollständigkeit, Verständlichkeit), nicht inhaltliche Korrektheit von Verwaltungsentscheidungen.

**Einbettung:** Die Engine ist zwischen dem Process Orchestrator und den Domänenadaptern positioniert. CaseMatch ist ein spezialisiertes Analyse-Modul innerhalb der Engine, nicht eine übergeordnete KI-Instanz. Alle Domänen nutzen dieselben Grundprinzipien: Fallakte, Statusmodell, Audit-Log, Erklärschicht.

---

## 4. Integration der Unternehmensgründungs-Domäne

Die Domäne Unternehmensgründung ist als vollständige Domänendokumentation analog zur Arbeitsverwaltung neu angelegt. Sie umfasst Problemraum, Zielbild, Rollen, Prozesse, Fallakte, Statusmodell und rechtliche Grenzen.

Architektonisch ist sie im Adapter-Layer angebunden, nutzt XGewerbeanmeldung (XÖV), ELSTER und wird von der Verfahrensfairness Engine überwacht. Die fiskalische Effizienzlogik ist im Finanzmodell ergänzt.

---

## 5. Begriffe, die bewusst ersetzt wurden

| Bisheriger Begriff | Ersatz / Begründung |
|-------------------|---------------------|
| "Gerechtigkeits-KI" | Nicht verwendet – irreführend und verantwortungsverschiebend |
| "KI-Herzstück" (CaseMatch) | "Analyse-Assistent" / "spezialisiertes Modul" – korrektere Einordnung |
| "Erfolgsaussichten eines Widerspruchs" | "Historische Verlaufsquote ähnlicher Fälle" – keine Prognose, sondern Information |
| "Widerspruch empfohlen" | Optionen ohne Empfehlung dargestellt – menschliche Entscheidung bleibt beim Bürger |
| "Rollout-Plan" mit Zeitangaben | "Inbetriebnahme-Voraussetzungen" – zustandsbasiert statt terminbasiert |
| "Startup" / "disruptiv" | Nicht in neuen Dokumenten verwendet |

---

## 6. Repo-weite Leitlinien, die nun gelten

- **Keine Gerechtigkeitsmaschinen-Sprache:** Kein KI-Modul wird als Gerechtigkeitsinstanz bezeichnet.
- **Keine Entscheidungssprache bei KI-Outputs:** Alle KI-Ausgaben sind Informationen, keine Empfehlungen oder Entscheidungen.
- **Zustandsbasierte Sprache statt Terminversprechen:** Keine Phasen mit Datumsangaben; Fortschritt nach Qualitätsnachweisen.
- **Offene Prüfpunkte müssen markiert sein:** Ungelöste rechtliche oder fachliche Fragen werden explizit als offen gekennzeichnet.
- **Keine Fantasiezahlen:** Quantitative Argumente werden nur auf Basis nachgewiesener oder plausibel begründeter Größen gemacht.
- **Domänenprinzipien sind konsistent:** Fallakte + Statusmodell + Audit-Log + Erklärschicht gelten für alle Domänen.
- **Keine antiunternehmerische Sprache:** Gründerinnen und Gründer sind Respektspersonen, nicht Antragsteller.

---

## 7. Offene juristische und fachliche Prüfpunkte

| Prüfpunkt | Bereich | Status |
|-----------|---------|--------|
| Datenweitergabe zwischen Behörden im Gründungsprozess | Datenschutz / VwVfG | Offen |
| AGG-Konformitätsprüfung der Verfahrensfairness Engine | Antidiskriminierung | Offen |
| Art. 22 DSGVO: Wann ist Engine-Prüfung "automatisierte Entscheidung"? | Datenschutz | Offen |
| Handelsregisterpflicht und Notarpflicht digital integrieren | Gesellschaftsrecht | Offen |
| Landesspezifische Abweichungen im Gründungsrecht | Föderales Recht | Offen |
| Pflichtversicherung Selbstständige: Hinweispflicht des Systems? | Sozialversicherungsrecht | Offen |
| Haftungsfreistellung bei fehlerhaften System-Hinweisen | Staatshaftungsrecht | Offen |
| Betroffenenrechte DSGVO bei Engine-Prüfungen | Datenschutz | Offen |
| Transparenzpflichten gegenüber Bürger bei Engine-Auswertung | Verwaltungsrecht | Offen |
| Qualifikationsanforderungen für externe Bias-Auditoren | Governance | Offen |

---

*Erstellt im Rahmen der Repo-Erweiterung: Verfahrensfairness Engine und Domäne Unternehmensgründung.*
