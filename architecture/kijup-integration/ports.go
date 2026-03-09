package kijupintegration

import (
	"context"
	"time"
)

// Ports/Interfaces für die Integrationsschicht.
// Keine Annahmen über konkrete KiJuP- oder Fachverfahrens-APIs; Implementierungen hängen am Adapter.

type LocalCaseSystemAdapter interface {
	// Liefert minimale Fall-Referenz ohne sensible Inhalte.
	FetchCaseReference(ctx context.Context, localCaseID string) (CaseReference, error)
	// Liefert Kontext-Stichworte für juristische Recherche (anonymisiert).
	FetchLegalContext(ctx context.Context, ref CaseReference) (map[string]string, error)
	// Schreibt juristische Referenzen zurück in das führende Fachverfahren (nur Hinweise/Links).
	PushLegalReference(ctx context.Context, ref CaseReference, legalRef LegalReference, provenance DataProvenance) error
}

type LegalReferenceProvider interface {
	// Sucht nach juristischen Referenzen (read-only). Implementation kann KiJuP-API oder Referenz-Cache sein.
	Search(ctx context.Context, query string, filters map[string]string) ([]LegalReference, error)
	// Liefert eine konkrete Referenz mit Quelle/Version.
	GetReference(ctx context.Context, referenceID string) (LegalReference, error)
}

type AuditTrailService interface {
	Record(ctx context.Context, entry AuditEntry) error
}

type SyncOrchestrator interface {
	// Startet einen referenzierenden Sync für einen Fall (kein Schreiben nach KiJuP).
	SyncReferencesForCase(ctx context.Context, caseRef CaseReference) (SyncResult, error)
	// Backfill für mehrere Fälle (z. B. täglich), mit Timebox zur Schonung der Fachverfahren.
	BackfillReferences(ctx context.Context, since time.Time) (SyncResult, error)
}

type PrivacyFilter interface {
	// Entfernt oder maskiert sensible Daten vor dem Aufruf externer Referenzquellen.
	Sanitize(ctx context.Context, payload map[string]any) (map[string]any, error)
	// Validiert, dass nur Minimaldaten übertragen werden.
	ValidateMinimality(ctx context.Context, payload map[string]any) error
}

// Helper: Vorgaben für Retries/Circuit Breaking (nicht an konkrete Lib gebunden).
type ResiliencePolicy struct {
	MaxAttempts       int
	InitialBackoffMS  int
	BackoffMultiplier float32
	TimeoutSeconds    int
	CircuitThreshold  int
	CircuitResetSec   int
}
