# Autonomer Weiterentwicklungs-Loop (Multi-Domain)

**Zweck:** Ein isolierter Agenten-Fire erledigt **genau eine** sinnvolle Iteration über **alle Demo-Domänen und Querschnitt** — ohne Gesprächskontext, ohne Endlos-Feinschliff, ohne Push.

**Cadence-Empfehlung:** `12m` (genug für lint/build/E2E-Teil + Commit; kürzer riskiert Überlappung).  
**Steuerdateien:** `AGENTS.md`, diese Datei, `loop-state.md`, `NEXT_STEPS_QUEUE.md`, `BUILD_STATE.md`, `DECISION_LOG.md`.  
**Anti-Growth:** DEC-013. **Session/E2E:** DEC-012. **Kein Push** im Loop.

---

## 1. Rotationsmodell

Jeder Fire wählt Arbeit so:

```
1. OFFEN mit Typ-Priorität: CHORE/Build-Brüche > DEMO-Produktlücke > DOCS/ARCH > nie reiner CTA-Paritäts-Mikro
2. Bei mehreren OFFEN gleicher Priorität: Domäne laut loop-state „next_domain“ bevorzugen
3. Queue leer → aus Katalog (§3) 1–3 OFFEN-Einträge erzeugen (IDs fortlaufend Q-4xx/Q-5xx),
   dann den obersten umsetzen
4. Nach DONE: loop-state next_domain weiterschalten (av → ug → kita → cross → av)
```

**Domänen-Schlüssel:** `av` | `ug` | `kita` | `cross`  
**cross** = Landing, Stories-Dashboard, Design-System, Delivery-Docs, arc42-light, a11y-global.

### Was zählt als „sinnvoll“ (erlaubt)

| Erlaubt | Verboten (Anti-Growth) |
|---------|------------------------|
| E2E-Lücken schließen (v. a. Kita) | Countdown-Chip-Parität AV↔UG ohne Produktlücke |
| Session-Integrität, DEC-012-Tests | print-only Meta-Spiegelungen ohne Nutzen |
| Landing/Stories-Navigation | BUILD_STATE-Romane, Root-Summaries |
| Domain-README-Schablone, SSOT-Docs | Neue Top-Level-Ordner ohne DEC |
| A11y (Skip-Link, Landmarks, Kontrast) | Neue Domäne ohne Story+Konzept-Paket |
| Ein klarer UX-Hebel pro Domäne | Mehrere unzusammenhängende Features pro Fire |

### DEMO-stabil (DEC-013)

AV/UG/KJ gelten als **DEMO-stabil** für Kernrouten.  
Nach DEMO-stabil nur: **Bugs**, **E2E-Lücken**, **echte Produktlücken**, **A11y**, **Docs-Andockung** — kein Micro-Feinschliff.

---

## 2. Fire-Ablauf (Pflicht)

1. `git log --oneline -5` · `git status --short`  
   - Fremde uncommittete Änderungen → Status „blocked“ und stoppen  
2. Lesen: `docs/delivery/loop-state.md`, `docs/NEXT_STEPS_QUEUE.md`, `docs/BUILD_STATE.md` (kurz), relevante DEC  
3. Obersten `OFFEN` wählen (Regeln §1); ggf. Katalog auffüllen  
4. `loop-state.md`: `last_domain`, `last_queue_id`, `fires_total` aktualisieren  
5. **Einen** Schritt implementieren (Code und/oder Docs)  
6. Codepfad: `cd demo && npm run lint && npm run build`  
   - Domänen-E2E wenn AV/UG/Kita-UI betroffen:  
     - AV: `npm run test:e2e:av` falls vorhanden, sonst betroffene Specs  
     - UG: `npm run test:e2e:ug` falls vorhanden  
     - Kita/Cross: mindestens betroffene Specs oder `test:e2e:ci` wenn breit  
   - Kein `page.goto()` nach Session-Interaktion in derselben Domäne (DEC-012)  
7. Queue → DONE; BUILD_STATE nur Delta (Kopf + betroffene Zeile); DONE-Tail ≤10  
8. Commit Conventional Commits · **kein `git push`**  
9. Statuszeile melden (Format §5)

---

## 3. Auffüll-Katalog (wenn Queue leer)

Agent legt **max. 3** neue OFFEN-Zeilen an und setzt die erste um.  
IDs: nächste freie ab `Q-450` (oder fortlaufend nach letztem Q-).

| Spur | Beispiel-Schritte (nicht alle auf einmal) |
|------|-------------------------------------------|
| **kita** | E2E Smoke Kernrouten; Meldekette Session→Lagebild; Session-Reset UI; a11y Druck/CSV-Buttons |
| **av** | Keyboard-Smoke; Skip-Link; Fairness-Leerzustand nach allen Aktionen absichern (Test) |
| **ug** | Behörden-BG-Happy-Path E2E; Ruhezustand nach Vollständigkeit; a11y Formular-Labels |
| **cross** | Landing Deep-Links; `/stories` „Zur Demo“; Domain-README-Schablone; Registry-Export in Docs prüfen |
| **chore** | BUILD_STATE E2E-Zähler; Queue-Archiv-Tail; flaky Spec fix |

Wenn Katalog und Lückenliste in BUILD_STATE nichts hergeben:  
Status `idle-no-work` · **nicht** künstliche Micro-Features erfinden · Scheduler darf weiterlaufen (nächster Fire prüft erneut).

---

## 4. Stop-Bedingungen (Scheduler)

| Bedingung | Aktion |
|-----------|--------|
| 3 Fires hintereinander `idle-no-work` oder `blocked` | Status melden + `scheduler_delete` |
| Nutzer stoppt manuell | `scheduler_delete <task_id>` |
| Auto-Expire | 7 Tage (System) |

Einzelner leerer Queue-Zustand ist **kein** Stop — zuerst Katalog (§3).

---

## 5. Statuszeile (Pflicht-Rückmeldung)

Eine Zeile, z. B.:

```
Q-401 | domain=kita | commit=abc1234 | build=ok | e2e=ok/n/a/fail | next=Q-402 | next_domain=av
```

Bei Stop: `stop reason=… | scheduler_delete requested`

---

## 6. Scheduler-Prompt (Copy-Paste, self-contained)

Intervall: **12m**. `fire_immediately` nach Bedarf.

```
Du arbeitest im Git-Repo open-state (Root mit AGENTS.md, docs/, demo/). Isolierter Fire — kein Chat-Kontext.

## Auftrag
Eine Iteration des autonomen Multi-Domain-Loops gemäß:
- AGENTS.md (Delivery, Commit, kein Push)
- docs/delivery/AUTONOMOUS_LOOP.md (Rotation, Katalog, Verbote)
- docs/delivery/loop-state.md (next_domain lesen/schreiben)
- docs/NEXT_STEPS_QUEUE.md, docs/BUILD_STATE.md, docs/DECISION_LOG.md (DEC-012, DEC-013)

Schritte: git status/log → Queue OFFEN (oder Katalog auffüllen max 3) → einen Schritt umsetzen → lint+build bei Code → Domain-E2E wenn UI → Queue/BUILD_STATE/loop-state → Commit. Nie git push. Nie page.goto nach Session-Interaktion (DEC-012). Kein Micro-CTA-Feinschliff (DEC-013).

## Bail
- Unklare uncommittete Fremdänderungen → blocked, stop
- Build/Lint nach Fix-Versuch rot → fail-Status, stop (nächster Fire darf retry)
- Kein sinnvoller Katalog-Schritt → idle-no-work

## Stop
Wenn loop-state consecutive_idle >= 3: melden und scheduler_delete dieser Task-ID.

## Status (eine Zeile)
Q-ID | domain=… | commit=…|no | build=ok|n/a|fail | e2e=… | next=… | next_domain=…
```

---

## 7. Grok-Workflow

Registriert: `.grok/workflows/autonomous-develop.rhai`  
Start: `/workflow autonomous-develop` oder Workflow-Tool mit `name: "autonomous-develop"`.

Führt **einen** Agenten-Fire mit dem Prompt oben aus (kein Push).

---

## 8. Manueller 12-Minuten-Loop

In Grok Build / CLI sinngemäß:

```
/loop 12m
```

mit dem Prompt aus §6 — oder `scheduler_create` interval `12m`, Prompt §6, `fire_immediately: true`.

**Task abbrechen:** `scheduler_delete <task_id>`.
