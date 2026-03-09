# ADR 2026-03-09: KiJuP-online als juristische Referenzquelle, lokale Fachverfahren als führende Systeme

- **Status:** Accepted  
- **Datum:** 09.03.2026  
- **Entscheider:** Architekturteam Open State (Integrationen)

## Kontext
- KiJuP-online dient als juristische Wissens-/Referenzquelle (Normen, Fundstellen, Kommentare).
- Lokale Fachverfahren führen die operative Fallbearbeitung (Fälle, Dokumente, Fristen, Status).
- Unklar, ob KiJuP-online eine offizielle API anbietet; keine Annahme über Schreibfähigkeit zulässig.

## Entscheidung
- KiJuP-online wird ausschließlich **read-only** angebunden. Es werden nur Referenzen (Quellen, Deep-Links, Normstände) abgefragt bzw. aus kuratierten Exports gelesen.
- Lokale Fachanwendungen bleiben **Single Source of Truth** für alle operativen Daten und Statusänderungen.
- Integration Layer erzwingt Datenminimierung, Audit-Trail und explizite Provenienz. Sensible Falldaten werden nicht an KiJuP übertragen.

## Konsequenzen
**Positiv**
- Klare Verantwortlichkeiten und Datenschutz-Konformität (DSGVO/SGB/DSAnpUG).
- Geringes Risiko für Inkonsistenzen, da operative Daten nicht dupliziert werden.
- Transparente Nachvollziehbarkeit von juristischen Empfehlungen (Quelle, Stand, Actor).

**Negativ / Trade-offs**
- Kein automatisches Schließen fachlicher Lücken durch KiJuP (weil kein Schreiben).
- Zusätzlicher Pflegeaufwand für Referenz-Cache/Kuratierung, falls KiJuP keine API liefert.
- Asynchrone Prozesse nötig, damit fehlende Referenzen operative Vorgänge nicht blockieren.

## Nächste Schritte
1) Schnittstellen-Sondierung mit KiJuP-Betreiber: Gibt es eine stabile Read-API oder Export-Formate?  
2) Referenz-Cache-Prototyp mit Signierung und Versionierung aufbauen.  
3) Adapter-Steckbrief je lokales Fachverfahren (Transport, Auth, Datenfelder) erstellen und gegen das kanonische Modell mappen.
