package kijupintegration

import "time"

// Canonical entities for KiJuP/Local-Fachverfahren Integration.
// Intentionally minimal: no personenbezogene Felder werden hier gehalten.

type CaseReference struct {
	ID             string    // Kanonische Fall-ID (uuid)
	LocalCaseID    string    // Operative ID im führenden Fachverfahren
	System         string    // Name/URN des lokalen Systems
	Tenant         string    // Kommune/Behörde
	UpdatedAt      time.Time // Letzter bekannte Stand im lokalen System
	BusinessDomain string    // z.B. "HzE", "Unterhaltsvorschuss", "Bußgeld"
}

type ExternalSystemLink struct {
	System       string    // z.B. "KiJuP-online-cache", "Fachverfahren-XYZ"
	RecordID     string    // Identifier im Fremdsystem
	Endpoint     string    // API- oder Export-URL (falls vorhanden)
	LastSyncAt   time.Time // Zeitpunkt der letzten Synchronisation
	ReadOnly     bool      // True für Referenzquellen wie KiJuP
	VersionLabel string    // z.B. "Stand 2026-03"
}

type LegalReference struct {
	ID           string
	Title        string
	Norm         string    // z.B. "SGB VIII §27"
	Section      string    // Freitext/Paragraph
	Source       CitationSource
	Version      string    // Stand/Edition
	RetrievedAt  time.Time
	ValidUntil   *time.Time
	Summary      string    // Kurzbegründung, keine Falldaten
	Confidence   float32   // optional: Empfehlungsstärke (0-1)
	Keywords     []string  // für Matching/Filter
	AppliesToIDs []string  // betroffene CaseReference.IDs (nur Referenzen)
}

type CitationSource struct {
	Provider    string // "KiJuP-online" / "Referenz-Cache"
	URI         string // Deep-Link oder Dokumenten-URI
	Section     string // Kapitel/Abschnitt
	Hash        string // Hash des Quelltextes für Integrität
	PublishedAt *time.Time
}

type SyncStatus string

const (
	SyncStatusPending  SyncStatus = "pending"
	SyncStatusSuccess  SyncStatus = "success"
	SyncStatusFailed   SyncStatus = "failed"
	SyncStatusDeferred SyncStatus = "deferred"
)

type SyncResult struct {
	Status        SyncStatus
	StartedAt     time.Time
	CompletedAt   time.Time
	ItemsSynced   int
	ItemsDeferred int
	Errors        []string
	CorrelationID string
}

type ActorType string

const (
	ActorHuman  ActorType = "human"
	ActorSystem ActorType = "system"
)

type AuditEntry struct {
	EventID       string
	Timestamp     time.Time
	ActorID       string
	ActorType     ActorType
	Action        string
	CaseRef       CaseReference
	SourceSystem  string // wer löst aus (Adapter/Service)
	Outcome       string // success|failed|warning
	CorrelationID string
	ReferenceURI  string // Quelle der juristischen Aussage
	PayloadHash   string // Hash der übermittelten Nutzdaten (ohne Klartext)
}

type DataProvenance struct {
	SourceSystem  string
	SourceRecord  string
	SourceURI     string
	RetrievedAt   time.Time
	VerifiedBy    string // ActorID, der die Referenz geprüft hat
	ContentHash   string
	Confidence    float32
	LegalStand    string // z.B. "Stand 09.03.2026"
	CorrelationID string
}

type MappingRef struct {
	LocalField     string
	CanonicalField string
	Notes          string
}

// Beispielhafte Feld-Mappings (anpassbar pro Fachverfahren).
var MinimalFieldMapping = []MappingRef{
	{LocalField: "aktenzeichen", CanonicalField: "CaseReference.LocalCaseID", Notes: "ohne Personenbezug"},
	{LocalField: "verfahrenstyp", CanonicalField: "CaseReference.BusinessDomain", Notes: "Domain für Referenz-Suche"},
	{LocalField: "frist_datum", CanonicalField: "DataProvenance.RetrievedAt", Notes: "als Kontext, nicht übermitteln"},
}
