# NEXT_STEPS_QUEUE.md – Priorisierte Weiterentwicklungs-Queue

Jeder Schritt ist einzeln umsetzbar.
Abhängigkeiten sind notiert.
Status: `OFFEN` | `IN_ARBEIT` | `DONE` | `BLOCKIERT`

Befehl: „Entwickle weiter" → obersten `OFFEN`-Eintrag nehmen und umsetzen.  
**Neue Session:** zuerst [`docs/delivery/SESSION_HANDOFF.md`](delivery/SESSION_HANDOFF.md).  
Autonomer Loop: [`docs/delivery/AUTONOMOUS_LOOP.md`](delivery/AUTONOMOUS_LOOP.md) · State: [`loop-state.md`](delivery/loop-state.md)

**DONE-Historie:** [`queue-archive/`](delivery/queue-archive/) · [`DONE_Q001-Q300.md`](delivery/queue-archive/DONE_Q001-Q300.md) · [`DONE_Q400-Q542.md`](delivery/queue-archive/DONE_Q400-Q542.md)

---

## Legende

- **Typ:** `DEMO` = UI/Code in demo/ | `DOCS` = Dokumentation | `ARCH` = Architektur | `CHORE` = Infrastruktur
- **Aufwand:** S (< 1h) / M (1–3h) / L (3h+)
- **Domäne:** `av` | `ug` | `kita` | `cross` (für Loop-Rotation)
- **Abhängigkeit:** welche Schritt-ID muss vorher DONE sein

---

## Priorisierungslogik

1. Technische Korrektheit und CI-Glaubwürdigkeit vor Kosmetik  
2. Sichtbarer Produktwert vor reiner Test-Spiegelung  
3. Anti-Growth (DEC-013): **kein** weiteres Skip-Link-/CTA-Routen-Matrix-Füllen ohne echte Produktlücke  
4. Delivery schlank halten (Queue-Archiv, BUILD_STATE Ist)  
5. Autonomer Loop: Katalog nur mit erlaubten Spuren (siehe AUTONOMOUS_LOOP §3)

---

## Queue (aktiv)

### Session-Handoff & Delivery (nächste Phase)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-600 | cross | Session-Handoff: `SESSION_HANDOFF.md`, Queue Q-600+, Katalog-Härtung, README-Verweis | CHORE | S | – | DONE |
| Q-601 | cross | DONE-Blöcke Q-400–Q-542 aus aktiver Queue nach `docs/delivery/queue-archive/DONE_Q400-Q542.md` auslagern; aktive Queue nur OFFEN + kurzer Tail | DOCS | M | Q-600 | DONE |
| Q-602 | cross | BUILD_STATE: Delivery-Zeilen und E2E-Zähler auf **378** / Push-Stand `a5a9a3e` synchronisieren; veraltete „Inventory 333“-Lücke entfernen | DOCS | S | Q-600 | DONE |
| Q-603 | chore | `demo/.gitignore`: `.next-ci-watcher/`, `playwright-report/`, `test-results/` (Untracked-Rauschen) | CHORE | S | – | DONE |
| Q-604 | cross | AUTONOMOUS_LOOP §3: verbotene Auffüll-Muster (Skip-Link-Routen-Matrix, CTA-Parität ohne Lücke) explizit; erlaubte Katalog-Beispiele aktualisieren | DOCS | S | Q-600 | DONE |

### Produkt & Nachvollziehbarkeit

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-610 | cross | Story-Registry: Status/AK gegen Demo-Realität prüfen; wo E2E+Screens vollständig → `ABGESCHLOSSEN` oder ehrlich `DEMONSTRIERBAR` belassen (kein Fake-Upgrade) | DEMO | M | Q-602 | DONE |
| Q-611 | cross | `VERFAHRENSFAIRNESS_IN_DER_DEMO.md` an aktuelle AV/UG-Signale, CTAs und Session-Verhalten anbinden (nur Delta, keine Doppel-Doku) | DOCS | M | – | DONE |
| Q-612 | cross | `/stories` + Registry: fehlende oder veraltete `route`-Felder und „Zur Demo“-Stichproben dokumentieren/fixen | DEMO | S | Q-610 | DONE |

### Domänen – ein Hebel (nicht Micro-Parität)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-620 | av | Produktlücke wählen und schließen: z. B. Leerzustand/Ruhezustand-Text nach allen Session-Aktionen einmal zentral konsistent (nur wenn noch uneinheitlich) **oder** E2E-Lücke an US-AV-006 Widerspruch – vorher im Code prüfen, nicht spekulieren | DEMO | M | – | DONE |
| Q-621 | ug | Analog AV: eine echte UG-Lücke (Ruhezustand/BG/Steuernummer-Hilfstext) **oder** Docs-Lücke Domain-README – Code-first, max. ein Paket | DEMO | M | – | DONE |
| Q-622 | kita | Meldelücke/Methodik: ein Nutzer-sichtbarer Hebel (Hinweis-Text, Leerzustand nach Session-Freigabe) **oder** fehlender E2E nur bei realem Regressionsrisiko – kein neues Skip-Link-Paket | DEMO | M | – | DONE |

### Architektur light (optional)

| ID | Domäne | Schritt | Typ | Aufwand | Abhängigkeit | Status |
|----|--------|---------|-----|---------|--------------|--------|
| Q-630 | arch | arc42 oder `05_Systemarchitektur`: Demo-Session-State + Fairness-Regeln als Ist-Hinweis (1 Abschnitt, Verweis auf Code) – nur wenn veraltet | ARCH | M | Q-611 | OFFEN |

---

## Abgeschlossene Wellen (Kurzverweis, nicht Arbeitsliste)

| Welle | IDs | Inhalt | Archiv |
|-------|-----|--------|--------|
| Prio-0 Struktur | Q-299–Q-307 | Refactoring-Plan, Archive, Queue-Split, Anti-Growth | [`DONE_Q001-Q300`](delivery/queue-archive/DONE_Q001-Q300.md) |
| Autonomie + a11y/E2E | Q-400–Q-542 | Loop, Kita-E2E, Skip-Links, Labels, Stories-CTA, Themes | [`DONE_Q400-Q542`](delivery/queue-archive/DONE_Q400-Q542.md) |
| Feature-Parität (alt) | bis Q-224 | AV/UG Countdown/CTA | queue-archive (in Q-001–Q-300) |
| Session-Handoff | Q-600–Q-604 | Handoff, Archiv, E2E-Sync, gitignore, Katalog | aktive Queue / DONE-Tail |

---

## Kürzlicher DONE-Tail (letzte ~10)

| ID | Kurz | Status |
|----|------|--------|
| Q-622 | Kita Meldelücke: Ruhezustand nach Freigabe + Methodik im Meldeeingang | DONE |
| Q-621 | UG Ruhezustand-Banner nach RQ/Unterlagen (BG- bzw. Steuernummer-CTA) | DONE |
| Q-620 | AV US-AV-006: Widerspruch session-lokal (Quittung, Verlauf, Reset) statt alert | DONE |
| Q-612 | Stories Zur-Demo: alle routes + Hash-Tiefenlinks KJ-006/010 + E2E AV/UG/KJ | DONE |
| Q-611 | VERFAHRENSFAIRNESS_IN_DER_DEMO: AV+UG Signale/CTAs/Session Ist | DONE |
| Q-610 | Story-Registry Status-Audit: 16× ABGESCHLOSSEN, 8× DEMONSTRIERBAR (offen AK) | DONE |
| Q-602 | BUILD_STATE E2E-Baseline 378 / `a5a9a3e` | DONE |
| Q-601 | Queue-Archiv Q-400–Q-542 auslagern | DONE |
| Q-600 | Session-Handoff + Queue-Phase Q-600+ | DONE |
| Q-604 | Loop-Katalog Anti-Skip-Link-Spam | DONE |

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
| a11y/E2E-Welle Q-400–Q-542 | ✓ archiviert |

---

## Archiv-Pflege

- DONE-Tail ≤ ~10; Rest → `docs/delivery/queue-archive/`
- Queue = Arbeitsliste (Anti-Growth §4 / DEC-013)
