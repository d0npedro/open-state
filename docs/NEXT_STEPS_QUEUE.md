# NEXT_STEPS_QUEUE.md – Priorisierte Weiterentwicklungs-Queue

Jeder Schritt ist einzeln umsetzbar.
Abhängigkeiten sind notiert.
Status: `OFFEN` | `IN_ARBEIT` | `DONE` | `BLOCKIERT`

Befehl: „Entwickle weiter" → obersten `OFFEN`-Eintrag nehmen und umsetzen.  
Autonomer Multi-Domain-Loop: [`docs/delivery/AUTONOMOUS_LOOP.md`](delivery/AUTONOMOUS_LOOP.md) · State: [`loop-state.md`](delivery/loop-state.md)

**DONE-Historie (Q-001–Q-300):** [`docs/delivery/queue-archive/DONE_Q001-Q300.md`](delivery/queue-archive/DONE_Q001-Q300.md)  
**Archiv-Index:** [`docs/delivery/queue-archive/README.md`](delivery/queue-archive/README.md)

---

## Legende

- **Typ:** `DEMO` = UI/Code in demo/ | `DOCS` = Dokumentation | `ARCH` = Architektur | `CHORE` = Infrastruktur
- **Aufwand:** S (< 1h) / M (1–3h) / L (3h+)
- **Domäne:** `av` | `ug` | `kita` | `cross` (für Loop-Rotation)
- **Abhängigkeit:** welche Schritt-ID muss vorher DONE sein

---

## Priorisierungslogik

1. Technische Korrektheit / E2E-Lücken vor Kosmetik
2. Sichtbarer Produktwert vor reiner Dokumentationspflege
3. Domänen-Rotation (loop-state): Lücken in untertesteten Bereichen (aktuell Kita-E2E) bevorzugen
4. Anti-Growth (DEC-013): kein Micro-Feinschliff nach DEMO-stabil; Queue/BUILD_STATE schlank
5. Autonomer Loop darf Queue aus Katalog auffüllen (max. 3), wenn leer — siehe AUTONOMOUS_LOOP.md

---

## Queue (aktiv)

### Autonomie-Betrieb & Qualität

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-400 | cross | Autonomer Multi-Domain-Loop: `AUTONOMOUS_LOOP.md`, `loop-state.md`, Queue-Katalog, Workflow `.grok/workflows/autonomous-develop.rhai` | CHORE | M | – | DONE |
| Q-401 | kita | E2E-Smoke Kita: Landing/Transparenz, Lagebild, Einrichtung, Tagesstand — Kernrouten erreichbar, h1, DEC-004-Hinweis wo relevant | DEMO | M | Q-400 | DONE |
| Q-402 | kita | E2E Meldekette: Session-Freigabe Meldung → Meldeeingang Lagebild sichtbar (kein page.goto nach Interaktion; Client-Nav) | DEMO | M | Q-401 | DONE |
| Q-403 | cross | BUILD_STATE: E2E-Zähler und letzte Prüfung auf aktuellen Stand (316 / ca5ccf9-Ära) bringen | DOCS | S | Q-400 | DONE |

### Cross-Domain Demo-Wert

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-410 | cross | Landing: pro Domänen-Karte optionaler Sekundärlink „Steuerung/Hinweise“ wo sinnvoll (Kita→Lagebild intern kennzeichnen; AV/UG Hinweise) — ohne Developer-Jargon | DEMO | S | – | DONE |
| Q-411 | cross | `/stories`: pro Story mit Screen „Zur Demo“-CTA (Route aus storyRegistry) | DEMO | M | – | DONE |
| Q-412 | kita | Kita-Layouts: DemoSessionBar wenn Session-State (Meldefreigabe o. Ä.) aktiv — Parität AV/UG Reset-Hinweis | DEMO | M | Q-402 | DONE |

### Domänen-Qualität (nicht Micro-CTA)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-420 | av | A11y: Skip-Link + `main`-Landmark im Fall-Layout (bzw. Root-Layout), E2E-Smoke Fokus | DEMO | S | – | DONE |
| Q-421 | ug | E2E: nach RQ+Upload+BG Ruhezustand/Übersicht ohne hängende Action-Banner (Regression) | DEMO | S | – | DONE |
| Q-422 | kita | E2E: öffentlicher Bericht Filter Planungsraum + CSV-Download-Button erreichbar/labeled | DEMO | S | Q-401 | DONE |

### Docs & Andockung

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-430 | cross | Domain-README-Schablone (Problem, Demo-Routen, Stories, API, Grenzen) auf alle 3 Domains anwenden | DOCS | M | – | DONE |
| Q-431 | kita | Kita-Domain-README: Related-Links Jugendamt-Module + KiJuP (13/14) ohne Inhaltsduplikat | DOCS | S | Q-430 | DONE |
| Q-432 | cross | TRACEABILITY_MATRIX: auf SSOT `storyRegistry.ts` ausrichten (generieren oder schlanker Stub + Verweis) | DOCS | M | – | DONE |

### Loop-Katalog (nach Queue-Leere, max. 3)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-440 | av | E2E: Fairness-Leerzustand nach Erledigung offener Aktionen (keine hängenden Signale; Session-konsistent, DEC-012) | DEMO | M | Q-420 | DONE |
| Q-441 | ug | E2E: Behörden-BG-Happy-Path (Markierung/Flow ohne page.goto nach Interaktion) | DEMO | M | Q-421 | DONE |
| Q-442 | kita | E2E: Session-Reset über DemoSessionBar nach Meldefreigabe (State weg, Lagebild ohne freigegebene Session-Meldung) | DEMO | S | Q-412 | DONE |

### Loop-Katalog (Auffüllung nach Q-442)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-450 | cross | E2E Landing: Domänen-Karten + Sekundärlinks Hinweise/Lagebild erreichbar (Deep-Link-Smoke) | DEMO | S | Q-410 | DONE |
| Q-451 | av | E2E Skip-Link: Fokus auf `#main-content` / `main` nach Tastatur-Aktivierung (Root/Fall) | DEMO | S | Q-420 | DONE |
| Q-452 | ug | E2E a11y: Behördenkarten und BG-Demo-Button haben zugängliche Namen/Labels | DEMO | S | Q-441 | DONE |

### Loop-Katalog (Auffüllung nach Q-452)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-460 | kita | E2E a11y: Lagebild Druck/CSV-Buttons mit zugänglichem Namen (labeled) | DEMO | S | Q-422 | DONE |
| Q-461 | cross | E2E Skip-Link auf `/stories` und `/feedback` (main-Fokus) | DEMO | S | Q-451 | DONE |
| Q-462 | av | E2E: Session-Reset DemoSessionBar nach RQ-Antwort leert Fairness-RQ-Signal | DEMO | S | Q-440 | OFFEN |

---

## Kürzlicher DONE-Tail (letzte ~10)

| ID | Kurz | Status |
|----|------|--------|
| Q-461 | Skip-Link /stories und /feedback E2E | DONE |
| Q-460 | Kita Lagebild Druck/CSV a11y Labels | DONE |
| Q-452 | UG a11y Behördenkarten + BG-Button Labels | DONE |
| Q-451 | Skip-Link Fokus Root/Fall/Hinweise E2E | DONE |
| Q-450 | Landing Deep-Link-Smoke Primär+Sekundär | DONE |
| Q-442 | Kita E2E Session-Reset DemoSessionBar Lagebild | DONE |
| Q-441 | UG E2E BG-Happy-Path Hinweise→Markierung | DONE |
| Q-440 | AV E2E Fairness-Leerzustand nach Aktionen | DONE |
| Q-432 | TRACEABILITY_MATRIX Stub + SSOT storyRegistry | DONE |
| Q-431 | Kita README Related-Links 13/14 + ADR KiJuP | DONE |

---

## Stabile Bausteine (kein Handlungsbedarf)

| Baustein | Status |
|---------|--------|
| Demo-Routen AV `/fall/*`, UG `/gruendung/*`, Kita `/kita/*` | ✓ klickbar, DEMO-stabil Kern |
| Fairness AV + UG session-sensitiv | ✓ |
| Story-Registry SSOT + `/stories` | ✓ |
| Theme-System | ✓ |
| Build/Deploy demo/ | ✓ |
| Strukturelles Refactoring Prio 0 | ✓ Q-299–307 |

---

## Archiv-Pflege

- DONE-Tail ≤ ~10; Rest → `docs/delivery/queue-archive/`
- Queue = Arbeitsliste (Anti-Growth §4 / DEC-013)
