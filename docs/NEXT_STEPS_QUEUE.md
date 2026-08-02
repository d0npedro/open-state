# NEXT_STEPS_QUEUE.md – Priorisierte Weiterentwicklungs-Queue

Jeder Schritt ist einzeln umsetzbar.
Abhängigkeiten sind notiert.
Status: `OFFEN` | `IN_ARBEIT` | `DONE` | `BLOCKIERT`

Befehl: „Entwickle weiter" → obersten `OFFEN`-Eintrag nehmen und umsetzen.

**DONE-Historie (Q-001–Q-300):** [`docs/delivery/queue-archive/DONE_Q001-Q300.md`](delivery/queue-archive/DONE_Q001-Q300.md)  
**Archiv-Index:** [`docs/delivery/queue-archive/README.md`](delivery/queue-archive/README.md)

---

## Legende

- **Typ:** `DEMO` = UI/Code in demo/ | `DOCS` = Dokumentation | `ARCH` = Architektur | `CHORE` = Infrastruktur
- **Aufwand:** S (< 1h) / M (1–3h) / L (3h+)
- **Abhängigkeit:** welche Schritt-ID muss vorher DONE sein

---

## Priorisierungslogik

1. **Priorität 0 (strukturelles Refactoring)** vor Feature-Feinschliff, solange DEC-011 aktiv
2. Sichtbarer Produktwert vor Dokumentationspflege
3. Klickbare Demo vor zusätzlicher Story-Verwaltung
4. Technische Korrektheit und Build-Stabilität vor neuen Seitengleisen

---

## Queue (aktiv)

### Priorität 0 – Strukturelles Repo-Refactoring (Navigation & Delivery)

Kein Feature-Zuwachs in dieser Spur. Ziel: kognitive Last senken, Historie archivieren,
Delivery-Dateien wieder zu Arbeitswerkzeugen machen.
Plan: [`docs/REPO_REFACTORING_PLAN.md`](REPO_REFACTORING_PLAN.md).

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-299 | Fundierte Refactoring-Analyse + priorisierter Plan (`docs/REPO_REFACTORING_PLAN.md`) | DOCS | M | – | DONE |
| Q-300 | Phase 0.1: `archive/rewrites/` + Root-`REPO_*` dorthin; README-Hinweis | DOCS | S | Q-299 | DONE |
| Q-301 | Phase 0.2: `NEXT_STEPS_QUEUE.md` splitten — aktive Queue vs. `docs/delivery/queue-archive/` | DOCS | M | Q-300 | DONE |
| Q-302 | Phase 0.3: `BUILD_STATE.md` auf Ist-Stand härten (kurze Routen-/Logik-Tabellen, keine Q-xxx-Chronik, nur echte Lücken) | DOCS | M | Q-301 | OFFEN |
| Q-303 | Phase 0.4: Domain-Journals rotieren (aktiv ≤15 Iterationen; Rest → `archive/journals/`) | DOCS | S | Q-300 | OFFEN |
| Q-304 | Phase 0.5: Deploy-Docs auf eine Führungsdatei zusammenführen; Stub-Verweise für die übrigen | DOCS | S | Q-300 | OFFEN |
| Q-305 | Phase 1.1: Story-Registry Single Source (`storyRegistry.ts` führend; JSON generieren oder Docs entkoppeln) | CHORE | M | Q-302 | OFFEN |
| Q-306 | Phase 2: `docs/README.md` Map of Content + Root-README straffen | DOCS | M | Q-302 | OFFEN |
| Q-307 | Phase 3–4: Anti-Growth-Regeln in AGENTS.md, DELIVERY_SYSTEM.md, DECISION_LOG verankern | DOCS | S | Q-302 | OFFEN |

---

### Feature-Backlog (pausiert unter DEC-011)

Nach Abschluss von Priorität 0 bzw. bei expliziter Feature-Freigabe fortsetzen.
Vollständige DONE-Feature-Historie: → [queue-archive](delivery/queue-archive/DONE_Q001-Q300.md).

| ID | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|---------|-----|---------|--------------|--------|
| Q-224 | UG Hinweise: UNTERLAGE-CTA `data-next-dok-id` + Hint mit nächster offener Bezeichnung (US-UG-003, Parität AV Hinweise Q-222) | DEMO | S | Q-219 | OFFEN |

---

## Kürzlicher DONE-Tail (letzte ~10)

Nur Orientierung; Details und ältere IDs → [Archiv](delivery/queue-archive/DONE_Q001-Q300.md).

| ID | Kurz | Status |
|----|------|--------|
| Q-301 | Queue-Split aktiv vs. `docs/delivery/queue-archive/` | DONE |
| Q-300 | Rewrite-Summaries → `archive/rewrites/` | DONE |
| Q-299 | Refactoring-Plan + Priorität-0-Queue | DONE |
| Q-223 | AV Übersicht Fairness UNTERLAGE-CTA live nächste Unterlage | DONE |
| Q-222 | AV Hinweise UNTERLAGE-CTA live nächste Unterlage | DONE |
| Q-221 | UG Übersicht Fairness UNTERLAGE-Countdown-Chip | DONE |
| Q-220 | UG Übersicht Fairness RQ-Countdown-Chip | DONE |
| Q-219 | UG Hinweise UNTERLAGE-Countdown-Chip | DONE |
| Q-218 | UG Hinweise RQ-Countdown-Chip | DONE |
| Q-217 | AV Übersicht Fairness UNTERLAGE-Countdown-Chip | DONE |

---

## Stabile Bausteine (kein Handlungsbedarf)

| Baustein | Status |
|---------|--------|
| Demo-Routen AV `/fall/*`, UG `/gruendung/*`, Kita `/kita/*` | ✓ klickbar |
| `/feedback` → GitHub Issues | ✓ |
| BuildInfo-Footer (Env / Version / Commit-SHA) | ✓ |
| Vercel-Deployment aus `demo/` | ✓ |
| Theme-Architektur (4 Themes, Density) | ✓ |
| Fairness-Regeln AV + UG session-sensitiv | ✓ |
| Story-Registry AV + UG + KJ auf `/stories` | ✓ |

---

## Archiv-Pflege

- Neue DONE-Einträge: in aktiver Queue Status → `DONE`; Tail auf ~10 halten.
- Bei Meilenstein (z. B. Phase 0 komplett): überschüssige DONE-Zeilen nach `docs/delivery/queue-archive/` auslagern.
- Queue bleibt Arbeitsliste, kein Changelog (Anti-Growth §4).
