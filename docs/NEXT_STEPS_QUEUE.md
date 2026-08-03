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
| Q-462 | av | E2E: Session-Reset DemoSessionBar nach RQ-Antwort leert Fairness-RQ-Signal | DEMO | S | Q-440 | DONE |

### Loop-Katalog (Auffüllung nach Q-462)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-470 | ug | E2E: Session-Reset DemoSessionBar nach RQ-Antwort stellt Fairness-RQ-Signal wieder her (Parität Q-462) | DEMO | S | Q-441 | DONE |
| Q-471 | kita | E2E Skip-Link: Fokus auf `main#main-content` für Kita-Kernrouten (`/kita`, `/kita/lagebild`) | DEMO | S | Q-401 | DONE |
| Q-472 | ug | E2E Skip-Link: Fokus `main#main-content` für `/gruendung` und `/gruendung/hinweise` (Parität Q-451) | DEMO | S | Q-451 | DONE |

### Loop-Katalog (Auffüllung nach Q-472)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-480 | kita | a11y + E2E: Einrichtung Belegungsstand Druck/CSV-Buttons mit zugänglichem Namen (Parität Lagebild Q-460) | DEMO | S | Q-401 | DONE |
| Q-481 | kita | E2E-Smoke: Bedarfsplanung, Gremienvorlage, Monatsbericht, Meldung – h1/Kernroute erreichbar | DEMO | S | Q-401 | DONE |
| Q-482 | av | E2E Keyboard-Smoke: Fall-Tabs per Tastatur erreichbar und aktivierbar (Fokus sichtbar) | DEMO | S | Q-420 | DONE |

### Loop-Katalog (Auffüllung nach Q-482)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-490 | ug | a11y + E2E: UG-Tabs `role=tablist/tab` + Keyboard-Smoke Enter-Navigation (Parität Q-482) | DEMO | S | Q-472 | DONE |
| Q-491 | kita | a11y + E2E: Tagesstand Druck-Button mit zugänglichem Namen (Parität CSV/Einrichtung) | DEMO | S | Q-480 | DONE |
| Q-492 | cross | E2E a11y: ThemeSwitcher hat zugänglichen Namen und ändert `data-theme` | DEMO | S | – | DONE |

### Loop-Katalog (Auffüllung nach Q-492)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-500 | av | E2E: Session-Reset nach RQ+Upload+Termin stellt Tab-Badges und Fairness-Aktions-Signale wieder her (DEC-012) | DEMO | S | Q-440 | DONE |
| Q-501 | cross | E2E: ThemeSwitcher ändert `data-density` + localStorage (Parität Q-492 theme) | DEMO | S | Q-492 | DONE |
| Q-502 | kita | E2E a11y: Bedarfsplanung Druck/CSV-Buttons mit zugänglichem Namen (Parität Lagebild Q-460) | DEMO | S | Q-481 | DONE |

### Loop-Katalog (Auffüllung nach Q-502)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-510 | cross | a11y + E2E: BuildInfo im Footer mit zugänglichem Gruppennamen (Env, Version, Commit) | DEMO | S | – | DONE |
| Q-511 | kita | a11y + E2E: Gremienvorlage Druck/CSV-Buttons mit zugänglichem Namen (Parität Bedarfsplanung Q-502) | DEMO | S | Q-481 | DONE |
| Q-512 | kita | a11y + E2E: Monatsbericht Druck-Button mit zugänglichem Namen (Parität CSV/Tagesstand) | DEMO | S | Q-481 | DONE |

### Loop-Katalog (Auffüllung nach Q-512)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-520 | cross | a11y + E2E: Footer-Nav + Feedback GitHub-Links mit neuem-Tab-Hinweis und korrektem Issue-URL-Muster | DEMO | S | Q-510 | DONE |
| Q-521 | av | E2E Skip-Link: Fokus `main#main-content` für `/fall/hinweise` und `/fall/dokumente` (Parität Q-451) | DEMO | S | Q-451 | DONE |
| Q-522 | kita | a11y + E2E: Monatsmeldung Druck/CSV-Buttons mit zugänglichem Namen (Parität Monatsbericht Q-512) | DEMO | S | Q-481 | OFFEN |

---

## Kürzlicher DONE-Tail (letzte ~10)

| ID | Kurz | Status |
|----|------|--------|
| Q-521 | AV Skip-Link /fall/hinweise und /fall/dokumente | DONE |
| Q-520 | Footer/Feedback externe Links a11y + Issue-URL E2E | DONE |
| Q-512 | Kita Monatsbericht Druck/CSV a11y Labels | DONE |
| Q-511 | Kita Vorlage Druck/CSV a11y Labels | DONE |
| Q-510 | BuildInfo Footer a11y Env/Version/Commit | DONE |
| Q-502 | Kita Bedarfsplanung Druck/CSV a11y Labels | DONE |
| Q-501 | ThemeSwitcher data-density + localStorage os-density | DONE |
| Q-500 | AV Session-Reset nach vollem Ruhezustand stellt Badges/Signale wieder her | DONE |
| Q-492 | ThemeSwitcher a11y + data-theme-Wechsel | DONE |
| Q-491 | Kita Tagesstand Druck/CSV a11y Labels | DONE |

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
