# 14_KiJuP_Integration – Schnittstelle zu KiJuP-online & lokale Fachanwendungen

**Status:** Entwurf (09.03.2026)  
**Ziel:** Belastbare Integrationsarchitektur, die KiJuP-online als juristische Referenzquelle nutzt, während lokale Fachverfahren führende operative Systeme bleiben.

---

## 1. Zielbild
- Lokale Fachanwendungen (Fallführung, Dokumente, Fristen) bleiben Primärsysteme.
- KiJuP-online wird ausschließlich als **lesende** Wissens- und Referenzquelle angebunden (Normtexte, Kommentierungen, Verweise, Deep-Links).
- Ein **Integration Layer** vermittelt zwischen Fachverfahren und Referenzquellen, erzwingt Datenschutz-Minimalprinzip, Audit-Trail und Nachvollziehbarkeit.
- Fachliche Entscheidungen verbleiben bei Sachbearbeitung/Fallverantwortlichen; jede KI- oder Regel-basierte Empfehlung ist begründet, versioniert und mit Quelle versehen.

---

## 2. Systemkontext (high level)

```mermaid
flowchart LR
    subgraph Local["Lokale Fachanwendungen (führend)"]
        L1[Fall-/Aktenführung\nDokumente, Fristen, Status]
        L2[Stammdaten & Berechtigungen]
    end

    subgraph IL["Integration Layer\n(Zero-Trust, Minimaldaten)"]
        A1[Adapter: Fachverfahren\nREST/SOAP/File/MQ]
        A2[LegalReferenceProvider\nKiJuP Read-Only]
        CM[Canonical Model\nCaseReference, LegalReference, Provenance]
        AU[Audit & Provenance\nappend-only]
        Q[Event/Job Scheduler\nRetry, Dead-Letter]
    end

    subgraph KIJUP["KiJuP-online\n(juristische Referenzquelle)"]
        K1[Recherche-API / Export*]
        K2[Deep Links\nNorm, Kommentar, Fundstelle]
    end

    Local <--> A1
    A1 --> CM
    CM --> AU
    CM --> A2
    A2 --> KIJUP
    Q --> A1
    Q --> A2

    %% Hinweis
    note right of KIJUP
      *Kein Schreibzugriff vorgesehen.\nFalls keine API verfügbar:\nkuratiertes Read-Only-Export-/Cache-Modell.
    end note
```

---

## 3. Abgrenzung & Verantwortlichkeiten
- **KiJuP-online:** Juristische Wissensquelle (Normen, Referenzen, Deep-Links). Kein transaktionales Primärsystem. Kein Schreiben von Falldaten. Nur lesende Nutzung und Speicherung von Referenzen/Metadaten.
- **Lokale Fachanwendungen:** Operative Wahrheit für Fälle, Dokumente, Status, Fristen, Stammdaten. Schreiben/Ändern ausschließlich hier.
- **Integration Layer:** Erzwingt Datenminimierung, Mapping aufs kanonische Modell, Audit, Fehlerbehandlung und Sichtbarmachung der Quelle.

---

## 4. Integrationsprinzipien
- **Minimaldatenprinzip:** Nur fallrelevante Metadaten und Referenz-IDs übertragen; keine sensiblen Falldetails an KiJuP-online.
- **Read-Only gegen KiJuP:** Keine Schreiboperationen, keine Annahme über bestehende Write-APIs.
- **Trennung von Operativ & Referenz:** Operative Aktionen (Genehmigen, Status setzen) bleiben in lokalen Systemen; KiJuP liefert nur belegte Hinweise.
- **Explizite Provenienz:** Jede juristische Aussage trägt Quelle, Zeitstempel, Version/Stand, Bearbeiter/System.
- **Fail-safe Defaults:** Bei Unsicherheit oder fehlender Antwort aus Referenzquelle bleibt operativer Prozess unverändert; Empfehlung wird als optional markiert.
- **Zero-Trust & Least Privilege:** Adapter mit eigenen Service-Identitäten, eng gefasste Scopes, Härtung (Rate Limit, Circuit Breaker).

---

## 5. Datenschutz- & Sicherheitsprinzipien
- **Rechtsgrundlage & Zweckbindung:** Abbildung pro Vorgang; Referenzen nur im Rahmen der rechtlichen Beratung/Begründung gespeichert.
- **Datenminimierung:** Keine Übermittlung von Klarnamen, Gesundheits- oder Sozialdaten an KiJuP-online. Nur Schlüssel: CaseReference-ID, Norm- oder Themen-Stichwort, optional anonymisierte Fakten.
- **Speicherbegrenzung:** Referenz-Cache mit TTL/Versionierung; Löschkonzept gekoppelt an Fallabschluss.
- **Transport & At-Rest:** TLS 1.3, Signierung der Audit-Events, Verschlüsselung im Datentresor.
- **Zugriff & Rollen:** Getrennte Rollen für Recherche vs. Fallbearbeitung; alle Abrufe protokolliert.
- **Security Controls:** WAF/API-Gateway vor dem Integration Layer, Input-Validierung pro Adapter, strukturierte Fehlercodes (keine Leaks).

---

## 6. Vertrauens- & Transparenzprinzipien
- Jede Empfehlung zeigt **Quelle, Fundstelle, Stand/Version, Abrufzeit** und den ausführenden Actor (Mensch/System).
- Deep-Links führen zurück zu KiJuP-online, damit Sachbearbeitung oder Bürger die Aussage prüfen kann.
- UI-Hinweis: „Falldaten bleiben im führenden Fachverfahren; juristische Hinweise sind referenziert und nachvollziehbar.“
- Änderungsverfolgung: Jede Aktualisierung einer Referenz erzeugt neues Audit-Event; alte Version bleibt lesbar.

---

## 7. Nachvollziehbarkeit / Audit Trail
- **Pflichtfelder je Event:** `actor_id`, `actor_type (human/system)`, `action`, `case_reference`, `source_system`, `source_reference (URI/Norm)`, `timestamp`, `hash_of_payload`, `outcome`.
- **Aufbewahrung:** Referenz-Audit 10 Jahre (orientiert an Verwaltungsakten), technisch append-only; kryptographische Verkettung empfohlen.
- **Korrelation:** `correlation_id` pro Fallinteraktion; ermöglicht Replay/Analyse.

---

## 8. Fehlerbehandlung / Retry / manuelle Nachbearbeitung
- **Retries:** Exponentiell (max. 3 Versuche) bei Netzwerk-/Timeout; kein Retry bei 4xx (fachlicher Fehler).
- **Dead-Letter Queue:** Nicht zustellbare Jobs werden markiert und einem manuellen Workbasket zugeführt (Sachbearbeitung).
- **Fallback:** Wenn KiJuP nicht erreichbar, Prozess läuft weiter ohne Referenz; UI markiert Hinweis als „Referenz derzeit nicht verfügbar“.
- **Validierung:** Eingaben an Fachadapter werden vor Aufruf schemageprüft; Mapping-Fehler erzeugen sofort Warnung + Audit-Event.

---

## 9. Synchronisationsmodell
- **KiJuP-online:** Pull-basiert, read-only. Falls keine API vorhanden: geplante Importe (z. B. wöchentliche Kuratierung von Normen/Kommentaren) in einen signierten, versionierten Referenz-Cache.
- **Lokale Fachanwendungen:** Event- oder Job-basiert. Fälle werden per Adapter gemeldet (Status, Fristen, neue Dokumente); Integration Layer schreibt keine Falldaten zurück, sondern liefert Referenzhinweise und Deep-Links an das führende System.
- **Kanonisches Modell:** Mapping von lokalen Feldern (z. B. `aktenzeichen`, `fall_typ`, `fristen`) auf `CaseReference`, `ExternalSystemLink`, `DataProvenance`.

---

## 10. Zielarchitektur – Bausteine
- **Integration Layer / Adapter Layer:** Standardisierte Ports; Validierung, Mapping, Circuit Breaking, Observability.
- **Fachverfahrens-Adapter:** Kommunale Fachverfahren (HzE, Unterhaltsvorschuss etc.), behördenspezifische Protokolle (REST/SOAP/File/MQ). Schreiben nur ins lokale System.
- **Legal Reference Provider (KiJuP):** Read-only Provider; liefert `LegalReference` + `CitationSource`; kann intern gegen Referenz-Cache laufen.
- **Canonical Data Model:** `CaseReference`, `ExternalSystemLink`, `LegalReference`, `CitationSource`, `AuditEntry`, `DataProvenance`.
- **Audit / Provenance:** Append-only Log; signiert; UI- und API-abrufbar.
- **Eventing / Queue (optional):** Für asynchrone Abrufe, Retry, Dead-Letter, Entkopplung von Fachverfahren und Referenzdienst.
- **Code-Skelett:** Go-Interfaces & Typen unter `architecture/kijup-integration/` für Ports und kanonische Entities.

---

## 11. Schnittstellenbeschreibung (konzeptionell)

**Daten aus lokalen Fachanwendungen (Read):**
- Fall-Identifikator (intern), Vorgangstyp, Status, relevante Fristen.
- Kontext für Recherche (Stichworte, Rechtsgebiet) – ohne sensible Falldetails.
- Optional: anonymisierte Fakten (Kategorie, Altersgruppe, keine Klarnamen/IDs).

**Daten zurück an lokale Fachanwendungen (Write):**
- Juristische Hinweise als Referenzobjekte (`LegalReference` + `CitationSource`).
- Deep-Links auf KiJuP-Fundstellen, Version/Stand, Abrufzeit.
- Nachvollziehbarkeits-Metadaten: `DataProvenance`, `AuditEntry` (ohne Klartextinhalte).

**Daten, die KiJuP-online NICHT erhalten soll:**
- Personenbezogene Stammdaten, Gesundheits-/Sozialdaten, vollständige Fallakte, Dokumente, Zahlungsdaten.

**Zu speichernde Metadaten je Referenz:**
- Quelle (URL/URI), Norm/Fundstelle, Kurzbeschreibung, Version/Stand, Hash der Quelle, Abrufzeit, Actor, Gültigkeitsfenster, Mapping auf betroffene Fälle/Fristen.

---

## 12. Risiken / Annahmen / offene Punkte
- **KiJuP-API unklar:** Bis zur Spezifikation nur read-only via Referenz-Cache / manuelle Kuratierung planen; keine Aussage zu Schreib- oder Fall-APIs.
- **Lokale Fachverfahren heterogen:** Pro Adapter müssen Datenmodelle konkretisiert werden; hier nur Kanonisches Modell skizziert.
- **Rechtsgrundlagen je Nutzungskontext:** Fachliche Freigabe je Behörde nötig (insb. bei Minderjährigen/HzE).
- **Betriebsverantwortung:** Klären, wer Referenz-Cache kuratiert/signiert und wie Updates versioniert werden.
- **Performance:** Referenzabrufe dürfen operative Transaktionen nicht blockieren; asynchron bevorzugt.

---

**Nächste Schritte (vorgeschlagen):**
1) Steckbrief pro lokales Fachverfahren (Datenfelder, Protokoll, Betreiber).  
2) Proof-of-Concept: KiJuP-Referenz-Cache mit 5 Normbeispielen + Audit-Log-Durchstich.  
3) UI-Prototyp: Anzeige von Referenzen inkl. Quelle/Stand im Fall-Frontend (Lesemodus).
