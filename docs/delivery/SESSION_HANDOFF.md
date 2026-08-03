# Session-Handoff – nächste Arbeitsphase

**Stand:** 2026-08-03 · **Push-ready** (Q-641)  
**Phase:** Demo-Domänen AV/UG/KJ **DEMO-stabil**; Queue Q-600–641 erledigt.  
**Nächster Einstieg:** Push auf Anweisung **oder** neue Produktlücke in Queue; kein OFFEN.

---

## Push-Empfehlung (Q-641)

**Jetzt ist ein guter Zeitpunkt zum Pushen** (lokal verifiziert, Welle geschlossen).

| Check | Ergebnis |
|-------|----------|
| lint | ✓ grün |
| build | ✓ 27 statische Seiten |
| `test:e2e:ci` | ✓ **385** passed (chromium, workers=1) |
| Queue | leer (kein halbfertiges OFFEN) |
| Ahead of `origin/main` | ~22 Commits (Q-601 … Q-641) |
| Working tree | clean nach Q-641-Commit |

**Push nur auf ausdrückliche Anweisung** (z. B. „pushe“ / „committe und pushe“).  
Empfohlener Ablauf: `cd demo && npm run lint && npm run build` (bereits grün) → `git push` (kein force).

---

## Was die letzte Session erreicht hat

| Bereich | Stand |
|---------|--------|
| Repo-Struktur | archive/rewrites, queue-archive, BUILD_STATE gehärtet, Anti-Growth DEC-013/014 |
| Demo AV/UG/KJ | Vertical Slices klickbar, Session-State, Fairness live; AV Widerspruch, UG/Kita Ruhezustand |
| E2E | `test:e2e:ci` **385** chromium (Q-640 + Re-Verify Q-641) |
| a11y | Skip-Link flächig, Druck/CSV-Labels Kita, ThemeSwitcher, BuildInfo, Stories-Landmarks |
| Delivery | Loop gestoppt nach idle×3; **Push-ready** dokumentiert |

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
| 1 | **Push** | auf Anweisung | Q-641 verifiziert; Remote-Sync + CI |
| 2 | Queue | **leer** | Katalog nur bei echter Produktlücke |
| 3 | Loop | gestoppt | idle×3 korrekt (DEC-013) |

Bereits vorbereitet (DONE): Q-600–Q-641 (Handoff, Archiv, Stories, Domänen-Hebel, arc42, E2E 385, Push-ready).

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
