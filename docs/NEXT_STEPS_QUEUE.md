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
| Q-403 | cross | BUILD_STATE: E2E-Zähler und letzte Prüfung auf aktuellen Stand (316 / ca5ccf9-Ära) bringen | DOCS | S | Q-400 | OFFEN |

### Cross-Domain Demo-Wert

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-410 | cross | Landing: pro Domänen-Karte optionaler Sekundärlink „Steuerung/Hinweise“ wo sinnvoll (Kita→Lagebild intern kennzeichnen; AV/UG Hinweise) — ohne Developer-Jargon | DEMO | S | – | DONE |
| Q-411 | cross | `/stories`: pro Story mit Screen „Zur Demo“-CTA (Route aus storyRegistry) | DEMO | M | – | OFFEN |
| Q-412 | kita | Kita-Layouts: DemoSessionBar wenn Session-State (Meldefreigabe o. Ä.) aktiv — Parität AV/UG Reset-Hinweis | DEMO | M | Q-402 | OFFEN |

### Domänen-Qualität (nicht Micro-CTA)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-420 | av | A11y: Skip-Link + `main`-Landmark im Fall-Layout (bzw. Root-Layout), E2E-Smoke Fokus | DEMO | S | – | DONE |
| Q-421 | ug | E2E: nach RQ+Upload+BG Ruhezustand/Übersicht ohne hängende Action-Banner (Regression) | DEMO | S | – | OFFEN |
| Q-422 | kita | E2E: öffentlicher Bericht Filter Planungsraum + CSV-Download-Button erreichbar/labeled | DEMO | S | Q-401 | OFFEN |

### Docs & Andockung

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-430 | cross | Domain-README-Schablone (Problem, Demo-Routen, Stories, API, Grenzen) auf alle 3 Domains anwenden | DOCS | M | – | OFFEN |
| Q-431 | kita | Kita-Domain-README: Related-Links Jugendamt-Module + KiJuP (13/14) ohne Inhaltsduplikat | DOCS | S | Q-430 | OFFEN |
| Q-432 | cross | TRACEABILITY_MATRIX: auf SSOT `storyRegistry.ts` ausrichten (generieren oder schlanker Stub + Verweis) | DOCS | M | – | OFFEN |

---

## Kürzlicher DONE-Tail (letzte ~10)

| ID | Kurz | Status |
|----|------|--------|
| Q-420 | A11y Skip-Link + main-Landmark (Root/Domains) | DONE |
| Q-410 | Landing Sekundärlinks Hinweise/Lagebild intern | DONE |
| Q-402 | Kita Meldekette E2E Freigabe→Lagebild (DEC-012) | DONE |
| Q-401 | Kita E2E-Smoke Kernrouten + `test:e2e:kita` | DONE |
| Q-400 | Autonomer Multi-Domain-Loop + Workflow | DONE |
| Q-224 | UG Hinweise UNTERLAGE data-next-dok-id | DONE |
| Q-307 | Anti-Growth DEC-013 | DONE |
| Q-306 | docs/README + Root straffen | DONE |
| Q-305 | storyRegistry SSOT | DONE |
| Q-304 | Deploy-Docs SSOT | DONE |

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
