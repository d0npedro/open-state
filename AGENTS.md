# AGENTS.md – Open State Agenten-Betriebssystem

Dieses Dokument ist verbindliche Arbeitsanweisung für jeden Agenten (Claude Code oder vergleichbar),
der in diesem Repository weiterentwickelt. Es gilt für jede Iteration ohne Ausnahme.

Kein Agent liefert Analysen oder Vorschlagslisten.
Jede Iteration endet mit tatsächlichen Dateiänderungen und einem Commit.

---

## Minimalbefehl: „Entwickle weiter"

Dieser Befehl löst exakt die folgende Sequenz aus:

```
1. git log --oneline -5 && git status --short
2. docs/BUILD_STATE.md lesen
3. docs/NEXT_STEPS_QUEUE.md lesen → obersten OFFEN-Eintrag wählen
4. docs/DECISION_LOG.md lesen → getroffene Entscheidungen berücksichtigen
5. AGENTS.md lesen (falls noch nicht gelesen)
6. Schritt implementieren (Dateien ändern, Code schreiben)
7. cd demo && npm run build (wenn Codepfad betroffen)
8. Betroffene Dokumentation gezielt aktualisieren
9. Queue aktualisieren: Schritt auf DONE
10. BUILD_STATE.md aktualisieren
11. Commit erstellen
12. Push nur wenn ausdrücklich angewiesen (→ Push-Regel unten)
13. Ergebnis strukturiert ausgeben
```

Kein Schritt überspringen ohne dokumentierten Grund.

---

## Autonomer Multi-Domain-Loop

Für wiederkehrende Weiterentwicklung über **alle Domänen** (AV, UG, Kita, Cross):

| Datei | Rolle |
|-------|--------|
| [`docs/delivery/AUTONOMOUS_LOOP.md`](docs/delivery/AUTONOMOUS_LOOP.md) | Rotation, Auffüll-Katalog, Verbote, **Scheduler-Prompt** |
| [`docs/delivery/loop-state.md`](docs/delivery/loop-state.md) | `next_domain`, Idle-Zähler |
| `.grok/workflows/autonomous-develop.rhai` | Ein Fire als Grok-Workflow |

Cadence-Empfehlung: **12 Minuten**. Kein Push im Loop. DEC-012/013 beachten.  
Wenn Queue leer: Katalog in AUTONOMOUS_LOOP (max. 3 neue OFFEN), keine Micro-CTA-Erfindung.

---

## Push-Regel

### Standard: kein Push

`git push` wird nie automatisch ausgeführt.
Jeder Commit bleibt lokal, bis der Nutzer ausdrücklich pushen lässt.

### Ausnahme: ausdrückliche Push-Anweisung

Wenn der Nutzer eine der folgenden Formulierungen verwendet, wird nach erfolgreichem Commit gepusht:

| Formulierung | Interpretation |
|-------------|---------------|
| „pushe" | push nach commit |
| „push" | push nach commit |
| „committe und pushe" | commit, dann push |
| „auf GitHub hochladen" | commit, dann push |
| „online bringen" | commit, dann push |
| „Entwickle weiter und pushe" | vollständiger Lauf + push |
| „Entwickle weiter. Committe und pushe am Ende." | vollständiger Lauf + push |

### Ablauf bei ausdrücklicher Push-Anweisung

```bash
# 1. Branch und Status vor dem Push prüfen
git status --short
git log --oneline -1

# 2. Pflicht: CI-äquivalente Prüfung (nie pushen ohne grünen Check)
cd demo && npm run lint && npm run build

# 3. Nur bei Exit-Code 0 pushen
git push

# 4. Ergebnis ausgeben: Branch, Commit-Hash, Push-Bestätigung, Build-Status
```

Ein Push erfolgt **ausschließlich nach erfolgreichem Commit und grünem `lint` + `build`**.
Kein Push bei fehlgeschlagenem Lint/Build oder nicht committeten, push-relevanten Änderungen.
Lokaler Build ist die Vorbedingung für GitHub Actions „Build Check“ – Agenten dürfen CI-Rot nicht als Überraschung erzeugen.

### Dauerbetrieb / Multi-Loop

Wenn der Nutzer **regelmäßiges Pushen** oder **Dauerbetrieb mit Remote-Sync** anweist:

- Domain-Loops pushen weiterhin **nicht**.
- Der **Supervisor** pusht nach erfolgreichem Merge + `lint` + `build` auf `origin main` (kein force).
- Der **CI-Watcher** prüft nach Pushes GitHub Actions (Build Check, ggf. E2E). Bei Failure: Logs lesen, lokal reproduzieren, fixen, committen, erneut pushen (kein force). Max. 2 Auto-Fix-Versuche pro defektem Commit, sonst Blockade dokumentieren.
- **Wichtig:** `npm run build` ≠ CI grün. Häufig scheitert **E2E**, nicht der Production-Build. Supervisor: vor Push `npm run test:e2e:ci`. Domain-Loops: `test:e2e:av` / `test:e2e:ug`. Nie `page.goto()` nach Session-Interaktion (DEC-012).
- Details: `docs/loops/MULTI_LOOP_BETRIEB.md`.

---

## Pflichtlektüre vor jeder Iteration

| Datei | Zweck |
|-------|-------|
| `docs/BUILD_STATE.md` | Was existiert tatsächlich? Was fehlt? (kompakt; kein Changelog) |
| `docs/NEXT_STEPS_QUEUE.md` | Aktive Arbeitsliste (`OFFEN` / `IN_ARBEIT` / `BLOCKIERT` + DONE-Tail) |
| `docs/DECISION_LOG.md` | Welche Entscheidungen sind bereits getroffen? |
| `CLAUDE.md` | Technische Projektführung, Build-Befehle, Dateistruktur |

**Nicht** in jedem Lauf lesen: `docs/delivery/queue-archive/`, `archive/`, Domain-Journals.  
Journals nur im Multi-Loop (`docs/loops/*-JOURNAL.md`, Rotation ≤15).

---

## Anti-Growth (verbindlich, DEC-013)

Kurzform. Details und Begründung: `docs/DECISION_LOG.md` (DEC-013), Volltext-Policy: `docs/REPO_REFACTORING_PLAN.md` §4.

1. **Queue** = Arbeitsliste, kein Changelog. DONE-Tail ≤ ~10; Rest → `docs/delivery/queue-archive/`.
2. **BUILD_STATE** = Ist-Stand. Pro Iteration max. Kopfzeile + betroffene Kurzzeile + echte Lücke; kein „Q-xxx erledigt“-Anhang.
3. **Keine** neuen `REPO_REWRITE_SUMMARY_*.md` im Root → `archive/rewrites/` oder DEC-Eintrag.
4. **Journals** ≤ 15 Iterationen aktiv; älteres → `archive/journals/`.
5. **Story-Registry:** nur `demo/data/storyRegistry.ts` manuell; JSON via `npm run registry:export`.
6. **Eine führende Quelle pro Thema;** zweites Dokument nur Stub oder generiert.
7. **Keine neuen Top-Level-Docs/Ordner** ohne DEC + Eintrag in `docs/README.md`. Kein `16_*.md` unter `docs/`.
8. **Micro-Paritäten bündeln** oder als bewusste Queue-Serie; nach „DEMO-stabil“ (DEC-013) kein Endlos-Feinschliff ohne Produktlücke/Bug.
9. **Pro Iteration** nur nötige Steuerdateien (typisch: Queue + knappes BUILD_STATE-Delta + Commit).

---

## Projektprinzipien

### Direkte Repo-Arbeit
Agenten analysieren und handeln. Jede Iteration endet mit konkreten Dateiänderungen und einem Commit.
Kein Durchlauf, der nur Ideen oder Beobachtungen liefert.

### Ein Schritt pro Iteration
Maximal ein gut abgegrenztes Arbeitspaket pro Durchlauf.
Ausnahme nur, wenn der Befehl explizit mehrere Schritte benennt.

### Story-Driven Development
Jede sichtbare Funktion in der Demo führt auf eine User Story zurück.
Neue Screens benötigen eine Story-ID.
Stories ohne Screen-Implementierung sind Konzept, keine Demo.
Story-Lebenszyklus: ENTWURF → BEREIT → IN_ENTWICKLUNG → DEMONSTRIERBAR → ABGESCHLOSSEN

### Transparenz als Pflicht
Jedes Signal, jede Kennzahl, jede Entscheidung muss erklärbar sein.
Begründungen sind Teil des Systems — kein nachträgliches Kommentar.
Methodik ist immer sichtbar.

### KI nur als Assistenz
Kein Modul trifft Entscheidungen autonom.
KI-Unterstützung ist erlaubt. Entscheidungsverantwortung bleibt beim Menschen.

### Fachlogik und Darstellung trennen
Theme- und Designsystem-Entscheidungen haben keinen Einfluss auf Geschäftslogik.
Fachwerte, Statusberechnungen und Regelwerke sind unabhängig von visuellen Einstellungen.

### Keine Werbung, keine Startup-Sprache
Kein „disruptiv", kein „revolutionär", kein „skalieren".
Sachliche Beschreibung staatlicher Infrastruktur.

### Keine Zeitplan-Rhetorik
Keine Liefertermin-Commitments. Keine Q2-Fertigstellungen.
Was fertig ist, ist fertig. Was offen ist, ist offen.

### Datenschutz als Designprinzip
Kindeswohl und personenbezogene Daten haben höchste Schutzstufe.
Datenverarbeitung folgt dem Zweckbindungsprinzip.

### Commit-Pflicht
Jede Iteration endet mit einem Commit. Kein Floating State.
Commit-Messages: Conventional Commits Format (feat / fix / docs / chore / refactor).

### Push nur auf ausdrückliche Anweisung
`git push` ist opt-in. Standard ist commit-only.
Ausdrückliche Anweisung durch den Nutzer schaltet Push für diesen Lauf frei.
Erlaubte Trigger-Formulierungen: → Push-Regel-Abschnitt oben.

---

## Entscheidungsverhalten

| Situation | Verhalten |
|-----------|----------|
| Schritt ist unklar | Klärung einholen – nicht raten |
| Schritt ist zu groß | In Teilschritte aufteilen, Queue aktualisieren |
| Build schlägt fehl | Fehler beheben, kein Commit bis grün |
| Nächster Schritt ist blockiert | Übernächsten wählen, Blockierung in DECISION_LOG dokumentieren |
| Schritt wurde teils gemacht | Fortführen bis vollständig, dann committen |
| Unerwarteter Zustand im Repo | Untersuchen statt überschreiben |

---

## Ergebnisformat

### Standardlauf (commit, kein push)

```
1. Was wurde gemacht (1–3 Sätze)
2. Geänderte / neu erstellte Dateien
3. Build-Status
4. Queue-Update (welcher Schritt auf DONE)
5. Commit-Message
6. Commit-Hash
7. Offener nächster Schritt
```

### Lauf mit Push

```
1. Was wurde gemacht (1–3 Sätze)
2. Geänderte / neu erstellte Dateien
3. Build-Status
4. Queue-Update (welcher Schritt auf DONE)
5. Commit-Message
6. Commit-Hash
7. Branch
8. Push-Ergebnis
9. Offener nächster Schritt
```

---

## Verhältnis zu anderen Steuerdateien

| Datei | Zuständigkeit |
|-------|--------------|
| `CLAUDE.md` | Technische Projektführung: Build-Befehle, Pfade, Architektur |
| `AGENTS.md` | Operative Arbeitslogik: Wie jede Iteration abläuft |
| `docs/DELIVERY_SYSTEM.md` | Detaillierter 12-Schritte-Ablauf mit Entscheidungsregeln |
| `docs/NEXT_STEPS_QUEUE.md` | Priorisierte Aufgabenliste |
| `docs/BUILD_STATE.md` | Aktueller tatsächlicher Projektstand |
| `docs/DECISION_LOG.md` | Begründete Architektur- und Strategieentscheidungen |

Bei technischen Fragen gilt `CLAUDE.md`. Bei Prozessfragen gilt `AGENTS.md`.
