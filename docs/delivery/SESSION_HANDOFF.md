# Session-Handoff – nächste Arbeitsphase

**Stand:** 2026-08-03 · Q-612 Stories Zur-Demo Routes/Stichproben erledigt  
**Phase:** Demo-Domänen AV/UG/KJ **DEMO-stabil**; Welle Q-400–Q-542 in [`queue-archive/DONE_Q400-Q542.md`](queue-archive/DONE_Q400-Q542.md).  
**Nächster Einstieg:** oberster `OFFEN` in [`NEXT_STEPS_QUEUE.md`](../NEXT_STEPS_QUEUE.md) = **Q-620** (AV Produkt-Hebel).

---

## Was die letzte Session erreicht hat

| Bereich | Stand |
|---------|--------|
| Repo-Struktur | archive/rewrites, queue-archive, BUILD_STATE gehärtet, Anti-Growth DEC-013/014 |
| Demo AV/UG/KJ | Vertical Slices klickbar, Session-State, Fairness live |
| E2E | `test:e2e:ci` **378** chromium (lokal + GitHub Actions grün nach Push) |
| a11y | Skip-Link flächig, Druck/CSV-Labels Kita, ThemeSwitcher, BuildInfo, Stories-Landmarks |
| Delivery | Autonomer Loop dokumentiert; Scheduler derzeit **nicht** aktiv |

**Bewusste Stop-Empfehlung:** Keine weitere Skip-Link-Routen-Matrix ohne echte Produktlücke (DEC-013).

---

## Sofortstart nächste Session

```
1. git log --oneline -5 && git status --short
2. docs/delivery/SESSION_HANDOFF.md lesen (diese Datei)
3. docs/NEXT_STEPS_QUEUE.md → obersten OFFEN (Q-600+)
4. docs/BUILD_STATE.md + DECISION_LOG (DEC-012/013)
5. Einen Schritt umsetzen → lint/build/E2E bei Code → Commit
6. Push nur auf ausdrückliche Anweisung
```

Minimalbefehl: **„Entwickle weiter“**  
Autonomie-Loop (optional): Prompt in `AUTONOMOUS_LOOP.md` §6, Intervall ≥5m; Katalog **ohne** Skip-Link-Spiegel.

---

## Priorisierte OFFEN-Themen (Queue Q-600+)

| Prio | Fokus | Queue | Warum |
|------|--------|-------|--------|
| 1 | Ein Produkt-Hebel pro Domäne | **Q-620**–622 | AV → UG → Kita |
| 2 | Stories / Fairness | Q-610–612 DONE | Registry + Doku |
| 3 | Architektur light | Q-630 | Session/Fairness Ist-Hinweis |

Bereits vorbereitet (DONE): Q-600 Handoff, Q-601 Archiv, Q-602 E2E-Baseline 378, Q-603 gitignore, Q-604 Katalog-Härtung.

Details und IDs: `docs/NEXT_STEPS_QUEUE.md`.

---

## Nicht anfassen (ohne neuen DEC)

- Backend / echte Behördenschnittstellen (Phase-0-Konzept)
- Final Open-Data-Lizenz BL (extern)
- DSFA produktiv (extern)
- Force-Push, Feature-Micro-CTA-Parität AV↔UG ohne Lücke

---

## Wichtige Pfade

| Zweck | Pfad |
|-------|------|
| Queue | `docs/NEXT_STEPS_QUEUE.md` |
| Ist-Stand | `docs/BUILD_STATE.md` |
| Agenten-Regeln | `AGENTS.md` |
| Loop | `docs/delivery/AUTONOMOUS_LOOP.md` |
| Demo | `demo/` · Start: `cd demo && npm run dev` |
| E2E | `cd demo && npm run test:e2e:ci` |
| Map of Content | `docs/README.md` |

---

## Ergebnisformat pro Iteration

Wie `AGENTS.md` Ergebnisformat: Was / Dateien / Build / Queue-DONE / Commit / Hash / nächster OFFEN.
