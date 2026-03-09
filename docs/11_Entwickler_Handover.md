# Open State – Entwickler-Handover-Dokument

**Version:** 1.0
**Erstellt aus:** docs/01–10 (alle Projektphasen konsolidiert)

---

## INHALTSVERZEICHNIS

1. [Projekt-Kurzübersicht](#1-projekt-kurzübersicht)
2. [Repository-Struktur](#2-repository-struktur)
3. [Architektur-Zusammenfassung](#3-architektur-zusammenfassung)
4. [Tech-Stack Referenz](#4-tech-stack-referenz)
5. [Kritische Implementierungsregeln](#5-kritische-implementierungsregeln)
6. [Modul-Übersicht & Status](#6-modul-übersicht--status)
7. [API-Design-Prinzipien](#7-api-design-prinzipien)
8. [Datenschutz & Sicherheit – Pflichten](#8-datenschutz--sicherheit--pflichten)
9. [CaseMatch AI – Technischer Einstieg](#9-casematch-ai--technischer-einstieg)
10. [UI/UX – Design System Einstieg](#10-uiux--design-system-einstieg)
11. [Behörden-Adapter – Implementierungsleitfaden](#11-behörden-adapter--implementierungsleitfaden)
12. [Testing-Strategie](#12-testing-strategie)
13. [Deployment & CI/CD](#13-deployment--cicd)
14. [Rechtliche Constraints für Entwickler](#14-rechtliche-constraints-für-entwickler)
15. [Roadmap & Prioritäten](#15-roadmap--prioritäten)
16. [Kontakte & Eskalationswege](#16-kontakte--eskalationswege)

---

## 1. Projekt-Kurzübersicht

**Was ist Open State?**
Open State ist die einzige offizielle deutsche Verwaltungs-App. Sie automatisiert 95 % aller Behördenvorgänge für 84 Millionen Bürger in unter 3 Minuten. Entwickelt als staatliche Infrastruktur, betrieben vom Föderalen Kompetenzzentrum Open State GmbH (Bund).

**Kernprinzipien (nicht verhandelbar):**
- Datensouveränität beim Bürger (Zero-Knowledge-Architektur)
- KI nur als Assistenz, nie als Entscheider
- Open Source für alle Kernkomponenten
- Barrierefreiheit WCAG 2.1 AA als Mindeststandard
- DSGVO by Design & by Default

**Projektstand:** Phase 0 (Aufbau) – Initiale Ausbaustufe

---

## 2. Repository-Struktur

```
github.com/bundesrepublik/open-state/
│
├── apps/
│   ├── ios/                    # Swift/SwiftUI iOS App
│   ├── android/                # Kotlin/Jetpack Compose Android App
│   ├── web/                    # React 18 + TypeScript PWA
│   └── kiosk/                  # React Electron Kiosk
│
├── services/
│   ├── api-gateway/            # Kong Konfiguration + Plugins
│   ├── identity-service/       # Rust/Actix-Web – eID, Auth
│   ├── process-orchestrator/   # Go + Temporal.io – Workflow Engine
│   ├── casematch-ai/           # Python/FastAPI + PyTorch – KI
│   ├── notification-service/   # Node.js + Bull Queue
│   ├── audit-service/          # Go + Kafka – Immutable Log
│   └── ocr-service/            # Python + Tesseract + LLM
│
├── adapters/
│   ├── einwohnermeldeamt/      # XMeld Adapter
│   ├── finanzamt/              # ELSTER Adapter
│   ├── justiz/                 # EGVP/XJustiz Adapter
│   ├── kfz/                    # i-Kfz Adapter
│   ├── gewerbeamt/             # XGewerbeanmeldung Adapter
│   ├── sozialleistungen/       # XSoziales Adapter
│   └── _template/              # Adapter-Template für neue Behörden
│
├── infrastructure/
│   ├── terraform/              # IaC – Sovereign Cloud
│   ├── kubernetes/             # K8s Manifeste + Helm Charts
│   ├── ci-cd/                  # GitLab CI Pipelines
│   └── monitoring/             # Prometheus + Grafana Configs
│
├── shared/
│   ├── design-system/          # Tokens, Komponenten (React)
│   ├── proto/                  # Protobuf Definitionen
│   ├── openapi/                # OpenAPI 3.1 Spezifikationen
│   └── types/                  # Geteilte TypeScript/Go Typen
│
├── docs/                       # Diese Dokumentation
│   ├── 01_Master_Blueprint.md
│   ├── 02_Vergleich_Best_Practices.md
│   └── ...
│
├── legal/                      # Rechtliche Dokumente
├── ai-models/                  # KI-Modell-Dokumentation
├── app-design/                 # UX/UI Dokumentation
├── roadmap/                    # Roadmap & Finanzplan
└── transparency/               # Transparenz & Haftung
```

---

## 3. Architektur-Zusammenfassung

### 3.1 Schichtenmodell

```
[iOS/Android/PWA/Kiosk]
         ↓ HTTPS/TLS 1.3
[API Gateway – Kong, Zero-Trust, OAuth2/FIDO2]
         ↓
[Platform Services]
  ├── Identity Service (Rust)       – eID, Auth, Tokens
  ├── Process Orchestrator (Go)     – Saga Workflows
  ├── CaseMatch AI (Python)         – KI-Empfehlungen
  ├── Notification Service (Node)   – Push/SMS/Mail
  ├── Audit Service (Go+Kafka)      – Immutable Log
  └── OCR Service (Python)          – Dokumentenanalyse
         ↓
[Behörden-Adapter-Layer]
  ├── XMeld, ELSTER, EGVP, i-Kfz, XGewerbe, XSoziales
  └── Adapter-Template für neue Behörden
         ↓
[Staatliche Behörden-Backendsysteme]
         ↕
[Datenschicht – Sovereign Cloud]
  ├── Bürger-Datentresor (PostgreSQL, AES-256, Zero-Knowledge)
  ├── Register-Cache (Redis, Read-Only, TTL 24h)
  ├── CaseMatch-DB (PostgreSQL + TimescaleDB, anonymisiert)
  └── Audit-Log (Kafka + ClickHouse, immutable, signiert)
```

### 3.2 Kommunikationsmuster

- **Client → Gateway:** REST over HTTPS, JWT Bearer Token
- **Gateway → Services:** gRPC (intern), mTLS via Istio
- **Services → Adapters:** REST/SOAP je Behördenstandard
- **Audit-Events:** Apache Kafka (append-only), kryptografisch signiert
- **Async-Workflows:** Temporal.io (Saga-Pattern für verteilte Transaktionen)

### 3.3 Kritische Designentscheidung: Dezentrale Daten

**Es gibt KEINE zentrale Datenbank aller Bürger.** Jeder Bürger hat einen eigenen, isolierten Datentresor. Behörden halten weiterhin ihre eigenen Daten. Open State ist ein **Kommunikationsbus**, kein Datensilo.

---

## 4. Tech-Stack Referenz

| Schicht | Technologie | Version | Lizenz |
|---------|-------------|---------|--------|
| iOS | Swift + SwiftUI | Swift 5.9+ | Apple |
| Android | Kotlin + Jetpack Compose | Kotlin 1.9+ | Apache 2.0 |
| Web/PWA | React + TypeScript | React 18, TS 5.x | MIT |
| State Mgmt | Zustand + React Query | Latest | MIT |
| Backend (Orchestrator) | Go | 1.22+ | BSD |
| Backend (Identity) | Rust + Actix-Web | Rust 1.75+ | MIT/Apache |
| Backend (KI) | Python + FastAPI | Python 3.12, FastAPI 0.100+ | MIT |
| Workflow Engine | Temporal.io | Latest | MIT |
| KI-Framework | PyTorch | 2.x | BSD |
| LLM (Basis) | Mistral 7B / Llama 3.1 8B | Latest | Apache 2.0 |
| LLM-Inferenz | vLLM | Latest | Apache 2.0 |
| Vector DB | Weaviate | Latest | BSD |
| API Gateway | Kong Enterprise | Latest | Kommerziell |
| Auth | Keycloak | Latest | Apache 2.0 |
| Container | Docker + Kubernetes | K8s 1.30+ | Apache 2.0 |
| Service Mesh | Istio | Latest | Apache 2.0 |
| Message Broker | Apache Kafka | 3.x | Apache 2.0 |
| Datenbank | PostgreSQL | 16+ | PostgreSQL |
| Cache | Redis | 7+ | BSD |
| Object Storage | MinIO | Latest | AGPL |
| Monitoring | Prometheus + Grafana | Latest | Apache 2.0 |
| Tracing | Jaeger + OpenTelemetry | Latest | Apache 2.0 |
| IaC | Terraform + Ansible | TF 1.6+ | MPL 2.0 |
| CI/CD | GitLab CI | Latest | MIT (CE) |

---

## 5. Kritische Implementierungsregeln

### REGEL 1: Zero-Knowledge-Datentresor
```
❌ VERBOTEN:
- Persönliche Daten im Klartext auf Servern speichern
- Bürger-Keys serverseitig halten
- Daten aus verschiedenen Bürgertresoren zusammenführen

✅ PFLICHT:
- Alle persönlichen Daten AES-256-GCM verschlüsselt
- Key-Derivation per Argon2id (bürgerseits, per PIN/Biometrie)
- Entschlüsselung nur im RAM, niemals persistent im Klartext
- Jeder Datenzugriff ins Audit-Log (signiert, immutable)
```

### REGEL 2: KI ist niemals Entscheider
```
❌ VERBOTEN:
- KI-Output direkt als Verwaltungsakt verwenden
- Konfidenz > 95% behaupten
- Empfehlung ohne Disclaimer ausgeben
- Bürger-spezifische Daten für Modell-Training verwenden

✅ PFLICHT:
- Jede KI-Ausgabe durch Regel-Engine validieren
- Menschliche Überprüfung immer anbieten
- Disclaimer-Text IMMER im Output-Schema enthalten
- Konfidenzwert IMMER sichtbar
```

### REGEL 3: DSGVO by Default
```
❌ VERBOTEN:
- Mehr Daten anfragen als für den Vorgang nötig
- Daten über den Vorgang hinaus speichern
- Verwaltungsdaten für Werbetargeting nutzen
- Daten ohne explizite Einwilligung an Dritte weitergeben

✅ PFLICHT:
- Datensparsamkeit: Nur das Minimum anfragen
- TTL auf alle temporären Daten setzen
- Einwilligung vor jeder Datenweitergabe einholen & loggen
- DSGVO-Folgenabschätzung für jedes neue Feature
```

### REGEL 4: Barrierefreiheit ist kein Feature
```
❌ VERBOTEN:
- Barrierefreiheit nachträglich einbauen
- Kontrastverhältnis unter 4,5:1 (WCAG AA)
- Touchziele unter 44×44px
- Animationen ohne Reduce-Motion-Option

✅ PFLICHT:
- WCAG 2.1 AA für jede Komponente im Design System
- Screen-Reader-Tests in jeder PR-Pipeline
- Keyboard-Navigation vollständig
- Einfache-Sprache-Version für alle Kerntexte
```

### REGEL 5: Open Source & Auditierbarkeit
```
✅ PFLICHT:
- Alle Kernkomponenten öffentlich auf GitHub
- Keine proprietären Abhängigkeiten in kritischen Pfaden
- Security-Advisories innerhalb 72h nach Entdeckung
- Monatliche Dependency-Updates (Dependabot)
- Jährlicher öffentlicher Code-Audit
```

---

## 6. Modul-Übersicht & Status

| Modul | Prio | Status | Dateipfad | Rechtl. Ampel |
|-------|------|--------|-----------|---------------|
| eID-Onboarding | 1 | 🟡 In Entwicklung | services/identity-service | 🟢 Grün |
| Wohnsitzummeldung | 1 | 🟡 In Entwicklung | adapters/einwohnermeldeamt | 🟢 Grün |
| Steuererklärung AutoFill | 1 | 🔴 Geplant | adapters/finanzamt | 🟡 Gelb |
| Datentresor | 1 | 🟡 In Entwicklung | services/identity-service | 🟢 Grün |
| Gewerbeanmeldung | 2 | 🔴 Geplant | adapters/gewerbeamt | 🟢 Grün |
| CaseMatch AI | 2 | 🔴 Alpha-Vorbereitung | services/casematch-ai | 🔴 Auflagen |
| Sozialleistungen | 2 | 🔴 Geplant | adapters/sozialleistungen | 🟡 Gelb |
| KFZ-Zulassung | 2 | 🔴 Geplant | adapters/kfz | 🟢 Grün |
| ePA-Integration | 3 | 🔴 Geplant | adapters/gesundheit | 🔴 Gesetz nötig |
| Digitales Notarmodul | 3 | 🔴 Geplant | adapters/notar | 🔴 Gesetz nötig |
| Bürgerpartizipation | 3 | 🔴 Geplant | apps/participation | 🟡 Prüfung |

**Legende:** 🟢 Sofort implementierbar | 🟡 Mit Auflagen | 🔴 Gesetzgebung abwarten

---

## 7. API-Design-Prinzipien

### 7.1 REST-Konventionen

```
Basis-URL: https://api.openstate.bund.de/v1/

Ressourcen:
GET    /citizens/{id}/address          – Adresse abrufen
POST   /citizens/{id}/address/change   – Ummeldung starten
GET    /workflows/{id}                 – Workflow-Status
POST   /casematch/analyze              – CaseMatch-Analyse starten
GET    /datentresor/log                – Zugriffs-Log abrufen

Pagination: ?page=1&limit=20 (cursor-based für große Sets)
Filterung:  ?filter[status]=pending&filter[type]=ummeldung
Sortierung: ?sort=-created_at (Minus = descending)
```

### 7.2 Standard-Response-Format

```json
{
  "data": { ... },
  "meta": {
    "request_id": "uuid-v4",
    "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
    "version": "1.0"
  },
  "errors": null
}
```

### 7.3 Fehler-Format (RFC 7807 Problem Details)

```json
{
  "type": "https://openstate.bund.de/errors/validation-error",
  "title": "Validierungsfehler",
  "status": 422,
  "detail": "Die eingegebene Adresse konnte nicht verifiziert werden.",
  "instance": "/citizens/123/address/change",
  "request_id": "uuid-v4"
}
```

### 7.4 Authentifizierung

```
1. eID-Verifizierung → JWT Access Token (15 Min) + Refresh Token (30 Tage)
2. Header: Authorization: Bearer <access_token>
3. Token-Rotation: Jeder Request mit Refresh-Token erneuert Access-Token
4. Scopes: openid, profile, verwaltung:read, verwaltung:write, casematch:read
5. MFA: Biometrie oder PIN für verwaltung:write Operationen
```

---

## 8. Datenschutz & Sicherheit – Pflichten

### 8.1 Pflicht-Checkliste pro Feature/PR

Vor jedem Merge in `main` müssen folgende Punkte geprüft sein:

```
Datenschutz:
☐ Welche personenbezogenen Daten werden verarbeitet?
☐ Gibt es eine Rechtsgrundlage (Art. 6 DSGVO)?
☐ Ist Datensparsamkeit eingehalten?
☐ Gibt es eine Löschfrist (TTL)?
☐ Ist ein Audit-Log-Eintrag vorgesehen?
☐ Wurde eine DSGVO-Folgenabschätzung durchgeführt? (bei neuen Verarbeitungen)

Sicherheit:
☐ SQL-Injection-Schutz (parameterisierte Queries)?
☐ Input-Validierung und -Sanitierung?
☐ Rate Limiting konfiguriert?
☐ Keine Secrets im Code (Secret-Scanner läuft in CI)?
☐ Dependencies aktuell (kein bekannter CVE)?
☐ OWASP Top 10 geprüft?

KI (für CaseMatch-Features):
☐ Kein Personenbezug in Trainingsdaten?
☐ Disclaimer im Output?
☐ Konfidenzwert sichtbar?
☐ Menschliche Überprüfung möglich?
☐ Bias-Test durchgeführt?
```

### 8.2 Verschlüsselungsstandards

| Kontext | Algorithmus | Schlüssellänge |
|---------|-------------|----------------|
| Datentresor (at rest) | AES-256-GCM | 256 bit |
| Key Derivation | Argon2id | memory=64MB, iter=3 |
| Transport | TLS 1.3 | — |
| Token-Signierung | RS256 (RSA) | 2048 bit |
| Audit-Log-Signierung | Ed25519 | 256 bit |
| Passwort-Hashing | bcrypt | cost=12 |

### 8.3 Incident-Response-Ablauf

```
Severity 1 (Datenpanne/System down):
  → Sofort: On-Call-Engineer + CISO informieren
  → 15 Min: Status-Page aktualisieren
  → 1 Std: BfDI informieren (DSGVO Art. 33)
  → 4 Std: Pressebriefing
  → 24 Std: Betroffene Bürger benachrichtigen
  → 72 Std: Post-Mortem Draft

Severity 2 (Teilausfall/Performance):
  → 30 Min: On-Call + Team-Lead
  → 1 Std: Status-Page
  → 24 Std: Post-Mortem
```

---

## 9. CaseMatch AI – Technischer Einstieg

### 9.1 Service-Einstiegspunkte

```
services/casematch-ai/
├── main.py                    # FastAPI App
├── models/
│   ├── casematch_model.py     # Haupt-Modell (Mistral 7B Fine-Tuned)
│   ├── rag_pipeline.py        # Retrieval-Augmented Generation
│   └── explainer.py           # SHAP/LIME Erklärbarkeit
├── schemas/
│   ├── input_schema.py        # Pydantic Input-Validierung
│   └── output_schema.py       # Pydantic Output-Schema (JSON)
├── rules/
│   └── output_validator.py    # Regel-Engine (Post-Processing)
├── bias/
│   └── bias_monitor.py        # Fairness-Monitoring
└── prompts/
    ├── system_prompt.txt       # System-Prompt (Produktionsversion)
    └── templates/              # Prompt-Templates je Falltyp
```

### 9.2 Minimales Integrationsbeispiel

```python
from casematch_ai import CaseMatchClient

client = CaseMatchClient(api_url="http://casematch-service:8080")

result = client.analyze(
    tatbestand_code="OWiG-052",       # Falschparken
    betrag_eur=80.0,
    beweise=["parkschein_foto"],
    bundesland="BY",
    anonymized_context=True            # NIEMALS echte PII übergeben
)

print(result.widerspruchs_erfolgsquote)  # 78
print(result.empfehlung)                 # "widerspruch"
print(result.erklaerung_buerger)         # Plaintext für UI
```

### 9.3 Modell-Versioning

```
Modell-Registry: services/casematch-ai/models/registry/
Namenskonvention: casematch-{base_model}-v{major}.{minor}
Beispiel: casematch-mistral7b-v1.3

Rollout:
- Neues Modell → 5% Traffic (A/B-Test)
- Monitoring 48h: Accuracy, Latenz, Bias-Score
- Bei Bestehen: 100% Traffic
- Altes Modell: 30 Tage archiviert, dann löschen
```

---

## 10. UI/UX – Design System Einstieg

### 10.1 Design-Token-Import

```typescript
// shared/design-system/tokens.ts
export const tokens = {
  color: {
    brand: {
      primary: '#003F8C',
      primaryDark: '#002A6B',
      accent: '#00A550',
    },
    status: {
      success: '#00A550',
      warning: '#E8A000',
      error: '#C0392B',
    },
    neutral: {
      background: '#F5F7FA',
      surface: '#FFFFFF',
      textPrimary: '#1A1A2E',
      textSecondary: '#6B7280',
    }
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 20, full: 9999 }
}
```

### 10.2 Kern-Komponenten (React)

```tsx
// Primärer Button – immer aus Design System verwenden
import { Button, Card, StatusBadge, ProgressBar } from '@open-state/design-system'

// Erfolgs-Screen Beispiel
<Card variant="success">
  <StatusBadge status="success">Erledigt</StatusBadge>
  <ProgressBar value={100} label="Ummeldung abgeschlossen" />
  <Button variant="primary" onPress={handleNext}>
    Zur Übersicht
  </Button>
</Card>
```

### 10.3 Barrierefreiheits-Pflichten im Code

```tsx
// IMMER: aria-label, role, accessibilityLabel
<TouchableOpacity
  accessibilityLabel="Ummeldung starten"
  accessibilityRole="button"
  accessibilityHint="Öffnet den Ummeldungs-Assistent"
  style={{ minWidth: 44, minHeight: 44 }}  // Mindestgröße!
>

// IMMER: Reduce Motion respektieren
const prefersReducedMotion = useReducedMotion()
const animation = prefersReducedMotion ? 'none' : 'spring'
```

---

## 11. Behörden-Adapter – Implementierungsleitfaden

### 11.1 Neuen Adapter erstellen

```go
// adapters/_template/adapter.go

package adapter

import (
    "context"
    "github.com/bundesrepublik/open-state/shared/types"
)

// PFLICHT: Jeder Adapter implementiert dieses Interface
type BehördenAdapter interface {
    // Hauptoperation ausführen
    SendRequest(ctx context.Context, req types.AdminRequest) (*types.AdminResponse, error)
    // Status einer laufenden Operation abfragen
    GetStatus(ctx context.Context, operationID string) (*types.StatusResponse, error)
    // Eingabedaten validieren (vor dem echten API-Call)
    ValidateData(data map[string]interface{}) error
    // Fähigkeiten dieses Adapters beschreiben
    GetCapabilities() types.AdapterCapabilities
}

// PFLICHT: Retry-Logik mit exponential backoff
// PFLICHT: Timeout maximal 30 Sekunden
// PFLICHT: Jede Kommunikation ins Audit-Log
// PFLICHT: Fehler-Mapping auf Standard-Error-Format
// VERBOTEN: Daten länger als für die Operation nötig halten
```

### 11.2 Adapter-Konfiguration

```yaml
# kubernetes/adapters/einwohnermeldeamt-config.yaml
adapter:
  name: einwohnermeldeamt
  standard: xmeld-3.2
  timeout_seconds: 30
  retry:
    max_attempts: 3
    backoff_multiplier: 2
    initial_delay_ms: 500
  circuit_breaker:
    threshold: 5           # Fehler in 60 Sekunden bis Öffnung
    timeout_seconds: 60    # Wie lange offen bleiben
  audit:
    log_requests: true
    log_responses: false   # Antworten nur bei Fehler loggen
    retention_days: 90
```

---

## 12. Testing-Strategie

### 12.1 Test-Pyramide

```
         /\
        /E2E\        < 10% – Wenige kritische User-Journeys
       /______\
      /Integrat.\    ~20% – Service-zu-Service, Adapter-Tests
     /____________\
    /  Unit Tests   \  ~70% – Logik, Parsing, Validierung
   /________________\
```

### 12.2 Pflicht-Tests pro Service

```
Unit Tests:        > 80% Code Coverage (CI-Pflicht)
Integration Tests: Alle Adapter gegen Mock-Behörden-Server
E2E Tests:         5 kritische User-Journeys (Ummeldung, Steuer,
                   CaseMatch, Datentresor, Onboarding)
Security Tests:    OWASP ZAP in jeder CI-Pipeline
Performance Tests: k6 Load-Tests vor jedem Major Release
Accessibility:     axe-core in E2E-Pipeline (Barrierefreiheit)
Bias Tests:        CaseMatch: Demographische Parität nach jedem Retraining
```

### 12.3 Test-Daten

```
WICHTIG: Niemals echte Bürgerdaten in Tests!

Test-Identitäten:
- Bereitgestellt durch Bundesdruckerei (Test-eID-Karten)
- Synthetische Daten: shared/test-fixtures/citizens/
- Anonymisierte Behörden-Antworten: shared/test-fixtures/responses/

Behörden-Mocks:
- WireMock-Server für alle Adapter
- Konfiguration: adapters/_mocks/
- Szenarien: Erfolg, Timeout, Fehler, Teilantwort
```

---

## 13. Deployment & CI/CD

### 13.1 Branch-Strategie

```
main          → Produktion (geschützt, nur via PR)
staging       → Staging-Umgebung (auto-deploy)
develop       → Integration aller Features
feature/*     → Feature-Branches (von develop)
hotfix/*      → Hotfixes (von main, zurück nach main + develop)
```

### 13.2 CI/CD-Pipeline (GitLab CI)

```yaml
# Jede PR durchläuft:
stages:
  - lint          # Code-Style, Type-Check
  - test          # Unit + Integration Tests
  - security      # Secret-Scan, SAST, Dependency-Check
  - accessibility # axe-core für Frontend
  - build         # Docker-Images bauen
  - deploy-staging # Automatisch auf Staging
  - e2e           # E2E-Tests gegen Staging
  - deploy-prod   # Manueller Trigger (nur main)
```

### 13.3 Release-Prozess

```
1. Feature auf develop fertig + reviewed
2. Staging-Deploy automatisch
3. QA + Produkt-Abnahme auf Staging (48h Mindest-Beobachtung)
4. PR von staging → main erstellen
5. Security-Review (bei sicherheitsrelevanten Änderungen: CISO)
6. Merge → Automatisches Prod-Deploy via Blue-Green
7. 1h Monitoring: Error-Rate, Latenz, Nutzer-Feedback
8. Rollback sofort verfügbar (< 5 Min via Kubernetes Rollout Undo)
```

---

## 14. Rechtliche Constraints für Entwickler

### 14.1 Was NIE implementiert werden darf (ohne Gesetzesänderung)

```
❌ CaseMatch AI als verbindliche Rechtsentscheidung
❌ Automatischer Bescheiderlass ohne Mensch in der Schleife
❌ Werbetargeting auf Basis von Verwaltungsdaten
❌ Datenweitergabe ohne explizite Einwilligung
❌ Gesichtserkennung über biometrische eID-Verifikation hinaus
❌ Speicherung von Kommunikationsinhalten (Art. 10 GG)
❌ CaseMatch für Strafrecht (nur OWiG, kein StGB)
❌ ePA-Integration vor SGB-Novelle
❌ Digitales Notarmodul vor BeurkG-Novelle
```

### 14.2 Rechtlich geklärte Grundlage

```
✅ eID-Onboarding + Wohnsitzummeldung → OZG + BMI-Erlass
✅ Steuererklärung AutoFill → § 87a AO + ELSTER-Vereinbarung
✅ Bußgeld-Widerspruch digital → § 67 OWiG (schriftlich = elektronisch)
✅ Gewerbeanmeldung → XGewerbeanmeldung-Standard + OZG
✅ KFZ-Zulassung → i-Kfz Verordnung
✅ Datentresor → DSGVO Art. 25 (Privacy by Design)
```

### 14.3 Disclaimer-Pflichten im UI (Code-Ebene)

```typescript
// CaseMatch: Pflicht-Disclaimer-Konstante – NIEMALS ENTFERNEN
export const CASEMATCH_DISCLAIMER =
  "Dies ist keine Rechtsberatung im Sinne des Rechtsdienstleistungsgesetzes (RDG). " +
  "Die Empfehlung basiert auf statistischen Auswertungen und ersetzt keine " +
  "individuelle rechtliche Beratung durch einen Rechtsanwalt."

// KI-Empfehlung: Konfidenz immer sichtbar
// Minimum-Darstellung: Konfidenzwert + Datenbasis + Disclaimer
```

---

## 15. Roadmap & Prioritäten

### 15.1 Aktuelle Sprint-Prioritäten (Phase 0)

```
P0 (Blocker):
  → Identity Service: eID-NFC-Integration (iOS + Android)
  → Datentresor: Zero-Knowledge-Verschlüsselung implementieren
  → API Gateway: OAuth2 + FIDO2 konfigurieren

P1 (Phase-1-Ziel):
  → Einwohnermeldeamt-Adapter: XMeld 3.2 vollständig
  → Prozess-Orchestrator: Ummeldungs-Workflow (Saga)
  → iOS/Android App: Onboarding + Home + Ummeldungs-Flow

P2 (Phase-2-Ziel):
  → ELSTER-Adapter + AutoFill-Logik
  → CaseMatch AI: Alpha-Modell (Fine-Tuning starten)
  → Audit-Service: Immutable Log + Bürger-Dashboard
```

### 15.2 Meilenstein-Übersicht

| Meilenstein | Eingangsvoraussetzung | Qualitätskriterium |
|-------------|----------------------|--------------------|
| Alpha-Bereitschaft | Infrastruktur vollständig, BSI-Audit bestanden | eID + Ummeldung funktionsfähig, 0 kritische Bugs |
| Public Beta | Alpha-KPIs erfüllt (NPS > 55, 0 Datenpannen) | 4 Pilotstädte, alle P1-Module, NPS > 40 |
| Steuer-Launch | ELSTER-Schnittstelle zertifiziert | ELSTER-Integration, Steuererklärung submitfähig |
| CaseMatch Beta | 5.000 Test-Analysen intern abgeschlossen | Juristen-Audit bestanden, Bias-Audit grün |
| 5-Länder-Rollout | Beta-KPIs erfüllt, Staatsverträge unterzeichnet | 5 Bundesländer vollständig angebunden |
| Bundesweiter Launch | Alle Länder-Adapter deployed, politischer Beschluss | 16/16 Bundesländer, 10 Mio. Nutzer |

---

## 16. Kontakte & Eskalationswege

### 16.1 Team-Struktur

| Rolle | Verantwortungsbereich |
|-------|----------------------|
| CTO Open State | Technische Gesamtverantwortung |
| Chief Privacy Officer | DSGVO, Datenschutz-Folgenabschätzungen |
| CISO | Sicherheitsarchitektur, Incidents |
| Lead AI Ethics | CaseMatch Bias-Audits, KI-Governance |
| Barrierefreiheits-Lead | WCAG-Compliance, Inklusion |
| Bundesbeauftragter Open State | Politische Koordination, Staatsvertrag |

### 16.2 Eskalationsmatrix

| Problem | Erste Ansprechperson | Eskalation |
|---------|---------------------|------------|
| Technischer Bug (P1/P2) | Team-Lead des Service | CTO (> 4h ungelöst) |
| Sicherheitsvorfall | On-Call-Engineer | CISO sofort |
| Datenpanne | CISO | Bundesbeauftragter + BfDI |
| Rechtliche Unsicherheit | Chief Privacy Officer | Externer Rechtsbeistand |
| Behörden-Adapter-Problem | Adapter-Team-Lead | Föd. Kompetenzzentrum |
| KI-Bias-Verdacht | Lead AI Ethics | Sofortige Modell-Pausierung |

### 16.3 Wichtige Ressourcen

```
Internes Wiki:         wiki.openstate.bund.de (intern)
API-Dokumentation:     api-docs.openstate.bund.de (öffentlich)
GitHub Repository:     github.com/bundesrepublik/open-state (öffentlich)
Status-Page:           status.openstate.bund.de (öffentlich)
Security-Reporting:    security@openstate.bund.de (verschlüsselt)
Bug-Bounty:            openstate.bund.de/bug-bounty
Figma Design System:   figma.com/file/[intern] (intern)
GitLab CI:             gitlab.openstate.bund.de (intern)
```

---

## Anhang: Glossar

| Begriff | Definition |
|---------|------------|
| **eID** | Elektronischer Personalausweis (NFC-Chip, BSI-zertifiziert) |
| **XÖV** | XML-basierte Standards für den deutschen öffentlichen Verwaltungsaustausch |
| **XMeld** | XÖV-Standard für Meldewesen-Kommunikation |
| **ELSTER** | Elektronische Steuererklärung (Finanzamt-Schnittstelle) |
| **EGVP** | Elektronisches Gerichts- und Verwaltungspostfach |
| **OZG** | Onlinezugangsgesetz – Pflicht zur digitalen Verwaltungsleistung |
| **OWiG** | Ordnungswidrigkeitengesetz – Rechtsgrundlage für Bußgelder |
| **RDG** | Rechtsdienstleistungsgesetz – regelt erlaubte Rechtsberatung |
| **EUDIW** | EU Digital Identity Wallet – europäische Identitätslösung (Rollout läuft) |
| **Zero-Knowledge** | Architektur, bei der der Betreiber keine Klartextdaten kennt |
| **Saga-Pattern** | Verteiltes Transaktionsmuster für Microservices |
| **RAG** | Retrieval-Augmented Generation – KI mit Wissensdatenbank |
| **XAI** | Explainable AI – erklärbare künstliche Intelligenz |
| **FIDO2** | Passwortloser Authentifizierungsstandard (WebAuthn) |

---

*Dieses Dokument konsolidiert alle Inhalte aus docs/01–10 zu einem einzigen Entwickler-Handover.*
*Bei Widersprüchen gilt: Rechtliche Dokumente (03, 04) > Technische Dokumente (05, 06) > Design-Dokumente (07, 08)*
*Version: 1.0*
