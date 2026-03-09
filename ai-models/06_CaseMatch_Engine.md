# Open State – CaseMatch AI Engine

*Basis: docs/01–05*

---

## 1. Überblick & Designziele

CaseMatch AI ist das KI-Herzstück von Open State. Sie analysiert Verwaltungsrechtsfälle, berechnet Vergleichswahrscheinlichkeiten und generiert Handlungsempfehlungen – stets als **Assistenz**, nie als Entscheidungsträger.

**Designziele:**
- Höchste Erklärbarkeit (Explainable AI / XAI) – Bürger verstehen jede Empfehlung
- Nachweisliche Fairness – keine systematische Benachteiligung nach Alter, Region, Herkunft
- Rechtssichere Klassifikation als „allgemeine rechtliche Information" (kein RDG-Verstoß)
- Kontinuierliches Lernen aus neuen Fällen (mit striktem Datenschutz)
- On-Device-Inferenz für unkritische Vorstufen (Datensparsamkeit)

---

## 2. Systemarchitektur CaseMatch

```
┌─────────────────────────────────────────────────────────┐
│                  CaseMatch AI Stack                      │
├─────────────────────────────────────────────────────────┤
│  Schicht 1: Input Processing                            │
│  OCR → Entity Extraction → Case Normalization           │
├─────────────────────────────────────────────────────────┤
│  Schicht 2: Retrieval (RAG)                             │
│  Vector DB → Semantic Search → Top-K ähnliche Fälle     │
├─────────────────────────────────────────────────────────┤
│  Schicht 3: Reasoning Model                             │
│  Fine-tuned LLM → Outcome Prediction → Confidence Score │
├─────────────────────────────────────────────────────────┤
│  Schicht 4: Explainability                              │
│  LIME/SHAP → Einfache Sprache → Disclaimer Generator    │
├─────────────────────────────────────────────────────────┤
│  Schicht 5: Output Validation                           │
│  Regel-Engine → Rechtskonformitätsprüfung → Freigabe    │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Trainingsdaten & Datenquellen

### 3.1 Primäre Datenquellen

| Datenquelle | Inhalt | Volumen (geschätzt) | Zugang |
|-------------|--------|---------------------|--------|
| Bundesverwaltungsgericht (BVerwG) | Verwaltungsrechtliche Urteile | ~180.000 Urteile (10 Jahre) | Öffentlich (juris.de) |
| Oberverwaltungsgerichte (16 OVG/VGH) | Berufungsurteile | ~500.000 Urteile | Öffentlich + Kooperation |
| Verwaltungsgerichte (1. Instanz) | Erstinstanzliche Urteile | ~2 Mio. Urteile | Kooperation mit Justizministerien |
| Bußgeldkatalog (BKat) | Standardtatbestände + Regelahndungen | ~1.000 Einträge | Öffentlich |
| Anonymisierte Behörden-Entscheidungen | Widerspruchsbescheide | ~5 Mio. (Aufbau über 3 Jahre) | Kooperation mit Behörden |
| Verbraucherzentrale-Fälle | Anonymisierte Beratungsfälle | ~200.000 | Kooperation |
| Rechtswissenschaftliche Kommentare | Auslegungshilfen (Beck, Wolters) | ~50.000 Seiten | Lizenzierung |

### 3.2 Datenschutz bei Trainingsdaten

**Grundsatz:** CaseMatch AI wird **ausschließlich auf anonymisierten Aggregatdaten** trainiert.

- Alle Trainingsdaten durchlaufen eine **k-Anonymisierung** (k≥10): Kein Einzelfall ist rekonstruierbar
- Personenbezogene Daten werden vor Training **differenziell verrauscht** (Differential Privacy, ε≤1.0)
- Laufende Nutzerdaten fließen **niemals direkt** ins Training – nur nach vollständiger Anonymisierung und mit 6-monatiger Quarantäne
- **Federated Learning** für zukünftige Modell-Updates: Modell geht zu den Daten, nicht Daten zum Modell
- Unabhängiger Datenschutz-Auditor prüft jeden Trainingszyklus

### 3.3 Datenqualitäts-Pipeline

```
Rohdaten → Deduplizierung → Anonymisierung → Qualitätsprüfung
→ Rechtliche Validierung → Bias-Check → Trainingsdaten-Pool
```

**Qualitätskriterien:**
- Mindest-Konfidenz der OCR-Extraktion: 95 %
- Manuelle Validierung einer 5 %-Stichprobe pro Batch
- Automatische Ausreißer-Erkennung (Fälle mit ungewöhnlichen Merkmalen werden manuell geprüft)

---

## 4. Modell-Architektur

### 4.1 Basis-Modell

**Gewählter Ansatz:** Fine-tuned Open-Source-LLM (souveräne Lösung)

| Eigenschaft | Wert |
|-------------|------|
| Basis-Modell | Mistral 7B / Llama 3.1 8B (Open-Source, EU-hostbar) |
| Sprache | Deutsch (primär), Englisch (Fallback) |
| Kontextfenster | 32.768 Tokens |
| Inferenz | vLLM auf NVIDIA A100 (on-premise, Staatswolke) |
| Quantisierung | INT8 für Produktion (Geschwindigkeit), FP16 für Training |
| On-Device | GGUF-Quantisierung für unkritische Vorstufen auf Mobilgeräten |

**Warum Open-Source:**
- Keine Abhängigkeit von US-Anbietern (DSGVO, CLOUD Act-Risiko)
- Vollständige Nachvollziehbarkeit der Modellgewichte
- Eigene Fine-Tuning-Kontrolle
- Kostenkontrolle im Staatsbetrieb

### 4.2 RAG-Komponente (Retrieval-Augmented Generation)

```python
# Konzeptioneller RAG-Pipeline-Code (Pseudocode)

class CaseMatchRAG:
    def __init__(self):
        self.vector_db = WeaviateClient(host="sovereign-cloud")
        self.embedder = SentenceTransformer("deutsche-rechtstexte-v2")
        self.llm = VLLMClient(model="casematch-mistral-7b-v3")

    def retrieve_similar_cases(self, case_input: CaseInput) -> list[SimilarCase]:
        # Semantische Suche in anonymisierter Fallbasis
        query_embedding = self.embedder.encode(case_input.normalized_text)
        similar_cases = self.vector_db.query(
            vector=query_embedding,
            filters={
                "tatbestand": case_input.tatbestand_code,
                "zeitraum": "2015-2025",
                "mindest_aehnlichkeit": 0.85
            },
            top_k=50
        )
        return similar_cases

    def predict_outcome(self, case_input: CaseInput,
                        similar_cases: list[SimilarCase]) -> Prediction:
        prompt = self.build_prediction_prompt(case_input, similar_cases)
        response = self.llm.generate(prompt, temperature=0.1)  # Niedrige Temperatur = konsistent
        return self.parse_prediction(response)

    def explain(self, prediction: Prediction) -> Explanation:
        # SHAP-basierte Erklärung der wichtigsten Einflussfaktoren
        shap_values = self.shap_explainer.explain(prediction)
        return self.format_citizen_explanation(shap_values)
```

---

## 5. Prompt Engineering

### 5.1 System-Prompt (Produktionsversion)

```
SYSTEM:
Du bist CaseMatch AI, ein Analyse-Assistent im deutschen Verwaltungsrecht.
Deine Aufgabe ist ausschließlich die statistische Auswertung vergleichbarer
Fälle und die Erstellung von Handlungsoptionen.

WICHTIGE EINSCHRÄNKUNGEN:
- Du gibst KEINE Rechtsberatung im Sinne des RDG.
- Du triffst KEINE Entscheidungen. Du präsentierst Optionen.
- Du verwendest ausschließlich anonymisierte Vergleichsdaten.
- Du weist immer auf professionelle Rechtsberatung hin.
- Du verwendest Alltagssprache, keine Juristensprache.
- Wenn die Datenbasis unter 50 Fällen liegt, sagst du das explizit.
- Du speicherst NICHTS aus diesem Gespräch für zukünftige Trainings
  (Einwilligung des Bürgers nicht vorhanden).

AUSGABEFORMAT:
Antworte immer im vorgegebenen JSON-Schema (siehe unten).
Kein Fließtext außerhalb des Schemas.
```

### 5.2 Analyse-Prompt-Template (Bußgeldfall)

```
USER:
Analysiere folgenden Verwaltungsfall:

FALLTYP: {tatbestand_code} – {tatbestand_bezeichnung}
BEHÖRDE: {behörde_typ} in {bundesland}
BETRAG: {betrag_eur} EUR
DATUM DES BESCHEIDS: {datum}
BÜRGER-SITUATION: {situation_zusammenfassung}
VORLIEGENDE BEWEISE: {beweis_kategorien}

VERGLEICHSFÄLLE AUS DER DATENBANK:
{top_50_anonymisierte_faelle_json}

AUFGABE:
1. Bewerte die Erfolgsaussichten eines Widerspruchs (0–100%)
2. Berechne eine faire Vergleichssumme (falls relevant)
3. Identifiziere die 3 wichtigsten Einflussfaktoren
4. Erstelle 2–3 Handlungsoptionen mit Vor-/Nachteilen
5. Weise auf Grenzen deiner Analyse hin

Antworte ausschließlich im folgenden JSON-Format:
{ausgabe_schema}
```

### 5.3 Ausgabe-Schema (JSON)

```json
{
  "analyse_id": "uuid",
  "tatbestand": "string",
  "widerspruchs_erfolgsquote": {
    "wert": 78,
    "einheit": "prozent",
    "datenbasis": 847,
    "zeitraum": "2015-2025",
    "konfidenz": 74
  },
  "vergleichssumme": {
    "empfohlen": 62.00,
    "range_min": 45.00,
    "range_max": 75.00,
    "berechnung": "Median der Vergleiche in identischen Fällen"
  },
  "einflussfaktoren": [
    {
      "faktor": "Gültiger Parkschein vorhanden",
      "einfluss": "stark_positiv",
      "gewicht": 0.45,
      "erklaerung": "In 89% der Fälle mit gültigem Parkschein wurde Widerspruch stattgegeben"
    },
    {
      "faktor": "Tatort: Halteverbot (absolut)",
      "einfluss": "negativ",
      "gewicht": 0.28,
      "erklaerung": "Absolute Halteverbote haben weniger Ermessensspielraum"
    }
  ],
  "handlungsoptionen": [
    {
      "option": "widerspruch",
      "titel": "Widerspruch einlegen",
      "erfolgsquote": 78,
      "aufwand": "gering",
      "zeitaufwand": "3 Minuten jetzt + 4-12 Wochen warten",
      "kosten": 0,
      "vorteile": ["Kein Geld zahlen wenn erfolgreich", "Aufschiebende Wirkung"],
      "nachteile": ["Unsicherheit für 4-12 Wochen", "2% Risiko erhöhter Bescheid"],
      "empfohlen": true
    },
    {
      "option": "vergleich",
      "titel": "Vergleich über Open State",
      "betrag": 62.00,
      "ratenzahlung": {"raten": 3, "betrag_pro_rate": 20.67},
      "aufwand": "minimal",
      "vorteile": ["Sofortige Erledigung", "Keine Unsicherheit"],
      "nachteile": ["Kosten trotz möglicher Berechtigung"],
      "empfohlen": false
    },
    {
      "option": "zahlen",
      "titel": "Bescheid akzeptieren und zahlen",
      "betrag": 80.00,
      "vorteile": ["Schnellste Lösung"],
      "nachteile": ["Voller Betrag", "Kein Widerspruch mehr möglich"],
      "empfohlen": false
    }
  ],
  "grenzen_der_analyse": [
    "Lokale Sonderregelungen des Bezirks nicht berücksichtigt",
    "Individuelle Vorgeschichte (z.B. frühere Bußgelder) nicht bekannt",
    "Aktuelle Rechtsprechungsänderungen bis max. 3 Monate Verzug"
  ],
  "disclaimer": "Dies ist keine Rechtsberatung. Bei Unsicherheit Anwalt oder Verbraucherzentrale konsultieren.",
  "rechtsberatung_links": {
    "anwaltsuche": "brak.de/anwaltsuche",
    "verbraucherzentrale": "verbraucherzentrale.de",
    "rechtsantragsstelle": "amtsgericht-{ort}.de"
  }
}
```

### 5.4 Few-Shot-Beispiele für Fine-Tuning

**Beispiel 1 – Erfolgreicher Widerspruch Falschparken:**
```
INPUT: Parkschein gültig, Halte-/Parkverbot-Zeichen durch Baum verdeckt,
       Fotodokumentation vorhanden, Betrag 35€, Berlin-Mitte

EXPECTED OUTPUT:
{
  "widerspruchs_erfolgsquote": {"wert": 84, "konfidenz": 82},
  "einflussfaktoren": [
    {"faktor": "Gültiger Parkschein", "einfluss": "stark_positiv"},
    {"faktor": "Verdecktes Zeichen dokumentiert", "einfluss": "stark_positiv"}
  ],
  "empfohlen": "widerspruch"
}
```

**Beispiel 2 – Geschwindigkeitsüberschreitung, klare Beweislage:**
```
INPUT: Radarfoto eindeutig, 28 km/h zu schnell, Schulzone,
       keine Gegenbeweise, Betrag 280€ + 2 Punkte

EXPECTED OUTPUT:
{
  "widerspruchs_erfolgsquote": {"wert": 12, "konfidenz": 88},
  "einflussfaktoren": [
    {"faktor": "Eindeutiges Radarfoto", "einfluss": "stark_negativ"},
    {"faktor": "Schulzone (erhöhte Sorgfaltspflicht)", "einfluss": "negativ"}
  ],
  "empfohlen": "vergleich",
  "hinweis": "Technische Überprüfung des Messgeräts prüfen (Eichschein anfordern)"
}
```

---

## 6. Fine-Tuning-Konzept

### 6.1 Training-Pipeline

```
Phase 1: Supervised Fine-Tuning (SFT)
├── Daten: 500.000 annotierte Fälle (Jurist + KI-Label)
├── Methode: LoRA (Low-Rank Adaptation) – speichereffizient
├── Epochs: 3
├── Learning Rate: 2e-4 mit Cosine-Decay
└── Evaluation: 10% Holdout-Set, Juristen-Review bei Top-Fehlern

Phase 2: RLHF (Reinforcement Learning from Human Feedback)
├── Human Rater: 20 zugelassene Juristen (Verwaltungsrecht)
├── Reward Model: Trainiert auf 50.000 paarweisen Präferenzen
├── PPO-Training: Maximiert Reward + KL-Divergenz-Penalty
└── Ziel: Empfehlungen, die Juristen als "hilfreich & korrekt" bewerten

Phase 3: Constitutional AI / RLAIF
├── Eigene "Verfassung" mit 15 Prinzipien (Fairness, Klarheit, Vorsicht)
├── KI bewertet eigene Outputs anhand der Verfassung
└── Iterative Verbesserung ohne menschliche Annotation

Phase 4: Continuous Learning
├── Monatliche Modell-Updates mit neuen anonymisierten Fällen
├── Federated Learning: Modellgewichte-Updates ohne Datenbewegung
└── A/B-Testing: 5% Traffic auf neues Modell vor vollständigem Rollout
```

### 6.2 Evaluierungsmetriken

| Metrik | Zielwert | Messmethode |
|--------|----------|-------------|
| Widerspruchs-Outcome-Accuracy | > 78 % | Vergleich Empfehlung vs. tatsächliches Ergebnis (6-Monats-Follow-up) |
| Kalibrierung (Konfidenz) | ECE < 0.05 | Expected Calibration Error |
| Fairness (demographisch) | Δ < 5 % zwischen Gruppen | Disparate Impact Test |
| Erklärungsqualität | NPS > 70 | Bürger-Bewertung der Erklärung |
| Falsch-Positiv-Rate (unberechtigte Widersprüche) | < 15 % | Juristen-Audit Stichprobe |
| Latenz (p99) | < 800 ms | Produktionsmonitoring |
| RDG-Konformität | 100 % | Juristische Quartals-Audits |

### 6.3 Bias-Erkennung & -Korrektur

**Bekannte Biasquellen im Rechtssystem:**
- Regionale Unterschiede (bayerische vs. Berliner Gerichte)
- Sozioökonomischer Status des ursprünglichen Klägers
- Darstellungsqualität des Schriftsatzes
- Richter-Variation (systematisch unterschiedliche Entscheidungen)

**Technische Gegenmaßnahmen:**
```python
# Bias-Monitoring (vereinfacht)
class BiasMonitor:
    def check_demographic_parity(self, predictions, protected_attributes):
        results = {}
        for attr in protected_attributes:  # Alter, Region, Nationalität
            groups = predictions.groupby(attr)
            success_rates = groups['empfehlung_widerspruch'].mean()
            max_disparity = success_rates.max() - success_rates.min()
            results[attr] = {
                'max_disparity': max_disparity,
                'passed': max_disparity < 0.05  # Max 5% Unterschied
            }
        return results

    def reweight_training_data(self, dataset, bias_report):
        # Unterrepräsentierte Gruppen höher gewichten
        for attr, report in bias_report.items():
            if not report['passed']:
                dataset = self.apply_reweighting(dataset, attr)
        return dataset
```

**Organisatorische Maßnahmen:**
- Halbjährliches externes Bias-Audit durch unabhängiges Institut
- Ergebnisse öffentlich im Transparenzbericht
- Automatischer Modell-Einfrierung wenn Bias-Schwellenwert überschritten

---

## 7. Spezialisierte Sub-Module

### 7.1 Modul: Bußgeld & OWiG
- Tatbestands-Klassifikation (1.200+ Tatbestandscodes)
- Bußgeldkatalog-Integration (automatisch aktualisiert)
- Messgerät-Einspruch-Datenbank (bekannte Gerätefehler)
- Fristberechnung (§ 67 OWiG: 2-Wochen-Frist automatisch berechnet)

### 7.2 Modul: Widerspruchsschreiben-Generator
- Musterschriftsatz-Templates für 200+ Standardfälle
- Automatische Befüllung mit Falldetails
- Sprachniveau-Anpassung (Standard / Einfache Sprache / Juristisch)
- Plausibilitätsprüfung: Sind alle Pflichtangaben vorhanden?

```
PROMPT WIDERSPRUCHSGENERATOR:

Erstelle einen formellen Widerspruch gemäß § 67 OWiG für:
- Aktenzeichen: {az}
- Behörde: {behörde}
- Tatvorwurf: {tatvorwurf}
- Bürger-Argumente: {argumente_freitext}
- Vorliegende Beweise: {beweise}

Anforderungen:
- Formeller Briefkopf
- Korrekte Rechtsgrundlage (§ 67 OWiG)
- Alle sachlichen Argumente des Bürgers einarbeiten
- Keine falschen Tatsachenbehauptungen
- Schluss: Antrag auf Aufhebung des Bescheids
- Sprache: Klar, höflich, nicht aggressiv
- Länge: max. 1 Seite
```

### 7.3 Modul: Ratenzahlungs-Optimierung
- Berechnung optimaler Ratenpläne (Zinsbelastung minimieren)
- Automatische Prüfung: Ist Ratenzahlung rechtlich möglich? (§ 18 OWiG)
- SEPA-Mandat-Generierung
- Erinnerungs-Push-Nachrichten

### 7.4 Modul: Steuerbescheid-Analyse (Beta)
- Erkennung häufiger Fehler in Steuerbescheiden
- Vergleich mit ELSTER-Eingabe
- Hinweis auf übersehene Abzugsmöglichkeiten
- Fristberechnung Einspruch (§ 355 AO: 1-Monats-Frist)

---

## 8. Sicherheit & Missbrauchsschutz

### 8.1 Prompt Injection Prevention
```python
class InputSanitizer:
    FORBIDDEN_PATTERNS = [
        r"ignore previous instructions",
        r"you are now",
        r"act as",
        r"jailbreak",
        # ... weitere Muster
    ]

    def sanitize(self, user_input: str) -> str:
        # Strukturierte Eingabe statt Freitext wo möglich
        # Freitext wird gesondert sandboxed verarbeitet
        for pattern in self.FORBIDDEN_PATTERNS:
            if re.search(pattern, user_input, re.IGNORECASE):
                raise SecurityException("Ungültige Eingabe erkannt")
        return html.escape(user_input)  # HTML-Encoding
```

### 8.2 Output-Validierung
- Jede KI-Ausgabe wird durch eine **Regel-Engine** validiert
- Regelbeispiele: „Konfidenz darf nie > 95 % sein", „Disclaimer muss immer vorhanden sein", „Empfohlener Betrag darf nie > Originalbetrag sein"
- Outputs, die Regeln verletzen, werden **automatisch blockiert** und manuell geprüft

### 8.3 Rate Limiting & Abuse Prevention
- Max. 10 CaseMatch-Anfragen pro Bürger pro Tag (verhindert Datamining)
- Anomalie-Erkennung: Ungewöhnliche Anfragemuster → automatische Sperrung
- Alle Anfragen mit Bürger-ID verknüpft (für Audit-Trail, nicht für Training)

---

## 9. Rollout-Plan CaseMatch AI

| Phase | Zeitraum | Scope | Qualitätsschwelle |
|-------|----------|-------|-------------------|
| Alpha | Monate 1–3 | Interne Tests, 50 Juristen | Accuracy > 70 % |
| Beta (geschlossen) | Monate 4–9 | 10.000 Pilotnutzer, nur Bußgelder | Accuracy > 75 %, NPS > 60 |
| Beta (offen) | Monate 10–18 | Bundesweit, alle OWiG-Fälle | Accuracy > 78 %, Bias-Audit bestanden |
| GA (General Availability) | Monat 19+ | Alle Module, inkl. Steuerbescheid | Accuracy > 80 %, ISO-Zertifizierung |

---

*Erstellt auf Basis: docs/01_Master_Blueprint.md bis architecture/05_Systemarchitektur.md*
