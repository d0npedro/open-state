# KiJuP-Integration – Code-Skelett (Go)

Dieses Verzeichnis enthält ein leichtgewichtiges Skelett für die Integrationsschicht:

- `types.go` – Kanonische Entitäten (`CaseReference`, `LegalReference`, `AuditEntry`, `DataProvenance`) mit Minimaldatenprinzip.
- `ports.go` – Ports/Interfaces für `LocalCaseSystemAdapter`, `LegalReferenceProvider`, `AuditTrailService`, `SyncOrchestrator`, `PrivacyFilter`.

Hinweise:
- Kein Schreiben nach KiJuP-online vorgesehen; `LegalReferenceProvider` ist strikt read-only.
- Adapter implementieren die Ports projektspezifisch (REST/SOAP/File/MQ), ohne sensible Falldaten nach außen zu geben.
- Resilience-Parameter sind bewusst generisch gehalten und können in die jeweiligen Adapter-Configs übernommen werden.

Siehe begleitende Architektur: `docs/14_KiJuP_Integration.md` und ADR `docs/adr/2026-03-09-kijup-reference-source.md`.
